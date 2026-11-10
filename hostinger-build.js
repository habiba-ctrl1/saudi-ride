// Hostinger build step: server par `next build` nahi chal sakta (thread limit),
// is liye locally bani hui build (prebuilt-next/) ko .next mein copy karte hain.
const fs = require("fs");
const path = require("path");

const root = __dirname;
const src = path.join(root, "prebuilt-next");
const out = path.join(root, ".next");
const standalone = path.join(out, "standalone");

function copy(from, to) {
  if (!fs.existsSync(from)) {
    console.log("skip (not found): " + path.relative(root, from));
    return;
  }
  fs.cpSync(from, to, { recursive: true, force: true });
  console.log("copied: " + path.relative(root, from) + " -> " + path.relative(root, to));
}

if (!fs.existsSync(src)) {
  console.error("prebuilt-next folder missing");
  process.exit(1);
}

fs.rmSync(out, { recursive: true, force: true });
copy(src, out);

// ZIP chhota rakhne ke liye top-level server folder ship nahi hota; standalone wali copy se banao.
if (!fs.existsSync(path.join(out, "server"))) copy(path.join(standalone, ".next", "server"), path.join(out, "server"));

// Standalone server ko static files aur public folder apne paas chahiye.
copy(path.join(out, "static"), path.join(standalone, ".next", "static"));
copy(path.join(root, "public"), path.join(standalone, "public"));

// Linux ke native binaries (npm install ne server par banaye) standalone mein daalo,
// kyunke prebuilt wale Windows ke hain.
copy(path.join(root, "node_modules", ".prisma"), path.join(standalone, "node_modules", ".prisma"));
copy(path.join(root, "node_modules", "@img"), path.join(standalone, "node_modules", "@img"));

console.log("prebuilt build ready, BUILD_ID=" + fs.readFileSync(path.join(out, "BUILD_ID"), "utf8"));
