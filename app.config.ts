/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  app.config.ts — the single source of truth for this starter.            │
 * │  Every user-facing string is bilingual: { tr, en }.                      │
 * │  Run `/setup` (or say "bu projeyi kur") to rebrand.                       │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
import type { L } from "@/lib/i18n/config";

export type IconName = string;

export interface NavItem { label: L; href: string; icon: IconName; }
export interface Feature { icon: IconName; title: L; body: L; }
export interface Stat { value: string; label: L; }
export interface PricingTier { name: string; price: string; period?: string; tagline: L; features: L[]; cta: L; featured?: boolean; }
export interface FaqItem { q: L; a: L; }
export interface Integration { key: string; name: string; envVars: string[]; required: boolean; docsUrl: string; purpose: string; }

export interface AppConfig {
  name: string;
  tagline: L;
  description: L;
  domain: string;
  logoText: string;
  accentName: string;
  marketing: {
    badge: L; heroTitle: L; heroAccent: L; heroSubtitle: L; heroCtaPrimary: L; heroCtaSecondary: L;
    features: Feature[]; stats: Stat[]; pricing: PricingTier[]; faq: FaqItem[];
  };
  nav: NavItem[];
  integrations: Integration[];
}

export const appConfig: AppConfig = {
  name: "Sıraya",
  tagline: { tr: "Tüm sosyal medyan, tek takvimde sıraya girsin.", en: "All your social, queued into one calendar." },
  description: {
    tr: "Sıraya Instagram, X, LinkedIn ve TikTok gönderilerini tek takvime alır, en iyi saatte otomatik yayınlar ve performansı tek panelde gösterir — tablo yok, son dakika telaşı yok.",
    en: "Sıraya queues your Instagram, X, LinkedIn and TikTok posts into one calendar, auto-publishes at the best time, and shows performance in one place — no spreadsheets, no last-minute scramble.",
  },
  domain: "siraya.app",
  logoText: "Sı",
  accentName: "teal",

  marketing: {
    badge: { tr: "Çok platformlu planlayıcı", en: "Multi-platform scheduler" },
    heroTitle: {
      tr: "Bir kez planla,",
      en: "Plan it once,",
    },
    heroAccent: {
      tr: "doğru saatte kendi yayınlansın.",
      en: "it posts at the right time.",
    },
    heroSubtitle: {
      tr: "Sıraya gönderilerini bir takvime dizer, en iyi saati öğrenir ve Instagram, X, LinkedIn ve TikTok'a senin için yayınlar. Bir öğleden sonrada bütün haftanı planla, gerisini otomatiğe bırak.",
      en: "Sıraya lines your posts up on one calendar, learns your best time, and publishes to Instagram, X, LinkedIn and TikTok for you. Plan a whole week in one afternoon and let it run.",
    },
    heroCtaPrimary: { tr: "Takvimi aç", en: "Open the calendar" },
    heroCtaSecondary: { tr: "Nasıl göründüğüne bak", en: "See how it looks" },
    features: [
      { icon: "calendar-days", title: { tr: "Tek takvim", en: "One calendar" }, body: { tr: "Bütün kanalların tek aylık ve haftalık görünümde. Sürükle-bırak ile taşı, çakışmaları bir bakışta gör.", en: "Every channel on one month and week view. Drag to move, see conflicts at a glance." } },
      { icon: "layout-list", title: { tr: "Akıllı kuyruk", en: "Smart queue" }, body: { tr: "Gönderini kuyruğa at; Sıraya bir sonraki boş en iyi saate yerleştirir. Boşlukları kendisi doldurur.", en: "Drop a post in the queue; Sıraya slots it into the next free best time. It fills the gaps for you." } },
      { icon: "clock", title: { tr: "En iyi saat otomatiği", en: "Best-time autopilot" }, body: { tr: "Kitlenin ne zaman aktif olduğunu öğrenir ve gönderiyi en çok etkileşim alacağı saate kaydırır.", en: "It learns when your audience is awake and shifts each post to the hour that earns the most engagement." } },
      { icon: "share-2", title: { tr: "Dört platform, tek akış", en: "Four platforms, one flow" }, body: { tr: "Instagram, X, LinkedIn ve TikTok bağlı. Her platforma uygun biçim ve uzunlukta otomatik gönderilir.", en: "Instagram, X, LinkedIn and TikTok connected. Each gets the right format and length, automatically." } },
      { icon: "bar-chart-3", title: { tr: "Net analitik", en: "Clear analytics" }, body: { tr: "Erişim, etkileşim ve en iyi saatler tek panelde. Hangi gönderi neden işe yaradı — tahmin değil, veri.", en: "Reach, engagement and best times in one panel. Why a post worked — data, not a guess." } },
      { icon: "users-round", title: { tr: "Onay & ekip", en: "Approvals & team" }, body: { tr: "Taslakları yayından önce gözden geçir, ekip arkadaşına onay için yolla. Yanlış gönderi yok.", en: "Review drafts before they go live, send them to a teammate for approval. No wrong posts." } },
    ],
    stats: [
      { value: "4", label: { tr: "platform, tek takvim", en: "platforms, one calendar" } },
      { value: "+38%", label: { tr: "en iyi saatte erişim", en: "reach at best time" } },
      { value: "5 sa", label: { tr: "haftada kazanılan zaman", en: "saved per week" } },
      { value: "$0", label: { tr: "demo modda denemek için", en: "to try in demo mode" } },
    ],
    pricing: [
      { name: "Solo", price: "$0", period: "/ay", tagline: { tr: "Tek kişilik içerik üreticisi için.", en: "For a solo creator." }, features: [{ tr: "2 kanal", en: "2 channels" }, { tr: "Takvim + kuyruk", en: "Calendar + queue" }, { tr: "Aylık 30 planlı gönderi", en: "30 scheduled posts / mo" }, { tr: "Temel analitik", en: "Basic analytics" }], cta: { tr: "Ücretsiz başla", en: "Start free" } },
      { name: "Creator", price: "$15", period: "/ay", tagline: { tr: "Düzenli yayınlayan üretici için.", en: "For a creator who posts often." }, features: [{ tr: "4 platform, sınırsız gönderi", en: "4 platforms, unlimited posts" }, { tr: "En iyi saat otomatiği", en: "Best-time autopilot" }, { tr: "En iyi saat ısı haritası", en: "Best-time heatmap" }, { tr: "Tam analitik", en: "Full analytics" }, { tr: "Taslak onayı", en: "Draft approvals" }], cta: { tr: "Ücretsiz dene", en: "Start free trial" }, featured: true },
      { name: "Team", price: "$39", period: "/ay", tagline: { tr: "Küçük ekip ve ajanslar için.", en: "For small teams & agencies." }, features: [{ tr: "Birden çok marka/çalışma alanı", en: "Multiple brands/workspaces" }, { tr: "Roller ve onay akışı", en: "Roles & approval flow" }, { tr: "Ekip takvimi", en: "Shared team calendar" }, { tr: "Öncelikli destek", en: "Priority support" }], cta: { tr: "Ekip kur", en: "Set up a team" } },
    ],
    faq: [
      { q: { tr: "Denemek için API anahtarı gerekli mi?", en: "Do I need API keys to try it?" }, a: { tr: "Hayır. Sıraya örnek kanallar, planlı gönderiler ve analitikle demo modda açılır — hemen tıklayıp gezebilirsin. Gerçekten yayınlamak için sosyal hesaplarını sonra bağlarsın.", en: "No. Sıraya boots in demo mode with sample channels, scheduled posts and analytics — click around immediately. Connect your social accounts later to publish for real." } },
      { q: { tr: "En iyi saat nasıl bulunuyor?", en: "How does it find the best time?" }, a: { tr: "Her kanalın geçmiş etkileşimini saat saat inceler ve kitlenin en aktif olduğu pencereyi bir ısı haritası olarak çıkarır. Otomatik mod gönderiyi o pencereye kaydırır.", en: "It studies each channel's past engagement hour by hour and surfaces the windows your audience is most active as a heatmap. Autopilot shifts each post into that window." } },
      { q: { tr: "Hangi platformları destekliyor?", en: "Which platforms does it support?" }, a: { tr: "Instagram, X, LinkedIn ve TikTok. Her gönderi, hedeflediğin platforma uygun biçim ve uzunluğa otomatik uyarlanır.", en: "Instagram, X, LinkedIn and TikTok. Each post is adapted to the format and length of the platform you target." } },
      { q: { tr: "Teknoloji nedir?", en: "What's the stack?" }, a: { tr: "Next.js 16, React 19, Tailwind v4. Her yere — tek tıkla Vercel'e — dağıtabileceğin standart bir uygulama.", en: "Next.js 16, React 19, Tailwind v4. It's a standard app you can deploy anywhere — Vercel in one click." } },
    ],
  },

  nav: [
    { label: { tr: "Takvim", en: "Calendar" }, href: "/dashboard", icon: "calendar-days" },
    { label: { tr: "Kuyruk", en: "Queue" }, href: "/queue", icon: "layout-list" },
    { label: { tr: "Kanallar", en: "Channels" }, href: "/channels", icon: "share-2" },
    { label: { tr: "Analitik", en: "Analytics" }, href: "/analytics", icon: "bar-chart-3" },
    { label: { tr: "Ayarlar", en: "Settings" }, href: "/settings", icon: "settings" },
  ],

  integrations: [
    {
      key: "social",
      name: "Social APIs",
      envVars: ["SOCIAL_API_KEY"],
      required: false,
      docsUrl: "https://siraya.app/docs/connect",
      purpose: "Publishes to Instagram, X, LinkedIn and TikTok. Without it, runs in demo mode.",
    },
    {
      key: "supabase",
      name: "Supabase",
      envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
      required: false,
      docsUrl: "https://supabase.com/dashboard/project/_/settings/api",
      purpose: "Stores posts, channels and the schedule. Without it, runs in demo mode.",
    },
    {
      key: "resend",
      name: "Resend",
      envVars: ["RESEND_API_KEY"],
      required: false,
      docsUrl: "https://resend.com/api-keys",
      purpose: "Sends approval requests and publish digests. Optional.",
    },
  ],
};

export default appConfig;
