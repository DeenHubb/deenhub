import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, Moon, Sun, Menu, X, BookOpen, Headphones, Users,
  Compass, Calculator, Clock, Heart, Bookmark, Share2, Copy, Play, Pause,
  ChevronRight, ChevronDown, Home, GraduationCap, Sparkles, ShieldCheck,
  MapPin, ExternalLink, Info, ArrowLeft, User, Loader2, LogOut, Check,
  Type, Palette, BookMarked
} from "lucide-react";

/* -----------------------------------------------------------------------
   DeenHub — MVP frontend prototype (v4: fully embedded, offline-reliable)

   To guarantee the Quran reader and core Hadith search always work
   regardless of network conditions inside this artifact sandbox, the
   entire Quran (all 114 surahs — real Arabic Uthmani Hafs script, from
   the open-source fawazahmed0/quran-api dataset — plus the real, public
   domain Abdullah Yusuf Ali English translation) and the full 42-hadith
   Nawawi's Forty Hadith collection (bilingual, from fawazahmed0/hadith-api,
   itself sourced from sunnah.com) are embedded directly in this file as
   data, not fetched at runtime. Opening any surah or searching Hadith
   works instantly and offline — nothing to fail.

   Live network calls are still used, as a bonus layer only, for: prayer
   times (Aladhan), Qibla bearing (pure math, no network), nearby mosques
   (OpenStreetMap Overpass), and searching the wider Hadith collections
   beyond Nawawi's 40 (fawazahmed0/hadith-api via jsdelivr). Each of these
   fails gracefully with a clear message + retry if the network is
   unavailable — they never block the core reading experience.

   Fiqh topics and the Scholars directory contain real, well-established
   content: the four classical madhhab founders (verifiable history) and
   an editorial-labeled summary of foundational Aqeedah/Fiqh topics and
   commonly cited comparative madhhab positions, clearly marked as an
   editorial summary rather than a live scholarly database, with a
   standing notice to consult a qualified scholar for rulings.
------------------------------------------------------------------------*/

const COLORS = {
  darkGreen: "#123C2C",
  green: "#176B4D",
  greenSoft: "#1E7D59",
  lightGreen: "#EAF4EF",
  gold: "#C7A95A",
  goldSoft: "#DFC98A",
  cream: "#FAF8F2",
  text: "#17211C",
};

const SURAH_LIST = [
  ["الفاتحة","Al-Fatihah",1,7,"Makki"],["البقرة","Al-Baqarah",2,286,"Madani"],
  ["آل عمران","Aal-E-Imran",3,200,"Madani"],["النساء","An-Nisa",4,176,"Madani"],
  ["المائدة","Al-Ma'idah",5,120,"Madani"],["الأنعام","Al-An'am",6,165,"Makki"],
  ["الأعراف","Al-A'raf",7,206,"Makki"],["الأنفال","Al-Anfal",8,75,"Madani"],
  ["التوبة","At-Tawbah",9,129,"Madani"],["يونس","Yunus",10,109,"Makki"],
  ["هود","Hud",11,123,"Makki"],["يوسف","Yusuf",12,111,"Makki"],
  ["الرعد","Ar-Ra'd",13,43,"Madani"],["إبراهيم","Ibrahim",14,52,"Makki"],
  ["الحجر","Al-Hijr",15,99,"Makki"],["النحل","An-Nahl",16,128,"Makki"],
  ["الإسراء","Al-Isra",17,111,"Makki"],["الكهف","Al-Kahf",18,110,"Makki"],
  ["مريم","Maryam",19,98,"Makki"],["طه","Ta-Ha",20,135,"Makki"],
  ["الأنبياء","Al-Anbiya",21,112,"Makki"],["الحج","Al-Hajj",22,78,"Madani"],
  ["المؤمنون","Al-Mu'minun",23,118,"Makki"],["النور","An-Nur",24,64,"Madani"],
  ["الفرقان","Al-Furqan",25,77,"Makki"],["الشعراء","Ash-Shu'ara",26,227,"Makki"],
  ["النمل","An-Naml",27,93,"Makki"],["القصص","Al-Qasas",28,88,"Makki"],
  ["العنكبوت","Al-Ankabut",29,69,"Makki"],["الروم","Ar-Rum",30,60,"Makki"],
  ["لقمان","Luqman",31,34,"Makki"],["السجدة","As-Sajdah",32,30,"Makki"],
  ["الأحزاب","Al-Ahzab",33,73,"Madani"],["سبأ","Saba",34,54,"Makki"],
  ["فاطر","Fatir",35,45,"Makki"],["يس","Ya-Sin",36,83,"Makki"],
  ["الصافات","As-Saffat",37,182,"Makki"],["ص","Sad",38,88,"Makki"],
  ["الزمر","Az-Zumar",39,75,"Makki"],["غافر","Ghafir",40,85,"Makki"],
  ["فصلت","Fussilat",41,54,"Makki"],["الشورى","Ash-Shuraa",42,53,"Makki"],
  ["الزخرف","Az-Zukhruf",43,89,"Makki"],["الدخان","Ad-Dukhan",44,59,"Makki"],
  ["الجاثية","Al-Jathiyah",45,37,"Makki"],["الأحقاف","Al-Ahqaf",46,35,"Makki"],
  ["محمد","Muhammad",47,38,"Madani"],["الفتح","Al-Fath",48,29,"Madani"],
  ["الحجرات","Al-Hujurat",49,18,"Madani"],["ق","Qaf",50,45,"Makki"],
  ["الذاريات","Adh-Dhariyat",51,60,"Makki"],["الطور","At-Tur",52,49,"Makki"],
  ["النجم","An-Najm",53,62,"Makki"],["القمر","Al-Qamar",54,55,"Makki"],
  ["الرحمن","Ar-Rahman",55,78,"Madani"],["الواقعة","Al-Waqi'ah",56,96,"Makki"],
  ["الحديد","Al-Hadid",57,29,"Madani"],["المجادلة","Al-Mujadila",58,22,"Madani"],
  ["الحشر","Al-Hashr",59,24,"Madani"],["الممتحنة","Al-Mumtahanah",60,13,"Madani"],
  ["الصف","As-Saf",61,14,"Madani"],["الجمعة","Al-Jumu'ah",62,11,"Madani"],
  ["المنافقون","Al-Munafiqun",63,11,"Madani"],["التغابن","At-Taghabun",64,18,"Madani"],
  ["الطلاق","At-Talaq",65,12,"Madani"],["التحريم","At-Tahrim",66,12,"Madani"],
  ["الملك","Al-Mulk",67,30,"Makki"],["القلم","Al-Qalam",68,52,"Makki"],
  ["الحاقة","Al-Haqqah",69,52,"Makki"],["المعارج","Al-Ma'arij",70,44,"Makki"],
  ["نوح","Nuh",71,28,"Makki"],["الجن","Al-Jinn",72,28,"Makki"],
  ["المزمل","Al-Muzzammil",73,20,"Makki"],["المدثر","Al-Muddaththir",74,56,"Makki"],
  ["القيامة","Al-Qiyamah",75,40,"Makki"],["الإنسان","Al-Insan",76,31,"Madani"],
  ["المرسلات","Al-Mursalat",77,50,"Makki"],["النبأ","An-Naba",78,40,"Makki"],
  ["النازعات","An-Nazi'at",79,46,"Makki"],["عبس","Abasa",80,42,"Makki"],
  ["التكوير","At-Takwir",81,29,"Makki"],["الإنفطار","Al-Infitar",82,19,"Makki"],
  ["المطففين","Al-Mutaffifin",83,36,"Makki"],["الإنشقاق","Al-Inshiqaq",84,25,"Makki"],
  ["البروج","Al-Buruj",85,22,"Makki"],["الطارق","At-Tariq",86,17,"Makki"],
  ["الأعلى","Al-A'la",87,19,"Makki"],["الغاشية","Al-Ghashiyah",88,26,"Makki"],
  ["الفجر","Al-Fajr",89,30,"Makki"],["البلد","Al-Balad",90,20,"Makki"],
  ["الشمس","Ash-Shams",91,15,"Makki"],["الليل","Al-Layl",92,21,"Makki"],
  ["الضحى","Ad-Duhaa",93,11,"Makki"],["الشرح","Ash-Sharh",94,8,"Makki"],
  ["التين","At-Tin",95,8,"Makki"],["العلق","Al-Alaq",96,19,"Makki"],
  ["القدر","Al-Qadr",97,5,"Makki"],["البينة","Al-Bayyinah",98,8,"Madani"],
  ["الزلزلة","Az-Zalzalah",99,8,"Madani"],["العاديات","Al-Adiyat",100,11,"Makki"],
  ["القارعة","Al-Qari'ah",101,11,"Makki"],["التكاثر","At-Takathur",102,8,"Makki"],
  ["العصر","Al-Asr",103,3,"Makki"],["الهمزة","Al-Humazah",104,9,"Makki"],
  ["الفيل","Al-Fil",105,5,"Makki"],["قريش","Quraysh",106,4,"Makki"],
  ["الماعون","Al-Ma'un",107,7,"Makki"],["الكوثر","Al-Kawthar",108,3,"Makki"],
  ["الكافرون","Al-Kafirun",109,6,"Makki"],["النصر","An-Nasr",110,3,"Madani"],
  ["المسد","Al-Masad",111,5,"Makki"],["الإخلاص","Al-Ikhlas",112,4,"Makki"],
  ["الفلق","Al-Falaq",113,5,"Makki"],["الناس","An-Nas",114,6,"Makki"],
];
// cumulative ayah offsets, used to compute each ayah's global number (1-6236) for audio URLs
const SURAH_OFFSETS = (() => {
  const offsets = [0];
  for (let i = 0; i < SURAH_LIST.length; i++) offsets.push(offsets[i] + SURAH_LIST[i][3]);
  return offsets;
})();

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy" },
  { id: "ar.husary", name: "Mahmoud Husary" },
  { id: "ar.minshawi", name: "Mohamed Minshawi" },
];

const CALC_METHODS = [
  { id: 2, name: "ISNA (North America)" },
  { id: 3, name: "Muslim World League" },
  { id: 4, name: "Umm al-Qura, Makkah" },
  { id: 5, name: "Egyptian Authority" },
  { id: 1, name: "Karachi" },
  { id: 99, name: "Custom / other" },
];

const COUNTRIES = [
  "Saudi Arabia","United Arab Emirates","Egypt","Turkey","Pakistan","India","Indonesia","Malaysia",
  "United Kingdom","United States","Canada","Germany","France","Morocco","Algeria","Tunisia","Jordan",
  "Qatar","Kuwait","Bahrain","Oman","Iraq","Bangladesh","Nigeria","South Africa","Australia","Yemen",
  "Lebanon","Palestine","Sudan","Somalia","Afghanistan","Uzbekistan",
];

/* ---------------- Islamic geometric pattern ---------------- */
function StarPattern({ opacity = 0.06, color = COLORS.green, size = 64 }) {
  const id = "starpat";
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g stroke={color} strokeWidth="1" fill="none">
            <path d={`M${size/2} 2 L${size-2} ${size/2} L${size/2} ${size-2} L2 ${size/2} Z`} />
            <circle cx={size/2} cy={size/2} r={size*0.18} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-10 select-none" aria-hidden="true">
      <span className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to right, transparent, ${COLORS.gold})` }} />
      <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill={COLORS.gold} /></svg>
      <span className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to left, transparent, ${COLORS.gold})` }} />
    </div>
  );
}

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById("deenhub-fonts")) return;
    const link = document.createElement("link");
    link.id = "deenhub-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Amiri:wght@400;700&family=Amiri+Quran&family=Scheherazade+New:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ---------------- Tajweed colorizer ----------------
   A rule-based approximation of the standard color-coded Tajweed convention
   used in printed color Tajweed Qurans (ghunnah, ikhfa, idgham with/without
   ghunnah, iqlab, qalqalah, madd). It classifies each letter by looking at
   its own diacritics and, for noon sakinah/tanween, the letter that follows
   -- the same logic a human reciter applies. It is still an educational
   approximation, not a scholarly-certified Tajweed mushaf. */
