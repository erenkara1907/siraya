import { cn } from "@/lib/utils";
import appConfig from "@/app.config";

/**
 * Sıraya logomark — a stacked queue settling into a calendar slot, with a clock
 * hand (best-time autopilot). Teal gradient with a sunny pop on the clock.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label={appConfig.name}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2dd4d8" />
          <stop offset="0.55" stopColor="#0ea5b7" />
          <stop offset="1" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="ssun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#f5c542" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#sg)" />
      <rect width="40" height="40" rx="11" fill="#fff" opacity="0.06" />
      {/* stacked queue chips dropping into place */}
      <rect x="9" y="9.5" width="22" height="4.4" rx="2.2" fill="#fff" opacity="0.55" />
      <rect x="9" y="16.4" width="16.5" height="4.4" rx="2.2" fill="#fff" opacity="0.8" />
      <rect x="9" y="23.3" width="11" height="4.4" rx="2.2" fill="#fff" />
      {/* clock — best-time autopilot */}
      <circle cx="28.5" cy="26.5" r="6.4" fill="url(#ssun)" stroke="#fff" strokeWidth="1.6" />
      <path d="M28.5 23.4 V26.5 L30.6 28" fill="none" stroke="#0e7490" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Brand lockup — mark + wordmark. Drop a real logo at public/logo.svg later by
 * swapping <LogoMark /> for an <img src="/logo.svg" />.
 */
export function Logo({
  className,
  withWordmark = true,
  onDark = false,
}: {
  className?: string;
  withWordmark?: boolean;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0 drop-shadow-sm" />
      {withWordmark && (
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            onDark ? "text-sidebar-foreground" : "text-foreground",
          )}
        >
          {appConfig.name}
        </span>
      )}
    </span>
  );
}
