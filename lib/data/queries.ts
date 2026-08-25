import { createClient, getUser } from "@/lib/supabase/server";
import type { Activity, DKpi } from "@/lib/demo/data";
import type { L } from "@/lib/i18n/config";
import type { ActivityRow, ChannelRow, MetricRow, PostRow, Workspace } from "./types";
import { DEFAULT_TZ, zonedParts } from "./tz";

const ACTION_LABEL: Record<ActivityRow["action"], L> = {
  queued: { tr: "kuyruğa ekledi", en: "added to queue" },
  approved: { tr: "onayladı", en: "approved" },
  published: { tr: "yayınladı", en: "published" },
  shifted_to_best_time: { tr: "en iyi saate kaydırdı", en: "shifted to best time" },
  failed: { tr: "yayınlayamadı", en: "failed to publish" },
};

/**
 * Everything the dashboard needs, in one round trip per table. Returns null
 * when there is no Supabase or nobody is signed in — callers fall back to demo.
 */
export async function getWorkspace(): Promise<Workspace | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const user = await getUser();
  if (!user) return null;

  const [profile, posts, channels, metrics, activity] = await Promise.all([
    supabase.from("profiles").select("display_name, timezone").eq("id", user.id).maybeSingle(),
    supabase.from("posts").select("id, channel_id, platform, title, body, scheduled_at, published_at, status, is_best_time"),
    supabase.from("channels").select("id, platform, handle, followers, growth, engagement, is_connected").order("created_at"),
    supabase.from("post_metrics").select("post_id, reach, engagement_rate, collected_at"),
    supabase.from("activity").select("id, actor, action, target, created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  const firstError = [posts.error, channels.error, metrics.error, activity.error].find(Boolean);
  if (firstError) {
    // A broken query must not silently render as "you have no posts".
    throw new Error(`Supabase read failed: ${firstError.message}`);
  }

  return {
    displayName:
      profile.data?.display_name ||
      (user.user_metadata?.display_name as string) ||
      user.email?.split("@")[0] ||
      "—",
    timezone: profile.data?.timezone || DEFAULT_TZ,
    posts: (posts.data ?? []) as PostRow[],
    channels: (channels.data ?? []) as ChannelRow[],
    metrics: (metrics.data ?? []) as MetricRow[],
    activity: (activity.data ?? []) as ActivityRow[],
  };
}

/** Is this instant inside the Monday–Sunday week containing `now`? */
export function inCurrentWeek(instant: string, now: Date, tz: string): boolean {
  const today = zonedParts(now, tz);
  const target = zonedParts(instant, tz);
  const mondayUtc = Date.UTC(today.year, today.month - 1, today.day - today.weekday);
  const targetUtc = Date.UTC(target.year, target.month - 1, target.day);
  const days = (targetUtc - mondayUtc) / 86400000;
  return days >= 0 && days < 7;
}

export function buildActivity(rows: ActivityRow[]): Activity[] {
  return rows.map((row) => ({
    id: row.id,
    who: row.actor,
    action: ACTION_LABEL[row.action],
    target: row.target,
    at: row.created_at,
  }));
}

export interface KpiInput {
  posts: PostRow[];
  metrics: MetricRow[];
  bestWindow?: { day: L; time: string };
  now: Date;
  tz: string;
}

export function buildKpis({ posts, metrics, bestWindow, now, tz }: KpiInput): DKpi[] {
  const scheduledThisWeek = posts.filter(
    (p) => p.status === "scheduled" && p.scheduled_at && inCurrentWeek(p.scheduled_at, now, tz),
  ).length;

  const publishedThisWeek = posts.filter(
    (p) => p.status === "published" && p.published_at && inCurrentWeek(p.published_at, now, tz),
  ).length;

  const weekAgo = now.getTime() - 7 * 86400000;
  const weeklyReach = metrics
    .filter((m) => new Date(m.collected_at).getTime() >= weekAgo)
    .reduce((sum, m) => sum + m.reach, 0);

  const channelCount = new Set(posts.map((p) => p.platform)).size;

  return [
    {
      label: { tr: "Bu hafta planlı", en: "Scheduled this week" },
      value: String(scheduledThisWeek),
      icon: "calendar-days",
      hint: { tr: `${channelCount} kanalda`, en: `across ${channelCount} channels` },
      tone: 1,
    },
    {
      label: { tr: "Bu hafta yayınlanan", en: "Published this week" },
      value: String(publishedThisWeek),
      icon: "send",
      hint: { tr: "tamamlanan gönderi", en: "posts completed" },
      tone: 2,
    },
    {
      label: { tr: "En iyi saat", en: "Best time" },
      value: bestWindow ? bestWindow.time.slice(0, 5) : "—",
      icon: "clock",
      hint: bestWindow ? bestWindow.day : { tr: "henüz veri yok", en: "no data yet" },
      tone: 3,
    },
    {
      label: { tr: "Haftalık erişim", en: "Weekly reach" },
      value: weeklyReach >= 1000 ? `${(weeklyReach / 1000).toFixed(1)}K` : String(weeklyReach),
      icon: "trending-up",
      hint: { tr: "son 7 gün", en: "last 7 days" },
      tone: 4,
    },
  ];
}

export function buildHero(displayName: string, queuedThisWeek: number, drafts: number) {
  const eyebrow: L = { tr: "Takvim · Bu hafta", en: "Calendar · This week" };
  const title: L = { tr: `Selam ${displayName}.`, en: `Hi ${displayName}.` };

  if (queuedThisWeek === 0 && drafts === 0) {
    return {
      eyebrow,
      title,
      accent: { tr: "Takvimin boş.", en: "Your calendar is empty." } as L,
      body: {
        tr: "İlk gönderini ekle — Sıraya onu takvime yerleştirir, en iyi saati öğrendikçe oraya kaydırır.",
        en: "Add your first post — Sıraya drops it on the calendar and shifts it to your best hour as it learns.",
      } as L,
    };
  }

  return {
    eyebrow,
    title,
    accent: {
      tr: `Bu hafta ${queuedThisWeek} gönderi sırada.`,
      en: `${queuedThisWeek} posts queued this week.`,
    } as L,
    body: {
      tr: drafts > 0
        ? `${drafts} taslak hâlâ onay bekliyor. Kuyruktan gözden geçirebilirsin.`
        : "Haftan hazır ve sıraya girdi. Boş kalan günlere gönderi ekleyebilirsin.",
      en: drafts > 0
        ? `${drafts} drafts are still waiting on review. You can go through them in the queue.`
        : "Your week is ready and queued. You can still fill the open days.",
    } as L,
  };
}
