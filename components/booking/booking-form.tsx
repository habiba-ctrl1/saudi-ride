"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/data/content";
import { bookingFormSchema, type BookingFormValues } from "@/lib/validators/booking";

type BookingStep = 0 | 1 | 2 | 3;

type BookingFormCopy = {
  heading: string;
  stepLabel: string;
  stepTitles: [string, string, string, string];
  labels: {
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    passengers: string;
  };
  placeholders: {
    pickup: string;
    dropoff: string;
  };
  buttons: {
    back: string;
    next: string;
    submit: string;
    submitting: string;
  };
  success: string;
  error: string;
};

type BookingFormProps = {
  copy: BookingFormCopy;
  locale: Locale;
};

export function BookingForm({ copy, locale }: BookingFormProps) {
  const [step, setStep] = useState<BookingStep>(0);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormValues, string>>>({});
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<BookingFormValues>({
    pickup: "",
    dropoff: "",
    travelDate: "",
    travelTime: "",
    passengers: 1
  });

  const isLastStep = step === 3;
  const progress = useMemo(() => ((step + 1) / 4) * 100, [step]);

  const validateCurrentStep = () => {
    const result =
      step === 0
        ? bookingFormSchema.pick({ pickup: true }).safeParse(form)
        : step === 1
          ? bookingFormSchema.pick({ dropoff: true }).safeParse(form)
          : step === 2
            ? bookingFormSchema.pick({ travelDate: true, travelTime: true }).safeParse(form)
            : bookingFormSchema.pick({ passengers: true }).safeParse(form);
    if (result.success) {
      setErrors((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(result.data).map((key) => [key, ""])) }));
      return true;
    }

    const stepErrors: Partial<Record<keyof BookingFormValues, string>> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof BookingFormValues;
      stepErrors[key] = issue.message;
    }
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return false;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setStep((prev) => Math.min(prev + 1, 3) as BookingStep);
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0) as BookingStep);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = bookingFormSchema.safeParse(form);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof BookingFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof BookingFormValues;
        nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback("");

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale })
      });

      if (!response.ok) {
        setFeedback(copy.error);
        return;
      }

      setFeedback(copy.success);
      setStep(0);
      setForm({
        pickup: "",
        dropoff: "",
        travelDate: "",
        travelTime: "",
        passengers: 1
      });
      setErrors({});
    } catch {
      setFeedback(copy.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#c7a66b]/25 bg-white p-6 shadow-[0_25px_55px_rgba(18,20,23,0.08)] md:p-7"
    >
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-[#7c8088]">
          <span>{copy.heading}</span>
          <span>
            {copy.stepLabel} {step + 1} / 4
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#ece7dd]">
          <div className="h-full rounded-full bg-[#c7a66b] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="mb-4 text-sm font-semibold text-[#121417]">{copy.stepTitles[step]}</p>

      {step === 0 && (
        <div>
          <label htmlFor="pickup" className="mb-2 block text-sm text-[#49505a]">
            {copy.labels.pickup}
          </label>
          <input
            id="pickup"
            type="text"
            placeholder={copy.placeholders.pickup}
            value={form.pickup}
            onChange={(event) => setForm((prev) => ({ ...prev, pickup: event.target.value }))}
            className="w-full rounded-xl border border-[#d8dde3] px-4 py-3 text-sm outline-none transition focus:border-[#c7a66b]"
          />
          {errors.pickup && <p className="mt-2 text-xs text-red-600">{errors.pickup}</p>}
        </div>
      )}

      {step === 1 && (
        <div>
          <label htmlFor="dropoff" className="mb-2 block text-sm text-[#49505a]">
            {copy.labels.dropoff}
          </label>
          <input
            id="dropoff"
            type="text"
            placeholder={copy.placeholders.dropoff}
            value={form.dropoff}
            onChange={(event) => setForm((prev) => ({ ...prev, dropoff: event.target.value }))}
            className="w-full rounded-xl border border-[#d8dde3] px-4 py-3 text-sm outline-none transition focus:border-[#c7a66b]"
          />
          {errors.dropoff && <p className="mt-2 text-xs text-red-600">{errors.dropoff}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="travelDate" className="mb-2 block text-sm text-[#49505a]">
              {copy.labels.date}
            </label>
            <input
              id="travelDate"
              type="date"
              value={form.travelDate}
              onChange={(event) => setForm((prev) => ({ ...prev, travelDate: event.target.value }))}
              className="w-full rounded-xl border border-[#d8dde3] px-4 py-3 text-sm outline-none transition focus:border-[#c7a66b]"
            />
            {errors.travelDate && <p className="mt-2 text-xs text-red-600">{errors.travelDate}</p>}
          </div>
          <div>
            <label htmlFor="travelTime" className="mb-2 block text-sm text-[#49505a]">
              {copy.labels.time}
            </label>
            <input
              id="travelTime"
              type="time"
              value={form.travelTime}
              onChange={(event) => setForm((prev) => ({ ...prev, travelTime: event.target.value }))}
              className="w-full rounded-xl border border-[#d8dde3] px-4 py-3 text-sm outline-none transition focus:border-[#c7a66b]"
            />
            {errors.travelTime && <p className="mt-2 text-xs text-red-600">{errors.travelTime}</p>}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <label htmlFor="passengers" className="mb-2 block text-sm text-[#49505a]">
            {copy.labels.passengers}
          </label>
          <input
            id="passengers"
            type="number"
            min={1}
            max={8}
            value={form.passengers}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                passengers: Number(event.target.value || 1)
              }))
            }
            className="w-full rounded-xl border border-[#d8dde3] px-4 py-3 text-sm outline-none transition focus:border-[#c7a66b]"
          />
          {errors.passengers && <p className="mt-2 text-xs text-red-600">{errors.passengers}</p>}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="rounded-full border border-[#d8dde3] px-5 py-2 text-sm text-[#49505a] transition hover:border-[#121417] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copy.buttons.back}
        </button>
        {isLastStep ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#121417] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#1b1f24]"
          >
            {isSubmitting ? copy.buttons.submitting : copy.buttons.submit}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-full bg-[#c7a66b] px-6 py-2 text-sm font-medium text-[#121417] transition hover:bg-[#b89352]"
          >
            {copy.buttons.next}
          </button>
        )}
      </div>
      {feedback && <p className="mt-4 text-sm text-[#49505a]">{feedback}</p>}
    </form>
  );
}
