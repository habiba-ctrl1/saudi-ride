// Hostinger deploy: `npm run deploy:hostinger`
//
// Hostinger Business hosting cannot run `next build` (thread limit), so we
// build the last COMMITTED code here, then force-push source + prebuilt build
// to the `hostinger-deploy` branch on GitHub. Hostinger deploys that branch
// and only runs `npm install` + `node hostinger-build.js`.
//
// Uncommitted changes are NOT deployed — commit first.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = path.resolve(repo, "..", "tsa-hostinger-pkg"); // keeps its own node_modules between runs
const stageDir = path.resolve(repo, "..", "tsa-hostinger-stage");
const BRANCH = "hostinger-deploy";

const run = (cmd, cwd, env = {}) =>
  execSync(cmd, { cwd, stdio: "inherit", env: { ...process.env, ...env } });
const out = (cmd, cwd) => execSync(cmd, { cwd, encoding: "utf8" }).trim();

function emptyDir(dir, keep = []) {
  fs.mkdirSync(dir, { recursive: true });
  for (const name of fs.readdirSync(dir)) {
    if (!keep.includes(name)) fs.rmSync(path.join(dir, name), { recursive: true, force: true });
  }
}

function exportCommit(dir) {
  const tarFile = path.join(dir, "__src.tar");
  run(`git archive --format=tar -o "${tarFile}" HEAD`, repo);
  run(`tar -xf __src.tar`, dir);
  fs.rmSync(tarFile);
}

const sha = out("git rev-parse --short HEAD", repo);
const subject = out("git log -1 --format=%s", repo);
const remote = out("git remote get-url origin", repo);
if (out("git status --porcelain --untracked-files=no", repo)) {
  console.warn("\n!! Uncommitted changes exist — they will NOT be deployed.\n");
}
console.log(`Deploying commit ${sha}: ${subject}`);

// 1. Build the committed code in a separate folder.
emptyDir(buildDir, ["node_modules"]);
exportCommit(buildDir);
fs.copyFileSync(path.join(repo, ".env.local"), path.join(buildDir, ".env.local"));
const lock = fs.readFileSync(path.join(buildDir, "package-lock.json"));
const lockStamp = path.join(buildDir, "node_modules", ".deploy-lock-copy");
if (!fs.existsSync(lockStamp) || !fs.readFileSync(lockStamp).equals(lock)) {
  run("npm ci", buildDir);
  fs.writeFileSync(lockStamp, lock);
}
run("npm run build", buildDir, { HOSTINGER_BUILD: "1" });
const nextDir = path.join(buildDir, ".next");
if (!fs.existsSync(path.join(nextDir, "standalone", "server.js"))) {
  throw new Error("Build did not produce .next/standalone/server.js");
}

// 2. Stage: committed source + prebuilt build (no secrets, no node_modules).
emptyDir(stageDir);
exportCommit(stageDir);
const skip = ["cache", "trace", "server", "types"].map((n) => path.join(nextDir, n)); // server is restored from standalone on Hostinger
fs.cpSync(nextDir, path.join(stageDir, "prebuilt-next"), {
  recursive: true,
  filter: (src) => !skip.includes(src) && !/[\\/]\.env[^\\/]*$/.test(src),
});
const pkgFile = path.join(stageDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
delete pkg.scripts.prebuild;
pkg.scripts.build = "node hostinger-build.js";
fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + "\n");

// 3. Force-push a single commit to the deploy branch.
run("git init -q", stageDir);
// No line-ending conversion: this is build output, and converting ~9000 files is very slow on Windows.
run("git config core.autocrlf false", stageDir);
run("git config core.safecrlf false", stageDir);
// The push is ~180 MB; the default HTTP buffer makes GitHub drop the connection.
run("git config http.postBuffer 1048576000", stageDir);
run("git config http.version HTTP/1.1", stageDir);
run("git add -A -f", stageDir);
run(`git -c user.name="deploy" -c user.email="deploy@localhost" commit -q -m "Hostinger deploy of ${sha}"`, stageDir);
run(`git push --force "${remote}" HEAD:refs/heads/${BRANCH}`, stageDir);
fs.rmSync(path.join(stageDir, ".git"), { recursive: true, force: true });

console.log(`\nDone. Branch "${BRANCH}" now holds commit ${sha}. Hostinger will deploy it.`);
