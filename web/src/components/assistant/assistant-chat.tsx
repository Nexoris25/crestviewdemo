"use client";

import { useRef, useState } from "react";
import { SendIcon } from "@/components/icons";
import { askAssistant, type ChatTurn } from "@/lib/api";
import { CONTACT } from "@/lib/site";

interface ChatMessage extends ChatTurn {
  suggestion?: string;
  reason?: string;
  time: string;
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const INTRO: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm the Crestview Assistant. Describe your biggest business challenge and I'll suggest the service that fits best.",
  time: "Now",
};

/**
 * Conversational assistant. Talks to the backend Gemini endpoint, falls back
 * locally. Fills its parent (which must be a flex column with a definite
 * height) and scrolls its message list internally.
 */
export function AssistantChat({ seed = [INTRO] }: { seed?: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () =>
    requestAnimationFrame(() =>
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }),
    );

  const send = async () => {
    const text = draft.trim();
    if (!text || busy) return;
    const userMsg: ChatMessage = { role: "user", content: text, time: now() };
    const history = [...messages, userMsg];
    setMessages(history);
    setDraft("");
    setBusy(true);
    scrollToEnd();

    const turns: ChatTurn[] = history.map((m) => ({ role: m.role, content: m.content }));
    const res = await askAssistant(turns);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: res.reply,
        suggestion: res.suggestedService,
        reason: res.reason,
        time: now(),
      },
    ]);
    setBusy(false);
    scrollToEnd();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={listRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-cream/40 px-4 py-5 sm:px-5"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "rounded-br-sm bg-navy text-white"
                  : "rounded-bl-sm bg-white text-body shadow-sm"
              }`}
            >
              <p>{m.content}</p>
              {m.suggestion && (
                <div className="mt-3 rounded-lg bg-orange/10 p-3 text-ink">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange">
                    Suggested service
                  </p>
                  <p className="mt-1 font-serif text-base">{m.suggestion}</p>
                  {m.reason && (
                    <p className="mt-2 text-xs text-body">
                      <span className="font-semibold">Why:</span> {m.reason}
                    </p>
                  )}
                </div>
              )}
              <p className={`mt-1.5 text-[0.65rem] ${m.role === "user" ? "text-white/60" : "text-muted"}`}>
                {m.time}
              </p>
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm text-muted shadow-sm">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted/60 [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted/60 [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted/60" />
              </span>
            </div>
          </div>
        )}
      </div>

      <form
        className="flex shrink-0 items-center gap-2 border-t border-line p-3 sm:p-4"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor="assistant-input" className="sr-only">
          Type your message
        </label>
        <input
          id="assistant-input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type your message..."
          className="min-w-0 flex-1 rounded-lg border border-line px-3.5 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!draft.trim() || busy}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange text-white transition-colors hover:bg-orange-dark disabled:opacity-50"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </form>

      <p className="shrink-0 px-4 pb-3 text-center text-xs text-muted sm:px-5">
        Prefer a human? Email {CONTACT.email} or call {CONTACT.phone}.
      </p>
    </div>
  );
}

export type { ChatMessage };