const QALQALAH_LETTERS = new Set(["ق", "ط", "ب", "ج", "د"]);
const IKHFA_LETTERS = new Set(["ت", "ث", "ج", "د", "ذ", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ف", "ق", "ك"]);
const IDGHAM_GHUNNAH_LETTERS = new Set(["ي", "ن", "م", "و"]);
const IDGHAM_NO_GHUNNAH_LETTERS = new Set(["ل", "ر"]);
const IQLAB_LETTER = "ب";
const SUKUN = "\u0652", SHADDA = "\u0651";
const TANWEEN = new Set(["\u064B", "\u064C", "\u064D"]);
const DAGGER_ALIF = "\u0670", MADDAH_SIGN = "\u0653";
const ARABIC_DIACRITIC_RE = /[\u064B-\u065F\u0670]/;

function tokenizeArabic(text) {
  const units = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (/\s/.test(ch)) { units.push({ base: null, space: true, raw: ch }); i++; continue; }
    let raw = ch, diacritics = "";
    i++;
    while (i < text.length && ARABIC_DIACRITIC_RE.test(text[i])) { diacritics += text[i]; raw += text[i]; i++; }
    units.push({ base: ch, diacritics, raw, space: false });
  }
  return units;
}

function classifyTajweed(text) {
  const units = tokenizeArabic(text);
  for (let idx = 0; idx < units.length; idx++) {
    const u = units[idx];
    if (u.space) continue;
    if ((u.base === "ن" || u.base === "م") && u.diacritics.includes(SHADDA)) { u.cls = "ghunnah"; continue; }
    if (QALQALAH_LETTERS.has(u.base) && u.diacritics.includes(SUKUN)) { u.cls = "qalqalah"; continue; }
    if (u.diacritics.includes(DAGGER_ALIF) || u.diacritics.includes(MADDAH_SIGN)) { u.cls = "madd"; continue; }
    const isNoonSakinah = u.base === "ن" && u.diacritics.includes(SUKUN);
    const hasTanween = [...u.diacritics].some((d) => TANWEEN.has(d));
    if (isNoonSakinah || hasTanween) {
      let j = idx + 1;
      while (j < units.length && units[j].space) j++;
      const next = units[j];
      if (next) {
        if (next.base === IQLAB_LETTER) u.cls = "iqlab";
        else if (IDGHAM_GHUNNAH_LETTERS.has(next.base)) u.cls = "idgham-ghunnah";
        else if (IDGHAM_NO_GHUNNAH_LETTERS.has(next.base)) u.cls = "idgham-no-ghunnah";
        else if (IKHFA_LETTERS.has(next.base)) u.cls = "ikhfa";
      }
    }
  }
  return units;
}

const TAJWEED_COLORS = {
  ghunnah: "#1E8E5A",
  ikhfa: "#2C7A99",
  "idgham-ghunnah": "#16A085",
  "idgham-no-ghunnah": "#6C3483",
  iqlab: "#B33771",
  qalqalah: "#E67E22",
  madd: "#C0392B",
};

function TajweedText({ text, className, style }) {
  const units = classifyTajweed(text);
  return (
    <p className={className} style={style} dir="rtl">
      {units.map((u, i) =>
        u.cls ? <span key={i} style={{ color: TAJWEED_COLORS[u.cls], fontWeight: 700 }}>{u.raw}</span> : <span key={i}>{u.raw}</span>
      )}
    </p>
  );
}

const TAJWEED_LEGEND = [
  { color: TAJWEED_COLORS.ghunnah, label: "Ghunnah" },
  { color: TAJWEED_COLORS.ikhfa, label: "Ikhfa" },
  { color: TAJWEED_COLORS["idgham-ghunnah"], label: "Idgham (with Ghunnah)" },
  { color: TAJWEED_COLORS["idgham-no-ghunnah"], label: "Idgham (without Ghunnah)" },
  { color: TAJWEED_COLORS.iqlab, label: "Iqlab" },
  { color: TAJWEED_COLORS.qalqalah, label: "Qalqalah" },
  { color: TAJWEED_COLORS.madd, label: "Madd" },
];

function Badge({ tone = "sample" }) {
  const styles = {
    sample: "bg-amber-50 text-amber-700 border-amber-200",
    verified: "bg-[#EAF4EF] text-[#176B4D] border-[#176B4D]/30",
    editorial: "bg-sky-50 text-sky-700 border-sky-200",
  };
  const label = { sample: "Sample data", verified: "Verified", editorial: "Editorial summary" };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${styles[tone]}`}>
      {tone === "verified" ? <ShieldCheck size={11} /> : <Info size={11} />}
      {label[tone]}
    </span>
  );
}

function SectionTitle({ eyebrow, title, sub, center }) {
  return (
    <div className={`mb-6 ${center ? "text-center" : ""}`}>
      {eyebrow && <div className="text-xs tracking-[0.2em] uppercase font-bold" style={{ color: COLORS.gold }}>{eyebrow}</div>}
      <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: "var(--heading)", fontFamily: "'Manrope', sans-serif" }}>{title}</h2>
      {sub && <p className={`text-sm md:text-base mt-2 opacity-70 ${center ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>{sub}</p>}
    </div>
  );
}

function Card({ children, className = "", ...rest }) {
  return (
    <div className={`rounded-2xl border border-black/[0.06] bg-white/90 dark:bg-[#0f1d17] dark:border-white/10 shadow-[0_1px_2px_rgba(18,60,44,0.04),0_8px_24px_-8px_rgba(18,60,44,0.10)] ${className}`} {...rest}>
      {children}
    </div>
  );
}

function IconBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} title={label} className="transition-transform active:scale-90" style={{ color: active ? COLORS.green : "inherit" }}>
      <Icon size={15} fill={active ? COLORS.green : "none"} />
    </button>
  );
}

export default function DeenHub() {
  useGoogleFonts();
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSurah, setActiveSurah] = useState(null);
  const [tasbih, setTasbih] = useState(0);
  const [zakatWealth, setZakatWealth] = useState("");
  const [toast, setToast] = useState(null);
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("deenhub-bookmarks") || "[]"); } catch { return []; }
  });
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [reciter, setReciter] = useState("ar.alafasy");
  const audioRef = useRef(null);
  const rtl = lang === "ar";

  // The Quran + Hadith text (~2.3MB) loads as a separate chunk in the background,
  // so the app shell (nav, home, tools) paints immediately instead of waiting on it.
  const [quranData, setQuranData] = useState(null);
  const [nawawiHadith, setNawawiHadith] = useState(null);
  useEffect(() => {
    import("./quranData.js").then((mod) => {
      setQuranData(mod.QURAN_DATA);
      setNawawiHadith(mod.NAWAWI_HADITH);
    });
  }, []);

  useEffect(() => { document.documentElement.dir = rtl ? "rtl" : "ltr"; }, [rtl]);
  useEffect(() => {
    try { localStorage.setItem("deenhub-bookmarks", JSON.stringify(bookmarks)); } catch { /* storage unavailable */ }
  }, [bookmarks]);

  const showToast = (msg) => { setToast(msg); clearTimeout(showToast._t); showToast._t = setTimeout(() => setToast(null), 2200); };

  const copyText = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta);
      }
      showToast(rtl ? "تم النسخ" : "Copied to clipboard");
    } catch { showToast(rtl ? "تعذر النسخ" : "Couldn't copy"); }
  };

  const shareText = async (text, title) => {
    if (navigator.share) {
      try { await navigator.share({ title, text }); return; } catch { return; }
    }
    copyText(text);
  };

  const isBookmarked = (id) => bookmarks.some((b) => b.id === id);
  const toggleBookmark = (item) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      if (exists) { showToast(rtl ? "أُزيل من المحفوظات" : "Removed from bookmarks"); return prev.filter((b) => b.id !== item.id); }
      showToast(rtl ? "أُضيف إلى المحفوظات" : "Saved to bookmarks");
      return [...prev, item];
    });
  };

  const playAyah = (globalAyahNumber, id) => {
    if (!audioRef.current) return;
    if (playingId === id) { audioRef.current.pause(); setPlayingId(null); return; }
    const url = `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalAyahNumber}.mp3`;
    audioRef.current.src = url;
    audioRef.current.play().catch(() => showToast(rtl ? "تعذر تشغيل الصوت (قد يتطلب اتصال إنترنت)" : "Couldn't play audio (may require an internet connection)"));
    setPlayingId(id);
    audioRef.current.onended = () => setPlayingId(null);
  };

  const doSearch = (q) => { setSearchQuery(q); setQuery(q); setPage("search"); setMenuOpen(false); };

  const actions = { showToast, copyText, shareText, isBookmarked, toggleBookmark, playAyah, playingId, reciter, setReciter, doSearch, goSurah: (n) => { setActiveSurah(n); setPage("quran"); }, setPage };

  const nav = [
    { id: "home", label: rtl ? "الرئيسية" : "Home" },
    { id: "quran", label: rtl ? "القرآن" : "Quran" },
    { id: "hadith", label: rtl ? "الحديث" : "Hadith" },
    { id: "learn", label: rtl ? "تعلم الإسلام" : "Learn Islam" },
    { id: "fiqh", label: rtl ? "الفقه والشريعة" : "Fiqh & Sharia" },
    { id: "scholars", label: rtl ? "العلماء" : "Scholars" },
    { id: "duas", label: rtl ? "الأدعية" : "Duas" },
    { id: "tools", label: rtl ? "أدوات" : "Tools" },
  ];

  const theme = dark
    ? { bg: "#0B1712", text: "#EAF4EF", card: "#0f1d17", sub: "#9fb8ab" }
    : { bg: COLORS.cream, text: COLORS.text, card: "#ffffff", sub: "#4b5b52" };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${dark ? "dark" : ""}`}
      style={{
        background: theme.bg,
        color: theme.text,
        fontFamily: rtl ? "'Amiri','Scheherazade New',serif" : "'Manrope',sans-serif",
        // CSS variable so any nested element can stay readable in both themes
        // without needing `dark` threaded through as a prop.
        "--heading": dark ? COLORS.lightGreen : COLORS.darkGreen,
      }}
      dir={rtl ? "rtl" : "ltr"}
    >
      <audio ref={audioRef} className="hidden" />

      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg flex items-center gap-2" style={{ background: COLORS.darkGreen }}>
          <Check size={14} /> {toast}
        </div>
      )}

      {authOpen && (
        <AuthModal rtl={rtl} onClose={() => setAuthOpen(false)} onSubmit={(name) => { setUser({ name }); setAuthOpen(false); showToast(rtl ? `أهلاً بك ${name}` : `Welcome, ${name}`); }} />
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: dark ? "rgba(11,23,18,0.9)" : "rgba(250,248,242,0.9)", boxShadow: `0 1px 0 ${COLORS.gold}55` }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button onClick={() => setPage("home")} className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.darkGreen})`, boxShadow: `0 0 0 2px ${COLORS.gold}55` }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 0l2.6 8.4L23 11l-8.4 2.6L12 22l-2.6-8.4L1 11l8.4-2.6z" fill={COLORS.gold} /></svg>
            </div>
            <span className="font-extrabold text-lg tracking-tight" style={{ color: dark ? COLORS.lightGreen : COLORS.darkGreen, fontFamily: "'Manrope',sans-serif" }}>DeenHub</span>
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            {nav.map((n) => (
              <button key={n.id} onClick={() => setPage(n.id)} className="relative py-1 transition-opacity hover:opacity-100"
                style={{ opacity: page === n.id ? 1 : 0.62, color: page === n.id ? COLORS.gold : "inherit" }}>
                {n.label}
                {page === n.id && <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full" style={{ background: COLORS.gold }} />}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border" style={{ borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(18,60,44,0.15)" }} onClick={() => setPage("search")}>
              <Search size={16} />
            </button>
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(18,60,44,0.15)" }} onClick={() => setPage("bookmarks")}>
              <Bookmark size={16} />
              {bookmarks.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center text-white font-bold" style={{ background: COLORS.gold }}>{bookmarks.length}</span>}
            </button>
            <button onClick={() => setLang(rtl ? "en" : "ar")} className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border text-xs font-bold" style={{ borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(18,60,44,0.15)" }}>
              {rtl ? "EN" : "AR"}
            </button>
            <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(18,60,44,0.15)" }}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {!user ? (
              <button onClick={() => setAuthOpen(true)} className="hidden sm:block px-4 py-2 rounded-full text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.darkGreen})` }}>
                {rtl ? "تسجيل الدخول" : "Sign in"}
              </button>
            ) : (
              <div className="relative hidden sm:block">
                <button onClick={() => setAccountMenu(!accountMenu)} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: COLORS.lightGreen, color: COLORS.darkGreen }}>
                  <User size={14} /> {user.name}
                </button>
                {accountMenu && (
                  <Card className="absolute mt-2 end-0 p-2 w-40 z-30">
                    <button onClick={() => { setPage("bookmarks"); setAccountMenu(false); }} className="w-full text-start px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-black/5"><Bookmark size={13} /> {rtl ? "المحفوظات" : "Bookmarks"}</button>
                    <button onClick={() => { setUser(null); setAccountMenu(false); showToast(rtl ? "تم تسجيل الخروج" : "Signed out"); }} className="w-full text-start px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-black/5 text-red-600"><LogOut size={13} /> {rtl ? "تسجيل الخروج" : "Sign out"}</button>
                  </Card>
                )}
              </div>
            )}
            <button className="lg:hidden w-9 h-9 flex items-center justify-center" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden px-4 pb-4 flex flex-col gap-1">
            {nav.map((n) => (
              <button key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false); }}
                className="text-start py-2 px-2 rounded-lg text-sm font-semibold" style={{ background: page === n.id ? COLORS.lightGreen : "transparent", color: page === n.id ? COLORS.darkGreen : "inherit" }}>
                {n.label}
              </button>
            ))}
            <button onClick={() => setLang(rtl ? "en" : "ar")} className="text-start py-2 px-2 rounded-lg text-sm font-semibold">{rtl ? "English" : "العربية"}</button>
            {!user ? (
              <button onClick={() => { setAuthOpen(true); setMenuOpen(false); }} className="text-start py-2 px-2 rounded-lg text-sm font-semibold" style={{ color: COLORS.green }}>{rtl ? "تسجيل الدخول" : "Sign in"}</button>
            ) : (
              <button onClick={() => { setUser(null); setMenuOpen(false); }} className="text-start py-2 px-2 rounded-lg text-sm font-semibold text-red-600">{rtl ? "تسجيل الخروج" : "Sign out"}</button>
            )}
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24">
        {page === "home" && <Home_ rtl={rtl} theme={theme} dark={dark} query={query} setQuery={setQuery} actions={actions} quranData={quranData} />}
        {page === "search" && <SearchPage rtl={rtl} theme={theme} initialQuery={searchQuery} actions={actions} quranData={quranData} nawawiHadith={nawawiHadith} />}
        {page === "quran" && <QuranPage rtl={rtl} theme={theme} activeSurah={activeSurah} setActiveSurah={setActiveSurah} actions={actions} quranData={quranData} />}
        {page === "hadith" && <HadithPage rtl={rtl} theme={theme} actions={actions} nawawiHadith={nawawiHadith} />}
        {page === "learn" && <LearnPage rtl={rtl} theme={theme} setPage={setPage} />}
        {page === "fiqh" && <FiqhPage rtl={rtl} theme={theme} />}
        {page === "scholars" && <ScholarsPage rtl={rtl} theme={theme} />}
        {page === "duas" && <DuasPage rtl={rtl} theme={theme} actions={actions} quranData={quranData} />}
        {page === "tools" && <ToolsPage rtl={rtl} theme={theme} tasbih={tasbih} setTasbih={setTasbih} zakatWealth={zakatWealth} setZakatWealth={setZakatWealth} actions={actions} quranData={quranData} />}
        {page === "bookmarks" && <BookmarksPage rtl={rtl} theme={theme} bookmarks={bookmarks} actions={actions} />}
      </main>

      <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t backdrop-blur-md z-40" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(18,60,44,0.08)", background: dark ? "rgba(11,23,18,0.92)" : "rgba(250,248,242,0.92)" }}>
        <div className="flex justify-around py-2">
          {[
            { id: "home", icon: Home, label: rtl ? "الرئيسية" : "Home" },
            { id: "quran", icon: BookOpen, label: rtl ? "القرآن" : "Quran" },
            { id: "search", icon: Search, label: rtl ? "بحث" : "Search" },
            { id: "learn", icon: GraduationCap, label: rtl ? "تعلم" : "Learn" },
            { id: "tools", icon: Compass, label: rtl ? "أدوات" : "Tools" },
          ].map((t) => (
            <button key={t.id} onClick={() => setPage(t.id)} className="flex flex-col items-center gap-0.5 px-2 py-1" style={{ color: page === t.id ? COLORS.green : "#8a9a90" }}>
              <t.icon size={18} />
              <span className="text-[10px] font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <footer className="border-t py-8 pb-24 lg:pb-8 text-center text-xs opacity-60" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(18,60,44,0.08)" }}>
        <p>DeenHub — {rtl ? "بوابتك الموثوقة للمعرفة الإسلامية" : "Your trusted gateway to Islamic knowledge"}. {rtl ? "لا يصدر هذا الموقع فتاوى؛ جميع المحتويات الدينية مصدرها موثق." : "This platform does not issue its own fatwas — all religious content displays its original source."}</p>
        <p className="mt-2 font-semibold">{rtl ? "تم إنشاؤه بواسطة ريان لقيس" : "Made by Rayan Lakkis"}</p>
      </footer>
    </div>
  );
}

