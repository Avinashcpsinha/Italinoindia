"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Sparkles, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

type Message = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t("welcomeMessage") }]);
    }
  }, [open, messages.length, t]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          locale,
        }),
      });

      if (!res.ok || !res.body) throw new Error("chat failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: assistant };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t("errorMessage") }]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([{ role: "assistant", content: t("welcomeMessage") }]);
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 inline-flex items-center gap-2 rounded-full bg-saffron-600 hover:bg-saffron-500 text-white px-5 py-3 shadow-lg shadow-saffron-900/20 transition-colors"
            aria-label={t("openButton")}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">{t("openButton")}</span>
            <MessageCircle className="h-4 w-4 sm:hidden" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-3 bottom-3 md:inset-auto md:bottom-8 md:right-8 md:w-[420px] md:max-h-[640px] z-50 flex flex-col rounded-2xl border border-ink-900/10 bg-cream-50 shadow-2xl overflow-hidden"
            style={{ height: "min(80vh, 640px)" }}
            role="dialog"
            aria-label={t("title")}
          >
            <header className="flex items-center justify-between border-b border-ink-900/10 px-5 py-4 bg-ink-900 text-cream-50">
              <div>
                <div className="flex items-center gap-2 font-serif text-lg">
                  <Sparkles className="h-4 w-4 text-saffron-300" />
                  {t("title")}
                </div>
                <div className="text-xs text-cream-100/60">{t("subtitle")}</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={reset}
                  aria-label={t("newChat")}
                  className="size-8 rounded-full hover:bg-ink-800 flex items-center justify-center"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="size-8 rounded-full hover:bg-ink-800 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "ml-auto bg-saffron-600 text-white rounded-br-sm"
                      : "bg-ink-900/5 text-ink-900 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="bg-ink-900/5 text-ink-900/60 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm w-fit">
                  <span className="inline-flex gap-1">
                    <span className="size-1.5 rounded-full bg-ink-900/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="size-1.5 rounded-full bg-ink-900/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="size-1.5 rounded-full bg-ink-900/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); void send(); }}
              className="border-t border-ink-900/10 p-3 bg-cream-100/50"
            >
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  placeholder={t("placeholder")}
                  rows={2}
                  className="resize-none min-h-[52px] bg-cream-50"
                  disabled={loading}
                />
                <Button type="submit" variant="primary" size="icon" disabled={!input.trim() || loading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-ink-900/50 leading-snug">{t("disclaimer")}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
