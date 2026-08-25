"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight, BarChart3, CalendarDays, CheckCheck, Eye, FilePen, LayoutList,
  Share2, Sparkles, Star, TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { TrendChart } from "@/components/app/trend-chart";
import { DemoBanner, EmptyState } from "@/components/app/empty-state";
import { NewPostButton } from "@/components/app/post-dialog";
import { useLang } from "@/components/i18n/language-provider";
import { PLATFORM, STATUS_LABEL, STATUS_TONE, type Platform } from "@/lib/demo/data";
import { WEEKDAYS } from "@/lib/data/derive-calendar";
import { HEATMAP_WINDOWS } from "@/lib/data/derive-analytics";
import type { DashboardView } from "@/lib/data/types";
import { formatRelative } from "@/lib/utils";

const dot = (p: Platform) => `oklch(62% 0.17 ${PLATFORM[p].hue})`;
const soft = (p: Platform) => `oklch(94% 0.05 ${PLATFORM[p].hue})`;

/** Math.max on an empty list is -Infinity, which silently breaks every bar width. */
const peak = (values: number[]) => (values.length ? Math.max(...values) : 0);

export function DashboardClient({ view }: { view: DashboardView }) {
  const { lang, t, ui } = useLang();
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");

  const maxReach = peak(view.reachByPlatform.map((r) => r.value));
  const maxScheduled = peak(view.channels.map((c) => c.scheduled));
  const totalPosts = view.channels.reduce((a, c) => a + c.scheduled, 0);
  const drafts = view.queue.filter((q) => q.status === "draft" || q.status === "needs_review");
  const totalReach14 = view.reach14d.reduce((a, b) => a + b, 0);
  const hasHeat = view.heatmap.some((row) => row.some((v) => v > 0));

  // Donut arcs, accumulated without mutating across the render.
  const mixTotal = view.mix.reduce((a, x) => a + x.value, 0) || 1;
  const mixSegments = view.mix.map((slice, i) => {
    const before = view.mix.slice(0, i).reduce((a, x) => a + x.value, 0);
    return { ...slice, start: (before / mixTotal) * 360, end: ((before + slice.value) / mixTotal) * 360 };
  });
  const conic = mixSegments.length
    ? `conic-gradient(${mixSegments.map((s) => `oklch(62% 0.16 ${s.hue}) ${s.start}deg ${s.end}deg`).join(", ")})`
    : "var(--color-muted)";

  const m = {
    tr: { month: "Ay", week: "Hafta", calendar: "İçerik takvimi", best: "En iyi saatler", heat: "Koyu = daha çok etkileşim",
      queue: "Sırada", all: "Tümü", channels: "Kanallar", reach: "Kanala göre erişim", activity: "Son hareketler", followers: "takipçi", scheduled: "sırada", eng: "etkileşim",
      engTitle: "Etkileşim — 6 hafta", engHint: "Haftalık ortalama etkileşim oranı", byPlatform: "Platforma göre gönderi", posts: "gönderi",
      top: "En iyi gönderiler", drafts: "Taslaklar & onaylar", draftsEmpty: "Bekleyen taslak yok.", review: "İncele", mix: "İçerik karışımı",
      total: "toplam planlı", kReach: "Toplam erişim", kReachHint: "son 14 gün", kAuto: "Otomatik kaydırma", kAutoHint: "en iyi saate", noActivity: "Henüz hareket yok." },
    en: { month: "Month", week: "Week", calendar: "Content calendar", best: "Best times", heat: "Darker = more engagement",
      queue: "Up next", all: "All", channels: "Channels", reach: "Reach by channel", activity: "Recent activity", followers: "followers", scheduled: "queued", eng: "engagement",
      engTitle: "Engagement — 6 weeks", engHint: "Weekly average engagement rate", byPlatform: "Posts by platform", posts: "posts",
      top: "Top posts", drafts: "Drafts & approvals", draftsEmpty: "No drafts waiting.", review: "Review", mix: "Content mix",
      total: "total scheduled", kReach: "Total reach", kReachHint: "last 14 days", kAuto: "Auto-shifts", kAutoHint: "to best time", noActivity: "Nothing has happened yet." },
  }[lang];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {view.isDemo && <DemoBanner text={ui.demoBanner} />}

      <section className="relative overflow-hidden rounded-3xl border border-border shadow-soft" style={{ background: "var(--grad-hero)" }}>
        <span className="blob -right-10 -top-16 h-56 w-56 bg-primary/25 drift" aria-hidden />
        <div className="relative grid gap-6 p-7 lg:grid-cols-[1.5fr_1fr] lg:p-9">
          <div>
            <p className="label-mono flex items-center gap-2 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" /> {t(view.hero.eyebrow)}
            </p>
            <h1 className="mt-3 font-display text-[30px] font-semibold leading-[1.08] tracking-tight lg:text-[40px]">
              {t(view.hero.title)} <span className="text-primary">{t(view.hero.accent)}</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">{t(view.hero.body)}</p>
            <div className="mt-5">
              <NewPostButton channels={view.channels} disabled={view.isDemo} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {view.kpis.map((k) => (
              <div key={t(k.label)} className="rounded-2xl bg-card/80 p-4 ring-1 ring-border backdrop-blur">
                <p className="flex items-center gap-1.5 label-mono text-muted-foreground">
                  {k.icon && <Icon name={k.icon} className="h-3 w-3 text-primary" />} {t(k.label)}
                </p>
                <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums">{k.value}</p>
                <p className="text-[11px] text-muted-foreground">{k.hint ? t(k.hint) : ""}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniKpi icon={<Eye className="h-3 w-3 text-primary" />} label={m.kReach} hint={m.kReachHint}
          value={totalReach14 >= 1000 ? `${(totalReach14 / 1000).toFixed(1)}K` : String(totalReach14)} />
        <MiniKpi icon={<Sparkles className="h-3 w-3 text-primary" />} label={m.kAuto} hint={m.kAutoHint} value={String(view.autoShifts)} />
        <MiniKpi icon={<FilePen className="h-3 w-3 text-primary" />} label={m.drafts} value={String(drafts.length)}
          hint={lang === "tr" ? "onay bekliyor" : "awaiting review"} />
        <MiniKpi icon={<BarChart3 className="h-3 w-3 text-primary" />} label={m.total} value={String(totalPosts)}
          hint={lang === "tr" ? `${view.channels.length} kanalda` : `across ${view.channels.length} channels`} />
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.calendar}</h2>
            <span className="text-sm text-muted-foreground">
              · {calendarView === "month" ? t(view.monthMeta.label) : t(view.weekMeta.label)}
            </span>
          </div>
          <div className="flex rounded-full border border-border p-0.5 text-xs font-medium">
            {(["month", "week"] as const).map((v) => (
              <button key={v} onClick={() => setCalendarView(v)}
                className={`cursor-pointer rounded-full px-3 py-1 transition ${calendarView === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {v === "month" ? m.month : m.week}
              </button>
            ))}
          </div>
        </div>

        {calendarView === "month" ? (
          <div>
            <div className="grid grid-cols-7 gap-1.5 pb-2">
              {view.monthMeta.weekdays[lang].map((d) => <div key={d} className="label-mono text-center text-muted-foreground">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {view.monthCells.map((cell) => (
                <div key={cell.key} className={`min-h-[78px] rounded-xl border p-1.5 ${cell.today ? "border-primary bg-primary/5" : "border-border/60"} ${!cell.mo ? "opacity-40" : ""}`}>
                  <p className={`mb-1 text-[11px] font-medium tabular-nums ${cell.today ? "text-primary" : "text-muted-foreground"}`}>{cell.d}</p>
                  <div className="space-y-1">
                    {cell.posts.slice(0, 3).map((p, i) => (
                      <div key={i} className="flex items-center gap-1 rounded px-1 py-0.5 text-[10px] font-medium" style={{ background: soft(p.platform), color: dot(p.platform) }}>
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dot(p.platform) }} />
                        <span className="tabular-nums">{p.time}</span>
                        {p.status === "needs_review" && <Star className="ml-auto h-2.5 w-2.5" />}
                      </div>
                    ))}
                    {cell.posts.length > 3 && <p className="px-1 text-[10px] text-muted-foreground">+{cell.posts.length - 3}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid min-w-[640px]" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
              <div />
              {view.weekMeta.days[lang].map((d) => (
                <div key={`${d.short}-${d.num}`} className="pb-2 text-center">
                  <p className="text-xs font-medium">{d.short}</p>
                  <p className="text-[11px] text-muted-foreground tabular-nums">{d.num}</p>
                </div>
              ))}
              {view.weekHours.map((hour) => (
                <div key={hour} className="contents">
                  <div className="border-t border-border/50 py-3 pr-2 text-right text-[10px] tabular-nums text-muted-foreground">{hour}</div>
                  {view.weekMeta.days[lang].map((_, dayIdx) => {
                    const post = view.weekPosts.find((p) => p.day === dayIdx && p.hour === hour);
                    return (
                      <div key={dayIdx} className="border-l border-t border-border/50 p-1">
                        {post && (
                          <div className="rounded-lg px-1.5 py-1 text-[10px] font-medium leading-tight" style={{ background: soft(post.platform), color: dot(post.platform) }}>
                            <span className="block truncate">{t(post.title)}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.best}</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">{hasHeat ? m.heat : ui.emptyHeatmap}</p>
          <div className="grid gap-1" style={{ gridTemplateColumns: "32px repeat(6, 1fr)" }}>
            <div />
            {HEATMAP_WINDOWS.map((w) => <div key={w} className="pb-1 text-center text-[9px] text-muted-foreground">{w}</div>)}
            {view.heatmap.map((row, r) => (
              <div key={r} className="contents">
                <div className="flex items-center text-[10px] text-muted-foreground">{WEEKDAYS[lang][r]}</div>
                {row.map((score, c) => (
                  <div key={c} className="grid aspect-square place-items-center rounded-md text-[9px] font-semibold"
                    style={{ background: `color-mix(in oklch, var(--color-primary) ${score}%, var(--color-muted))`, color: score > 55 ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)" }}>
                    {score > 80 ? score : ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {view.bestWindows.length > 0 && (
            <ul className="mt-5 space-y-2">
              {view.bestWindows.map((b) => (
                <li key={`${t(b.day)}-${b.time}`} className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">{t(b.day)}</span>
                  <span className="text-muted-foreground">{b.time}</span>
                  <span className="ml-auto tabular-nums font-semibold text-primary">{b.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.queue}</h2>
            <Link href="/queue" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              {m.all} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {view.queue.length === 0 ? (
            <EmptyState icon={<LayoutList className="h-5 w-5" />} title={ui.emptyQueue} hint={ui.emptyQueueHint} className="border-0 bg-transparent px-0 py-6" />
          ) : (
            <ul className="space-y-2.5">
              {view.queue.slice(0, 5).map((q) => (
                <li key={q.id} className="flex items-start gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: soft(q.platform), color: dot(q.platform) }}>
                    <Icon name={PLATFORM[q.platform].icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                      {t(q.title)} {q.best && <Star className="h-3 w-3 fill-current text-primary" />}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{t(q.when)}</p>
                  </div>
                  <Badge tone={STATUS_TONE[q.status]} className="shrink-0">{t(STATUS_LABEL[q.status])}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold tracking-tight">{m.channels}</h2>
          {view.channels.length === 0 ? (
            <EmptyState
              icon={<Share2 className="h-5 w-5" />}
              title={ui.emptyChannels}
              hint={ui.emptyChannelsHint}
              action={<Link href="/channels" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">{ui.addChannel}</Link>}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {view.channels.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: soft(c.platform), color: dot(c.platform) }}>
                        <Icon name={PLATFORM[c.platform].icon} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{c.handle}</p>
                        <p className="text-xs text-muted-foreground">{c.followers} {m.followers}</p>
                      </div>
                      {c.growth !== 0 && (
                        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-success">
                          <ArrowUpRight className="h-3 w-3" />{c.growth}%
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-xs text-muted-foreground">
                      <span>{c.scheduled} {m.scheduled}</span>
                      <span className="tabular-nums">{c.engagement}% {m.eng}</span>
                    </div>
                  </div>
                ))}
              </div>

              {view.reachByPlatform.length > 0 && (
                <div className="mt-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <h3 className="mb-3 text-sm font-semibold">{m.reach}</h3>
                  <div className="space-y-2.5">
                    {view.reachByPlatform.map((r) => (
                      <div key={r.platform}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium">{PLATFORM[r.platform].name}</span>
                          <span className="tabular-nums text-muted-foreground">{r.value.toLocaleString()}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full" style={{ width: `${maxReach ? (r.value / maxReach) * 100 : 0}%`, background: dot(r.platform) }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold tracking-tight">{m.activity}</h2>
          {view.activity.length === 0 ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">{m.noActivity}</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {view.activity.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 text-sm">
                    <p className="leading-snug">
                      <span className="font-medium">{a.who}</span>{" "}
                      <span className="text-muted-foreground">{t(a.action)}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{formatRelative(a.at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold tracking-tight">{m.engTitle}</h2>
            </div>
            {view.engagementDelta !== 0 && (
              <span className={`inline-flex items-center gap-0.5 text-sm font-semibold ${view.engagementDelta > 0 ? "text-success" : "text-destructive"}`}>
                <ArrowUpRight className="h-4 w-4" /> {view.engagementDelta > 0 ? "+" : ""}{view.engagementDelta}pt
              </span>
            )}
          </div>
          <p className="mb-3 text-xs text-muted-foreground">{m.engHint}</p>
          <TrendChart data={view.engagementTrend} suffix="%" height={220} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.byPlatform}</h2>
          </div>
          {view.channels.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{ui.emptyChannels}</p>
          ) : (
            <div className="space-y-3">
              {view.channels.map((ch) => (
                <div key={ch.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span className="grid h-5 w-5 place-items-center rounded" style={{ background: soft(ch.platform), color: dot(ch.platform) }}>
                        <Icon name={PLATFORM[ch.platform].icon} className="h-3 w-3" />
                      </span>
                      {PLATFORM[ch.platform].name}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{ch.scheduled} {m.posts}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${maxScheduled ? (ch.scheduled / maxScheduled) * 100 : 0}%`, background: dot(ch.platform) }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold tracking-tight">{m.top}</h2>
            </div>
            <Link href="/analytics" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              {m.all} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {view.topPosts.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{ui.emptyAnalytics}</p>
          ) : (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {view.topPosts.map((p, i) => (
                  <tr key={p.id}>
                    <td className="py-3 pr-2 text-muted-foreground tabular-nums">{i + 1}</td>
                    <td className="py-3 pr-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: soft(p.platform), color: dot(p.platform) }}>
                        <Icon name={PLATFORM[p.platform].icon} className="h-4 w-4" />
                      </span>
                    </td>
                    <td className="min-w-0 py-3 pr-2">
                      <p className="truncate font-medium">{t(p.title)}</p>
                      <p className="text-xs text-muted-foreground">{PLATFORM[p.platform].name} · {t(p.when)}</p>
                    </td>
                    <td className="py-3 pr-2 text-right tabular-nums font-semibold">{p.reach}</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-success">
                        <TrendingUp className="h-3 w-3" />{p.engagement}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-display text-lg font-semibold tracking-tight">{m.mix}</h2>
          {view.mix.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{ui.emptyQueue}</p>
          ) : (
            <div className="flex items-center gap-6">
              <div className="relative h-32 w-32 shrink-0 rounded-full" style={{ background: conic }}>
                <div className="absolute inset-[18%] grid place-items-center rounded-full bg-card">
                  <div className="text-center">
                    <p className="font-display text-xl font-semibold leading-none tabular-nums">{view.queue.length}</p>
                    <p className="text-[10px] text-muted-foreground">{m.posts}</p>
                  </div>
                </div>
              </div>
              <ul className="flex-1 space-y-2.5">
                {view.mix.map((s) => (
                  <li key={s.key} className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: `oklch(62% 0.16 ${s.hue})` }} />
                    <span className="flex-1 truncate text-[13px]">{t(s.label)}</span>
                    <span className="tabular-nums font-semibold text-muted-foreground">{s.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilePen className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.drafts}</h2>
          </div>
          <Badge tone="warning">{drafts.length} {lang === "tr" ? "bekliyor" : "pending"}</Badge>
        </div>
        {drafts.length === 0 ? (
          <p className="rounded-xl bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">{m.draftsEmpty}</p>
        ) : (
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {drafts.map((q) => (
              <li key={q.id} className="flex items-start gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: soft(q.platform), color: dot(q.platform) }}>
                  <Icon name={PLATFORM[q.platform].icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t(q.title)}</p>
                  <p className="truncate text-xs text-muted-foreground">{t(q.body)}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge tone={STATUS_TONE[q.status]}>{t(STATUS_LABEL[q.status])}</Badge>
                    <span className="text-[11px] text-muted-foreground">{t(q.when)}</span>
                  </div>
                </div>
                <Link href="/queue" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                  <CheckCheck className="h-3 w-3" /> {m.review}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function MiniKpi({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <p className="flex items-center gap-1.5 label-mono text-muted-foreground">{icon} {label}</p>
      <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}