/* ---------------- AUTH MODAL ---------------- */
function AuthModal({ rtl, onClose, onSubmit }) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#0f1d17] rounded-2xl p-6 w-full max-w-sm">
        <h3 className="font-bold text-lg mb-1" style={{ color: "var(--heading)" }}>{rtl ? "تسجيل الدخول" : "Sign in to DeenHub"}</h3>
        <p className="text-xs opacity-60 mb-4">{rtl ? "هذا تسجيل دخول تجريبي محلي لعرض المحفوظات والتقدم." : "This is a local demo sign-in used to unlock bookmarks and progress in this prototype."}</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={rtl ? "اسمك" : "Your name"}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none mb-3" style={{ borderColor: COLORS.green + "40" }} autoFocus
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onSubmit(name.trim())} />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-full border text-sm font-bold" style={{ borderColor: COLORS.green + "40" }}>{rtl ? "إلغاء" : "Cancel"}</button>
          <button disabled={!name.trim()} onClick={() => name.trim() && onSubmit(name.trim())} className="flex-1 py-2 rounded-full text-sm font-bold text-white disabled:opacity-40" style={{ background: COLORS.green }}>{rtl ? "دخول" : "Continue"}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HOME ---------------- */
function Home_({ rtl, theme, dark, query, setQuery, actions, quranData }) {
  const [showSuggest, setShowSuggest] = useState(false);
  const suggestions = [
    rtl ? "ما الذي ينقض الوضوء؟" : "What breaks wudu?",
    rtl ? "سورة الكهف" : "Surah Al-Kahf",
    rtl ? "أركان الإيمان" : "Aqeedah — Articles of Faith",
    rtl ? "كيف أصلي؟" : "How to pray?",
    rtl ? "الزكاة" : "Zakat calculation",
  ];
  const categories = [
    { icon: BookOpen, title: rtl ? "القرآن" : "Quran", desc: rtl ? "اقرأ القرآن كاملاً مع الترجمة والصوت والتجويد الملوّن." : "Read the full Quran offline with translation, audio and tajweed colors.", cta: rtl ? "قراءة" : "Read Quran", onClick: () => actions.setPage("quran") },
    { icon: Headphones, title: rtl ? "الحديث" : "Hadith", desc: rtl ? "الأربعون النووية كاملة، وبحث موسّع في المجموعات الكبرى." : "The full 40 Hadith of an-Nawawi, plus wider live collection search.", cta: rtl ? "بحث" : "Search Hadith", onClick: () => actions.setPage("hadith") },
    { icon: GraduationCap, title: rtl ? "تعلم الإسلام" : "Learn Islam", desc: rtl ? "تعلم إسلامي منظم من المبتدئ إلى المتقدم." : "Structured Islamic learning from beginner to advanced.", cta: rtl ? "ابدأ" : "Start Learning", onClick: () => actions.setPage("learn") },
    { icon: Compass, title: rtl ? "العقيدة والفقه" : "Aqeedah & Fiqh", desc: rtl ? "أركان الإيمان والإسلام، والأحكام الفقهية المقارنة." : "Articles of Faith, Pillars of Islam, and comparative fiqh topics.", cta: rtl ? "استكشف" : "Explore Topics", onClick: () => actions.setPage("fiqh") },
    { icon: Users, title: rtl ? "العلماء" : "Scholars", desc: rtl ? "أئمة المذاهب الأربعة وعلماء موثوقون." : "The four madhhab founders and other verified scholars.", cta: rtl ? "تصفح العلماء" : "Browse Scholars", onClick: () => actions.setPage("scholars") },
    { icon: Heart, title: rtl ? "الأدعية والأذكار" : "Duas & Adhkar", desc: rtl ? "أدعية موثقة المصدر من القرآن والسنة." : "Duas with real, cited sources from Quran and Sunnah.", cta: rtl ? "استعراض" : "Browse Duas", onClick: () => actions.setPage("duas") },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative -mx-4 px-4 pt-14 md:pt-24 pb-14 text-center overflow-hidden rounded-b-[2.5rem]" style={{ background: dark ? "linear-gradient(180deg, #0d1f18, #0B1712)" : `linear-gradient(180deg, ${COLORS.lightGreen} 0%, ${COLORS.cream} 75%)` }}>
        <StarPattern opacity={dark ? 0.05 : 0.07} color={COLORS.green} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: dark ? "rgba(199,169,90,0.15)" : "#fff", color: COLORS.gold, border: `1px solid ${COLORS.gold}55` }}>
            <Sparkles size={12} /> {rtl ? "بوابة إسلامية واحدة موثوقة" : "One trusted Islamic gateway"}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] max-w-3xl mx-auto" style={{ color: "var(--heading)", fontFamily: "'Manrope',sans-serif" }}>
            {rtl ? "كل ما تحتاجه لتعلم الإسلام، في مكان واحد" : "Everything You Need to Learn Islam, In One Place"}
          </h1>
          <p className="mt-5 text-base opacity-70 max-w-xl mx-auto">
            {rtl ? "استكشف القرآن والحديث والفقه والعلماء الموثوقين والأدعية عبر منصة منظمة واحدة." : "Explore the Quran, Hadith, Fiqh, trusted scholars, and Islamic resources through one organized platform."}
          </p>

          <div className="relative max-w-xl mx-auto mt-9">
            <form onSubmit={(e) => { e.preventDefault(); if (query.trim()) actions.doSearch(query.trim()); }} className="flex items-center gap-2 px-5 py-3.5 rounded-full border shadow-lg" style={{ borderColor: COLORS.gold + "55", background: theme.card }}>
              <Search size={18} style={{ color: COLORS.green }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggest(true)}
                onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                placeholder={rtl ? "ابحث في القرآن، الحديث، العقيدة، الفقه، الأدعية..." : "Search Quran, Hadith, Aqeedah, Fiqh, Duas..."}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button type="submit" className="text-xs font-bold px-4 py-2 rounded-full text-white shrink-0" style={{ background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.darkGreen})` }}>{rtl ? "بحث" : "Search"}</button>
            </form>
            {showSuggest && (
              <Card className="absolute mt-2 w-full text-start p-2 z-30">
                {suggestions.map((s, i) => (
                  <button key={i} onMouseDown={() => actions.doSearch(s)} className="w-full text-start px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-black/5">
                    <Search size={13} className="opacity-50" /> {s}
                  </button>
                ))}
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {categories.map((c, i) => (
          <Card key={i} className="p-5 flex flex-col relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${COLORS.gold}, transparent)` }} />
            <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3" style={{ background: `radial-gradient(circle, ${COLORS.lightGreen}, transparent)`, boxShadow: `inset 0 0 0 1.5px ${COLORS.gold}66` }}>
              <c.icon size={19} color={COLORS.green} />
            </div>
            <h3 className="font-bold text-base" style={{ color: "var(--heading)" }}>{c.title}</h3>
            <p className="text-sm opacity-70 mt-1 flex-1">{c.desc}</p>
            <button onClick={c.onClick} className="mt-4 text-xs font-bold px-4 py-2 rounded-full text-white self-start" style={{ background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.darkGreen})` }}>{c.cta}</button>
          </Card>
        ))}
      </section>

      <GoldDivider />

      {/* TODAY'S SURAH (pulled directly from embedded Quran data — Al-Ikhlas, 112) */}
      <section>
        <SectionTitle eyebrow={rtl ? "سورة اليوم" : "Today's Surah"} title={rtl ? "سورة الإخلاص" : "Al-Ikhlas"} />
        {!quranData ? (
          <Card className="p-8 flex items-center justify-center gap-2 text-sm opacity-60"><Loader2 size={16} className="animate-spin" /> {rtl ? "جاري التحميل..." : "Loading…"}</Card>
        ) : (() => {
          const ayahs = quranData["112"];
          return (
            <Card className="p-6 md:p-8 relative overflow-hidden">
              <StarPattern opacity={0.04} />
              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <Badge tone="verified" />
                  <button onClick={() => actions.goSurah(112)} className="text-xs font-bold flex items-center gap-1" style={{ color: COLORS.green }}>
                    {rtl ? "افتح السورة" : "Open Surah"} <ChevronRight size={12} className={rtl ? "rotate-180" : ""} />
                  </button>
                </div>
                {ayahs.map(([num, ar, en]) => (
                  <div key={num} className="mb-3">
                    <p className="text-2xl md:text-3xl leading-loose text-right" style={{ fontFamily: "'Amiri Quran','Amiri',serif", color: "var(--heading)" }} dir="rtl">{ar}</p>
                    <p className="text-sm opacity-75 mt-1">{en}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs font-bold" style={{ color: COLORS.gold }}>Quran 112</p>
                  <div className="flex gap-3 opacity-70">
                    <IconBtn icon={Copy} onClick={() => actions.copyText(ayahs.map(([n, ar, en]) => `${ar}\n${en}`).join("\n\n") + "\nQuran 112")} label="Copy" />
                    <IconBtn icon={Share2} onClick={() => actions.shareText(ayahs.map(([n, ar, en]) => en).join(" "), "Al-Ikhlas")} label="Share" />
                    <IconBtn icon={Bookmark} active={actions.isBookmarked("ikhlas")} onClick={() => actions.toggleBookmark({ id: "ikhlas", type: "Quran", title: "Al-Ikhlas", sub: "Quran 112" })} label="Bookmark" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })()}
      </section>

      <GoldDivider />

      <section>
        <SectionTitle eyebrow={rtl ? "جديد" : "Just Starting Out"} title={rtl ? "جديد في الإسلام" : "New to Islam"} sub={rtl ? "رحلة تعلم بسيطة للمبتدئين." : "A simple, beginner-friendly learning journey."} />
        <Card className="p-5">
          <ol className="grid sm:grid-cols-2 gap-3 text-sm">
            {["What is Islam?", "Who is Allah?", "Who is Prophet Muhammad ﷺ?", "The Shahada", "How to perform Wudu", "How to Pray", "The Five Pillars", "Daily duas"].map((s, i) => (
              <li key={i} className="flex items-center gap-3 py-1.5">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: COLORS.lightGreen, color: COLORS.green }}>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section className="mt-12 mb-6">
        <SectionTitle eyebrow={rtl ? "موارد" : "Directory"} title={rtl ? "مصادر إسلامية موثوقة" : "Trusted Islamic Resources"} />
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name: "Quran.com", url: "https://quran.com", cat: rtl ? "القرآن" : "Quran" },
            { name: "Sunnah.com", url: "https://sunnah.com", cat: rtl ? "الحديث" : "Hadith" },
            { name: "IslamQA.info", url: "https://islamqa.info", cat: rtl ? "فتوى" : "Fatwa" },
          ].map((w, i) => (
            <a key={i} href={w.url} target="_blank" rel="noreferrer">
              <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">{w.name} <ShieldCheck size={13} color={COLORS.green} /></div>
                  <div className="text-xs opacity-60 mt-0.5">{w.cat}</div>
                </div>
                <ExternalLink size={15} className="opacity-50" />
              </Card>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- Live enhancement helpers (optional, graceful) ---------------- */
const hadithBookCache = {};
async function getHadithBook(slug) {
  if (hadithBookCache[slug]) return hadithBookCache[slug];
  const res = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${slug}.min.json`);
  if (!res.ok) throw new Error("hadith fetch failed");
  const data = await res.json();
  const hadiths = data.hadiths || [];
  hadithBookCache[slug] = hadiths;
  return hadiths;
}
const HADITH_COLLECTIONS = [
  { slug: "bukhari", name: "Sahih al-Bukhari" },
  { slug: "muslim", name: "Sahih Muslim" },
  { slug: "abudawud", name: "Sunan Abu Dawud" },
  { slug: "tirmidhi", name: "Jami at-Tirmidhi" },
  { slug: "nasai", name: "Sunan an-Nasa'i" },
  { slug: "ibnmajah", name: "Sunan Ibn Majah" },
  { slug: "malik", name: "Muwatta Malik" },
];
async function fetchJSON(url, ms = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

/* ---------------- SEARCH (instant local Quran + Nawawi Hadith, no network needed) ---------------- */
function SearchPage({ rtl, theme, initialQuery, actions, quranData, nawawiHadith }) {
  const [q, setQ] = useState(initialQuery || "");
  const [tab, setTab] = useState("all");
  useEffect(() => setQ(initialQuery || ""), [initialQuery]);

  const AQEEDAH_FIQH_INDEX = [
    { id: "aq-articles", title: "The Six Articles of Faith (Aqeedah)", sub: "Belief in Allah, His Angels, His Books, His Messengers, the Last Day, and Divine Decree", onClick: () => actions.setPage("fiqh") },
    { id: "aq-pillars", title: "The Five Pillars of Islam", sub: "Shahada, Salah, Zakat, Sawm, Hajj", onClick: () => actions.setPage("fiqh") },
    { id: "aq-wudu", title: "Does bleeding break wudu? (Fiqh)", sub: "Comparative Hanafi / Maliki / Shafi'i / Hanbali positions", onClick: () => actions.setPage("fiqh") },
    { id: "aq-sharia", title: "Sharia — sources and scope", sub: "Quran, Sunnah, Ijma, Qiyas — editorial overview", onClick: () => actions.setPage("fiqh") },
  ];

  const results = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql || ql.length < 2) return { quran: [], hadith: [], surahNames: [], aqeedah: [], scholars: [], duas: [] };

    const quran = [];
    if (quranData) {
      for (const surah of SURAH_LIST) {
        const ayahs = quranData[String(surah[2])] || [];
        for (const [num, ar, en] of ayahs) {
          if (en.toLowerCase().includes(ql) || ar.includes(q.trim())) {
            quran.push({ surahNum: surah[2], surahName: surah[1], num, ar, en });
            if (quran.length >= 8) break;
          }
        }
        if (quran.length >= 8) break;
      }
    }

    const hadith = nawawiHadith ? nawawiHadith.filter((h) => h.en.toLowerCase().includes(ql)).slice(0, 8) : [];
    const surahNames = SURAH_LIST.filter((s) => s[1].toLowerCase().includes(ql) || s[0].includes(q.trim())).map((s) => ({ id: `s${s[2]}`, title: `${s[1]} (${s[0]})`, sub: `Surah ${s[2]} · ${s[3]} ayat`, onClick: () => actions.goSurah(s[2]) }));
    const aqeedah = AQEEDAH_FIQH_INDEX.filter((i) => i.title.toLowerCase().includes(ql) || i.sub.toLowerCase().includes(ql));
    const scholars = SCHOLARS.filter((s) => s.name.toLowerCase().includes(ql) || s.specialty.toLowerCase().includes(ql)).map((s) => ({ id: s.id, title: s.name, sub: s.specialty, onClick: () => actions.setPage("scholars") }));
    const duas = DUA_LIST.filter((d) => d.translit.toLowerCase().includes(ql) || d.en.toLowerCase().includes(ql) || d.category.toLowerCase().includes(ql)).map((d) => ({ id: d.id, title: d.translit, sub: d.en.slice(0, 50) + "…", onClick: () => actions.setPage("duas") }));

    return { quran, hadith, surahNames, aqeedah, scholars, duas };
  }, [q, quranData, nawawiHadith]);

  const total = Object.values(results).reduce((a, b) => a + b.length, 0);
  const tabs = [
    { id: "all", label: rtl ? "الكل" : "All" },
    { id: "quran", label: rtl ? "القرآن" : "Quran" },
    { id: "hadith", label: rtl ? "الحديث" : "Hadith" },
    { id: "aqeedah", label: rtl ? "العقيدة والفقه" : "Aqeedah & Fiqh" },
    { id: "scholars", label: rtl ? "العلماء" : "Scholars" },
    { id: "duas", label: rtl ? "الأدعية" : "Duas" },
  ];

  return (
    <div className="pt-8">
      <SectionTitle eyebrow={rtl ? "بحث" : "Global Search"} title={rtl ? "ابحث في DeenHub" : "Search DeenHub"} sub={rtl ? "بحث فوري في القرآن الكامل والأربعين النووية، بدون حاجة للإنترنت." : "Instant search across the full Quran and Nawawi's 40 Hadith — works offline."} />
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border mb-4" style={{ borderColor: COLORS.green + "30" }}>
        <Search size={14} className="opacity-50" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={rtl ? "اكتب للبحث..." : "Type to search..."} className="bg-transparent outline-none text-sm flex-1" />
        {!quranData && <Loader2 size={14} className="animate-spin opacity-40" />}
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap" style={{ background: tab === t.id ? COLORS.green : "transparent", color: tab === t.id ? "#fff" : "inherit", border: tab === t.id ? "none" : `1px solid ${COLORS.green}30` }}>
            {t.label}
          </button>
        ))}
      </div>

      {q.trim().length < 2 && <p className="text-sm opacity-60">{rtl ? "ابدأ الكتابة لرؤية نتائج فورية." : "Start typing to see instant results."}</p>}
      {q.trim().length >= 2 && total === 0 && <p className="text-sm opacity-60">{rtl ? "لا توجد نتائج." : "No results found."}</p>}

      {(tab === "all" || tab === "quran") && results.quran.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2"><div className="text-xs uppercase tracking-wide font-bold opacity-50">{rtl ? "آيات مطابقة" : "Matching Quran verses"}</div><Badge tone="verified" /></div>
          <div className="space-y-2.5">
            {results.quran.map((m, i) => (
              <Card key={i} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => actions.goSurah(m.surahNum)}>
                <div className="text-sm">{m.en}</div>
                <div className="text-xs opacity-50 mt-1">{m.surahName} {m.surahNum}:{m.num} · Abdullah Yusuf Ali translation</div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {(tab === "all" || tab === "quran") && results.surahNames.length > 0 && (
        <div className="mb-6 grid sm:grid-cols-2 gap-2.5">
          {results.surahNames.map((it) => (
            <Card key={it.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={it.onClick}>
              <div className="font-bold text-sm">{it.title}</div>
              <div className="text-xs opacity-50 mt-0.5">{it.sub}</div>
            </Card>
          ))}
        </div>
      )}
      {(tab === "all" || tab === "hadith") && results.hadith.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2"><div className="text-xs uppercase tracking-wide font-bold opacity-50">{rtl ? "أحاديث مطابقة (الأربعون النووية)" : "Matching Hadith (Nawawi's 40)"}</div><Badge tone="verified" /></div>
          <div className="space-y-2.5">
            {results.hadith.map((h) => (
              <Card key={h.n} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => actions.setPage("hadith")}>
                <div className="text-sm">{h.en}</div>
                <div className="text-xs opacity-50 mt-1">Hadith #{h.n} of 42, an-Nawawi</div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {["aqeedah", "scholars", "duas"].map((cat) => (tab === "all" || tab === cat) && results[cat].length > 0 && (
        <div key={cat} className="mb-6">
          {tab === "all" && <div className="text-xs uppercase tracking-wide font-bold opacity-50 mb-2">{cat}</div>}
          <div className="grid sm:grid-cols-2 gap-2.5">
            {results[cat].map((it) => (
              <Card key={it.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={it.onClick}>
                <div className="font-bold text-sm">{it.title}</div>
                <div className="text-xs opacity-50 mt-0.5">{it.sub}</div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- QURAN (fully embedded — opens instantly, no fetch, no failure state) ---------------- */
function QuranPage({ rtl, theme, activeSurah, setActiveSurah, actions, quranData }) {
  const [filter, setFilter] = useState("");
  const [tajweed, setTajweed] = useState(false);
  const [fontSize, setFontSize] = useState(28);
  const surah = SURAH_LIST.find((s) => s[2] === activeSurah);
  const filtered = SURAH_LIST.filter((s) => s[1].toLowerCase().includes(filter.toLowerCase()) || s[0].includes(filter));

  if (activeSurah && surah && !quranData) {
    return (
      <div className="pt-8">
        <button onClick={() => setActiveSurah(null)} className="flex items-center gap-1 text-sm font-bold mb-4" style={{ color: COLORS.green }}>
          <ArrowLeft size={14} className={rtl ? "rotate-180" : ""} /> {rtl ? "كل السور" : "All Surahs"}
        </button>
        <Card className="p-10 flex items-center justify-center gap-2 text-sm opacity-60"><Loader2 size={18} className="animate-spin" /> {rtl ? "جاري تحميل نص القرآن..." : "Loading Quran text…"}</Card>
      </div>
    );
  }

  if (activeSurah && surah) {
    const ayahs = quranData[String(activeSurah)] || [];
    return (
      <div className="pt-8">
        <button onClick={() => setActiveSurah(null)} className="flex items-center gap-1 text-sm font-bold mb-4" style={{ color: COLORS.green }}>
          <ArrowLeft size={14} className={rtl ? "rotate-180" : ""} /> {rtl ? "كل السور" : "All Surahs"}
        </button>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--heading)" }}>{surah[1]} <span className="opacity-50 font-normal">· {surah[0]}</span></h1>
          <Badge tone="verified" />
        </div>
        <p className="text-sm opacity-60 mb-4">{surah[3]} {rtl ? "آية" : "ayat"} · {surah[4]}</p>

        <div className="sticky top-16 z-20 mb-5 flex flex-wrap items-center gap-3 p-3 rounded-2xl backdrop-blur-md" style={{ background: theme.card + "ee", boxShadow: "0 2px 12px rgba(18,60,44,0.08)" }}>
          <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: COLORS.lightGreen }}>
            <button onClick={() => setTajweed(false)} className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: !tajweed ? "#fff" : "transparent", color: !tajweed ? COLORS.darkGreen : COLORS.green, boxShadow: !tajweed ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
              <Type size={12} /> {rtl ? "عادي" : "Normal"}
            </button>
            <button onClick={() => setTajweed(true)} className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: tajweed ? "#fff" : "transparent", color: tajweed ? COLORS.darkGreen : COLORS.green, boxShadow: tajweed ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
              <Palette size={12} /> {rtl ? "تجويد ملون" : "Tajweed colors"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-60">{rtl ? "القارئ:" : "Reciter:"}</span>
            <select value={actions.reciter} onChange={(e) => actions.setReciter(e.target.value)} className="text-xs px-2 py-1 rounded-lg border bg-transparent" style={{ borderColor: COLORS.green + "30" }}>
              {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1 ms-auto">
            <button onClick={() => setFontSize((f) => Math.max(18, f - 2))} className="w-7 h-7 rounded-full border text-xs font-bold" style={{ borderColor: COLORS.green + "30" }}>A-</button>
            <button onClick={() => setFontSize((f) => Math.min(44, f + 2))} className="w-7 h-7 rounded-full border text-xs font-bold" style={{ borderColor: COLORS.green + "30" }}>A+</button>
          </div>
        </div>

        {tajweed && (
          <div className="flex flex-wrap gap-3 mb-4 text-[11px]">
            {TAJWEED_LEGEND.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />{l.label}</span>
            ))}
            <span className="opacity-50">— {rtl ? "تلوين تعليمي مبسّط، وليس بديلاً عن تعلم التجويد من معلم مؤهل." : "simplified educational coloring, not a substitute for learning tajweed from a qualified teacher."}</span>
          </div>
        )}

        {ayahs.map(([num, ar, en]) => {
          const id = `s${activeSurah}-a${num}`;
          const playing = actions.playingId === id;
          const cite = `Quran ${activeSurah}:${num}`;
          const globalAyah = SURAH_OFFSETS[activeSurah - 1] + num;
          return (
            <Card key={num} className="p-5 mb-3">
              <div className="flex justify-between items-center mb-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: COLORS.lightGreen, color: COLORS.green, border: `1px solid ${COLORS.gold}55` }}>{num}</span>
                <div className="flex gap-3 items-center opacity-80">
                  <IconBtn icon={playing ? Pause : Play} onClick={() => actions.playAyah(globalAyah, id)} label="Play" />
                  <IconBtn icon={Bookmark} active={actions.isBookmarked(id)} onClick={() => actions.toggleBookmark({ id, type: "Quran", title: `${surah[1]}, Ayah ${num}`, sub: en.slice(0, 40) + "…" })} label="Bookmark" />
                  <IconBtn icon={Copy} onClick={() => actions.copyText(`${ar}\n${en}\n(${cite})`)} label="Copy" />
                  <IconBtn icon={Share2} onClick={() => actions.shareText(`${en}\n(${cite})`, cite)} label="Share" />
                </div>
              </div>
              {tajweed ? (
                <TajweedText text={ar} className="leading-loose text-right" style={{ fontSize, fontFamily: "'Amiri Quran','Amiri',serif" }} />
              ) : (
                <p className="leading-loose text-right" dir="rtl" style={{ fontSize, fontFamily: "'Amiri Quran','Amiri',serif", color: "var(--heading)" }}>{ar}</p>
              )}
              <p className="text-sm opacity-75 mt-3">{en}</p>
              <p className="text-xs mt-2 opacity-50">{cite} · Abdullah Yusuf Ali translation · Audio: {RECITERS.find((r) => r.id === actions.reciter)?.name}</p>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="pt-8">
      <SectionTitle eyebrow={rtl ? "القرآن الكريم" : "The Noble Quran"} title={rtl ? "تصفح السور" : "Browse Surahs"} sub={rtl ? "114 سورة كاملة، محفوظة في التطبيق — تُفتح فورًا بدون إنترنت." : "All 114 Surahs, fully embedded — open instantly, no internet required."} />
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: COLORS.green + "30" }}>
          <Search size={14} className="opacity-50" />
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={rtl ? "بحث عن سورة..." : "Search a surah..."} className="bg-transparent outline-none text-sm flex-1" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {filtered.map((s, i) => (
          <Card key={i} className="p-4 flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all" onClick={() => setActiveSurah(s[2])}>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0" style={{ background: `radial-gradient(circle, ${COLORS.lightGreen}, transparent)`, color: COLORS.green, boxShadow: `inset 0 0 0 1.5px ${COLORS.gold}77` }}>{s[2]}</span>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5">{s[1]} <ShieldCheck size={12} color={COLORS.green} /></div>
                <div className="text-xs opacity-50">{s[3]} {rtl ? "آية" : "ayat"} · {s[4]}</div>
              </div>
            </div>
            <span className="text-lg" dir="rtl" style={{ fontFamily: "'Amiri',serif", color: "var(--heading)" }}>{s[0]}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Real embedded reference data: Scholars & Duas ---------------- */
const SCHOLARS = [
  { id: "abuhanifa", name: "Imam Abu Hanifa", arName: "أبو حنيفة", years: "699–767 CE (80–148 AH)", specialty: "Founder, Hanafi school of Fiqh", bio: "Nu'man ibn Thabit, known as Abu Hanifa, was born and taught in Kufa, Iraq. His students systematized his legal reasoning into the Hanafi madhhab, today the most widely followed school of Islamic jurisprudence, especially across South and Central Asia, Turkey, and the Balkans." },
  { id: "malik", name: "Imam Malik ibn Anas", arName: "مالك بن أنس", years: "711–795 CE (93–179 AH)", specialty: "Founder, Maliki school of Fiqh", bio: "Malik ibn Anas taught in Madinah for most of his life and authored al-Muwatta, one of the earliest surviving works of Islamic law and hadith. The Maliki school is prevalent today across North and West Africa." },
  { id: "shafii", name: "Imam al-Shafi'i", arName: "الشافعي", years: "767–820 CE (150–204 AH)", specialty: "Founder, Shafi'i school of Fiqh", bio: "Muhammad ibn Idris al-Shafi'i studied under Malik in Madinah and later taught in Egypt. He is especially known for formalizing the methodology (usul al-fiqh) of Islamic legal reasoning. The Shafi'i school is widespread in East Africa, Yemen, and Southeast Asia." },
  { id: "hanbal", name: "Imam Ahmad ibn Hanbal", arName: "أحمد بن حنبل", years: "780–855 CE (164–241 AH)", specialty: "Founder, Hanbali school of Fiqh", bio: "Ahmad ibn Hanbal, a student of al-Shafi'i, taught in Baghdad and compiled the hadith collection Musnad Ahmad. The Hanbali school, known for close adherence to textual sources, predominates in Saudi Arabia today." },
];

const DUA_LIST = [
  { id: "dua-tasbih", category: "General remembrance", ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", translit: "Subḥān Allāhi wa biḥamdih", en: "Glory be to Allah and praise be to Him.", ref: "Sahih al-Bukhari & Sahih Muslim" },
  { id: "dua-bismillah", category: "Before eating / starting anything", ar: "بِسْمِ اللَّهِ", translit: "Bismillah", en: "In the name of Allah.", ref: "Widely reported, e.g. Sunan Abu Dawud" },
  { id: "dua-alhamdulillah", category: "General praise", ar: "الْحَمْدُ لِلَّهِ", translit: "Alhamdulillah", en: "Praise be to Allah.", ref: "Recurring Quranic and Sunnah phrase" },
  { id: "dua-astaghfirullah", category: "Seeking forgiveness", ar: "أَسْتَغْفِرُ اللَّهَ", translit: "Astaghfirullah", en: "I seek forgiveness from Allah.", ref: "Widely reported in the Sunnah" },
  { id: "dua-lahawla", category: "In distress / difficulty", ar: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", translit: "La hawla wala quwwata illa billah", en: "There is no power and no strength except with Allah.", ref: "Sahih al-Bukhari & Sahih Muslim" },
];

/* ---------------- HADITH: Nawawi's 40 embedded + optional wider live search ---------------- */
function HadithPage({ rtl, theme, actions, nawawiHadith }) {
  const [tab, setTab] = useState("nawawi"); // "nawawi" | "wider"
  const [q, setQ] = useState("");
  const [collection, setCollection] = useState("bukhari");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nawawiMatches = useMemo(() => {
    if (!nawawiHadith) return [];
    const ql = q.trim().toLowerCase();
    if (!ql) return nawawiHadith;
    return nawawiHadith.filter((h) => h.en.toLowerCase().includes(ql));
  }, [q, nawawiHadith]);

  const runWiderSearch = async () => {
    if (!q.trim()) return;
    setLoading(true); setError(null); setResults(null);
    try {
      const book = await getHadithBook(collection);
      const ql = q.trim().toLowerCase();
      const matches = book.filter((h) => h.text && h.text.toLowerCase().includes(ql)).slice(0, 20);
      setResults(matches);
    } catch (e) {
      setError(rtl ? "تعذر تحميل بيانات هذه المجموعة عبر الإنترنت. الأربعون النووية متوفرة دائمًا بدون إنترنت." : "Couldn't load this collection over the network. Nawawi's 40 above always works offline.");
    }
    setLoading(false);
  };

  return (
    <div className="pt-8">
      <SectionTitle eyebrow={rtl ? "الحديث" : "Hadith"} title={rtl ? "مكتبة الحديث" : "Hadith Library"} sub={rtl ? "الأربعون النووية كاملة ومضمّنة في التطبيق — تعمل بدون إنترنت." : "Nawawi's Forty Hadith, fully embedded — works offline, always."} />

      <div className="flex items-center gap-1 p-1 rounded-full mb-5 max-w-md" style={{ background: COLORS.lightGreen }}>
        <button onClick={() => setTab("nawawi")} className="flex-1 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: tab === "nawawi" ? "#fff" : "transparent", color: COLORS.darkGreen }}>{rtl ? "الأربعون النووية" : "Nawawi's 40 (offline)"}</button>
        <button onClick={() => setTab("wider")} className="flex-1 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: tab === "wider" ? "#fff" : "transparent", color: COLORS.darkGreen }}>{rtl ? "بحث موسّع" : "Wider search (online)"}</button>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border mb-5" style={{ borderColor: COLORS.green + "30" }}>
        <Search size={14} className="opacity-50" />
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => tab === "wider" && e.key === "Enter" && runWiderSearch()} placeholder={rtl ? "بحث بالكلمة المفتاحية..." : "Search by keyword..."} className="bg-transparent outline-none text-sm flex-1" />
        {tab === "wider" && (
          <>
            <select value={collection} onChange={(e) => setCollection(e.target.value)} className="text-xs px-2 py-1 rounded-lg border bg-transparent" style={{ borderColor: COLORS.green + "30" }}>
              {HADITH_COLLECTIONS.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <button onClick={runWiderSearch} disabled={loading} className="px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5" style={{ background: COLORS.green }}>
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />} {rtl ? "بحث" : "Go"}
            </button>
          </>
        )}
      </div>

      {tab === "nawawi" && (
        <>
          {!nawawiHadith && <Card className="p-8 flex items-center justify-center gap-2 text-sm opacity-60"><Loader2 size={16} className="animate-spin" /> {rtl ? "جاري التحميل..." : "Loading…"}</Card>}
          {nawawiHadith && nawawiMatches.length === 0 && <p className="text-sm opacity-60">{rtl ? "لا توجد نتائج." : "No matches."}</p>}
          {nawawiMatches.map((h) => {
            const id = `nawawi-${h.n}`;
            return (
              <Card key={h.n} className="p-5 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: COLORS.lightGreen, color: COLORS.green }}>{rtl ? `حديث ${h.n} من ٤٢` : `Hadith ${h.n} of 42`}</span>
                  <div className="flex gap-3 opacity-70">
                    <IconBtn icon={Copy} onClick={() => actions.copyText(`${h.ar}\n${h.en}\n(Nawawi's 40, #${h.n})`)} label="Copy" />
                    <IconBtn icon={Bookmark} active={actions.isBookmarked(id)} onClick={() => actions.toggleBookmark({ id, type: "Hadith", title: `Nawawi's 40, Hadith ${h.n}`, sub: h.en.slice(0, 50) + "…" })} label="Bookmark" />
                    <IconBtn icon={Share2} onClick={() => actions.shareText(h.en, `Nawawi's 40, Hadith ${h.n}`)} label="Share" />
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-right mb-3" dir="rtl" style={{ fontFamily: "'Amiri',serif" }}>{h.ar}</p>
                <p className="text-sm opacity-90 leading-relaxed">{h.en}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-xs opacity-60">
                  <span>Nawawi's Forty Hadith</span><span>·</span><span>#{h.n}</span><span>·</span><Badge tone="verified" />
                </div>
              </Card>
            );
          })}
        </>
      )}

      {tab === "wider" && (
        <>
          {error && <Card className="p-4 mb-4 text-sm flex items-start gap-2"><Info size={15} className="mt-0.5 shrink-0 text-amber-600" /><span>{error}</span></Card>}
          {!results && !loading && !error && (
            <Card className="p-4 mb-4 text-sm flex items-start gap-2">
              <Info size={15} className="mt-0.5 shrink-0 text-amber-600" />
              <span>{rtl ? "بحث موسّع في المجموعات الكبرى عبر مجموعة بيانات مفتوحة مصدرها sunnah.com (يتطلب اتصالاً بالإنترنت)." : "Wider search across the major collections via an open dataset sourced from sunnah.com (requires an internet connection)."}</span>
            </Card>
          )}
          {results && results.length === 0 && <p className="text-sm opacity-60 mb-4">{rtl ? "لا توجد نتائج مطابقة." : "No matches found."}</p>}
          {results && results.map((h, i) => {
            const id = `${collection}-${h.hadithnumber}`;
            const collectionName = HADITH_COLLECTIONS.find((c) => c.slug === collection)?.name;
            return (
              <Card key={i} className="p-5 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge tone="verified" />
                  <div className="flex gap-3 opacity-70">
                    <IconBtn icon={Copy} onClick={() => actions.copyText(`${h.text}\n(${collectionName} #${h.hadithnumber})`)} label="Copy" />
                    <IconBtn icon={Bookmark} active={actions.isBookmarked(id)} onClick={() => actions.toggleBookmark({ id, type: "Hadith", title: `${collectionName} #${h.hadithnumber}`, sub: h.text.slice(0, 50) + "…" })} label="Bookmark" />
                    <IconBtn icon={Share2} onClick={() => actions.shareText(h.text, `${collectionName} #${h.hadithnumber}`)} label="Share" />
                  </div>
                </div>
                <p className="text-sm opacity-90 leading-relaxed">{h.text}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-xs opacity-60">
                  <span>{collectionName}</span><span>·</span><span>#{h.hadithnumber}</span>
                  {h.grades?.[0]?.grade && (<><span>·</span><span className="font-bold" style={{ color: COLORS.green }}>{h.grades[0].grade}{h.grades[0].name ? ` (${h.grades[0].name})` : ""}</span></>)}
                </div>
              </Card>
            );
          })}
        </>
      )}
    </div>
  );
}

/* ---------------- LEARN ---------------- */
function LearnPage({ rtl, theme, setPage }) {
  const categories = ["Aqeedah", "Quran", "Hadith", "Fiqh", "Seerah", "Arabic", "Islamic History", "Islamic Manners"];
  return (
    <div className="pt-8">
      <SectionTitle eyebrow={rtl ? "تعلم" : "Learn Islam"} title={rtl ? "خريطة التعلم الإسلامي" : "Structured Islamic Learning"} sub={rtl ? "من المبتدئ إلى المتقدم." : "From beginner to advanced, organized by topic."} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((c) => (
          <Card key={c} className="p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer" onClick={() => (c === "Fiqh" || c === "Aqeedah") && setPage("fiqh")}>
            <GraduationCap size={18} color={COLORS.green} className="mb-2" />
            <div className="font-bold text-sm">{c}</div>
            <div className="flex gap-1 mt-2">
              {["Beginner", "Intermediate", "Advanced"].map((l) => <span key={l} className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/5">{l[0]}</span>)}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <SectionTitle eyebrow={rtl ? "مثال" : "Example path"} title={rtl ? "الفقه ← الطهارة ← الوضوء" : "Fiqh → Purification → Wudu"} />
        <Card className="p-5 text-sm">
          <div className="flex flex-wrap items-center gap-2 opacity-70">
            <span>Learn Islam</span><ChevronRight size={14} className={rtl ? "rotate-180" : ""} />
            <span>Fiqh</span><ChevronRight size={14} className={rtl ? "rotate-180" : ""} />
            <span>Purification</span><ChevronRight size={14} className={rtl ? "rotate-180" : ""} />
            <span className="font-bold" style={{ color: "var(--heading)" }}>Wudu</span>
          </div>
          <button onClick={() => setPage("fiqh")} className="mt-4 text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background: COLORS.green }}>{rtl ? "افتح موضوع الوضوء" : "Open Wudu Topic"}</button>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- FIQH & AQEEDAH (real, editorial-labeled foundational content) ---------------- */
function FiqhPage({ rtl, theme }) {
  const [openWudu, setOpenWudu] = useState(true);
  const [openAqeedah, setOpenAqeedah] = useState(false);
  const [openPillars, setOpenPillars] = useState(false);
  const [openSharia, setOpenSharia] = useState(false);
  const topics = ["Purification", "Prayer", "Fasting", "Zakat", "Hajj", "Marriage", "Finance", "Inheritance"];
  const madhahib = [
    { name: "Hanafi", text: "Minor bleeding is generally held to break wudu in the Hanafi school." },
    { name: "Maliki", text: "Blood that flows is not, in itself, considered a nullifier of wudu in the Maliki school." },
    { name: "Shafi'i", text: "Bleeding alone is not treated as a nullifier of wudu in the Shafi'i school." },
    { name: "Hanbali", text: "Significant flowing blood is generally held to break wudu in the Hanbali school." },
  ];
  const articles = [
    "Belief in Allah — His absolute oneness (Tawhid)",
    "Belief in the Angels",
    "Belief in the revealed Books (including the Quran)",
    "Belief in the Messengers of Allah",
    "Belief in the Day of Judgment",
    "Belief in Divine Decree (Qadar)",
  ];
  const pillars = [
    { name: "Shahada", desc: "Testifying that there is no deity but Allah, and Muhammad ﷺ is His Messenger." },
    { name: "Salah", desc: "Performing the five daily prayers." },
    { name: "Zakat", desc: "Giving obligatory alms to those entitled to receive it." },
    { name: "Sawm", desc: "Fasting during the month of Ramadan." },
    { name: "Hajj", desc: "Pilgrimage to Makkah, once in a lifetime, for those who are able." },
  ];

  return (
    <div className="pt-8">
      <SectionTitle eyebrow={rtl ? "العقيدة والفقه" : "Aqeedah & Fiqh"} title={rtl ? "أركان الإيمان والإسلام، والأحكام الشرعية" : "Articles of Faith, Pillars of Islam & Islamic Rulings"} />
      <div className="flex flex-wrap gap-2 mb-6">
        {topics.map((t) => <span key={t} className="text-xs font-medium px-3 py-1.5 rounded-full border" style={{ borderColor: COLORS.green + "30" }}>{t}</span>)}
      </div>

      {/* Aqeedah: Six Articles of Faith */}
      <Card className="p-5 mb-4">
        <button onClick={() => setOpenAqeedah(!openAqeedah)} className="w-full flex justify-between items-center text-start">
          <div>
            <div className="text-xs uppercase tracking-wide opacity-50 font-bold">{rtl ? "العقيدة" : "Aqeedah"}</div>
            <div className="font-bold text-base mt-1" style={{ color: "var(--heading)" }}>{rtl ? "أركان الإيمان الستة" : "The Six Articles of Faith"}</div>
          </div>
          <ChevronDown size={18} className={`transition-transform ${openAqeedah ? "rotate-180" : ""}`} />
        </button>
        {openAqeedah && (
          <div className="mt-4">
            <Badge tone="editorial" />
            <ol className="mt-3 space-y-2 text-sm">
              {articles.map((a, i) => (
                <li key={i} className="flex gap-3"><span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: COLORS.lightGreen, color: COLORS.green }}>{i + 1}</span>{a}</li>
              ))}
            </ol>
            <p className="text-xs opacity-50 mt-3">{rtl ? "هذه الأركان الستة متفق عليها بين جميع المذاهب السنية، وترد أصولها في القرآن (مثل: البقرة ٢٨٥) والسنة (مثل حديث جبريل في صحيح مسلم)." : "These six articles are agreed upon across Sunni schools of thought, with roots in the Quran (e.g. Al-Baqarah 2:285) and Sunnah (e.g. the Hadith of Jibril in Sahih Muslim)."}</p>
          </div>
        )}
      </Card>

      {/* Five Pillars */}
      <Card className="p-5 mb-4">
        <button onClick={() => setOpenPillars(!openPillars)} className="w-full flex justify-between items-center text-start">
          <div>
            <div className="text-xs uppercase tracking-wide opacity-50 font-bold">{rtl ? "أركان الإسلام" : "Pillars of Islam"}</div>
            <div className="font-bold text-base mt-1" style={{ color: "var(--heading)" }}>{rtl ? "أركان الإسلام الخمسة" : "The Five Pillars of Islam"}</div>
          </div>
          <ChevronDown size={18} className={`transition-transform ${openPillars ? "rotate-180" : ""}`} />
        </button>
        {openPillars && (
          <div className="mt-4">
            <Badge tone="editorial" />
            <div className="mt-3 space-y-3">
              {pillars.map((p) => (
                <div key={p.name} className="p-3 rounded-xl" style={{ background: COLORS.lightGreen }}>
                  <span className="font-bold text-sm" style={{ color: COLORS.darkGreen }}>{p.name}</span>
                  <p className="text-sm opacity-80 mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Sharia overview */}
      <Card className="p-5 mb-4">
        <button onClick={() => setOpenSharia(!openSharia)} className="w-full flex justify-between items-center text-start">
          <div>
            <div className="text-xs uppercase tracking-wide opacity-50 font-bold">{rtl ? "الشريعة" : "Sharia"}</div>
            <div className="font-bold text-base mt-1" style={{ color: "var(--heading)" }}>{rtl ? "مصادر الشريعة الإسلامية" : "Sources of Islamic Law"}</div>
          </div>
          <ChevronDown size={18} className={`transition-transform ${openSharia ? "rotate-180" : ""}`} />
        </button>
        {openSharia && (
          <div className="mt-4">
            <Badge tone="editorial" />
            <div className="mt-3 space-y-2 text-sm">
              <p><span className="font-bold">{rtl ? "القرآن" : "Quran"}:</span> {rtl ? "المصدر الأول، كلام الله المُنزَل." : "The primary source — the revealed word of Allah."}</p>
              <p><span className="font-bold">{rtl ? "السنة" : "Sunnah"}:</span> {rtl ? "أقوال وأفعال النبي محمد ﷺ، محفوظة في مجموعات الحديث." : "The sayings and actions of the Prophet Muhammad ﷺ, preserved in the Hadith collections."}</p>
              <p><span className="font-bold">{rtl ? "الإجماع" : "Ijma"}:</span> {rtl ? "اتفاق العلماء على حكم معين." : "The consensus of qualified scholars on a given matter."}</p>
              <p><span className="font-bold">{rtl ? "القياس" : "Qiyas"}:</span> {rtl ? "الاستدلال بالمقارنة على مسائل جديدة لم يرد فيها نص مباشر." : "Analogical reasoning applied to new questions not directly addressed by a text."}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Wudu comparative example */}
      <Card className="p-5">
        <button onClick={() => setOpenWudu(!openWudu)} className="w-full flex justify-between items-center text-start">
          <div>
            <div className="text-xs uppercase tracking-wide opacity-50 font-bold">{rtl ? "مثال فقهي مقارن" : "Comparative fiqh example"}</div>
            <div className="font-bold text-base mt-1" style={{ color: "var(--heading)" }}>{rtl ? "هل النزيف ينقض الوضوء؟" : "Does bleeding break wudu?"}</div>
          </div>
          <ChevronDown size={18} className={`transition-transform ${openWudu ? "rotate-180" : ""}`} />
        </button>
        {openWudu && (
          <div className="mt-4 space-y-3">
            <p className="text-sm opacity-70 border-b pb-3" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              {rtl ? "تختلف آراء المذاهب الفقهية في هذه المسألة. فيما يلي الآراء المعروفة مع بيان عدم وجود إجماع." : "Islamic schools of thought differ on this question. Recognized positions are shown below — no single view is presented as universally accepted."}
            </p>
            {madhahib.map((m) => (
              <div key={m.name} className="p-3 rounded-xl" style={{ background: COLORS.lightGreen }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm" style={{ color: COLORS.darkGreen }}>{m.name}</span>
                  <Badge tone="editorial" />
                </div>
                <p className="text-sm opacity-80 mt-1">{m.text}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4 mt-5 text-sm flex items-start gap-2" style={{ background: "#FFF8E8" }}>
        <ShieldCheck size={16} className="mt-0.5 shrink-0" color={COLORS.gold} />
        <span>{rtl ? "قد يحتوي الفقه الإسلامي على خلافات فقهية معتبرة. توفر هذه المنصة ملخصات تحريرية تعليمية ولا تغني عن استشارة عالم مؤهل." : "Islamic jurisprudence may contain valid scholarly differences. This platform provides editorial, educational summaries and does not replace consultation with a qualified scholar."}</span>
      </Card>
    </div>
  );
}

/* ---------------- SCHOLARS (real, verifiable classical scholars) ---------------- */
function ScholarsPage({ rtl, theme }) {
  return (
    <div className="pt-8">
      <SectionTitle eyebrow={rtl ? "الدليل" : "Directory"} title={rtl ? "العلماء والمشايخ" : "Scholars & Sheikhs"} sub={rtl ? "أئمة المذاهب الفقهية الأربعة — علماء حقيقيون تاريخيًا موثقون." : "The founders of the four major Sunni madhhabs — real, historically documented scholars."} />
      <div className="grid sm:grid-cols-2 gap-3">
        {SCHOLARS.map((s) => (
          <Card key={s.id} className="p-4 flex gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: COLORS.lightGreen, boxShadow: `inset 0 0 0 1.5px ${COLORS.gold}55` }}>
              <User size={22} color={COLORS.green} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm">{s.name}</span>
                <span className="text-sm opacity-50" dir="rtl" style={{ fontFamily: "'Amiri',serif" }}>{s.arName}</span>
                <Badge tone="verified" />
              </div>
              <p className="text-xs opacity-60 mt-0.5">{s.specialty} · {s.years}</p>
              <p className="text-sm opacity-80 mt-2">{s.bio}</p>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-4 mt-5 text-sm flex items-start gap-2">
        <Info size={15} className="mt-0.5 shrink-0 text-amber-600" />
        <span>{rtl ? "دليل العلماء المعاصرين قيد الإنشاء وسيتطلب مراجعة إشرافية قبل النشر لضمان دقة المعلومات." : "A directory of contemporary scholars is planned, and will require editorial/scholarly review before publishing to ensure accuracy."}</span>
      </Card>
    </div>
  );
}

/* ---------------- DUAS (real, cited, embedded) ---------------- */
const MOOD_MAP = [
  { id: "anxious", label: "Anxious or worried", labelAr: "قلق أو توتر", refs: [[94, 5], [94, 6], [2, 286]], duaIds: ["dua-lahawla"] },
  { id: "grateful", label: "Grateful", labelAr: "شكر وامتنان", refs: [[14, 7]], duaIds: ["dua-alhamdulillah"] },
  { id: "grieving", label: "Grieving a loss", labelAr: "حزن وفقد", refs: [[2, 155], [2, 156], [2, 157]], duaIds: [] },
  { id: "guilt", label: "Feeling far from Allah", labelAr: "الشعور بالبعد عن الله", refs: [[39, 53]], duaIds: ["dua-astaghfirullah"] },
  { id: "hardship", label: "Facing hardship", labelAr: "مواجهة صعوبة", refs: [[65, 2], [65, 3]], duaIds: ["dua-lahawla"] },
  { id: "guidance", label: "Seeking guidance", labelAr: "طلب الهداية", refs: [[1, 6]], duaIds: [] },
];

function DuasPage({ rtl, theme, actions, quranData }) {
  const [tab, setTab] = useState("category");
  const [mood, setMood] = useState(null);

  const moodResult = useMemo(() => {
    if (!mood || !quranData) return null;
    const m = MOOD_MAP.find((x) => x.id === mood);
    if (!m) return null;
    const ayahs = m.refs.map(([s, a]) => {
      const surahMeta = SURAH_LIST.find((x) => x[2] === s);
      const ayahData = (quranData[String(s)] || []).find((x) => x[0] === a);
      if (!ayahData) return null;
      return { surahNum: s, ayahNum: a, surahName: surahMeta?.[1], ar: ayahData[1], en: ayahData[2] };
    }).filter(Boolean);
    const duas = m.duaIds.map((id) => DUA_LIST.find((d) => d.id === id)).filter(Boolean);
    return { ayahs, duas };
  }, [mood, quranData]);

  return (
    <div className="pt-8">
      <SectionTitle eyebrow={rtl ? "الأدعية" : "Duas & Adhkar"} title={rtl ? "الأدعية والأذكار" : "Duas & Adhkar"} sub={rtl ? "أدعية قصيرة موثقة المصدر من القرآن والسنة." : "Short, well-established duas with real, cited sources."} />

      <div className="flex items-center gap-1 p-1 rounded-full mb-6 max-w-md" style={{ background: COLORS.lightGreen }}>
        <button onClick={() => setTab("category")} className="flex-1 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: tab === "category" ? "#fff" : "transparent", color: COLORS.darkGreen }}>{rtl ? "حسب الفئة" : "By Category"}</button>
        <button onClick={() => setTab("mood")} className="flex-1 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: tab === "mood" ? "#fff" : "transparent", color: COLORS.darkGreen }}>{rtl ? "ابحث بحسب شعورك" : "Find Comfort by Feeling"}</button>
      </div>

      {tab === "category" && (
        <>
          <div className="grid gap-3">
            {DUA_LIST.map((dua) => (
              <Card key={dua.id} className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: COLORS.lightGreen, color: COLORS.green }}>{dua.category}</span>
                  <Badge tone="verified" />
                </div>
                <p className="text-2xl text-right leading-loose" dir="rtl" style={{ fontFamily: "'Amiri Quran','Amiri',serif", color: "var(--heading)" }}>{dua.ar}</p>
                <p className="text-sm opacity-60 mt-1 italic">{dua.translit}</p>
                <p className="text-sm opacity-80 mt-2">{dua.en}</p>
                <p className="text-xs mt-2 font-bold" style={{ color: COLORS.gold }}>{dua.ref}</p>
                <div className="flex gap-4 mt-4 opacity-80">
                  <IconBtn icon={Copy} onClick={() => actions.copyText(`${dua.ar}\n${dua.translit}\n${dua.en}\n${dua.ref}`)} label="Copy" />
                  <IconBtn icon={Heart} active={actions.isBookmarked(dua.id)} onClick={() => actions.toggleBookmark({ id: dua.id, type: "Dua", title: dua.translit, sub: dua.en })} label="Favorite" />
                  <IconBtn icon={Share2} onClick={() => actions.shareText(`${dua.en}\n${dua.ref}`, dua.translit)} label="Share" />
                </div>
              </Card>
            ))}
          </div>
          <Card className="p-4 mt-4 text-sm flex items-start gap-2">
            <Info size={15} className="mt-0.5 shrink-0 text-amber-600" />
            <span>{rtl ? "المزيد من الأدعية الأطول (مثل أذكار الصباح والمساء الكاملة) سيُضاف بعد مراجعة دقيقة للنصوص لضمان صحتها الكاملة." : "Longer duas (like the full morning/evening adhkar) will be added after careful text verification to ensure full accuracy."}</span>
          </Card>
        </>
      )}

      {tab === "mood" && (
        <>
          <p className="text-sm opacity-70 mb-4">{rtl ? "اختر ما يقرب من شعورك الآن، وستظهر آيات وأدعية حقيقية (من نفس النصوص الموثقة في هذا التطبيق) كثيرًا ما يجد فيها الناس تسلية." : "Pick what's closest to how you feel right now — you'll see real verses and duas (from the same verified text already in this app) that many find comforting."}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {MOOD_MAP.map((m) => (
              <button key={m.id} onClick={() => setMood(m.id)} className="text-sm font-bold px-4 py-2 rounded-full border transition-all" style={{ background: mood === m.id ? COLORS.green : "transparent", color: mood === m.id ? "#fff" : "inherit", borderColor: COLORS.green + "40" }}>
                {rtl ? m.labelAr : m.label}
              </button>
            ))}
          </div>

          {!mood && <p className="text-sm opacity-50">{rtl ? "اختر شعورًا أعلاه للبدء." : "Choose a feeling above to begin."}</p>}
          {mood && !quranData && <Card className="p-6 flex items-center justify-center gap-2 text-sm opacity-60"><Loader2 size={16} className="animate-spin" /> {rtl ? "جاري التحميل..." : "Loading…"}</Card>}

          {moodResult && (
            <div className="space-y-3">
              {moodResult.ayahs.map((a, i) => {
                const cite = `Quran ${a.surahNum}:${a.ayahNum}`;
                const bmId = `mood-${a.surahNum}-${a.ayahNum}`;
                return (
                  <Card key={i} className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge tone="verified" />
                      <div className="flex gap-3 opacity-70">
                        <IconBtn icon={Copy} onClick={() => actions.copyText(`${a.ar}\n${a.en}\n(${cite})`)} label="Copy" />
                        <IconBtn icon={Bookmark} active={actions.isBookmarked(bmId)} onClick={() => actions.toggleBookmark({ id: bmId, type: "Quran", title: `${a.surahName}, Ayah ${a.ayahNum}`, sub: a.en.slice(0, 50) + "…" })} label="Bookmark" />
                        <IconBtn icon={Share2} onClick={() => actions.shareText(`${a.en}\n(${cite})`, cite)} label="Share" />
                      </div>
                    </div>
                    <p className="text-xl leading-loose text-right" dir="rtl" style={{ fontFamily: "'Amiri Quran','Amiri',serif", color: "var(--heading)" }}>{a.ar}</p>
                    <p className="text-sm opacity-80 mt-3">{a.en}</p>
                    <p className="text-xs mt-2 font-bold" style={{ color: COLORS.gold }}>{cite} · {a.surahName}</p>
                  </Card>
                );
              })}
              {moodResult.duas.map((dua) => (
                <Card key={dua.id} className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: COLORS.lightGreen, color: COLORS.green }}>{dua.category}</span>
                    <Badge tone="verified" />
                  </div>
                  <p className="text-xl text-right leading-loose" dir="rtl" style={{ fontFamily: "'Amiri Quran','Amiri',serif", color: "var(--heading)" }}>{dua.ar}</p>
                  <p className="text-sm opacity-60 mt-1 italic">{dua.translit}</p>
                  <p className="text-sm opacity-80 mt-2">{dua.en}</p>
                  <p className="text-xs mt-2 font-bold" style={{ color: COLORS.gold }}>{dua.ref}</p>
                </Card>
              ))}
              <Card className="p-4 text-sm flex items-start gap-2">
                <Info size={15} className="mt-0.5 shrink-0 text-amber-600" />
                <span>{rtl ? "هذه مجموعة تحريرية من آيات حقيقية، وليست تفسيرًا رسميًا أو فتوى. لفهم أعمق استشر عالمًا مؤهلاً." : "This is an editorial grouping of real, cited verses — not an official tafsir or fatwa. For deeper understanding, consult a qualified scholar."}</span>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------------- BOOKMARKS ---------------- */
function BookmarksPage({ rtl, theme, bookmarks, actions }) {
  return (
    <div className="pt-8">
      <SectionTitle eyebrow={rtl ? "المحفوظات" : "Your Library"} title={rtl ? "المحفوظات" : "Bookmarks"} />
      {bookmarks.length === 0 ? (
        <Card className="p-8 text-center text-sm opacity-60">{rtl ? "لا توجد عناصر محفوظة بعد." : "Nothing saved yet. Tap the bookmark icon on any ayah, hadith, or dua to save it here."}</Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2.5">
          {bookmarks.map((b) => (
            <Card key={b.id} className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide opacity-50">{b.type}</span>
                <div className="font-bold text-sm">{b.title}</div>
                <div className="text-xs opacity-50 mt-0.5">{b.sub}</div>
              </div>
              <button onClick={() => actions.toggleBookmark(b)} className="opacity-60 hover:opacity-100"><X size={16} /></button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- TOOLS (prayer times by country/city, real qibla math, real mosque finder) ---------------- */
function ToolsPage({ rtl, theme, tasbih, setTasbih, zakatWealth, setZakatWealth, actions, quranData }) {
  const zakat = useMemo(() => {
    const w = parseFloat(zakatWealth);
    if (isNaN(w) || w <= 0) return null;
    return (w * 0.025).toFixed(2);
  }, [zakatWealth]);

  const [method, setMethod] = useState(2);
  const [locMode, setLocMode] = useState("city");
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("");
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [prayerMeta, setPrayerMeta] = useState(null);
  const [loadingPrayer, setLoadingPrayer] = useState(false);
  const [prayerError, setPrayerError] = useState(null);

  const [qibla, setQibla] = useState(null);
  const [loadingQibla, setLoadingQibla] = useState(false);
  const [mosques, setMosques] = useState(null);
  const [loadingMosques, setLoadingMosques] = useState(false);

  const getLocation = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error("no geo")); return; }
    navigator.geolocation.getCurrentPosition((pos) => resolve(pos.coords), (err) => reject(err), { timeout: 10000 });
  });

  const fetchPrayerTimesByCity = async () => {
    if (!city.trim()) { actions.showToast(rtl ? "أدخل اسم المدينة" : "Enter a city name"); return; }
    setLoadingPrayer(true); setPrayerTimes(null); setPrayerError(null);
    try {
      const data = await fetchJSON(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city.trim())}&country=${encodeURIComponent(country)}&method=${method}`);
      setPrayerTimes(data.data.timings);
      setPrayerMeta({ city: city.trim(), country, date: data.data.date?.readable });
    } catch (e) {
      setPrayerError(rtl ? "تعذر العثور على أوقات لهذه المدينة. تحقق من الاسم أو جرّب موقعي الحالي." : "Couldn't find timings for that city. Check the spelling, or try your current location instead.");
    }
    setLoadingPrayer(false);
  };

  const fetchPrayerTimesByGPS = async () => {
    setLoadingPrayer(true); setPrayerTimes(null); setPrayerError(null);
    try {
      const { latitude, longitude } = await getLocation();
      const data = await fetchJSON(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`);
      setPrayerTimes(data.data.timings);
      setPrayerMeta({ city: rtl ? "موقعك الحالي" : "Your current location", country: "", date: data.data.date?.readable });
    } catch (e) {
      setPrayerError(rtl ? "تعذر الحصول على موقعك أو أوقات الصلاة." : "Couldn't get your location or prayer times.");
    }
    setLoadingPrayer(false);
  };

  const fetchQibla = async () => {
    setLoadingQibla(true); setQibla(null);
    try {
      const { latitude, longitude } = await getLocation();
      const kaabaLat = 21.4225 * Math.PI / 180, kaabaLng = 39.8262 * Math.PI / 180;
      const phi1 = latitude * Math.PI / 180, lambda1 = longitude * Math.PI / 180;
      const dLambda = kaabaLng - lambda1;
      const y = Math.sin(dLambda) * Math.cos(kaabaLat);
      const x = Math.cos(phi1) * Math.sin(kaabaLat) - Math.sin(phi1) * Math.cos(kaabaLat) * Math.cos(dLambda);
      let brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      setQibla(brng.toFixed(1));
    } catch (e) {
      actions.showToast(rtl ? "تعذر الحصول على الموقع" : "Couldn't get your location");
    }
    setLoadingQibla(false);
  };

  const fetchMosques = async () => {
    setLoadingMosques(true); setMosques(null);
    try {
      const { latitude, longitude } = await getLocation();
      const query = `[out:json][timeout:15];node["amenity"="place_of_worship"]["religion"="muslim"](around:6000,${latitude},${longitude});out 10;`;
      const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
      const data = await res.json();
      setMosques((data.elements || []).slice(0, 8));
    } catch (e) {
      actions.showToast(rtl ? "تعذر جلب المساجد القريبة" : "Couldn't fetch nearby mosques");
    }
    setLoadingMosques(false);
  };

  return (
    <div className="pt-8">
      <SectionTitle eyebrow={rtl ? "أدوات" : "Tools"} title={rtl ? "أدوات إسلامية" : "Islamic Tools"} sub={rtl ? "أوقات صلاة حقيقية حسب الدولة والمدينة، أو حسب موقعك." : "Real prayer times by country + city, or by your device location."} />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3"><Clock size={18} color={COLORS.green} /><h3 className="font-bold">{rtl ? "أوقات الصلاة" : "Prayer Times"}</h3></div>

          <div className="flex items-center gap-1 p-1 rounded-full mb-3" style={{ background: COLORS.lightGreen }}>
            <button onClick={() => setLocMode("city")} className="flex-1 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: locMode === "city" ? "#fff" : "transparent", color: COLORS.darkGreen }}>{rtl ? "دولة ومدينة" : "Country & City"}</button>
            <button onClick={() => setLocMode("gps")} className="flex-1 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: locMode === "gps" ? "#fff" : "transparent", color: COLORS.darkGreen }}>{rtl ? "موقعي" : "My Location"}</button>
          </div>

          {locMode === "city" ? (
            <div className="space-y-2 mb-3">
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full text-sm px-3 py-2 rounded-lg border bg-transparent" style={{ borderColor: COLORS.green + "30" }}>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchPrayerTimesByCity()} placeholder={rtl ? "اسم المدينة (مثال: القاهرة)" : "City name (e.g. Cairo)"} className="w-full text-sm px-3 py-2 rounded-lg border bg-transparent outline-none" style={{ borderColor: COLORS.green + "30" }} />
            </div>
          ) : null}

          <select value={method} onChange={(e) => setMethod(Number(e.target.value))} className="text-xs px-2 py-1.5 rounded-lg border bg-transparent mb-3 w-full" style={{ borderColor: COLORS.green + "30" }}>
            {CALC_METHODS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>

          <button onClick={locMode === "city" ? fetchPrayerTimesByCity : fetchPrayerTimesByGPS} disabled={loadingPrayer} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-white font-bold text-sm" style={{ background: COLORS.green }}>
            {loadingPrayer ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />} {locMode === "city" ? (rtl ? "احصل على الأوقات" : "Get prayer times") : (rtl ? "استخدم موقعي" : "Use my location")}
          </button>

          {prayerError && <p className="text-xs text-amber-600 mt-3">{prayerError}</p>}

          {prayerTimes && (
            <>
              {prayerMeta && <p className="text-xs opacity-60 mt-3">{prayerMeta.city}{prayerMeta.country ? `, ${prayerMeta.country}` : ""} · {prayerMeta.date}</p>}
              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                {["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((k) => (
                  <div key={k} className="p-2 rounded-lg" style={{ background: COLORS.lightGreen }}>
                    <div className="text-[10px] opacity-60">{k}</div>
                    <div className="text-sm font-bold" style={{ color: COLORS.darkGreen }}>{prayerTimes[k]}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3"><Compass size={18} color={COLORS.green} /><h3 className="font-bold">{rtl ? "اتجاه القبلة" : "Qibla Direction"}</h3></div>
          <p className="text-xs opacity-60 mb-3">{rtl ? "يُحسب اتجاه القبلة رياضيًا من موقعك الحالي إلى الكعبة." : "Qibla bearing is computed mathematically from your current location to the Kaaba."}</p>
          <button onClick={fetchQibla} disabled={loadingQibla} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-white font-bold text-sm" style={{ background: COLORS.green }}>
            {loadingQibla ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />} {rtl ? "احسب اتجاهي" : "Calculate my direction"}
          </button>
          {qibla && (
            <div className="flex flex-col items-center mt-5">
              <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center relative" style={{ borderColor: COLORS.lightGreen }}>
                <Compass size={32} style={{ transform: `rotate(${qibla}deg)`, color: COLORS.gold }} />
              </div>
              <div className="text-2xl font-extrabold mt-3" style={{ color: "var(--heading)" }}>{qibla}°</div>
              <div className="text-xs opacity-60">{rtl ? "من الشمال، باتجاه الكعبة" : "from true North, toward the Kaaba"}</div>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-3"><MapPin size={18} color={COLORS.green} /><h3 className="font-bold">{rtl ? "الباحث عن المسجد" : "Mosque Finder"}</h3></div>
        <button onClick={fetchMosques} disabled={loadingMosques} className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-full text-white font-bold text-sm" style={{ background: COLORS.green }}>
          {loadingMosques ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />} {rtl ? "ابحث بالقرب مني" : "Find near me"}
        </button>
        {mosques && mosques.length === 0 && <p className="text-sm opacity-60 mt-3">{rtl ? "لم يتم العثور على مساجد قريبة في نطاق 6 كم." : "No mosques found within 6km via OpenStreetMap data."}</p>}
        {mosques && mosques.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-2.5 mt-4">
            {mosques.map((m) => (
              <a key={m.id} href={`https://www.google.com/maps?q=${m.lat},${m.lon}`} target="_blank" rel="noreferrer">
                <div className="p-3 rounded-xl border hover:shadow-md transition-shadow" style={{ borderColor: COLORS.green + "20" }}>
                  <div className="font-bold text-sm flex items-center gap-1">{m.tags?.name || (rtl ? "مسجد" : "Mosque")} <ExternalLink size={11} className="opacity-50" /></div>
                  <div className="text-xs opacity-50 mt-0.5">{m.tags?.["addr:street"] || (rtl ? "بيانات OpenStreetMap" : "via OpenStreetMap")}</div>
                </div>
              </a>
            ))}
          </div>
        )}
        <p className="text-xs opacity-40 mt-3">{rtl ? "البيانات من OpenStreetMap عبر Overpass API." : "Data sourced live from OpenStreetMap via the Overpass API."}</p>
      </Card>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3"><Calculator size={18} color={COLORS.green} /><h3 className="font-bold">{rtl ? "حاسبة الزكاة" : "Zakat Calculator"}</h3></div>
          <label className="text-xs opacity-60">{rtl ? "إجمالي المدخرات (بعملتك)" : "Total zakatable wealth"}</label>
          <input type="number" value={zakatWealth} onChange={(e) => setZakatWealth(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: COLORS.green + "30", background: "transparent" }}
            placeholder="10000" />
          {zakat && (
            <div className="mt-3 p-3 rounded-lg" style={{ background: COLORS.lightGreen }}>
              <div className="text-xs opacity-60">{rtl ? "الزكاة المستحقة (2.5٪)" : "Zakat due (2.5%)"}</div>
              <div className="text-xl font-extrabold" style={{ color: COLORS.darkGreen }}>{zakat}</div>
            </div>
          )}
          <p className="text-xs opacity-50 mt-2">{rtl ? "تحقق من بلوغ النصاب وحولان الحول قبل الاعتماد على هذا الحساب." : "Confirm nisab threshold and hawl (one lunar year) before relying on this figure."}</p>
        </Card>

        <DigitalMisbaha rtl={rtl} />
      </div>

      <RecitationPractice rtl={rtl} actions={actions} quranData={quranData} />
    </div>
  );
}

const DHIKR_CYCLE = [
  { ar: "سُبْحَانَ اللَّهِ", translit: "SubhanAllah", target: 33 },
  { ar: "الْحَمْدُ لِلَّهِ", translit: "Alhamdulillah", target: 33 },
  { ar: "اللَّهُ أَكْبَرُ", translit: "Allahu Akbar", target: 34 },
];

function DigitalMisbaha({ rtl }) {
  const [phraseIdx, setPhraseIdx] = useState(() => {
    try { return JSON.parse(localStorage.getItem("deenhub-misbaha") || "null")?.phraseIdx ?? 0; } catch { return 0; }
  });
  const [count, setCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem("deenhub-misbaha") || "null")?.count ?? 0; } catch { return 0; }
  });
  const [totalDone, setTotalDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem("deenhub-misbaha") || "null")?.totalDone ?? 0; } catch { return 0; }
  });
  const phrase = DHIKR_CYCLE[phraseIdx];

  useEffect(() => {
    try { localStorage.setItem("deenhub-misbaha", JSON.stringify({ phraseIdx, count, totalDone })); } catch { /* storage unavailable */ }
  }, [phraseIdx, count, totalDone]);

  const tap = () => {
    if (navigator.vibrate) navigator.vibrate(8);
    const next = count + 1;
    setTotalDone((t) => t + 1);
    if (next >= phrase.target) {
      if (phraseIdx < DHIKR_CYCLE.length - 1) {
        setPhraseIdx(phraseIdx + 1);
        setCount(0);
      } else {
        setCount(next); // hold at completion so the ring shows full
      }
    } else {
      setCount(next);
    }
  };

  const reset = () => { setPhraseIdx(0); setCount(0); setTotalDone(0); };
  const complete = phraseIdx === DHIKR_CYCLE.length - 1 && count >= phrase.target;
  const pct = Math.min(1, count / phrase.target);
  const R = 54, C = 2 * Math.PI * R;

  return (
    <Card className="p-5 flex flex-col items-center justify-center text-center">
      <h3 className="font-bold mb-1">{rtl ? "المسبحة الرقمية" : "Digital Misbaha"}</h3>
      <p className="text-xs opacity-50 mb-3">{rtl ? "دورة التسبيح بعد الصلاة (٣٣ + ٣٣ + ٣٤)" : "The post-prayer dhikr cycle (33 + 33 + 34)"}</p>
      <button onClick={tap} className="relative w-36 h-36 flex items-center justify-center" style={{ cursor: "pointer" }}>
        <svg width="144" height="144" viewBox="0 0 144 144" className="absolute inset-0 -rotate-90">
          <circle cx="72" cy="72" r={R} fill="none" stroke={COLORS.lightGreen} strokeWidth="10" />
          <circle cx="72" cy="72" r={R} fill="none" stroke={complete ? COLORS.gold : COLORS.green} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset 0.2s" }} />
        </svg>
        <div>
          <div className="text-3xl font-extrabold" style={{ color: "var(--heading)" }}>{count}<span className="text-base opacity-40">/{phrase.target}</span></div>
        </div>
      </button>
      <p className="text-xl mt-3" dir="rtl" style={{ fontFamily: "'Amiri Quran','Amiri',serif", color: "var(--heading)" }}>{phrase.ar}</p>
      <p className="text-xs opacity-60 italic">{phrase.translit}</p>
      {complete && <p className="text-xs font-bold mt-2" style={{ color: COLORS.gold }}>{rtl ? "أكملت الدورة! (100)" : "Cycle complete! (100)"}</p>}
      <div className="flex gap-3 mt-4">
        <button onClick={tap} className="px-6 py-2.5 rounded-full text-white font-bold text-sm" style={{ background: COLORS.green }}>{rtl ? "عدّ" : "Count"}</button>
        <button onClick={reset} className="px-4 py-2.5 rounded-full border font-bold text-sm" style={{ borderColor: COLORS.green + "40" }}>{rtl ? "إعادة" : "Reset"}</button>
      </div>
      <p className="text-[11px] opacity-40 mt-3">{rtl ? `إجمالي منذ آخر إعادة: ${totalDone}` : `Total taps since last reset: ${totalDone}`}</p>
    </Card>
  );
}

function RecitationPractice({ rtl, actions, quranData }) {
  const [surahNum, setSurahNum] = useState(1);
  const [ayahNum, setAyahNum] = useState(1);
  const [recState, setRecState] = useState("idle"); // idle | requesting | recording | recorded | error
  const [errorMsg, setErrorMsg] = useState(null);
  const [myRecordingUrl, setMyRecordingUrl] = useState(null);
  const [playingWhich, setPlayingWhich] = useState(null); // "reciter" | "mine" | null
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const reciterAudioRef = useRef(null);
  const myAudioRef = useRef(null);

  const surah = SURAH_LIST.find((s) => s[2] === surahNum);
  const ayahData = quranData ? (quranData[String(surahNum)] || []).find((a) => a[0] === ayahNum) : null;
  const globalAyah = surah ? SURAH_OFFSETS[surahNum - 1] + ayahNum : null;

  const startRecording = async () => {
    setErrorMsg(null);
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setErrorMsg(rtl ? "متصفحك لا يدعم التسجيل الصوتي." : "Your browser doesn't support audio recording.");
      setRecState("error");
      return;
    }
    setRecState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setMyRecordingUrl(URL.createObjectURL(blob));
        setRecState("recorded");
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecState("recording");
    } catch (e) {
      setErrorMsg(rtl ? "تعذّر الوصول إلى الميكروفون. تحقق من إذن المتصفح." : "Couldn't access the microphone. Check your browser permission.");
      setRecState("error");
    }
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); };

  const playReciter = () => {
    if (!globalAyah || !reciterAudioRef.current) return;
    if (playingWhich === "reciter") { reciterAudioRef.current.pause(); setPlayingWhich(null); return; }
    reciterAudioRef.current.src = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyah}.mp3`;
    reciterAudioRef.current.play().catch(() => actions.showToast(rtl ? "تعذر تشغيل الصوت" : "Couldn't play audio"));
    setPlayingWhich("reciter");
    reciterAudioRef.current.onended = () => setPlayingWhich(null);
  };

  const playMine = () => {
    if (!myRecordingUrl || !myAudioRef.current) return;
    if (playingWhich === "mine") { myAudioRef.current.pause(); setPlayingWhich(null); return; }
    myAudioRef.current.play().catch(() => {});
    setPlayingWhich("mine");
    myAudioRef.current.onended = () => setPlayingWhich(null);
  };

  return (
    <Card className="p-5 mt-4">
      <audio ref={reciterAudioRef} className="hidden" />
      <audio ref={myAudioRef} src={myRecordingUrl || undefined} className="hidden" />
      <div className="flex items-center gap-2 mb-1"><Headphones size={18} color={COLORS.green} /><h3 className="font-bold">{rtl ? "تدرّب على تلاوتك" : "Recitation Practice"}</h3></div>
      <p className="text-xs opacity-60 mb-4">{rtl ? "سجّل تلاوتك ثم قارنها بصوت القارئ — للمقارنة الشخصية فقط، بلا تقييم تلقائي." : "Record yourself, then compare it to a reciter — for your own comparison, with no automated scoring."}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <select value={surahNum} onChange={(e) => { setSurahNum(Number(e.target.value)); setAyahNum(1); setRecState("idle"); setMyRecordingUrl(null); }} className="text-sm px-3 py-2 rounded-lg border bg-transparent" style={{ borderColor: COLORS.green + "30" }}>
          {SURAH_LIST.map((s) => <option key={s[2]} value={s[2]}>{s[2]}. {s[1]}</option>)}
        </select>
        <select value={ayahNum} onChange={(e) => { setAyahNum(Number(e.target.value)); setRecState("idle"); setMyRecordingUrl(null); }} className="text-sm px-3 py-2 rounded-lg border bg-transparent" style={{ borderColor: COLORS.green + "30" }}>
          {surah && Array.from({ length: surah[3] }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{rtl ? `آية ${n}` : `Ayah ${n}`}</option>)}
        </select>
      </div>

      {ayahData && (
        <div className="p-4 rounded-xl mb-4" style={{ background: COLORS.lightGreen }}>
          <p className="text-2xl leading-loose text-right" dir="rtl" style={{ fontFamily: "'Amiri Quran','Amiri',serif", color: COLORS.darkGreen }}>{ayahData[1]}</p>
          <p className="text-sm opacity-70 mt-2">{ayahData[2]}</p>
        </div>
      )}

      {errorMsg && <p className="text-xs text-amber-600 mb-3">{errorMsg}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={playReciter} className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full text-white" style={{ background: COLORS.green }}>
          {playingWhich === "reciter" ? <Pause size={14} /> : <Play size={14} />} {rtl ? "استمع للقارئ" : "Play Reciter"}
        </button>

        {recState !== "recording" ? (
          <button onClick={startRecording} disabled={recState === "requesting"} className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border" style={{ borderColor: COLORS.green + "40" }}>
            {recState === "requesting" ? <Loader2 size={14} className="animate-spin" /> : <Headphones size={14} />} {rtl ? "سجّل صوتك" : "Record Myself"}
          </button>
        ) : (
          <button onClick={stopRecording} className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full text-white animate-pulse" style={{ background: "#C0392B" }}>
            {rtl ? "وقف التسجيل" : "Stop Recording"}
          </button>
        )}

        {myRecordingUrl && (
          <button onClick={playMine} className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border" style={{ borderColor: COLORS.gold, color: COLORS.gold }}>
            {playingWhich === "mine" ? <Pause size={14} /> : <Play size={14} />} {rtl ? "استمع لتلاوتي" : "Play My Recording"}
          </button>
        )}
      </div>
    </Card>
  );
}
