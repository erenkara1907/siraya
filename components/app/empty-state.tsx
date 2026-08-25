import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shown wherever a signed-in workspace has nothing in it yet. */
export function EmptyState({
  icon, title, hint, action, className,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center", className)}>
      {icon && <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>}
      <p className="font-medium">{title}</p>
      {hint && <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">{hint}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/** Banner that keeps demo mode honest — the numbers on screen are not yours. */
export function DemoBanner({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-2.5 text-center text-xs text-muted-foreground">
      {text}
    </p>
  );
}
