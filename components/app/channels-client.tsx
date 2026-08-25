"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Check, Loader2, Plus, Share2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { useLang } from "@/components/i18n/language-provider";
import { DemoBanner, EmptyState } from "@/components/app/empty-state";
import { createChannel, deleteChannel } from "@/lib/actions/channels";
import { PLATFORM, PLATFORMS, type Channel, type Platform } from "@/lib/demo/data";
import type { ChannelsView } from "@/lib/data/types";

const dot = (p: Platform) => `oklch(62% 0.17 ${PLATFORM[p].hue})`;
const soft = (p: Platform) => `oklch(94% 0.05 ${PLATFORM[p].hue})`;
const FIELD = "flex h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export interface ConnectNotice { kind: "connected" | "error"; detail: string }

export function ChannelsClient({ view, notice }: { view: ChannelsView; notice?: ConnectNotice }) {
  const { lang, ui } = useLang();
  const [adding, setAdding] = useState(false);
  const m = {
    tr: { title: "Kanallar", sub: "Bağlı sosyal hesapların ve performansları.", followers: "Takipçi", growth: "30g büyüme", scheduled: "Sırada", eng: "Etkileşim", connected: "Bağlı" },
    en: { title: "Channels", sub: "Your connected social accounts and how they're doing.", followers: "Followers", growth: "30d growth", scheduled: "Queued", eng: "Engagement", connected: "Connected" },
  }[lang];

  const totalFollowers = view.channels.reduce((s, c) => s + c.followerNum, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{m.title}</h2>
          <p className="text-sm text-muted-foreground">{m.sub}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setAdding(true)} disabled={view.isDemo} variant="outline" className="rounded-full">
            <Plus className="h-4 w-4" /> {ui.addChannel}
          </Button>
          {/* A full page load, not a fetch: this hands the browser to Instagram. */}
          <a
            href={view.isDemo ? undefined : "/api/instagram/connect"}
            aria-disabled={view.isDemo}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 ${view.isDemo ? "pointer-events-none opacity-50" : ""}`}
          >
            <Icon name={PLATFORM.instagram.icon} className="h-4 w-4" /> {ui.connectInstagram}
          </a>
        </div>
      </div>

      {view.isDemo && <DemoBanner text={ui.demoBanner} />}

      {notice?.kind === "connected" && (
        <p className="flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <span><span className="font-medium">{ui.igConnected} {notice.detail}</span> — {ui.igTokenNote}</span>
        </p>
      )}
      {notice?.kind === "error" && (
        <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{notice.detail}</span>
        </p>
      )}

      {view.channels.length === 0 ? (
        <EmptyState
          icon={<Share2 className="h-5 w-5" />}
          title={ui.emptyChannels}
          hint={ui.emptyChannelsHint}
          action={<Button onClick={() => setAdding(true)} className="rounded-full"><Plus className="h-4 w-4" /> {ui.addChannel}</Button>}
        />
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <p className="label-mono text-muted-foreground">{m.followers}</p>
            <p className="mt-1 font-display text-4xl font-semibold tabular-nums">
              {totalFollowers >= 1000 ? `${(totalFollowers / 1000).toFixed(1)}K` : totalFollowers}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {view.channels.map((c) => (
              <ChannelCard key={c.id} channel={c} labels={m} readOnly={view.isDemo} />
            ))}
          </div>
        </>
      )}

      {adding && <AddChannelDialog onClose={() => setAdding(false)} />}
    </div>
  );
}

function ChannelCard({
  channel, labels, readOnly,
}: {
  channel: Channel;
  labels: { followers: string; growth: string; scheduled: string; eng: string; connected: string };
  readOnly: boolean;
}) {
  const { ui } = useLang();
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: soft(channel.platform), color: dot(channel.platform) }}>
          <Icon name={PLATFORM[channel.platform].icon} className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{channel.handle}</p>
          <p className="text-xs text-muted-foreground">{PLATFORM[channel.platform].name}</p>
        </div>
        {channel.connected ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
            <Check className="h-3 w-3" /> {labels.connected}
          </span>
        ) : (
          <span title={ui.notPublishingHint} className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {ui.notPublishing}
          </span>
        )}
        {!readOnly && (
          <button
            onClick={() => startTransition(() => { void deleteChannel(channel.id); })}
            disabled={pending}
            aria-label={ui.delete}
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <Stat label={labels.followers} value={channel.followers} />
        <Stat label={labels.growth} value={`${channel.growth > 0 ? "+" : ""}${channel.growth}%`} accent={channel.growth > 0} />
        <Stat label={labels.scheduled} value={`${channel.scheduled}`} />
        <Stat label={labels.eng} value={`${channel.engagement}%`} />
      </div>
    </div>
  );
}

function AddChannelDialog({ onClose }: { onClose: () => void }) {
  const { ui } = useLang();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await createChannel(form);
      if (result.ok) onClose();
      else setError(result.error ?? ui.errGeneric);
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">{ui.addChannel}</h2>
          <button onClick={onClose} aria-label={ui.cancel} className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="platform">{ui.postPlatform}</Label>
            <select id="platform" name="platform" required className={FIELD} defaultValue={PLATFORMS[0]}>
              {PLATFORMS.map((p) => <option key={p} value={p}>{PLATFORM[p].name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="handle">{ui.channelHandle}</Label>
            <Input id="handle" name="handle" required maxLength={80} placeholder="@handle" autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="followers">{ui.channelFollowers}</Label>
            <Input id="followers" name="followers" type="number" min={0} defaultValue={0} />
          </div>

          <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">{ui.notPublishingHint}</p>

          {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>{ui.cancel}</Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? ui.saving : ui.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="label-mono text-muted-foreground">{label}</p>
      <p className={`mt-0.5 font-display text-lg font-semibold tabular-nums ${accent ? "text-success" : ""}`}>{value}</p>
    </div>
  );
}
