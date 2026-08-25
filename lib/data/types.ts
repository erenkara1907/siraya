import type { L } from "@/lib/i18n/config";
import type {
  Activity, BestWindow, Channel, DKpi, MonthCell, Platform, PostStatus,
  QueueItem, TopPost, WeekPost,
} from "@/lib/demo/data";
import type { TrendPoint } from "@/components/app/trend-chart";

/* ── Rows, as they come back from Supabase ───────────────────────────────── */

export interface PostRow {
  id: string;
  channel_id: string | null;
  platform: Platform;
  title: string;
  body: string;
  scheduled_at: string | null;
  published_at: string | null;
  status: PostStatus;
  is_best_time: boolean;
}

export interface ChannelRow {
  id: string;
  platform: Platform;
  handle: string;
  followers: number;
  growth: number;
  engagement: number;
  is_connected: boolean;
}

export interface MetricRow {
  post_id: string;
  reach: number;
  engagement_rate: number;
  collected_at: string;
}

export interface ActivityRow {
  id: string;
  actor: string;
  action: "queued" | "approved" | "published" | "shifted_to_best_time" | "failed";
  target: string;
  created_at: string;
}

/** Everything one workspace holds, fetched once per request. */
export interface Workspace {
  displayName: string;
  timezone: string;
  posts: PostRow[];
  channels: ChannelRow[];
  metrics: MetricRow[];
  activity: ActivityRow[];
}

/* ── View models the pages render ────────────────────────────────────────── */

export interface MixSlice { key: string; label: L; value: number; hue: string }

export interface DashboardView {
  isDemo: boolean;
  hero: { eyebrow: L; title: L; accent: L; body: L };
  kpis: DKpi[];
  monthMeta: { label: L; weekdays: { tr: string[]; en: string[] } };
  monthCells: MonthCell[];
  weekMeta: { label: L; days: { tr: { short: string; num: number }[]; en: { short: string; num: number }[] } };
  weekHours: string[];
  weekPosts: WeekPost[];
  heatmap: number[][];
  bestWindows: BestWindow[];
  channels: Channel[];
  queue: QueueItem[];
  reachByPlatform: { platform: Platform; value: number }[];
  activity: Activity[];
  engagementTrend: TrendPoint[];
  reach14d: number[];
  topPosts: TopPost[];
  mix: MixSlice[];
  autoShifts: number;
  engagementDelta: number;
}

export interface QueueView { isDemo: boolean; items: QueueItem[]; channels: Channel[] }

export interface ChannelsView { isDemo: boolean; channels: Channel[] }

export interface AnalyticsView {
  isDemo: boolean;
  reach14d: number[];
  engagementTrend: TrendPoint[];
  engagementDelta: number;
  reachByPlatform: { platform: Platform; value: number }[];
  bestWindows: BestWindow[];
  topPosts: TopPost[];
}
