"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight, ArrowRight, CalendarDays, LayoutList, Clock, Share2, BarChart3,
  UsersRound, Check, X as XIcon, Sparkles, Plus, Minus, Zap, MoveRight, Wand2,
} from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";

const moduleIcons = [CalendarDays, LayoutList, Clock, Share2, BarChart3, UsersRound];

const content = {
  tr: {
    nav: ["Ne yapar", "Bir haftanın akışı", "Fiyatlar"], signin: "Giriş yap", demo: "Demoyu dene",
    badge: "Çok platformlu planlayıcı",
    h1a: "Bir kez planla,", h1b: "doğru saatte", h1c: "kendi yayınlansın.",
    sub: "Sıraya gönderilerini tek takvime dizer, kitlenin en aktif olduğu saati öğrenir ve Instagram, X, LinkedIn ve TikTok'a senin için yayınlar. Bir öğleden sonrada bütün haftanı planla, gerisini sıraya bırak.",
    cta1: "Takvimi aç", cta2: "Nasıl göründüğüne bak", note: "· kart yok · 60 saniyelik demo",
    proofAvatars: "1.200+ içerik üreticisi haftasını Sıraya'ya planlatıyor.",
    marqueeTitle: "Sıraya her platformu konuşur",
    marquee: ["Instagram", "X", "LinkedIn", "TikTok", "Reels", "Thread", "Carousel", "Story", "Shorts", "Makale", "Anket", "Video"],
    problemKicker: "Kaos",
    problemH: ["Dört uygulama, dört sekme,", "ve hep yanlış saatte gönderi."],
    problemBody: "Her platform ayrı bir sekme, her gönderi elle ve çoğu zaman geç. Hangi saatte paylaşacağını tahmin edersin, tutarlılığı kaçırırsın, takvim aklında kalır. Sıraya hepsini tek takvime, tek kuyruğa ve doğru saate indirir.",
    problemStats: [
      { n: "4", l: "ayrı sekmede dönen platform" },
      { n: "%70", l: "yanlış saatte kaçan erişim" },
      { n: "5 sa", l: "haftada elle gönderiye giden zaman" },
      { n: "0", l: "elinde kalan içerik takvimi" },
    ],
    whatKicker: "Ne yapar",
    whatH: ["Bir sosyal medya ekibi kadar düzen,", "tek takvimde, sessizce."],
    modules: [
      { t: "Tek takvim", b: "Bütün kanalların tek aylık ve haftalık görünümde. Sürükle-bırak ile taşı, çakışmaları bir bakışta gör." },
      { t: "Akıllı kuyruk", b: "Gönderiyi kuyruğa at; Sıraya bir sonraki boş en iyi saate yerleştirir. Boşlukları kendisi doldurur." },
      { t: "En iyi saat otomatiği", b: "Kitlenin ne zaman aktif olduğunu öğrenir ve gönderiyi en çok etkileşim alacağı saate kaydırır." },
      { t: "Dört platform, tek akış", b: "Instagram, X, LinkedIn ve TikTok bağlı. Her platforma uygun biçim ve uzunlukta otomatik gönderilir." },
      { t: "Net analitik", b: "Erişim, etkileşim ve en iyi saatler tek panelde. Hangi gönderi neden işe yaradı — tahmin değil, veri." },
      { t: "Onay & ekip", b: "Taslakları yayından önce gözden geçir, ekip arkadaşına onay için yolla. Yanlış gönderi yok." },
    ],
    stepsKicker: "Üç adım",
    stepsH: ["Yükle, sıraya gir,", "yayında."],
    steps: [
      { n: "01", t: "Kanallarını bağla", b: "Instagram, X, LinkedIn ve TikTok'u bir kez bağla — Sıraya hepsini tek yerden yönetir." },
      { n: "02", t: "Gönderileri kuyruğa at", b: "Bir öğleden sonra haftanı planla. Sürükle-bırak takvim ya da akıllı kuyruk — sen seç." },
      { n: "03", t: "En iyi saatte yayınlasın", b: "Sıraya gerisini halleder: her gönderiyi kitlenin en aktif olduğu pencereye kaydırır ve yayınlar." },
    ],
    calKicker: "İmza",
    calH: ["Takvim ve ısı haritası.", "Tüm haftan, tek bakışta."],
    calBody: "Aylık takvimde her kanal renkli bir çip. Isı haritası kitlenin ne zaman uyanık olduğunu gösterir — koyu kareler en iyi saatlerin. Sıraya gönderiyi otomatik o pencereye taşır.",
    calLegend: "Daha az etkileşim → daha çok",
    proof: [
      { big: "+38%", l: "en iyi saatte erişim", c: "Otomatik mod açıkken ortalama artış" },
      { big: "5 sa", l: "haftada kazanılan zaman", c: "Elle gönderiden kuyruğa geçince" },
      { big: "4", l: "platform, tek takvim", c: "Instagram · X · LinkedIn · TikTok" },
    ],
    journeyKicker: "Pazartesi sabahı",
    journeyH: ["Bir haftanın planı,", "tek oturuşta."],
    ticks: [
      { time: "09:02", who: "Sen", b: "Haftanın 14 gönderisini kuyruğa attın — kahveni bitirmeden." },
      { time: "09:03", who: "Sıraya", b: "Her gönderiyi platformuna göre biçimledi: Reels dikey, Thread parçalı, makale uzun." },
      { time: "09:04", who: "Sıraya", b: "En iyi saat ısı haritasına baktı; Salı 18:00 ve Perşembe 18:00 en güçlü pencereler." },
      { time: "09:04", who: "Sıraya", b: "Öne çıkan Reels'i Salı 18:00'e kaydırdı. Takvim çakışmasız." },
      { time: "Salı 18:00", who: "Sıraya", b: "Reels otomatik yayınlandı — sen başka iştesin." },
      { time: "Salı 21:30", who: "Analitik", b: "Erişim geçen haftaya göre %38 yukarıda. En iyi saat tuttu." },
    ],
    testiKicker: "Üreticiler ne diyor",
    testiH: "Pazar gecesi paniği bitti.",
    testimonials: [
      { q: "Eskiden her akşam 'şimdi mi atsam?' diye düşünürdüm. Artık Pazartesi planlıyorum, hafta kendi akıyor.", n: "Elif K.", r: "İçerik üreticisi · 64K" },
      { q: "Isı haritası ilk kez bana 'tahmin etme, bak' dedirtti. Erişimim ay içinde gözle görülür arttı.", n: "Burak T.", r: "Kurucu · B2B SaaS" },
      { q: "Dört platformu tek takvimde görmek beynimi rahatlattı. Çakışma yok, unutmak yok.", n: "Deniz A.", r: "Sosyal medya yöneticisi" },
    ],
    compareKicker: "Fark",
    compareH: ["Stüdyo değil.", "Planlayıcı."],
    compareBody: "Sıraya gönderi üretmez — onları düzene sokar. İçeriğin sende; biz onu doğru sıraya, doğru saate ve doğru platforma koyarız.",
    compareRows: [
      { a: "Dört ayrı uygulama ve sekme", b: "Tek takvim, dört platform" },
      { a: "Saati tahmin et", b: "En iyi saat ısı haritasıyla kesin" },
      { a: "Her gönderiyi elle at", b: "Kuyruğa at, otomatik yayınlasın" },
      { a: "Tutarlılık hatırlamaya kalmış", b: "Hafta önceden sıraya girer" },
    ],
    promiseKicker: "Dürüst söz",
    promiseH: ["Senin sesin.", "Bizim sıramız."],
    promiseBody: "Sıraya içeriğini yazmaz, değiştirmez ya da 'AI'laştırmaz. Yazdığın gönderi, çektiğin video — olduğu gibi yayınlanır. Biz sadece doğru saate, doğru platforma, doğru sıraya koyarız.",
    promiseBullets: [
      "İçeriğine dokunmayız: ne yazdıysan o yayınlanır.",
      "En iyi saat önerisi şeffaf — neden o saat, görürsün.",
      "İstediğin an otomatiği kapat, saati elle seç.",
      "Bağladığın hesaplar ve veriler senin; istediğinde çıkar.",
    ],
    pricingKicker: "Fiyatlar",
    pricingH: ["Tek planlayıcı.", "Dürüst fiyat."],
    plans: [
      { name: "Solo", price: "$0", cad: "başlangıç", body: "Tek kişilik üretici, ayda birkaç gönderi.", bullets: ["2 kanal", "Takvim + kuyruk", "Aylık 30 gönderi", "Temel analitik"], cta: "Ücretsiz başla", featured: false },
      { name: "Creator", price: "$15", cad: "/ay", body: "Düzenli yayınlayan üretici için tam deneyim.", bullets: ["4 platform, sınırsız", "En iyi saat otomatiği", "Isı haritası", "Tam analitik", "Taslak onayı"], cta: "30 gün ücretsiz dene", featured: true },
      { name: "Team", price: "$39", cad: "/ay", body: "Küçük ekip ve ajanslar için.", bullets: ["Birden çok marka", "Roller & onay akışı", "Ekip takvimi", "Öncelikli destek"], cta: "Ekip kur", featured: false },
    ],
    faqKicker: "Merak edilenler",
    faqH: "Kısa cevaplar.",
    faq: [
      { q: "Denemek için API anahtarı gerekir mi?", a: "Hayır. Sıraya örnek kanallar, planlı gönderiler ve analitikle demo modda açılır — hemen tıklayabilirsin. Gerçekten yayınlamak için sosyal hesaplarını /setup ile bağlarsın." },
      { q: "En iyi saat nasıl bulunuyor?", a: "Her kanalın geçmiş etkileşimini saat saat inceler ve kitlenin en aktif olduğu pencereyi bir ısı haritası olarak çıkarır. Otomatik mod gönderiyi o pencereye kaydırır." },
      { q: "Hangi platformları destekliyor?", a: "Instagram, X, LinkedIn ve TikTok. Her gönderi, hedeflediğin platforma uygun biçim ve uzunluğa otomatik uyarlanır." },
      { q: "İçeriğimi siz mi yazıyorsunuz?", a: "Hayır. Sıraya bir planlayıcı, stüdyo değil. İçeriği sen üretirsin; biz onu doğru sıraya, saate ve platforma koyarız." },
      { q: "Otomatik en iyi saati kapatabilir miyim?", a: "Tabii. Otomatik mod istediğin an kapanır; her gönderinin saatini elle seçebilirsin. Öneri görünür kalır ama sen karar verirsin." },
      { q: "Ekip ve onay akışı var mı?", a: "Creator ve Team planlarında taslakları yayından önce gözden geçirir, ekip arkadaşına onaya gönderirsin. Team'de roller ve birden çok marka da var." },
      { q: "Verilerimi dışa aktarabilir miyim?", a: "Evet. Bağladığın hesaplar ve tüm planlama verisi senindir; istediğin an CSV olarak dışa aktarır, hesabını taşırsın." },
      { q: "Fiyatlandırma nasıl?", a: "Solo ücretsiz başlar, Creator aylık $15, Team aylık $39. Kredi kartı istemeden 30 gün dener, dilediğinde iptal edersin." },
    ],
    finaleKicker: "Dene · 60 saniye",
    finaleH: ["Bu haftanın gönderilerini", "şimdi sıraya diz."],
    finaleBody: "Önceden doldurulmuş canlı bir planlayıcı demosunu gez — her ekran tıklanabilir. Kart yok, kayıt yok.",
    footTagline: "Tüm sosyal medyanı tek takvimde sıraya dizen çok platformlu planlayıcı.",

    /* interactive demo */
    tryKicker: "Canlı dene",
    tryH: ["Gönderini yaz,", "en iyi saati biz bulalım."],
    tryBody: "Bir gönderi yaz, platformları seç, butona bas. Sıraya gönderiyi mini haftalık takvimdeki en güçlü pencereye yerleştirsin — gerçek üründe olduğu gibi.",
    tryPlaceholder: "ör. \"Yeni vaka çalışmamız yayında — 3 ayda 3× erişim.\"",
    tryPlatforms: "Platformlar",
    tryButton: "En iyi zamanı bul",
    tryEmpty: "Bir gönderi yaz ve butona bas — Sıraya saatini seçsin.",
    tryHintLabel: "En iyi saat önerisi",
    trySlotted: "Takvime yerleşti",
    tryReason: "Kitlen bu pencerede en aktif — ısı haritası 96/100 dedi.",
    tryDays: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],

    /* use cases / personas */
    useKicker: "Kimler için",
    useH: ["Tek planlayıcı,", "dört farklı masaüstü."],
    useCases: [
      { icon: "users-round", t: "Sosyal medya yöneticisi", b: "Beş markanın takvimini tek ekranda tut, çakışmaları gör, onay akışıyla hata yapma.", tag: "5 marka · tek takvim" },
      { icon: "briefcase", t: "Ajans", b: "Müşteri başına ayrı çalışma alanı, roller ve onay. Raporu tek tıkla dışa aktar.", tag: "Roller + raporlar" },
      { icon: "store", t: "Küçük işletme", b: "Kampanyayı bir kez planla, dört platforma uygun biçimde otomatik yayınlasın.", tag: "Kur, unut" },
      { icon: "user-round", t: "Kişisel marka", b: "Pazartesi otur, haftanı sıraya diz. En iyi saatte yayınla, sen başka iştesin.", tag: "Haftada 5 saat geri" },
    ],

    /* expanded testimonials */
    bigTestiKicker: "Üreticiler ne diyor",
    bigTestiH: ["Pazar gecesi paniği", "bitti."],
    bigTestimonials: [
      { q: "Eskiden her akşam 'şimdi mi atsam?' derdim. Artık Pazartesi planlıyorum, hafta kendi akıyor.", n: "Elif Kaya", r: "İçerik üreticisi · 64K", metric: "Haftada 5 sa", ml: "zaman tasarrufu", hue: "350" },
      { q: "Isı haritası ilk kez 'tahmin etme, bak' dedirtti. Erişimim ay içinde gözle görülür arttı.", n: "Burak Toprak", r: "Kurucu · B2B SaaS", metric: "+38%", ml: "erişim", hue: "230" },
      { q: "Dört platformu tek takvimde görmek beynimi rahatlattı. Çakışma yok, unutmak yok.", n: "Deniz Arı", r: "Sosyal medya yöneticisi", metric: "4→1", ml: "tek sekme", hue: "245" },
      { q: "Ajansta 6 markayı yönetiyoruz; onay akışı sayesinde yanlış gönderi sıfıra indi.", n: "Selin Umut", r: "Ajans kurucusu", metric: "0", ml: "yanlış gönderi", hue: "190" },
      { q: "TikTok'ta tutturduğum saat tesadüf değilmiş. Sıraya pencereyi gösterince düzenli oldum.", n: "Mert Can", r: "Yaratıcı · 41K", metric: "3×", ml: "izlenme", hue: "190" },
      { q: "Küçük dükkânım için kampanyayı bir kez planlıyorum, dört yerde birden çıkıyor. Büyü gibi.", n: "Ayşe Demir", r: "Küçük işletme", metric: "2 sa→0", ml: "haftalık emek", hue: "350" },
    ],

    /* comparison table */
    cmpKicker: "Karşılaştır",
    cmpH: ["Manuel değil. Şişkin araç değil.", "Sadece planlayıcı."],
    cmpCols: ["", "Manuel", "Buffer / Hootsuite", "Sıraya"],
    cmpRows: [
      { f: "Tek takvim, dört platform", a: false, b: true, c: true },
      { f: "En iyi saat ısı haritası", a: false, b: "kısmi", c: true },
      { f: "Otomatik en iyi saate kaydırma", a: false, b: false, c: true },
      { f: "Şeffaf 'neden bu saat' açıklaması", a: false, b: false, c: true },
      { f: "Taslak onayı & ekip rolleri", a: false, b: true, c: true },
      { f: "İçeriğine dokunmaz (AI'laştırmaz)", a: true, b: "bazen", c: true },
      { f: "Dakikalar içinde kurulum", a: false, b: "kısmi", c: true },
      { f: "Dürüst, tek fiyat", a: true, b: false, c: true },
    ],

    /* one calendar showcase */
    oneCalKicker: "Tek takvim",
    oneCalH: ["Bir takvim,", "her platform."],
    oneCalBody: "Instagram pembesi, X grisi, LinkedIn mavisi, TikTok turkuazı — hepsi tek aylık görünümde renkli çipler. Hangi gün ne yayınlanıyor, bir bakışta.",
    oneCalMonth: "Haziran",
    oneCalLegend: ["Instagram", "X", "LinkedIn", "TikTok"],

    /* best-time engine deep dive */
    engineKicker: "Motor",
    engineH: ["En iyi saat", "nasıl bulunur?"],
    engineBody: "Sıraya her kanalın geçmiş etkileşimini saat saat tarar ve kitlenin uyanık olduğu pencereleri bir ısı haritasına çevirir. Koyu kareler en iyi saatlerin; otomatik mod gönderiyi oraya kaydırır.",
    engineSteps: [
      { n: "01", t: "Topla", b: "Her gönderinin saatini ve etkileşimini geçmişe dönük oku." },
      { n: "02", t: "Çöz", b: "Gün × saat ızgarasında pencereleri 0–100 arası puanla." },
      { n: "03", t: "Kaydır", b: "Yeni gönderiyi en yüksek puanlı boş pencereye yerleştir." },
    ],

    /* integrations strip */
    integKicker: "Bağlantılar",
    integH: "Bağlan, gerisini Sıraya halletsin.",
    integitems: [
      { name: "Instagram", icon: "camera", hue: "350" },
      { name: "X", icon: "at-sign", hue: "230" },
      { name: "LinkedIn", icon: "briefcase", hue: "245" },
      { name: "TikTok", icon: "music-2", hue: "190" },
      { name: "Facebook", icon: "globe", hue: "250" },
    ],
  },
  en: {
    nav: ["What it does", "A week's flow", "Pricing"], signin: "Sign in", demo: "Try the demo",
    badge: "Multi-platform scheduler",
    h1a: "Plan it once,", h1b: "it posts at", h1c: "the right time.",
    sub: "Sıraya lines your posts up on one calendar, learns when your audience is most active, and publishes to Instagram, X, LinkedIn and TikTok for you. Plan a whole week in one afternoon and let the queue run.",
    cta1: "Open the calendar", cta2: "See how it looks", note: "· no card · 60-second demo",
    proofAvatars: "1,200+ creators let Sıraya plan their week.",
    marqueeTitle: "Sıraya speaks every platform",
    marquee: ["Instagram", "X", "LinkedIn", "TikTok", "Reels", "Thread", "Carousel", "Story", "Shorts", "Article", "Poll", "Video"],
    problemKicker: "The chaos",
    problemH: ["Four apps, four tabs,", "and always the wrong time."],
    problemBody: "Every platform is a separate tab, every post is manual and usually late. You guess the time, you lose consistency, the calendar lives in your head. Sıraya collapses all of it into one calendar, one queue and the right time.",
    problemStats: [
      { n: "4", l: "platforms juggled across tabs" },
      { n: "70%", l: "of reach lost to the wrong hour" },
      { n: "5 hrs", l: "a week spent posting by hand" },
      { n: "0", l: "content calendars that stuck" },
    ],
    whatKicker: "What it does",
    whatH: ["A whole social team's order,", "in one calendar, quietly."],
    modules: [
      { t: "One calendar", b: "Every channel on one month and week view. Drag to move, see conflicts at a glance." },
      { t: "Smart queue", b: "Drop a post in the queue; Sıraya slots it into the next free best time. It fills the gaps for you." },
      { t: "Best-time autopilot", b: "It learns when your audience is awake and shifts each post to the hour that earns the most engagement." },
      { t: "Four platforms, one flow", b: "Instagram, X, LinkedIn and TikTok connected. Each gets the right format and length, automatically." },
      { t: "Clear analytics", b: "Reach, engagement and best times in one panel. Why a post worked — data, not a guess." },
      { t: "Approvals & team", b: "Review drafts before they go live, send them to a teammate for approval. No wrong posts." },
    ],
    stepsKicker: "Three steps",
    stepsH: ["Upload, queue,", "live."],
    steps: [
      { n: "01", t: "Connect your channels", b: "Connect Instagram, X, LinkedIn and TikTok once — Sıraya runs them all from one place." },
      { n: "02", t: "Queue your posts", b: "Plan your week in one afternoon. Drag-and-drop calendar or the smart queue — you pick." },
      { n: "03", t: "It posts at the best time", b: "Sıraya does the rest: it shifts each post into your audience's most active window and publishes." },
    ],
    calKicker: "Signature",
    calH: ["Calendar and heatmap.", "Your whole week, at a glance."],
    calBody: "On the month calendar every channel is a colored chip. The heatmap shows when your audience is awake — the darker squares are your best times. Sıraya moves posts into that window automatically.",
    calLegend: "Less engagement → more",
    proof: [
      { big: "+38%", l: "reach at best time", c: "Average lift with autopilot on" },
      { big: "5 hrs", l: "saved per week", c: "Moving from manual posting to the queue" },
      { big: "4", l: "platforms, one calendar", c: "Instagram · X · LinkedIn · TikTok" },
    ],
    journeyKicker: "Monday morning",
    journeyH: ["A week's plan,", "in one sitting."],
    ticks: [
      { time: "09:02", who: "You", b: "Dropped the week's 14 posts into the queue — before your coffee was done." },
      { time: "09:03", who: "Sıraya", b: "Formatted each for its platform: Reels vertical, Thread split, article long-form." },
      { time: "09:04", who: "Sıraya", b: "Read your best-time heatmap; Tue 18:00 and Thu 18:00 are the strongest windows." },
      { time: "09:04", who: "Sıraya", b: "Shifted the featured Reel to Tue 18:00. Calendar with no conflicts." },
      { time: "Tue 18:00", who: "Sıraya", b: "The Reel auto-published — you were doing something else." },
      { time: "Tue 21:30", who: "Analytics", b: "Reach is up 38% vs last week. The best time held." },
    ],
    testiKicker: "What creators say",
    testiH: "No more Sunday-night panic.",
    testimonials: [
      { q: "I used to ask myself every evening, 'should I post now?' Now I plan on Monday and the week just runs.", n: "Elif K.", r: "Creator · 64K" },
      { q: "The heatmap made me stop guessing and start looking. My reach climbed noticeably within a month.", n: "Burak T.", r: "Founder · B2B SaaS" },
      { q: "Seeing all four platforms on one calendar calmed my brain. No clashes, nothing forgotten.", n: "Deniz A.", r: "Social media manager" },
    ],
    compareKicker: "The difference",
    compareH: ["Not a studio.", "A scheduler."],
    compareBody: "Sıraya doesn't make your posts — it puts them in order. The content is yours; we place it in the right queue, the right time and the right platform.",
    compareRows: [
      { a: "Four separate apps and tabs", b: "One calendar, four platforms" },
      { a: "Guess the time", b: "Certain, with a best-time heatmap" },
      { a: "Post each one by hand", b: "Queue it, it auto-publishes" },
      { a: "Consistency left to memory", b: "The week is queued in advance" },
    ],
    promiseKicker: "The honest promise",
    promiseH: ["Your voice.", "Our order."],
    promiseBody: "Sıraya doesn't write, rewrite or 'AI-ify' your content. The post you wrote, the video you shot — it goes out as is. We just place it at the right time, the right platform, the right spot in the queue.",
    promiseBullets: [
      "We don't touch your content: what you wrote is what posts.",
      "Best-time suggestions are transparent — see why that hour.",
      "Turn autopilot off any time and pick the hour yourself.",
      "Your connected accounts and data are yours; export anytime.",
    ],
    pricingKicker: "Pricing",
    pricingH: ["One scheduler.", "Honest pricing."],
    plans: [
      { name: "Solo", price: "$0", cad: "to start", body: "A solo creator, a few posts a month.", bullets: ["2 channels", "Calendar + queue", "30 posts / mo", "Basic analytics"], cta: "Start free", featured: false },
      { name: "Creator", price: "$15", cad: "/ mo", body: "The full experience for a creator who posts often.", bullets: ["4 platforms, unlimited", "Best-time autopilot", "Best-time heatmap", "Full analytics", "Draft approvals"], cta: "Try free for 30 days", featured: true },
      { name: "Team", price: "$39", cad: "/ mo", body: "For small teams and agencies.", bullets: ["Multiple brands", "Roles & approval flow", "Shared team calendar", "Priority support"], cta: "Set up a team", featured: false },
    ],
    faqKicker: "Good to know",
    faqH: "The short answers.",
    faq: [
      { q: "Do I need API keys to try it?", a: "No. Sıraya boots in demo mode with sample channels, scheduled posts and analytics — click around immediately. Connect your social accounts via /setup to publish for real." },
      { q: "How does it find the best time?", a: "It studies each channel's past engagement hour by hour and surfaces the windows your audience is most active as a heatmap. Autopilot shifts each post into that window." },
      { q: "Which platforms does it support?", a: "Instagram, X, LinkedIn and TikTok. Each post is adapted to the format and length of the platform you target." },
      { q: "Do you write my content?", a: "No. Sıraya is a scheduler, not a studio. You make the content; we put it in the right queue, time and platform." },
      { q: "Can I turn best-time autopilot off?", a: "Of course. Switch autopilot off any time and pick the hour for each post by hand. The suggestion stays visible, but the call is yours." },
      { q: "Is there a team and approval flow?", a: "On the Creator and Team plans you review drafts before they go live and send them to a teammate for approval. Team adds roles and multiple brands." },
      { q: "Can I export my data?", a: "Yes. Your connected accounts and all scheduling data are yours; export to CSV any time and take your account with you." },
      { q: "How does pricing work?", a: "Solo starts free, Creator is $15/mo, Team is $39/mo. Try it for 30 days with no card and cancel whenever you like." },
    ],
    finaleKicker: "Try it · 60 seconds",
    finaleH: ["Queue this week's posts", "right now."],
    finaleBody: "Take a live scheduler demo for a spin — pre-loaded, every screen interactive. No card, no signup.",
    footTagline: "The multi-platform scheduler that queues all your social into one calendar.",

    /* interactive demo */
    tryKicker: "Try it live",
    tryH: ["Write your post,", "we'll find the best time."],
    tryBody: "Type a post, pick the platforms, hit the button. Sıraya drops it into the strongest window on a mini week calendar — exactly like the real product.",
    tryPlaceholder: "e.g. \"New case study is live — 3× reach in 3 months.\"",
    tryPlatforms: "Platforms",
    tryButton: "Find the best time",
    tryEmpty: "Write a post and hit the button — let Sıraya pick the hour.",
    tryHintLabel: "Best-time suggestion",
    trySlotted: "Slotted into the calendar",
    tryReason: "Your audience peaks in this window — the heatmap scored it 96/100.",
    tryDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

    /* use cases / personas */
    useKicker: "Who it's for",
    useH: ["One scheduler,", "four different desks."],
    useCases: [
      { icon: "users-round", t: "Social media manager", b: "Keep five brands' calendars on one screen, see clashes, never slip with an approval flow.", tag: "5 brands · one calendar" },
      { icon: "briefcase", t: "Agency", b: "A separate workspace per client, roles and approvals. Export the report in one click.", tag: "Roles + reports" },
      { icon: "store", t: "Small business", b: "Plan a campaign once, publish it to four platforms in the right format automatically.", tag: "Set it, forget it" },
      { icon: "user-round", t: "Personal brand", b: "Sit down Monday, queue your week. Post at the best time while you're doing something else.", tag: "5 hrs back a week" },
    ],

    /* expanded testimonials */
    bigTestiKicker: "What creators say",
    bigTestiH: ["No more", "Sunday-night panic."],
    bigTestimonials: [
      { q: "I used to ask every evening, 'should I post now?' Now I plan on Monday and the week just runs.", n: "Elif Kaya", r: "Creator · 64K", metric: "5 hrs/wk", ml: "time saved", hue: "350" },
      { q: "The heatmap made me stop guessing and start looking. My reach climbed noticeably within a month.", n: "Burak Toprak", r: "Founder · B2B SaaS", metric: "+38%", ml: "reach", hue: "230" },
      { q: "Seeing all four platforms on one calendar calmed my brain. No clashes, nothing forgotten.", n: "Deniz Arı", r: "Social media manager", metric: "4→1", ml: "one tab", hue: "245" },
      { q: "We run 6 brands at the agency; the approval flow took wrong posts to zero.", n: "Selin Umut", r: "Agency founder", metric: "0", ml: "wrong posts", hue: "190" },
      { q: "The hour I'd been hitting on TikTok wasn't luck. Sıraya showed me the window and I got consistent.", n: "Mert Can", r: "Creator · 41K", metric: "3×", ml: "views", hue: "190" },
      { q: "For my little shop I plan the campaign once and it goes out in four places. Feels like magic.", n: "Ayşe Demir", r: "Small business", metric: "2h→0", ml: "weekly effort", hue: "350" },
    ],

    /* comparison table */
    cmpKicker: "Compare",
    cmpH: ["Not manual. Not bloated.", "Just a scheduler."],
    cmpCols: ["", "Manual", "Buffer / Hootsuite", "Sıraya"],
    cmpRows: [
      { f: "One calendar, four platforms", a: false, b: true, c: true },
      { f: "Best-time heatmap", a: false, b: "partial", c: true },
      { f: "Auto-shift to the best time", a: false, b: false, c: true },
      { f: "Transparent 'why this hour'", a: false, b: false, c: true },
      { f: "Draft approvals & team roles", a: false, b: true, c: true },
      { f: "Never touches your content (no AI-ify)", a: true, b: "sometimes", c: true },
      { f: "Set up in minutes", a: false, b: "partial", c: true },
      { f: "Honest, single price", a: true, b: false, c: true },
    ],

    /* one calendar showcase */
    oneCalKicker: "One calendar",
    oneCalH: ["One calendar,", "every platform."],
    oneCalBody: "Instagram pink, X grey, LinkedIn blue, TikTok teal — all colored chips in one month view. What goes out on which day, at a glance.",
    oneCalMonth: "June",
    oneCalLegend: ["Instagram", "X", "LinkedIn", "TikTok"],

    /* best-time engine deep dive */
    engineKicker: "The engine",
    engineH: ["How the best time", "gets found."],
    engineBody: "Sıraya scans each channel's past engagement hour by hour and turns the windows your audience is awake into a heatmap. The darker squares are your best times; autopilot shifts your post there.",
    engineSteps: [
      { n: "01", t: "Collect", b: "Read every post's hour and engagement, going back in time." },
      { n: "02", t: "Solve", b: "Score the windows 0–100 on a day × hour grid." },
      { n: "03", t: "Shift", b: "Place the new post in the highest-scoring open window." },
    ],

    /* integrations strip */
    integKicker: "Integrations",
    integH: "Connect once, let Sıraya handle the rest.",
    integitems: [
      { name: "Instagram", icon: "camera", hue: "350" },
      { name: "X", icon: "at-sign", hue: "230" },
      { name: "LinkedIn", icon: "briefcase", hue: "245" },
      { name: "TikTok", icon: "music-2", hue: "190" },
      { name: "Facebook", icon: "globe", hue: "250" },
    ],
  },
};

