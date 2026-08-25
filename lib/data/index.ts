import * as demo from "@/lib/demo/data";
import { buildChannels, buildMonthCells, buildQueue, buildWeek, WEEKDAYS } from "./derive-calendar";
import {
  buildEngagementTrend, buildHeatmap, buildMix, buildReach14d, buildReachByPlatform, buildTopPosts,
} from "./derive-analytics";
import { buildActivity, buildHero, buildKpis, getWorkspace, inCurrentWeek } from "./queries";
import type { AnalyticsView, ChannelsView, DashboardView, QueueView, Workspace } from "./types";

/** The kit's own sample week, used whenever there is no signed-in workspace. */
const DEMO_MIX = [
  { key: "reel", label: { tr: "Reels / Video", en: "Reel / Video" }, value: 34, hue: "350" },
  { key: "carousel", label: { tr: "Carousel", en: "Carousel" }, value: 26, hue: "245" },
  { key: "thread", label: { tr: "Thread / Metin", en: "Thread / Text" }, value: 22, hue: "230" },
  { key: "story", label: { tr: "Story / Klip", en: "Story / Clip" }, value: 18, hue: "190" },
];

function demoDashboard(): DashboardView {
  return {
    isDemo: true,
    hero: demo.hero,
    kpis: demo.kpis,
    monthMeta: demo.monthMeta,
    monthCells: demo.monthCells,
    weekMeta: demo.weekMeta,
    weekHours: demo.weekHours,
    weekPosts: demo.weekPosts,
    heatmap: demo.heatmap,
    bestWindows: demo.bestWindows,
    channels: demo.channels,
    queue: demo.queue,
    reachByPlatform: demo.reachByPlatform,
    activity: demo.activity,
    engagementTrend: demo.engagementTrend,
    reach14d: demo.reach14d,
    topPosts: demo.topPosts,
    mix: DEMO_MIX,
    autoShifts: 12,
    engagementDelta: 2.3,
  };
}

function liveDashboard(ws: Workspace, now: Date): DashboardView {
  const tz = ws.timezone;
  const month = buildMonthCells(ws.posts, now, tz);
  const week = buildWeek(ws.posts, now, tz);
  const { heatmap, bestWindows } = buildHeatmap(ws.posts, ws.metrics, tz);
  const { trend, delta } = buildEngagementTrend(ws.metrics, now);

  const queue = buildQueue(ws.posts, now, tz);
  const queuedThisWeek = ws.posts.filter(
    (p) => p.status === "scheduled" && p.scheduled_at && inCurrentWeek(p.scheduled_at, now, tz),
  ).length;
  const drafts = ws.posts.filter((p) => p.status === "draft" || p.status === "needs_review").length;

  return {
    isDemo: false,
    hero: buildHero(ws.displayName, queuedThisWeek, drafts),
    kpis: buildKpis({ posts: ws.posts, metrics: ws.metrics, bestWindow: bestWindows[0], now, tz }),
    monthMeta: { label: month.label, weekdays: WEEKDAYS },
    monthCells: month.cells,
    weekMeta: { label: week.label, days: week.days },
    weekHours: week.weekHours,
    weekPosts: week.weekPosts,
    heatmap,
    bestWindows,
    channels: buildChannels(ws.channels, ws.posts),
    queue,
    reachByPlatform: buildReachByPlatform(ws.posts, ws.metrics),
    activity: buildActivity(ws.activity),
    engagementTrend: trend,
    reach14d: buildReach14d(ws.metrics, now, tz),
    topPosts: buildTopPosts(ws.posts, ws.metrics, tz),
    mix: buildMix(ws.posts),
    autoShifts: ws.activity.filter((a) => a.action === "shifted_to_best_time").length,
    engagementDelta: delta,
  };
}

export async function getDashboardView(): Promise<DashboardView> {
  const ws = await getWorkspace();
  return ws ? liveDashboard(ws, new Date()) : demoDashboard();
}

export async function getQueueView(): Promise<QueueView> {
  const ws = await getWorkspace();
  if (!ws) return { isDemo: true, items: demo.queue, channels: demo.channels };
  return {
    isDemo: false,
    items: buildQueue(ws.posts, new Date(), ws.timezone),
    channels: buildChannels(ws.channels, ws.posts),
  };
}

export async function getChannelsView(): Promise<ChannelsView> {
  const ws = await getWorkspace();
  if (!ws) return { isDemo: true, channels: demo.channels };
  return { isDemo: false, channels: buildChannels(ws.channels, ws.posts) };
}

export async function getAnalyticsView(): Promise<AnalyticsView> {
  const ws = await getWorkspace();
  if (!ws) {
    return {
      isDemo: true,
      reach14d: demo.reach14d,
      engagementTrend: demo.engagementTrend,
      engagementDelta: 2.3,
      reachByPlatform: demo.reachByPlatform,
      bestWindows: demo.bestWindows,
      topPosts: demo.topPosts,
    };
  }

  const now = new Date();
  const { trend, delta } = buildEngagementTrend(ws.metrics, now);
  const { bestWindows } = buildHeatmap(ws.posts, ws.metrics, ws.timezone);

  return {
    isDemo: false,
    reach14d: buildReach14d(ws.metrics, now, ws.timezone),
    engagementTrend: trend,
    engagementDelta: delta,
    reachByPlatform: buildReachByPlatform(ws.posts, ws.metrics),
    bestWindows,
    topPosts: buildTopPosts(ws.posts, ws.metrics, ws.timezone),
  };
}
