/**
 * Sıraya demo data — a creator's social calendar running on autopilot. With no
 * API keys, the whole app renders from this file. Labels are bilingual
 * ({ tr, en }); pages resolve them to the active language. Post copy, handles
 * and channel names stay as-is (content). Connect your social accounts (run
 * /setup) to publish for real.
 */
import type { TrendPoint } from "@/components/app/trend-chart";
import type { L } from "@/lib/i18n/config";

/* ── Platforms ──────────────────────────────────────────────────────────── */
export type Platform = "instagram" | "x" | "linkedin" | "tiktok";

// NOTE: lucide-react v1 ships no brand glyphs (no instagram/twitter/linkedin/
// facebook icons). We map each platform to a neutral lucide icon that exists.
export const PLATFORM: Record<Platform, { name: string; icon: string; hue: string }> = {
  instagram: { name: "Instagram", icon: "camera", hue: "350" },
  x: { name: "X", icon: "at-sign", hue: "230" },
  linkedin: { name: "LinkedIn", icon: "briefcase", hue: "245" },
  tiktok: { name: "TikTok", icon: "music-2", hue: "190" },
};

export const PLATFORMS = Object.keys(PLATFORM) as Platform[];

export type PostStatus = "scheduled" | "draft" | "published" | "needs_review" | "failed";

export const STATUS_LABEL: Record<PostStatus, L> = {
  scheduled: { tr: "Sırada", en: "Scheduled" },
  draft: { tr: "Taslak", en: "Draft" },
  published: { tr: "Yayında", en: "Published" },
  needs_review: { tr: "Onay bekliyor", en: "Needs review" },
  failed: { tr: "Başarısız", en: "Failed" },
};

export const STATUS_TONE: Record<PostStatus, "info" | "neutral" | "success" | "warning" | "destructive"> = {
  scheduled: "info",
  draft: "neutral",
  published: "success",
  needs_review: "warning",
  failed: "destructive",
};

/* ── KPIs ───────────────────────────────────────────────────────────────── */
export interface DKpi { label: L; value: string; delta?: number; icon?: string; hint?: L; tone?: 1 | 2 | 3 | 4; }

export const kpis: DKpi[] = [
  { label: { tr: "Bu hafta planlı", en: "Scheduled this week" }, value: "23", delta: 9.0, icon: "calendar-days", hint: { tr: "4 kanalda", en: "across 4 channels" }, tone: 1 },
  { label: { tr: "Bu hafta yayınlanan", en: "Published this week" }, value: "16", delta: 14.0, icon: "send", hint: { tr: "tamamı zamanında", en: "all on time" }, tone: 2 },
  { label: { tr: "En iyi saat", en: "Best time" }, value: "18:00", delta: undefined, icon: "clock", hint: { tr: "Sal & Per akşamı", en: "Tue & Thu evening" }, tone: 3 },
  { label: { tr: "Haftalık erişim", en: "Weekly reach" }, value: "48.2K", delta: 38.0, icon: "trending-up", hint: { tr: "geçen haftaya göre", en: "vs last week" }, tone: 4 },
];

/* ── Hero ───────────────────────────────────────────────────────────────── */
export const hero = {
  eyebrow: { tr: "Takvim · Bu hafta", en: "Calendar · This week" } as L,
  title: { tr: "Selam Mira.", en: "Hi Mira." } as L,
  accent: { tr: "Bu hafta 23 gönderi sırada.", en: "23 posts queued this week." } as L,
  body: {
    tr: "Haftan hazır ve sıraya girdi. Salı 18:00 en güçlü pencere — Sıraya öne çıkan Reels'i oraya kaydırdı. Perşembe öğleden sonra hâlâ boş; bir gönderi ekleyebilirsin.",
    en: "Your week is ready and queued. Tuesday 18:00 is your strongest window — Sıraya shifted the featured Reel there. Thursday afternoon is still open; you could add a post.",
  } as L,
};

/* ── Calendar: month grid ──────────────────────────────────────────────────
   42 cells (6 weeks). `d` is the day number; `mo=false` = outside current month.
   `posts` are the chips shown in that cell. */
export interface MonthPost { platform: Platform; time: string; status: PostStatus; }
export interface MonthCell { key: string; d: number; mo: boolean; today?: boolean; posts: MonthPost[]; }