/* platform chip colors for the hero/preview */
const chipColors: Record<string, string> = {
  ig: "oklch(60% 0.2 350)",
  x: "oklch(40% 0.02 240)",
  li: "oklch(52% 0.15 245)",
  tt: "oklch(55% 0.14 195)",
};

/* ── Hero illustration: a floaty month calendar + best-time heatmap ──────── */
function PlannerPreview({ lang }: { lang: "tr" | "en" }) {
  const t = {
    tr: { best: "En iyi saat", heat: "En iyi saat", queued: "23 sırada", reel: "Reels · 18:00", auto: "Otomatik kaydırıldı" },
    en: { best: "Best time", heat: "Best time", queued: "23 queued", reel: "Reel · 18:00", auto: "Auto-shifted" },
  }[lang];
  const days = lang === "tr" ? ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chips: Record<number, string[]> = {
    1: ["li"], 2: ["x", "ig"], 4: ["tt"], 6: ["li", "x"], 8: ["ig"], 9: ["tt", "x"],
    11: ["li"], 13: ["ig", "x"], 15: ["tt"], 16: ["ig", "li"], 18: ["x"], 20: ["tt", "ig"],
    23: ["li"], 25: ["x"], 27: ["ig", "tt"],
  };
  const heat = [
    [22, 48, 61, 78, 35], [30, 55, 58, 96, 44], [26, 50, 64, 72, 38],
    [28, 52, 60, 90, 49], [24, 46, 57, 70, 41], [18, 34, 44, 62, 58], [20, 30, 38, 66, 64],
  ];
  return (
    <div className="relative h-[460px] sm:h-[520px]">
      {/* back card — month calendar */}
      <div className="absolute right-0 top-2 w-[290px] rotate-3 overflow-hidden rounded-2xl bg-card p-4 shadow-pop ring-1 ring-border floaty">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold">{lang === "tr" ? "Haziran" : "June"}</p>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{t.queued}</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((d) => <span key={d} className="text-[8px] font-medium uppercase tracking-wide text-muted-foreground">{d[0]}</span>)}
          {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
            <div key={d} className="aspect-square rounded-[5px] bg-muted/60 p-0.5">
              <span className="block text-right text-[7px] leading-none text-muted-foreground/70">{d}</span>
              <div className="mt-0.5 flex flex-wrap gap-0.5">
                {(chips[d] ?? []).map((ch, k) => (
                  <span key={k} className="h-1 w-1 rounded-full" style={{ background: chipColors[ch] }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* mid card — best-time heatmap */}
      <div className="absolute left-0 top-32 w-[230px] overflow-hidden rounded-2xl bg-card p-4 shadow-pop ring-1 ring-border floaty" style={{ animationDelay: "0.7s" }}>
        <div className="mb-2 flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-primary" />
          <p className="text-xs font-semibold">{t.heat}</p>
        </div>
        <div className="space-y-1">
          {heat.map((row, r) => (
            <div key={r} className="flex items-center gap-1">
              <span className="w-5 text-[7px] text-muted-foreground">{days[r]}</span>
              <div className="flex gap-1">
                {row.map((v, ci) => (
                  <span key={ci} className="h-3.5 w-3.5 rounded-[3px]" style={{ background: `color-mix(in oklch, var(--color-sun) ${v}%, var(--color-muted))` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* front chip — best-time autopilot */}
      <div className="absolute bottom-2 right-6 w-[210px] overflow-hidden rounded-2xl bg-card p-3.5 shadow-pop ring-1 ring-border floaty" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: chipColors.ig }}><Sparkles className="h-4 w-4 text-white" /></span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{t.reel}</p>
            <p className="inline-flex items-center gap-1 text-[10px] text-success"><Zap className="h-2.5 w-2.5" /> {t.auto}</p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between rounded-lg bg-muted/70 px-2 py-1.5 text-[10px]">
          <span className="text-muted-foreground">14:00</span>
          <MoveRight className="h-3 w-3 text-primary" />
          <span className="font-semibold text-primary">18:00</span>
        </div>
      </div>
      {/* float chip — best-time pill */}
      <div className="absolute -left-2 top-4 hidden rounded-xl border border-border bg-card px-3 py-2 shadow-pop sm:block slide-x">
        <p className="flex items-center gap-1.5 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-sun pulse-dot" /> {t.best} · {lang === "tr" ? "Sal" : "Tue"} 18:00
        </p>
      </div>
    </div>
  );
}

export default function SirayaLanding() {
  const { lang } = useLang();
  const c = content[lang];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-dvh">
      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2.5"><LogoMark className="h-8 w-8" /><span className="font-display text-lg font-semibold tracking-tight">Sıraya</span></Link>
          <nav className="ml-auto hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#what" className="hover:text-foreground transition-colors">{c.nav[0]}</a>
            <a href="#journey" className="hover:text-foreground transition-colors">{c.nav[1]}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{c.nav[2]}</a>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-7">
            <LanguageToggle className="mr-1" />
            <Link href="/login" className="hidden px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">{c.signin}</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition hover:opacity-90">{c.demo} <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)", opacity: 0.6 }} />
        <span className="blob -left-24 -top-20 -z-10 h-96 w-96 bg-primary/25 drift" aria-hidden />
        <span className="blob right-1/4 top-32 -z-10 h-72 w-72 drift" aria-hidden style={{ background: "color-mix(in oklch, var(--color-sun) 32%, transparent)", animationDelay: "2s" }} />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:py-24">
          <div>
            <p className="rise label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.badge}</p>
            <h1 className="rise mt-6 font-display text-[clamp(40px,6.5vw,76px)] font-semibold leading-[0.96] tracking-tight" style={{ animationDelay: "0.08s" }}>
              {c.h1a} <span className="hl">{c.h1b}</span><br />
              <span className="display-accent font-normal">{c.h1c}</span>
            </h1>
            <p className="rise mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "0.18s" }}>{c.sub}</p>
            <div className="rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.28s" }}>
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground shadow-sm shadow-primary/25 transition hover:opacity-90">{c.cta1} <ArrowRight className="h-4 w-4" /></Link>
              <a href="#what" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium text-foreground ring-1 ring-border transition hover:bg-muted">{c.cta2}</a>
              <span className="hidden self-center label-mono text-muted-foreground sm:inline">{c.note}</span>
            </div>
            <div className="rise mt-9 flex items-center gap-3 text-sm text-muted-foreground" style={{ animationDelay: "0.38s" }}>
              <div className="flex -space-x-2">
                {["EK", "BT", "DA", "MA", "SL"].map((i, k) => (
                  <span key={i} className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold text-foreground/70 ring-2 ring-background" style={{ background: `oklch(${84 - k * 4}% 0.06 ${195 + k * 12})` }}>{i}</span>
                ))}
              </div>
              <span>{c.proofAvatars}</span>
            </div>
          </div>
          <div className="rise" style={{ animationDelay: "0.3s" }}><PlannerPreview lang={lang} /></div>
        </div>
      </section>

      {/* ── Marquee ─────────────────────────────────────────────────── */}
      <section className="overflow-hidden border-y border-border py-7">
        <p className="label-mono mb-4 text-center text-muted-foreground">{c.marqueeTitle}</p>
        <div className="marquee gap-10">
          {[...c.marquee, ...c.marquee].map((it, i) => (
            <span key={i} className="display-accent whitespace-nowrap px-2 text-2xl text-muted-foreground/70">{it}<span className="ml-10 text-primary">·</span></span>
          ))}
        </div>
      </section>

      {/* ── Problem ─────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.05fr] lg:px-8">
          <div>
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.problemKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(30px,4.5vw,52px)] font-semibold leading-[1.02] tracking-tight">{c.problemH[0]} <span className="display-accent font-normal">{c.problemH[1]}</span></h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">{c.problemBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {c.problemStats.map((s, i) => (
              <div key={s.l} className="rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border" style={{ transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}>
                <p className="font-display text-[40px] font-semibold leading-none tabular-nums text-primary">{s.n}</p>
                <p className="mt-2 text-[13px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules ─────────────────────────────────────────────────── */}
      <section id="what" className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.whatKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(30px,4.5vw,52px)] font-semibold leading-[1.02] tracking-tight">{c.whatH[0]} <span className="display-accent font-normal">{c.whatH[1]}</span></h2>
          </div>
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {c.modules.map((mod, i) => {
              const Icon = moduleIcons[i];
              return (
                <article key={mod.t} className="group rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-pop">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary transition group-hover:scale-110"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{mod.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mod.b}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Use cases / personas ────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.useKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.2vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.useH[0]} <span className="display-accent font-normal">{c.useH[1]}</span></h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.useCases.map((u) => (
              <article key={u.t} className="group flex flex-col rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-pop">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-110"><Icon name={u.icon} className="h-5 w-5" /></span>
                <h3 className="mt-5 text-base font-semibold tracking-tight">{u.t}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{u.b}</p>
                <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-sun/15 px-2.5 py-1 text-[11px] font-medium text-sun-foreground">{u.tag}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steps ───────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="label-mono text-primary">{c.stepsKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.stepsH[0]} <span className="display-accent font-normal">{c.stepsH[1]}</span></h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {c.steps.map((s, i) => (
              <div key={s.n} className="relative rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border">
                <span className="font-display text-5xl font-semibold leading-none text-primary/15">{s.n}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
                {i < c.steps.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-border md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive "schedule a post" demo ──────────────────────── */}
      <section className="border-t border-border py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.tryKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.2vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.tryH[0]} <span className="display-accent font-normal">{c.tryH[1]}</span></h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">{c.tryBody}</p>
          </div>
          <TryDemo c={c} lang={lang} />
        </div>
      </section>

      {/* ── Calendar + heatmap showcase ─────────────────────────────── */}
      <section className="border-y border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <div>
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.calKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4vw,46px)] font-semibold leading-[1.04] tracking-tight">{c.calH[0]} <span className="display-accent font-normal">{c.calH[1]}</span></h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">{c.calBody}</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground">{c.calLegend.split("→")[0]}</span>
              <div className="flex gap-1">
                {[12, 32, 52, 72, 92].map((v) => (
                  <span key={v} className="h-4 w-7 rounded-[4px]" style={{ background: `color-mix(in oklch, var(--color-sun) ${v}%, var(--color-muted))` }} />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">→ {c.calLegend.split("→")[1]}</span>
            </div>
          </div>
          {/* big heatmap */}
          <ShowcaseHeatmap lang={lang} />
        </div>
      </section>

      {/* ── One calendar, every platform ────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.15fr] lg:px-8">
          <div>
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.oneCalKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4vw,46px)] font-semibold leading-[1.04] tracking-tight">{c.oneCalH[0]} <span className="display-accent font-normal">{c.oneCalH[1]}</span></h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">{c.oneCalBody}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {c.oneCalLegend.map((p, i) => (
                <span key={p} className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-medium ring-1 ring-border">
                  <span className="h-2 w-2 rounded-full" style={{ background: chipColors[(["ig", "x", "li", "tt"] as const)[i]] }} /> {p}
                </span>
              ))}
            </div>
          </div>
          <MiniMonth c={c} lang={lang} />
        </div>
      </section>

      {/* ── Best-time engine deep-dive ──────────────────────────────── */}
      <section className="border-y border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.engineKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.2vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.engineH[0]} <span className="display-accent font-normal">{c.engineH[1]}</span></h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">{c.engineBody}</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {c.engineSteps.map((s, i) => (
              <div key={s.n} className="relative rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border">
                <div className="flex items-center gap-3">
                  <span className="font-display text-4xl font-semibold leading-none text-primary/20">{s.n}</span>
                  <span className="h-px flex-1 bg-border" />
                  <Icon name={["database", "grid-3x3", "move-right"][i]} className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
              </div>
            ))}
          </div>
          {/* integrations strip */}
          <div className="mt-12 rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border">
            <p className="label-mono mb-5 inline-flex items-center gap-2 text-muted-foreground"><Share2 className="h-3.5 w-3.5 text-primary" /> {c.integKicker} · {c.integH}</p>
            <div className="flex flex-wrap items-center gap-3">
              {c.integitems.map((it) => (
                <span key={it.name} className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-4 py-2.5 text-sm font-medium ring-1 ring-border">
                  <span className="grid h-7 w-7 place-items-center rounded-lg text-white" style={{ background: `oklch(62% 0.17 ${it.hue})` }}><Icon name={it.icon} className="h-3.5 w-3.5" /></span>
                  {it.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof ───────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-card py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-3 lg:px-8">
          {c.proof.map((p) => (
            <div key={p.l}>
              <p className="font-display text-[64px] font-semibold leading-none tracking-tight text-primary">{p.big}</p>
              <p className="mt-2 text-sm font-medium">{p.l}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Journey timeline ────────────────────────────────────────── */}
      <section id="journey" className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.journeyKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.journeyH[0]} <span className="display-accent font-normal">{c.journeyH[1]}</span></h2>
          </div>
          <ol className="relative ml-3 space-y-5 border-l border-border pl-8">
            {c.ticks.map((tk, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[42px] grid h-7 w-7 place-items-center rounded-full bg-card text-[10px] font-mono text-primary ring-1 ring-border">●</span>
                <div className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-xs text-primary">{tk.time}</span>
                    <span className="text-[11px] text-muted-foreground">{tk.who}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{tk.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Testimonials (expanded) ─────────────────────────────────── */}
      <section className="border-y border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.bigTestiKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(28px,4.2vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.bigTestiH[0]} <span className="display-accent font-normal">{c.bigTestiH[1]}</span></h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.bigTestimonials.map((tm, i) => (
              <figure key={i} className="flex flex-col rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-pop">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex gap-0.5 text-sun">{Array.from({ length: 5 }).map((_, k) => <Sparkles key={k} className="h-3.5 w-3.5 fill-current" />)}</div>
                  <span className="inline-flex items-baseline gap-1 rounded-full bg-primary/8 px-2.5 py-1">
                    <span className="font-display text-sm font-semibold text-primary tabular-nums">{tm.metric}</span>
                    <span className="text-[10px] text-muted-foreground">{tm.ml}</span>
                  </span>
                </div>
                <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground/90">“{tm.q}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold text-white" style={{ background: `oklch(62% 0.16 ${tm.hue})` }}>{tm.n.split(" ").map((x) => x[0]).join("")}</span>
                  <div><p className="text-sm font-semibold">{tm.n}</p><p className="text-xs text-muted-foreground">{tm.r}</p></div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ──────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <div>
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.compareKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4vw,46px)] font-semibold leading-[1.04] tracking-tight">{c.compareH[0]} <span className="display-accent font-normal">{c.compareH[1]}</span></h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">{c.compareBody}</p>
          </div>
          <ul className="space-y-2.5">
            {c.compareRows.map((row) => (
              <li key={row.a} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
                <span className="text-[13px] text-muted-foreground line-through decoration-destructive/40">{row.a}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium"><Check className="h-4 w-4 shrink-0 text-success" /> {row.b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Comparison table ────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.cmpKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,44px)] font-semibold leading-[1.04] tracking-tight">{c.cmpH[0]} <span className="display-accent font-normal">{c.cmpH[1]}</span></h2>
          </div>
          <div className="overflow-hidden rounded-3xl bg-card shadow-pop ring-1 ring-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-4 text-left text-[13px] font-medium text-muted-foreground">{c.cmpCols[0]}</th>
                    <th className="px-3 py-4 text-center text-[12px] font-medium text-muted-foreground">{c.cmpCols[1]}</th>
                    <th className="px-3 py-4 text-center text-[12px] font-medium text-muted-foreground">{c.cmpCols[2]}</th>
                    <th className="bg-primary/[0.06] px-3 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 font-display text-[15px] font-semibold tracking-tight text-primary"><LogoMark className="h-4 w-4" /> {c.cmpCols[3]}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {c.cmpRows.map((row, i) => (
                    <tr key={row.f} className={cn("border-b border-border/60", i % 2 ? "bg-muted/20" : "")}>
                      <td className="px-5 py-3.5 text-left text-[13px] font-medium">{row.f}</td>
                      <td className="px-3 py-3.5 text-center"><CmpCell v={row.a} /></td>
                      <td className="px-3 py-3.5 text-center"><CmpCell v={row.b} /></td>
                      <td className="bg-primary/[0.06] px-3 py-3.5 text-center"><CmpCell v={row.c} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Promise (inverted) ──────────────────────────────────────── */}
      <section className="px-5 pb-8 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-sidebar p-10 text-sidebar-foreground lg:p-16">
          <span className="blob -right-20 -top-20 h-72 w-72 bg-primary/40 drift" aria-hidden />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <p className="label-mono inline-flex items-center gap-2 text-sidebar-muted"><span className="h-px w-7 bg-primary" /> {c.promiseKicker}</p>
              <h2 className="mt-4 font-display text-[clamp(28px,4vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.promiseH[0]} <span className="display-accent font-normal" style={{ color: "var(--color-sun)" }}>{c.promiseH[1]}</span></h2>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-sidebar-muted">{c.promiseBody}</p>
            </div>
            <ul className="space-y-3">
              {c.promiseBullets.map((b) => (
                <li key={b} className="flex gap-3 rounded-2xl bg-white/[0.05] px-4 py-3.5 ring-1 ring-white/10"><Check className="mt-0.5 h-4 w-4 shrink-0 text-sun" /><p className="text-[13.5px] leading-relaxed text-sidebar-foreground/85">{b}</p></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="label-mono text-primary">{c.pricingKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.pricingH[0]} <span className="display-accent font-normal">{c.pricingH[1]}</span></h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {c.plans.map((p) => (
              <article key={p.name} className={cn("relative rounded-3xl p-7 lg:p-8", p.featured ? "bg-sidebar text-sidebar-foreground shadow-pop" : "bg-card ring-1 ring-border shadow-soft")}>
                {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">{lang === "tr" ? "Önerilen" : "Recommended"}</span>}
                <p className={cn("label-mono", p.featured ? "text-sidebar-muted" : "text-muted-foreground")}>{p.name}</p>
                <p className="mt-3 flex items-end gap-1"><span className="font-display text-5xl font-semibold leading-none tracking-tight">{p.price}</span><span className={cn("pb-1.5 text-[13px]", p.featured ? "text-sidebar-muted" : "text-muted-foreground")}>{p.cad}</span></p>
                <p className={cn("mt-3 text-[13px] leading-relaxed", p.featured ? "text-sidebar-foreground/75" : "text-muted-foreground")}>{p.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {p.bullets.map((b) => <li key={b} className="flex items-start gap-2 text-[13px]"><Check className={cn("mt-0.5 h-4 w-4 shrink-0", p.featured ? "text-sun" : "text-success")} />{b}</li>)}
                </ul>
                <Link href="/signup" className={cn("mt-7 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-[13px] font-medium transition", p.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "ring-1 ring-border hover:bg-muted")}>{p.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="mb-10 text-center">
            <p className="label-mono text-primary">{c.faqKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,42px)] font-semibold tracking-tight">{c.faqH}</h2>
          </div>
          <ul className="space-y-2.5">
            {c.faq.map((item, i) => (
              <li key={item.q} className="overflow-hidden rounded-2xl bg-card ring-1 ring-border">
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-[15px] font-semibold tracking-tight">{item.q}</span>
                  {open === i ? <Minus className="h-4 w-4 shrink-0 text-muted-foreground" /> : <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </button>
                {open === i && <p className="px-5 pb-4 text-[13.5px] leading-relaxed text-muted-foreground">{item.a}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Finale ──────────────────────────────────────────────────── */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] p-10 text-center text-white lg:p-16" style={{ background: "var(--grad-brand)" }}>
          <span className="blob left-1/4 -top-12 h-64 w-64 bg-white/20 drift" aria-hidden />
          <div className="relative">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-white/70"><Sparkles className="h-3 w-3" /> {c.finaleKicker}</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-[clamp(32px,5.5vw,68px)] font-semibold leading-[1] tracking-tight">{c.finaleH[0]} <span className="italic" style={{ fontFamily: "var(--font-display)" }}>{c.finaleH[1]}</span></h2>
            <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-white/85">{c.finaleBody}</p>
            <div className="mt-9"><Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-medium text-foreground transition hover:bg-white/90">{c.cta1} <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-14">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-sm text-muted-foreground md:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5"><LogoMark className="h-7 w-7" /><span className="font-display text-base font-semibold tracking-tight text-foreground">Sıraya</span></Link>
              <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-muted-foreground">{c.footTagline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["ig", "x", "li", "tt"] as const).map((k) => (
                  <span key={k} className="h-7 w-7 rounded-lg" style={{ background: `color-mix(in oklch, ${chipColors[k]} 22%, transparent)` }} aria-hidden />
                ))}
              </div>
              <p className="mt-4 inline-flex items-center gap-1.5 label-mono text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> {lang === "tr" ? "Tüm sistemler çalışıyor" : "All systems operational"}</p>
            </div>
            <div>
              <p className="label-mono mb-3 text-muted-foreground">{lang === "tr" ? "Ürün" : "Product"}</p>
              <ul className="space-y-1.5">
                <li><a href="#what" className="hover:text-foreground">{c.nav[0]}</a></li>
                <li><a href="#journey" className="hover:text-foreground">{c.nav[1]}</a></li>
                <li><a href="#pricing" className="hover:text-foreground">{c.nav[2]}</a></li>
                <li><Link href="/login" className="hover:text-foreground">{c.demo}</Link></li>
                <li><span>{lang === "tr" ? "En iyi saat motoru" : "Best-time engine"}</span></li>
              </ul>
            </div>
            <div>
              <p className="label-mono mb-3 text-muted-foreground">{lang === "tr" ? "Platformlar" : "Platforms"}</p>
              <ul className="space-y-1.5"><li>Instagram</li><li>X</li><li>LinkedIn</li><li>TikTok</li><li>Facebook</li></ul>
            </div>
            <div>
              <p className="label-mono mb-3 text-muted-foreground">{lang === "tr" ? "Şirket" : "Company"}</p>
              <ul className="space-y-1.5"><li>hello@siraya.app</li><li>{lang === "tr" ? "Hakkında" : "About"}</li><li>{lang === "tr" ? "Gizlilik" : "Privacy"}</li><li>{lang === "tr" ? "Şartlar" : "Terms"}</li></ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-[12px] text-muted-foreground md:flex-row md:items-center">
            <p>© 2026 Sıraya · siraya.app</p>
            <p className="label-mono">{lang === "tr" ? "Tek takvim · dört platform · en iyi saat" : "One calendar · four platforms · best time"}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Big best-time heatmap for the showcase act. */
function ShowcaseHeatmap({ lang }: { lang: "tr" | "en" }) {
  const days = lang === "tr" ? ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const windows = ["06", "09", "12", "15", "18", "21"];
  const heat = [
    [22, 48, 61, 40, 78, 35], [30, 55, 58, 52, 96, 44], [26, 50, 64, 47, 72, 38],
    [28, 52, 60, 55, 90, 49], [24, 46, 57, 42, 70, 41], [18, 34, 44, 50, 62, 58], [20, 30, 38, 46, 66, 64],
  ];
  return (
    <div className="rounded-3xl bg-card p-6 shadow-pop ring-1 ring-border">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <p className="font-display text-base font-semibold tracking-tight">{lang === "tr" ? "En iyi saat ısı haritası" : "Best-time heatmap"}</p>
      </div>
      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[420px]">
          <div className="ml-9 grid grid-cols-6 gap-1.5 pb-1.5 text-center">
            {windows.map((w) => <span key={w} className="font-mono text-[10px] text-muted-foreground">{w}</span>)}
          </div>
          {heat.map((row, r) => (
            <div key={r} className="flex items-center gap-1.5 py-0.5">
              <span className="w-7 text-[11px] font-medium text-muted-foreground">{days[r]}</span>
              <div className="grid flex-1 grid-cols-6 gap-1.5">
                {row.map((v, ci) => (
                  <span
                    key={ci}
                    className={cn("grid aspect-[2/1] place-items-center rounded-md text-[9px] font-semibold transition hover:scale-105", v >= 80 ? "text-sun-foreground" : "text-transparent")}
                    style={{ background: `color-mix(in oklch, var(--color-sun) ${v}%, var(--color-muted))` }}
                  >
                    {v >= 80 ? v : ""}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-[11px] font-medium text-success">
        <Zap className="h-3 w-3" /> {lang === "tr" ? "En iyi: Salı 18:00 — otomatik kullanıldı" : "Best: Tuesday 18:00 — autopilot uses it"}
      </p>
    </div>
  );
}

/* ── Interactive "schedule a post" demo ──────────────────────────────────────
   Type a post, pick platforms, hit the button — it slots into a mini week grid
   at a best-time and shows a best-time hint. Pure useState, no backend. */
const TRY_PLATFORMS: { key: "ig" | "x" | "li" | "tt"; label: string; icon: string }[] = [
  { key: "ig", label: "Instagram", icon: "camera" },
  { key: "x", label: "X", icon: "at-sign" },
  { key: "li", label: "LinkedIn", icon: "briefcase" },
  { key: "tt", label: "TikTok", icon: "music-2" },
];

function TryDemo({ c, lang }: { c: typeof content["tr"]; lang: "tr" | "en" }) {
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<Record<string, boolean>>({ ig: true, x: false, li: true, tt: false });
  const [slot, setSlot] = useState<{ day: number; row: number } | null>(null);
  const hours = ["09", "12", "15", "18", "21"];
  // best-time grid: Tue 18:00 is the peak (day 1, row 3)
  const best = { day: 1, row: 3 };
  const toggle = (k: string) => setPicked((p) => ({ ...p, [k]: !p[k] }));
  const anyPicked = Object.values(picked).some(Boolean);
  const run = () => { if (anyPicked) setSlot(best); };
  const activeChips = TRY_PLATFORMS.filter((p) => picked[p.key]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
      {/* composer */}
      <div className="flex flex-col rounded-3xl bg-card p-6 shadow-pop ring-1 ring-border">
        <label className="label-mono text-muted-foreground">{lang === "tr" ? "Gönderi" : "Post"}</label>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setSlot(null); }}
          rows={3}
          placeholder={c.tryPlaceholder}
          className="mt-2 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed outline-none ring-primary/30 transition placeholder:text-muted-foreground/60 focus:ring-2"
        />
        <p className="label-mono mt-5 text-muted-foreground">{c.tryPlatforms}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRY_PLATFORMS.map((p) => (
            <button
              key={p.key}
              onClick={() => { toggle(p.key); setSlot(null); }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition",
                picked[p.key]
                  ? "text-white ring-transparent"
                  : "bg-muted text-muted-foreground ring-border hover:text-foreground",
              )}
              style={picked[p.key] ? { background: chipColors[p.key] } : undefined}
            >
              <Icon name={p.icon} className="h-3.5 w-3.5" /> {p.label}
              {picked[p.key] && <Check className="h-3 w-3" />}
            </button>
          ))}
        </div>
        <button
          onClick={run}
          disabled={!anyPicked}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Wand2 className="h-4 w-4" /> {c.tryButton}
        </button>
        {slot && (
          <div className="animate-float-up mt-4 rounded-2xl border border-sun/40 bg-sun/10 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-sun-foreground">
              <Sparkles className="h-3.5 w-3.5" /> {c.tryHintLabel}: {lang === "tr" ? "Salı" : "Tue"} 18:00
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">{c.tryReason}</p>
          </div>
        )}
      </div>

      {/* mini week grid */}
      <div className="rounded-3xl bg-card p-6 shadow-pop ring-1 ring-border">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <p className="font-display text-base font-semibold tracking-tight">{lang === "tr" ? "Bu hafta" : "This week"}</p>
          {slot && <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[10px] font-semibold text-success"><Zap className="h-2.5 w-2.5" /> {c.trySlotted}</span>}
        </div>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: "26px repeat(7, 1fr)" }}>
          <div />
          {c.tryDays.map((d) => <div key={d} className="pb-1 text-center text-[9px] font-medium uppercase tracking-wide text-muted-foreground">{d[0]}</div>)}
          {hours.map((h, row) => (
            <div key={h} className="contents">
              <div className="flex items-center text-[9px] tabular-nums text-muted-foreground">{h}</div>
              {c.tryDays.map((_, day) => {
                const isSlot = slot && slot.day === day && slot.row === row;
                const isBestCol = best.day === day && best.row === row;
                return (
                  <div
                    key={day}
                    className={cn(
                      "relative aspect-[3/2] rounded-md border transition",
                      isSlot ? "border-transparent" : isBestCol ? "border-sun/40 bg-sun/10" : "border-border/50 bg-muted/40",
                    )}
                    style={isSlot ? { background: "var(--grad-brand)" } : undefined}
                  >
                    {isSlot && (
                      <div className="animate-float-up absolute inset-0 grid place-items-center gap-0.5 p-0.5">
                        <div className="flex gap-0.5">
                          {activeChips.slice(0, 4).map((p) => (
                            <span key={p.key} className="h-1.5 w-1.5 rounded-full ring-1 ring-white/60" style={{ background: chipColors[p.key] }} />
                          ))}
                        </div>
                        <span className="text-[7px] font-bold text-white">18:00</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {!slot && (
          <p className="mt-4 rounded-xl bg-muted/50 px-3 py-2.5 text-center text-[11.5px] text-muted-foreground">{c.tryEmpty}</p>
        )}
        {slot && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5 text-[11.5px]">
            <span className="text-muted-foreground line-through">14:00</span>
            <MoveRight className="h-3 w-3 text-primary" />
            <span className="font-semibold text-primary">{lang === "tr" ? "Salı" : "Tue"} 18:00</span>
            <span className="ml-auto text-muted-foreground">{activeChips.length} {lang === "tr" ? "platform" : "platforms"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── One-calendar mini month grid (multi-platform chips) ─────────────────────── */
function MiniMonth({ c, lang }: { c: typeof content["tr"]; lang: "tr" | "en" }) {
  const chips: Record<number, ("ig" | "x" | "li" | "tt")[]> = {
    2: ["li"], 3: ["x", "ig"], 5: ["tt"], 6: ["li", "x"], 9: ["ig"], 10: ["tt", "x"],
    12: ["li"], 13: ["ig", "x"], 16: ["tt", "ig"], 17: ["x"], 19: ["li", "ig"],
    20: ["tt"], 23: ["ig", "x"], 24: ["li"], 26: ["tt"], 27: ["x", "ig"], 30: ["li", "tt"],
  };
  const days = lang === "tr" ? ["P", "S", "Ç", "P", "C", "C", "P"] : ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="rounded-3xl bg-card p-6 shadow-pop ring-1 ring-border">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-base font-semibold tracking-tight">{c.oneCalMonth} 2026</p>
        <div className="flex items-center gap-2.5">
          {(["ig", "x", "li", "tt"] as const).map((k, i) => (
            <span key={k} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: chipColors[k] }} /> {c.oneCalLegend[i]}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {days.map((d, i) => <span key={i} className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">{d}</span>)}
        {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
          <div key={d} className="min-h-[42px] rounded-lg border border-border/50 bg-muted/30 p-1 text-left">
            <span className="block text-[8px] tabular-nums text-muted-foreground/70">{d}</span>
            <div className="mt-0.5 flex flex-wrap gap-0.5">
              {(chips[d] ?? []).map((ch, k) => (
                <span key={k} className="h-1.5 w-1.5 rounded-full" style={{ background: chipColors[ch] }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Comparison cell renderer ────────────────────────────────────────────────── */
function CmpCell({ v }: { v: boolean | string }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-success" />;
  if (v === false) return <XIcon className="mx-auto h-4 w-4 text-muted-foreground/40" />;
  return <span className="text-[11px] font-medium text-muted-foreground">{v}</span>;
}
