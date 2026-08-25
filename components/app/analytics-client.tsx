"use client";

import { BarChart3, Eye, TrendingUp } from "lucide-react";
import { TrendChart } from "@/components/app/trend-chart";
import { Icon } from "@/components/ui/icon";
import { useLang } from "@/components/i18n/language-provider";
import { DemoBanner, EmptyState } from "@/components/app/empty-state";
import { PLATFORM, type Platform } from "@/lib/demo/data";
import type { AnalyticsView } from "@/lib/data/types";

const dot = (p: Platform) => `oklch(62% 0.17 ${PLATFORM[p].hue})`;
const soft = (p: Platform) => `oklch(94% 0.05 ${PLATFORM[p].hue})`;

export function AnalyticsClient({ view }: { view: AnalyticsView }) {
  const { lang, t, ui } = useLang();
  const m = {
    tr: { title: "Analitik", sub: "Erişim, etkileşim ve en iyi pencereler.", reach: "14 günlük erişim", eng: "Etkileşim oranı", byChannel: "Kanala göre erişim", top: "En iyi gönderiler", best: "En iyi pencereler" },
    en: { title: "Analytics", sub: "Reach, engagement and your best windows.", reach: "14-day reach", eng: "Engagement rate", byChannel: "Reach by channel", top: "Top posts", best: "Best windows" },
  }[lang];

  const totalReach = view.reach14d.reduce((a, b) => a + b, 0);
  const maxR = view.reachByPlatform.length ? Math.max(...view.reachByPlatform.map((r) => r.value)) : 0;
  const hasData = totalReach > 0 || view.topPosts.length > 0;

  const header = (
    <div>
      <h2 className="font-display text-2xl font-semibold tracking-tight">{m.title}</h2>
      <p className="text-sm text-muted-foreground">{m.sub}</p>
    </div>
  );

  if (!hasData) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        {header}
        {view.isDemo && <DemoBanner text={ui.demoBanner} />}
        <EmptyState icon={<BarChart3 className="h-5 w-5" />} title={ui.emptyAnalytics} hint={ui.emptyAnalyticsHint} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {header}
      {view.isDemo && <DemoBanner text={ui.demoBanner} />}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{m.reach}</h3>
            <p className="inline-flex items-center gap-1 font-display text-xl font-semibold tabular-nums">
              <Eye className="h-4 w-4 text-muted-foreground" />
              {totalReach >= 1000 ? `${(totalReach / 1000).toFixed(1)}K` : totalReach}
            </p>
          </div>
          <TrendChart data={view.reach14d.map((v, i) => ({ label: `${i + 1}`, value: v }))} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{m.eng}</h3>
            {view.engagementDelta !== 0 && (
              <p className={`inline-flex items-center gap-0.5 text-sm font-semibold ${view.engagementDelta > 0 ? "text-success" : "text-destructive"}`}>
                <TrendingUp className="h-4 w-4" />
                {view.engagementDelta > 0 ? "+" : ""}{view.engagementDelta}pt
              </p>
            )}
          </div>
          <TrendChart data={view.engagementTrend} suffix="%" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="mb-4 font-semibold">{m.byChannel}</h3>
          <div className="space-y-3">
            {view.reachByPlatform.map((r) => (
              <div key={r.platform}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{PLATFORM[r.platform].name}</span>
                  <span className="tabular-nums text-muted-foreground">{r.value.toLocaleString()}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${maxR ? (r.value / maxR) * 100 : 0}%`, background: dot(r.platform) }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <h4 className="mb-2 text-sm font-semibold">{m.best}</h4>
            {view.bestWindows.length === 0 ? (
              <p className="text-xs text-muted-foreground">{ui.emptyHeatmap}</p>
            ) : (
              <ul className="space-y-1.5">
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
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="mb-4 font-semibold">{m.top}</h3>
          {view.topPosts.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{ui.emptyAnalytics}</p>
          ) : (
            <ul className="divide-y divide-border">
              {view.topPosts.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: soft(p.platform), color: dot(p.platform) }}>
                    <Icon name={PLATFORM[p.platform].icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t(p.title)}</p>
                    <p className="text-xs text-muted-foreground">{t(p.when)}</p>
                  </div>
                  <div className="text-right">
                    <p className="tabular-nums text-sm font-semibold">{p.reach}</p>
                    <p className="tabular-nums text-xs text-muted-foreground">{p.engagement}%</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
