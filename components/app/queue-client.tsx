"use client";

import { useState, useTransition } from "react";
import { CheckCheck, Clock, Loader2, LayoutList, Send, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { useLang } from "@/components/i18n/language-provider";
import { DemoBanner, EmptyState } from "@/components/app/empty-state";
import { NewPostButton } from "@/components/app/post-dialog";
import { deletePost, updatePostStatus } from "@/lib/actions/posts";
import { PLATFORM, PLATFORMS, STATUS_LABEL, STATUS_TONE, type Platform, type QueueItem } from "@/lib/demo/data";
import type { QueueView } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const dot = (p: Platform) => `oklch(62% 0.17 ${PLATFORM[p].hue})`;
const soft = (p: Platform) => `oklch(94% 0.05 ${PLATFORM[p].hue})`;

export function QueueClient({ view }: { view: QueueView }) {
  const { lang, ui } = useLang();
  const [plat, setPlat] = useState<Platform | "all">("all");
  const m = {
    tr: { title: "Sıra", sub: "Yayına çıkacak gönderiler — en yakın tarihli en üstte.", all: "Tümü", best: "en iyi saat" },
    en: { title: "Queue", sub: "Posts going out next — soonest first.", all: "All", best: "best time" },
  }[lang];

  const shown = view.items.filter((q) => plat === "all" || q.platform === plat);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{m.title}</h2>
          <p className="text-sm text-muted-foreground">{m.sub}</p>
        </div>
        <NewPostButton channels={view.channels} disabled={view.isDemo} />
      </div>

      {view.isDemo && <DemoBanner text={ui.demoBanner} />}

      {view.items.length === 0 ? (
        <EmptyState
          icon={<LayoutList className="h-5 w-5" />}
          title={ui.emptyQueue}
          hint={ui.emptyQueueHint}
          action={<NewPostButton channels={view.channels} />}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPlat("all")}
              className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition cursor-pointer", plat === "all" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted")}
            >
              {m.all}
            </button>
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => setPlat(p)}
                className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition cursor-pointer", plat === p ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted")}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot(p) }} /> {PLATFORM[p].name}
              </button>
            ))}
          </div>

          <ul className="space-y-2.5">
            {shown.map((q) => <QueueRow key={q.id} item={q} bestLabel={m.best} readOnly={view.isDemo} />)}
          </ul>
        </>
      )}
    </div>
  );
}

function QueueRow({ item, bestLabel, readOnly }: { item: QueueItem; bestLabel: string; readOnly: boolean }) {
  const { t, ui } = useLang();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setError(result.error ?? ui.errGeneric);
    });
  }

  return (
    <li className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: soft(item.platform), color: dot(item.platform) }}>
        <Icon name={PLATFORM[item.platform].icon} className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 font-medium">
          {t(item.title)}
          {item.best && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              <Star className="h-2.5 w-2.5 fill-current" /> {bestLabel}
            </span>
          )}
        </p>
        {t(item.body) && <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{t(item.body)}</p>}
        <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" /> {t(item.when)}
        </p>
        {error && <p role="alert" className="mt-1.5 text-xs text-destructive">{error}</p>}
      </div>

      <div className="flex flex-col items-end gap-2">
        <Badge tone={STATUS_TONE[item.status]}>{t(STATUS_LABEL[item.status])}</Badge>

        {!readOnly && (
          <div className="flex items-center gap-1">
            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}

            {(item.status === "needs_review" || item.status === "draft") && (
              <button
                onClick={() => run(() => updatePostStatus(item.id, "scheduled"))}
                disabled={pending}
                title={ui.approve}
                aria-label={ui.approve}
                className="grid h-7 w-7 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </button>
            )}

            {item.status === "scheduled" && (
              <button
                onClick={() => run(() => updatePostStatus(item.id, "published"))}
                disabled={pending}
                title={ui.markPublished}
                aria-label={ui.markPublished}
                className="grid h-7 w-7 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-success/10 hover:text-success disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={() => run(() => deletePost(item.id))}
              disabled={pending}
              title={ui.delete}
              aria-label={ui.delete}
              className="grid h-7 w-7 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
