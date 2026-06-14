"use client";

import { useEffect, useState } from "react";
import { AssistantChat } from "@/components/assistant/assistant-chat";
import { SparkleIcon, CloseIcon, ChatIcon } from "@/components/icons";

/**
 * Global floating AI assistant. The launcher mirrors the chat icon shown on
 * every hero in the Figma; clicking it opens the Crestview Assistant screen.
 */
export function AssistantWidget() {
  const [open, setOpen] = useState(false);

  // Close on Escape for accessibility.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Crestview Assistant"
          aria-modal="false"
          className="fixed inset-x-3 bottom-24 z-50 mx-auto flex h-[32rem] max-h-[calc(100dvh-7rem)] w-auto max-w-[24rem] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[24rem]"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 bg-navy px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                CA
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-navy bg-green-500" />
              </span>
              <div>
                <p className="text-sm font-semibold">Crestview Assistant</p>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <AssistantChat />
        </div>
      )}

      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-lg ring-1 ring-white/10 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange text-white">
          <SparkleIcon className="h-3 w-3" />
        </span>
        {open ? <CloseIcon className="h-6 w-6" /> : <ChatIcon className="h-6 w-6" />}
      </button>
    </>
  );
}
