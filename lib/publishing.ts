import type { Platform } from "@/lib/demo/data";

/**
 * Platforms Sıraya can actually publish to today. Everything else can still be
 * drafted — but scheduling it would be a promise the scheduler cannot keep, so
 * the queue would sit there looking fine while nothing ever went out.
 */
export const PUBLISHABLE_PLATFORMS: Platform[] = ["instagram"];

export function canPublish(platform: Platform): boolean {
  return PUBLISHABLE_PLATFORMS.includes(platform);
}

/** Statuses that mean "this is expected to go out on its own". */
export const AUTOMATED_STATUSES = ["scheduled", "published"] as const;