const P = (platform: Platform, time: string, status: PostStatus = "scheduled"): MonthPost => ({ platform, time, status });

export const monthMeta = {
  label: { tr: "Haziran 2026", en: "June 2026" } as L,
  weekdays: {
    tr: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
};

export const monthCells: MonthCell[] = [
  // week 1 — starts Mon Jun 1
  { key: "m1", d: 1, mo: true, posts: [P("linkedin", "09:00", "published"), P("instagram", "18:00", "published")] },
  { key: "m2", d: 2, mo: true, posts: [P("x", "12:30", "published")] },
  { key: "m3", d: 3, mo: true, posts: [P("tiktok", "19:00", "published"), P("instagram", "11:00", "published")] },
  { key: "m4", d: 4, mo: true, posts: [P("linkedin", "08:30", "published")] },
  { key: "m5", d: 5, mo: true, posts: [P("x", "13:00", "published"), P("instagram", "17:30", "published")] },
  { key: "m6", d: 6, mo: true, posts: [] },
  { key: "m7", d: 7, mo: true, posts: [P("tiktok", "20:00", "published")] },
  // week 2
  { key: "m8", d: 8, mo: true, posts: [P("linkedin", "09:00", "published"), P("x", "12:00", "published")] },
  { key: "m9", d: 9, mo: true, posts: [P("instagram", "18:00", "published"), P("tiktok", "19:30", "published")] },
  { key: "m10", d: 10, mo: true, posts: [P("x", "14:00", "published")] },
  { key: "m11", d: 11, mo: true, posts: [P("linkedin", "08:30", "published"), P("instagram", "17:00", "published")] },
  { key: "m12", d: 12, mo: true, posts: [P("tiktok", "20:00", "published"), P("x", "12:30", "published")] },
  { key: "m13", d: 13, mo: true, today: true, posts: [P("instagram", "18:00"), P("x", "12:30", "published"), P("linkedin", "09:00", "published")] },
  { key: "m14", d: 14, mo: true, posts: [P("tiktok", "19:00"), P("instagram", "11:30")] },
  // week 3 — the planned week
  { key: "m15", d: 15, mo: true, posts: [P("linkedin", "09:00"), P("x", "12:30"), P("instagram", "18:00")] },
  { key: "m16", d: 16, mo: true, posts: [P("instagram", "18:00"), P("tiktok", "19:30"), P("x", "13:00")] },
  { key: "m17", d: 17, mo: true, posts: [P("linkedin", "08:30"), P("x", "12:00")] },
  { key: "m18", d: 18, mo: true, posts: [P("tiktok", "20:00", "needs_review"), P("instagram", "17:00")] },
  { key: "m19", d: 19, mo: true, posts: [P("x", "12:30"), P("linkedin", "09:00"), P("instagram", "18:00")] },
  { key: "m20", d: 20, mo: true, posts: [P("tiktok", "19:00", "draft")] },
  { key: "m21", d: 21, mo: true, posts: [] },
  // week 4
  { key: "m22", d: 22, mo: true, posts: [P("linkedin", "09:00"), P("instagram", "18:00")] },
  { key: "m23", d: 23, mo: true, posts: [P("x", "12:30"), P("tiktok", "19:30")] },
  { key: "m24", d: 24, mo: true, posts: [P("instagram", "17:30", "draft")] },
  { key: "m25", d: 25, mo: true, posts: [P("linkedin", "08:30"), P("x", "13:00")] },
  { key: "m26", d: 26, mo: true, posts: [P("tiktok", "20:00")] },
  { key: "m27", d: 27, mo: true, posts: [] },
  { key: "m28", d: 28, mo: true, posts: [P("instagram", "11:00", "draft")] },
  // week 5
  { key: "m29", d: 29, mo: true, posts: [P("linkedin", "09:00"), P("x", "12:30")] },
  { key: "m30", d: 30, mo: true, posts: [P("instagram", "18:00"), P("tiktok", "19:00")] },
  { key: "m31", d: 1, mo: false, posts: [] },
  { key: "m32", d: 2, mo: false, posts: [] },
  { key: "m33", d: 3, mo: false, posts: [] },
  { key: "m34", d: 4, mo: false, posts: [] },
  { key: "m35", d: 5, mo: false, posts: [] },
  // week 6 (trailing)
  { key: "m36", d: 6, mo: false, posts: [] },
  { key: "m37", d: 7, mo: false, posts: [] },
  { key: "m38", d: 8, mo: false, posts: [] },
  { key: "m39", d: 9, mo: false, posts: [] },
  { key: "m40", d: 10, mo: false, posts: [] },
  { key: "m41", d: 11, mo: false, posts: [] },
  { key: "m42", d: 12, mo: false, posts: [] },
];

/* ── Calendar: week grid (this week, time-slotted) ─────────────────────────
   Hours down the left, days across the top. Each post sits at an hour slot. */
export const weekMeta = {
  label: { tr: "15 – 21 Haziran", en: "Jun 15 – 21" } as L,
  days: {
    tr: [
      { short: "Pzt", num: 15 }, { short: "Sal", num: 16 }, { short: "Çar", num: 17 },
      { short: "Per", num: 18 }, { short: "Cum", num: 19 }, { short: "Cmt", num: 20 }, { short: "Paz", num: 21 },
    ],
    en: [
      { short: "Mon", num: 15 }, { short: "Tue", num: 16 }, { short: "Wed", num: 17 },
      { short: "Thu", num: 18 }, { short: "Fri", num: 19 }, { short: "Sat", num: 20 }, { short: "Sun", num: 21 },
    ],
  },
};

export const weekHours = ["08:00", "10:00", "12:00", "14:00", "17:00", "19:00"];

export interface WeekPost { id: string; day: number; hour: string; platform: Platform; title: L; status: PostStatus; }

export const weekPosts: WeekPost[] = [
  { id: "w1", day: 0, hour: "08:00", platform: "linkedin", title: { tr: "Pazartesi ipucu dizisi", en: "Monday tip series" }, status: "scheduled" },
  { id: "w2", day: 0, hour: "12:00", platform: "x", title: { tr: "Thread: 5 ders", en: "Thread: 5 lessons" }, status: "scheduled" },
  { id: "w3", day: 0, hour: "17:00", platform: "instagram", title: { tr: "Carousel: süreç", en: "Carousel: process" }, status: "scheduled" },
  { id: "w4", day: 1, hour: "12:00", platform: "x", title: { tr: "Hızlı not", en: "Quick note" }, status: "scheduled" },
  { id: "w5", day: 1, hour: "17:00", platform: "instagram", title: { tr: "Reels: kamera arkası", en: "Reel: behind the scenes" }, status: "scheduled" },
  { id: "w6", day: 1, hour: "19:00", platform: "tiktok", title: { tr: "Dans değil, ipucu", en: "Not a dance, a tip" }, status: "scheduled" },
  { id: "w7", day: 2, hour: "08:00", platform: "linkedin", title: { tr: "Vaka çalışması", en: "Case study" }, status: "scheduled" },
  { id: "w8", day: 2, hour: "12:00", platform: "x", title: { tr: "Anket", en: "Poll" }, status: "scheduled" },
  { id: "w9", day: 3, hour: "17:00", platform: "instagram", title: { tr: "Alıntı görsel", en: "Quote graphic" }, status: "scheduled" },
  { id: "w10", day: 3, hour: "19:00", platform: "tiktok", title: { tr: "Soru-cevap", en: "Q&A clip" }, status: "needs_review" },
  { id: "w11", day: 4, hour: "08:00", platform: "linkedin", title: { tr: "Haftalık özet", en: "Weekly recap" }, status: "scheduled" },
  { id: "w12", day: 4, hour: "12:00", platform: "x", title: { tr: "Cuma düşüncesi", en: "Friday thought" }, status: "scheduled" },
  { id: "w13", day: 4, hour: "17:00", platform: "instagram", title: { tr: "Reels: özet", en: "Reel: recap" }, status: "scheduled" },
  { id: "w14", day: 5, hour: "19:00", platform: "tiktok", title: { tr: "Hafta sonu vlog", en: "Weekend vlog" }, status: "draft" },
];

/* ── Best-time heatmap: 7 days × 6 windows → score 0–100 ──────────────────── */
export const heatmapMeta = {
  days: {
    tr: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  windows: ["06–09", "09–12", "12–15", "15–18", "18–21", "21–24"],
};

// rows = days (Mon..Sun), cols = windows. Higher = more engagement.
export const heatmap: number[][] = [
  [22, 48, 61, 40, 78, 35], // Mon
  [30, 55, 58, 52, 96, 44], // Tue  ← peak
  [26, 50, 64, 47, 72, 38], // Wed
  [28, 52, 60, 55, 90, 49], // Thu  ← strong
  [24, 46, 57, 42, 70, 41], // Fri
  [18, 34, 44, 50, 62, 58], // Sat
  [20, 30, 38, 46, 66, 64], // Sun
];

export interface BestWindow { day: L; time: string; score: number; }
export const bestWindows: BestWindow[] = [
  { day: { tr: "Salı", en: "Tuesday" }, time: "18:00–21:00", score: 96 },
  { day: { tr: "Perşembe", en: "Thursday" }, time: "18:00–21:00", score: 90 },
  { day: { tr: "Pazartesi", en: "Monday" }, time: "18:00–21:00", score: 78 },
];

/* ── Channels ───────────────────────────────────────────────────────────── */
export interface Channel {
  id: string;
  platform: Platform;
  handle: string;
  followers: string;
  followerNum: number;
  growth: number;     // % vs last 30d
  scheduled: number;  // posts queued
  engagement: number; // avg %
  connected: boolean;
}

export const channels: Channel[] = [
  { id: "c1", platform: "instagram", handle: "@mira.builds", followers: "28.4K", followerNum: 28400, growth: 6.2, scheduled: 9, engagement: 4.8, connected: true },
  { id: "c2", platform: "x", handle: "@mirabuilds", followers: "12.1K", followerNum: 12100, growth: 9.7, scheduled: 7, engagement: 3.1, connected: true },
  { id: "c3", platform: "linkedin", handle: "Mira Aydın", followers: "8.9K", followerNum: 8900, growth: 4.4, scheduled: 5, engagement: 5.6, connected: true },
  { id: "c4", platform: "tiktok", handle: "@mira.builds", followers: "41.2K", followerNum: 41200, growth: 12.3, scheduled: 6, engagement: 7.2, connected: true },
];

/* ── Queue (ordered "up next" list) ────────────────────────────────────────── */
export interface QueueItem {
  id: string;
  platform: Platform;
  title: L;
  body: L;
  when: L;       // human "Today 18:00"
  slot: string;  // exact time
  status: PostStatus;
  best?: boolean; // sitting in a best-time window
}

export const queue: QueueItem[] = [
  { id: "q1", platform: "instagram", title: { tr: "Carousel: planlama akışım", en: "Carousel: my planning flow" }, body: { tr: "6 slaytta haftalık içerik ritmim — kaydet, dene.", en: "My weekly content rhythm in 6 slides — save it, try it." }, when: { tr: "Bugün 18:00", en: "Today 18:00" }, slot: "18:00", status: "scheduled", best: true },
  { id: "q2", platform: "x", title: { tr: "Thread: 5 planlama dersi", en: "Thread: 5 scheduling lessons" }, body: { tr: "Bir yılda 800 gönderiden öğrendiklerim 🧵", en: "What 800 posts in a year taught me 🧵" }, when: { tr: "Yarın 12:30", en: "Tomorrow 12:30" }, slot: "12:30", status: "scheduled" },
  { id: "q3", platform: "tiktok", title: { tr: "Soru-cevap klibi", en: "Q&A clip" }, body: { tr: "'En iyi saat gerçek mi?' sorusuna 40 sn'lik yanıt.", en: "A 40s answer to 'is best-time real?'" }, when: { tr: "Per 19:00", en: "Thu 19:00" }, slot: "19:00", status: "needs_review" },
  { id: "q4", platform: "linkedin", title: { tr: "Vaka: 3× erişim", en: "Case study: 3× reach" }, body: { tr: "Tek bir değişiklikle erişimi nasıl üçe katladım.", en: "How one change tripled my reach." }, when: { tr: "Çar 09:00", en: "Wed 09:00" }, slot: "09:00", status: "scheduled", best: true },
  { id: "q5", platform: "instagram", title: { tr: "Reels: kamera arkası", en: "Reel: behind the scenes" }, body: { tr: "Bir gönderi nasıl doğuyor — 20 sn.", en: "How a post comes together — 20s." }, when: { tr: "Sal 17:00", en: "Tue 17:00" }, slot: "17:00", status: "scheduled" },
  { id: "q6", platform: "x", title: { tr: "Cuma anketi", en: "Friday poll" }, body: { tr: "Hangi platform sence en zor?", en: "Which platform do you find hardest?" }, when: { tr: "Cum 12:00", en: "Fri 12:00" }, slot: "12:00", status: "draft" },
  { id: "q7", platform: "tiktok", title: { tr: "Hafta sonu vlog", en: "Weekend vlog" }, body: { tr: "Bir içerik üreticisinin Cumartesi'si.", en: "A creator's Saturday." }, when: { tr: "Cmt 19:00", en: "Sat 19:00" }, slot: "19:00", status: "draft" },
];

/* ── Engagement series ──────────────────────────────────────────────────────── */
export const reach14d = [1180, 1340, 980, 1620, 1510, 2240, 1980, 1760, 2410, 2060, 2880, 3120, 2740, 3460];

export const reachByPlatform: { platform: Platform; value: number }[] = [
  { platform: "instagram", value: 18200 },
  { platform: "tiktok", value: 21400 },
  { platform: "x", value: 5400 },
  { platform: "linkedin", value: 3200 },
];

/* engagement-rate trend for the analytics chart */
export const engagementTrend: TrendPoint[] = [
  { label: "Wk 1", value: 2.9 },
  { label: "Wk 2", value: 3.4 },
  { label: "Wk 3", value: 3.1 },
  { label: "Wk 4", value: 4.0 },
  { label: "Wk 5", value: 4.6 },
  { label: "Wk 6", value: 5.2 },
];

/* top posts for analytics */
export interface TopPost { id: string; platform: Platform; title: L; reach: string; engagement: number; when: L; }
export const topPosts: TopPost[] = [
  { id: "t1", platform: "tiktok", title: { tr: "Soru-cevap: en iyi saat", en: "Q&A: best time" }, reach: "12.4K", engagement: 9.1, when: { tr: "9 Haz", en: "Jun 9" } },
  { id: "t2", platform: "instagram", title: { tr: "Carousel: planlama akışı", en: "Carousel: planning flow" }, reach: "8.8K", engagement: 6.7, when: { tr: "5 Haz", en: "Jun 5" } },
  { id: "t3", platform: "linkedin", title: { tr: "Vaka: 3× erişim", en: "Case study: 3× reach" }, reach: "6.2K", engagement: 7.4, when: { tr: "4 Haz", en: "Jun 4" } },
  { id: "t4", platform: "x", title: { tr: "Thread: 5 ders", en: "Thread: 5 lessons" }, reach: "5.1K", engagement: 4.2, when: { tr: "2 Haz", en: "Jun 2" } },
  { id: "t5", platform: "instagram", title: { tr: "Reels: kamera arkası", en: "Reel: behind the scenes" }, reach: "4.6K", engagement: 5.9, when: { tr: "9 Haz", en: "Jun 9" } },
];

/* ── Activity feed ─────────────────────────────────────────────────────────── */
export interface Activity { id: string; who: string; action: L; target: string; at: string; }
export const activity: Activity[] = [
  { id: "a1", who: "Sıraya", action: { tr: "en iyi saate kaydırdı", en: "shifted to best time" }, target: "Instagram · 18:00", at: new Date(Date.now() - 6 * 60000).toISOString() },
  { id: "a2", who: "Sıraya", action: { tr: "yayınladı", en: "published" }, target: "X · Thread", at: new Date(Date.now() - 52 * 60000).toISOString() },
  { id: "a3", who: "Deniz", action: { tr: "onayladı", en: "approved" }, target: "TikTok · Q&A", at: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: "a4", who: "Mira", action: { tr: "kuyruğa ekledi", en: "added to queue" }, target: "LinkedIn · Case study", at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: "a5", who: "Sıraya", action: { tr: "yayınladı", en: "published" }, target: "Instagram · Reel", at: new Date(Date.now() - 26 * 3600000).toISOString() },
];
