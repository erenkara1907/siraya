import type { ui as dict } from "@/lib/i18n/dict";

type UiStrings = (typeof dict)["tr"];

/**
 * Supabase returns English auth errors. Map the ones a user can actually hit
 * onto our bilingual dictionary; anything unmapped falls back to errGeneric.
 */
const MATCHERS: { test: RegExp; key: keyof UiStrings }[] = [
  { test: /invalid login credentials/i, key: "errInvalidCredentials" },
  { test: /already registered|already been registered|user already exists/i, key: "errEmailTaken" },
  { test: /password should be at least|weak.?password/i, key: "errWeakPassword" },
  { test: /email not confirmed/i, key: "errEmailNotConfirmed" },
  { test: /provider is not enabled|unsupported provider/i, key: "errProviderDisabled" },
];

export function authErrorKey(message: string | undefined): keyof UiStrings {
  if (!message) return "errGeneric";
  return MATCHERS.find((m) => m.test.test(message))?.key ?? "errGeneric";
}
