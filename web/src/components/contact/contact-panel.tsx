"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui";
import { CheckCircleIcon } from "@/components/icons";
import { AssistantChat } from "@/components/assistant/assistant-chat";
import { SERVICES, CONTACT } from "@/lib/site";
import { submitLead } from "@/lib/api";

type Tab = "form" | "assistant";

const MAX_MESSAGE = 1000;

export function ContactPanel() {
  const [tab, setTab] = useState<Tab>("form");

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-30px_rgba(5,13,66,0.3)]">
      <div role="tablist" aria-label="Contact options" className="grid grid-cols-2 border-b border-line">
        <TabButton id="tab-form" panel="panel-form" active={tab === "form"} onClick={() => setTab("form")}>
          Send us a message
        </TabButton>
        <TabButton
          id="tab-assistant"
          panel="panel-assistant"
          active={tab === "assistant"}
          onClick={() => setTab("assistant")}
        >
          AI Assistant
        </TabButton>
      </div>

      <div hidden={tab !== "form"} id="panel-form" role="tabpanel" aria-labelledby="tab-form">
        <ContactForm />
      </div>
      <div
        hidden={tab !== "assistant"}
        id="panel-assistant"
        role="tabpanel"
        aria-labelledby="tab-assistant"
      >
        <AssistantPanel />
      </div>
    </div>
  );
}

function TabButton({
  id,
  panel,
  active,
  onClick,
  children,
}: {
  id: string;
  panel: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-controls={panel}
      aria-selected={active}
      onClick={onClick}
      className={`px-4 py-4 text-sm font-semibold transition-colors ${
        active ? "bg-white text-navy" : "bg-cream text-muted hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------- Form --- */

function ContactForm() {
  const formId = useId();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (status === "done") {
    return (
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange/10 text-orange">
          <CheckCircleIcon className="h-8 w-8" />
        </span>
        <h3 className="mt-5 font-serif text-2xl text-ink">Thank you — message sent</h3>
        <p className="mt-2 max-w-sm text-sm text-body">
          Our team will be in touch shortly, usually within one business day.
        </p>
        <Button
          variant="ghost-light"
          className="mt-6"
          onClick={() => {
            setMessage("");
            setStatus("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 p-6 sm:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setStatus("sending");
        try {
          await submitLead({
            fullName: String(fd.get("name") ?? ""),
            company: String(fd.get("company") ?? ""),
            email: String(fd.get("email") ?? ""),
            phone: String(fd.get("phone") ?? ""),
            service: String(fd.get("service") ?? ""),
            message: String(fd.get("message") ?? ""),
            consent: fd.get("consent") === "on",
          });
          setStatus("done");
        } catch {
          setStatus("error");
        }
      }}
    >
      <div>
        <h3 className="font-serif text-xl text-ink">Send us a message</h3>
        <p className="mt-1 text-sm text-body">
          Fill out the form below and our team will be in touch shortly.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${formId}-name`} label="Full Name" required>
          <input id={`${formId}-name`} name="name" type="text" required autoComplete="name" placeholder="Enter your full name" className={inputClass} />
        </Field>
        <Field id={`${formId}-company`} label="Company Name" required>
          <input id={`${formId}-company`} name="company" type="text" required autoComplete="organization" placeholder="Enter your company name" className={inputClass} />
        </Field>
        <Field id={`${formId}-email`} label="Email Address" required>
          <input id={`${formId}-email`} name="email" type="email" required autoComplete="email" placeholder="Enter your email address" className={inputClass} />
        </Field>
        <Field id={`${formId}-phone`} label="Phone Number">
          <input id={`${formId}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="Enter your phone number" className={inputClass} />
        </Field>
      </div>

      <Field id={`${formId}-service`} label="Service of interest">
        <select id={`${formId}-service`} name="service" defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select a service
          </option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={`${formId}-message`}
        label="Tell us about your challenges"
        required
        hint="The more details you share the better we can assist you"
      >
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={5}
          maxLength={MAX_MESSAGE}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className={`${inputClass} min-h-[132px] resize-none`}
        />
        <p className="mt-1 text-right text-xs text-muted">
          {message.length} / {MAX_MESSAGE}
        </p>
      </Field>

      <label className="flex items-start gap-3 text-sm text-body">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-orange focus:ring-orange" />
        <span>I agree to be contacted by CrestView group regarding my enquiry.</span>
      </label>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Sorry, your message couldn&apos;t be sent. Please try again, or reach us directly at{" "}
          <a href={`mailto:${CONTACT.email}`} className="font-medium underline">
            {CONTACT.email}
          </a>
          .
        </p>
      )}

      <Button type="submit" className="w-full" withArrow disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </Button>

      <p className="text-center text-xs text-muted">
        Your information is secure and will never be shared
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30";

function Field({
  id,
  label,
  required = false,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label} {required && <span className="text-orange">*</span>}
      </label>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------- Assistant --- */

function AssistantPanel() {
  return (
    <div className="flex h-[34rem] flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-line px-6 py-4">
        <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
          CA
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Crestview Assistant</p>
          <p className="text-xs text-green-600">Online</p>
        </div>
      </div>
      <AssistantChat />
    </div>
  );
}
