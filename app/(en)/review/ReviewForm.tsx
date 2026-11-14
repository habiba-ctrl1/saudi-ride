"use client";

import { useState } from "react";

type Props = { refCode: string; token: string; name: string; route: string; already: boolean; googleUrl: string };

export default function ReviewForm({ refCode, token, name, route, already, googleUrl }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">(already ? "done" : "idle");
  const [error, setError] = useState("");
  const firstName = name.replace(/^(mr|mrs|dr)\.?\s+/i, "").trim().split(/\s+/)[0];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) return setError("Please choose a rating.");
    setState("sending");
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref: refCode, k: token, rating, comment }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok || res.status === 409) return setState("done");
    setState("idle");
    setError(data.error || "Something went wrong. Please try again.");
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Thank you, {firstName}</h1>
        <p className="mt-3 text-gray-600">Your feedback has been received.</p>
        {googleUrl && (
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-semibold text-white">
            Also share it on Google
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900">How was your trip, {firstName}?</h1>
      <p className="mt-2 text-sm text-gray-600">{route} · Ref {refCode}</p>

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-gray-800">Your rating</legend>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)} className={`h-12 w-12 text-3xl leading-none ${n <= rating ? "text-yellow-400" : "text-gray-300"}`}>★</button>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 block text-sm font-medium text-gray-800" htmlFor="comment">Tell us more (optional)</label>
      <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={2000} rows={5}
        className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-base" placeholder="Driver, vehicle, punctuality..." />

      {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
      <button type="submit" disabled={state === "sending"} className="mt-6 min-h-[44px] w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white disabled:opacity-60">
        {state === "sending" ? "Sending..." : "Submit review"}
      </button>
      <p className="mt-3 text-xs text-gray-500">Reviews are checked by our team before anything is published.</p>
    </form>
  );
}
