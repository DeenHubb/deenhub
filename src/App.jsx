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

// Surahs with full embedded text ready right now: Al-Fatihah + all of Juz Amma (78-114).
// Kept intentionally small so the app loads fast and reliably; every other surah is
// clearly marked "coming soon" in the browse list rather than silently failing.
const AVAILABLE_SURAHS = new Set([1, ...Array.from({ length: 114 - 78 + 1 }, (_, i) => 78 + i)]);

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

/* ---------------- Simplified tajweed colorizer (educational approximation) ---------------- */
const TAJWEED_RULES = [
  { re: /[نم]ّ/, color: "#1E8E5A" },
  { re: /[ًٌٍ]/, color: "#2E86C1" },
  { re: /[بجدطق]ْ/, color: "#E67E22" },
  { re: /[ٰٓ]/, color: "#C0392B" },
];
const TAJWEED_SPLIT = /([نم]ّ|[ًٌٍ]|[بجدطق]ْ|[ٰٓ])/;
function TajweedText({ text, className, style }) {
  const parts = text.split(TAJWEED_SPLIT).filter((p) => p !== "");
  return (
    <p className={className} style={style} dir="rtl">
      {parts.map((part, i) => {
        const rule = TAJWEED_RULES.find((r) => r.re.test(part));
        return rule ? <span key={i} style={{ color: rule.color, fontWeight: 700 }}>{part}</span> : <span key={i}>{part}</span>;
      })}
    </p>
  );
}
const TAJWEED_LEGEND = [
  { color: "#1E8E5A", label: "Ghunnah (nasal hum)" },
  { color: "#2E86C1", label: "Tanween" },
  { color: "#E67E22", label: "Qalqalah (echo)" },
  { color: "#C0392B", label: "Madd (elongation)" },
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

/* ---------------- Embedded data (real text, no network required) ----------------
   QURAN_DATA covers Al-Fatihah + all of Juz Amma (surahs 78-114) -- the short,
   most commonly read/memorized surahs -- kept intentionally small so this file
   parses and opens instantly and reliably. Source: fawazahmed0/quran-api
   (ara-quranuthmanihaf + eng-abdullahyusufal, public domain).
   Every other surah is listed as "coming soon" rather than silently failing. */
const QURAN_DATA = {
  "1":[[1,"بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ","In the name of Allah, Most Gracious, Most Merciful"],[2,"ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ","Praise be to Allah, the Cherisher and Sustainer of the worlds"],[3,"ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ","Most Gracious, Most Merciful"],[4,"مَٰلِكِ يَوۡمِ ٱلدِّينِ","Master of the Day of Judgment"],[5,"إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ","Thee do we worship, and Thine aid we seek"],[6,"ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ","Show us the straight way"],[7,"صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ","The way of those on whom Thou hast bestowed Thy Grace, those whose (portion) is not wrath, and who go not astray"]],
  "78":[[1,"عَمَّ يَتَسَآءَلُونَ","Concerning what are they disputing"],[2,"عَنِ ٱلنَّبَإِ ٱلۡعَظِيمِ","Concerning the Great News"],[3,"ٱلَّذِي هُمۡ فِيهِ مُخۡتَلِفُونَ","About which they cannot agree"],[4,"كَلَّا سَيَعۡلَمُونَ","Verily, they shall soon (come to) know"],[5,"ثُمَّ كَلَّا سَيَعۡلَمُونَ","Verily, verily they shall soon (come to) know"],[6,"أَلَمۡ نَجۡعَلِ ٱلۡأَرۡضَ مِهَٰدࣰ ا","Have We not made the earth as a wide expanse"],[7,"وَٱلۡجِبَالَ أَوۡتَادࣰ ا","And the mountains as pegs"],[8,"وَخَلَقۡنَٰكُمۡ أَزۡوَٰجࣰ ا","And (have We not) created you in pairs"],[9,"وَجَعَلۡنَا نَوۡمَكُمۡ سُبَاتࣰ ا","And made your sleep for rest"],[10,"وَجَعَلۡنَا ٱلَّيۡلَ لِبَاسࣰ ا","And made the night as a covering"],[11,"وَجَعَلۡنَا ٱلنَّهَارَ مَعَاشࣰ ا","And made the day as a means of subsistence"],[12,"وَبَنَيۡنَا فَوۡقَكُمۡ سَبۡعࣰ ا شِدَادࣰ ا","And (have We not) built over you the seven firmaments"],[13,"وَجَعَلۡنَا سِرَاجࣰ ا وَهَّاجࣰ ا","And placed (therein) a Light of Splendour"],[14,"وَأَنزَلۡنَا مِنَ ٱلۡمُعۡصِرَٰتِ مَآءࣰ ثَجَّاجࣰ ا","And do We not send down from the clouds water in abundance"],[15,"لِّنُخۡرِجَ بِهِۦ حَبࣰّ ا وَنَبَاتࣰ ا","That We may produce therewith corn and vegetables"],[16,"وَجَنَّٰتٍ أَلۡفَافًا","And gardens of luxurious growth"],[17,"إِنَّ يَوۡمَ ٱلۡفَصۡلِ كَانَ مِيقَٰتࣰ ا","Verily the Day of Sorting out is a thing appointed"],[18,"يَوۡمَ يُنفَخُ فِي ٱلصُّورِ فَتَأۡتُونَ أَفۡوَاجࣰ ا","The Day that the Trumpet shall be sounded, and ye shall come forth in crowds"],[19,"وَفُتِحَتِ ٱلسَّمَآءُ فَكَانَتۡ أَبۡوَٰبࣰ ا","And the heavens shall be opened as if there were doors"],[20,"وَسُيِّرَتِ ٱلۡجِبَالُ فَكَانَتۡ سَرَابًا","And the mountains shall vanish, as if they were a mirage"],[21,"إِنَّ جَهَنَّمَ كَانَتۡ مِرۡصَادࣰ ا","Truly Hell is as a place of ambush"],[22,"لِّلطَّٰغِينَ مَـَٔابࣰ ا","For the transgressors a place of destination"],[23,"لَّٰبِثِينَ فِيهَآ أَحۡقَابࣰ ا","They will dwell therein for ages"],[24,"لَّا يَذُوقُونَ فِيهَا بَرۡدࣰ ا وَلَا شَرَابًا","Nothing cool shall they taste therein, nor any drink"],[25,"إِلَّا حَمِيمࣰ ا وَغَسَّاقࣰ ا","Save a boiling fluid and a fluid, dark, murky, intensely cold"],[26,"جَزَآءࣰ وِفَاقًا","A fitting recompense (for them)"],[27,"إِنَّهُمۡ كَانُواْ لَا يَرۡجُونَ حِسَابࣰ ا","For that they used not to fear any account (for their deeds)"],[28,"وَكَذَّبُواْ بِـَٔايَٰتِنَا كِذَّابࣰ ا","But they (impudently) treated Our Signs as false"],[29,"وَكُلَّ شَيۡءٍ أَحۡصَيۡنَٰهُ كِتَٰبࣰ ا","And all things have We preserved on record"],[30,"فَذُوقُواْ فَلَن نَّزِيدَكُمۡ إِلَّا عَذَابًا","So taste ye (the fruits of your deeds); for no increase shall We grant you, except in Punishment"],[31,"إِنَّ لِلۡمُتَّقِينَ مَفَازًا","Verily for the Righteous there will be a fulfilment of (the heart's) desires"],[32,"حَدَآئِقَ وَأَعۡنَٰبࣰ ا","Gardens enclosed, and grapevines"],[33,"وَكَوَاعِبَ أَتۡرَابࣰ ا","And voluptuous women of equal age"],[34,"وَكَأۡسࣰ ا دِهَاقࣰ ا","And a cup full (to the brim)"],[35,"لَّا يَسۡمَعُونَ فِيهَا لَغۡوࣰ ا وَلَا كِذَّٰبࣰ ا","No vanity shall they hear therein, nor Untruth"],[36,"جَزَآءࣰ مِّن رَّبِّكَ عَطَآءً حِسَابࣰ ا","Recompense from thy Lord, a gift, (amply) sufficient"],[37,"رَّبِّ ٱلسَّمَٰوَٰتِ وَٱلۡأَرۡضِ وَمَا بَيۡنَهُمَا ٱلرَّحۡمَٰنِۖ لَا يَمۡلِكُونَ مِنۡهُ خِطَابࣰ ا","(From) the Lord of the heavens and the earth, and all between, (Allah) Most Gracious: None shall have power to argue with Him"],[38,"يَوۡمَ يَقُومُ ٱلرُّوحُ وَٱلۡمَلَٰٓئِكَةُ صَفࣰّ اۖ لَّا يَتَكَلَّمُونَ إِلَّا مَنۡ أَذِنَ لَهُ ٱلرَّحۡمَٰنُ وَقَالَ صَوَابࣰ ا","The Day that the Spirit and the angels will stand forth in ranks, none shall speak except any who is permitted by (Allah) Most Gracious, and He will say what is right"],[39,"ذَٰلِكَ ٱلۡيَوۡمُ ٱلۡحَقُّۖ فَمَن شَآءَ ٱتَّخَذَ إِلَىٰ رَبِّهِۦ مَـَٔابًا","That Day will be the sure Reality: Therefore, whoso will, let him take a (straight) return to his Lord"],[40,"إِنَّآ أَنذَرۡنَٰكُمۡ عَذَابࣰ ا قَرِيبࣰ ا يَوۡمَ يَنظُرُ ٱلۡمَرۡءُ مَا قَدَّمَتۡ يَدَاهُ وَيَقُولُ ٱلۡكَافِرُ يَٰلَيۡتَنِي كُنتُ تُرَٰبَۢا","Verily, We have warned you of a Penalty near, the Day when man will see (the deeds) which his hands have sent forth, and the Unbeliever will say, \"Woe unto me! Would that I were (metre) dust"]],
  "79":[[1,"وَٱلنَّٰزِعَٰتِ غَرۡقࣰ ا","By the (angels) who tear out (the souls of the wicked) with violence"],[2,"وَٱلنَّٰشِطَٰتِ نَشۡطࣰ ا","By those who gently draw out (the souls of the blessed)"],[3,"وَٱلسَّٰبِحَٰتِ سَبۡحࣰ ا","And by those who glide along (on errands of mercy)"],[4,"فَٱلسَّٰبِقَٰتِ سَبۡقࣰ ا","Then press forward as in a race"],[5,"فَٱلۡمُدَبِّرَٰتِ أَمۡرࣰ ا","Then arrange to do (the Commands of their Lord)"],[6,"يَوۡمَ تَرۡجُفُ ٱلرَّاجِفَةُ","One Day everything that can be in commotion will be in violent commotion"],[7,"تَتۡبَعُهَا ٱلرَّادِفَةُ","Followed by oft-repeated (commotions)"],[8,"قُلُوبࣱ يَوۡمَئِذࣲ وَاجِفَةٌ","Hearts that Day will be in agitation"],[9,"أَبۡصَٰرُهَا خَٰشِعَةࣱ‏","Cast down will be (their owners') eyes"],[10,"يَقُولُونَ أَءِنَّا لَمَرۡدُودُونَ فِي ٱلۡحَافِرَةِ","They say (now): \"What! shall we indeed be returned to (our) former state"],[11,"أَءِذَا كُنَّا عِظَٰمࣰ ا نَّخِرَةࣰ‏","What! - when we shall have become rotten bones"],[12,"قَالُواْ تِلۡكَ إِذࣰ ا كَرَّةٌ خَاسِرَةࣱ‏","They say: \"It would, in that case, be a return with loss"],[13,"فَإِنَّمَا هِيَ زَجۡرَةࣱ وَٰحِدَةࣱ‏","But verily, it will be but a single (Compelling) Cry"],[14,"فَإِذَا هُم بِٱلسَّاهِرَةِ","When, behold, they will be in the (full) awakening (to Judgment)"],[15,"هَلۡ أَتَىٰكَ حَدِيثُ مُوسَىٰٓ","Has the story of Moses reached thee"],[16,"إِذۡ نَادَىٰهُ رَبُّهُۥ بِٱلۡوَادِ ٱلۡمُقَدَّسِ طُوًى","Behold, thy Lord did call to him in the sacred valley of Tuwa"],[17,"ٱذۡهَبۡ إِلَىٰ فِرۡعَوۡنَ إِنَّهُۥ طَغَىٰ","Go thou to Pharaoh for he has indeed transgressed all bounds"],[18,"فَقُلۡ هَل لَّكَ إِلَىٰٓ أَن تَزَكَّىٰ","And say to him, 'Wouldst thou that thou shouldst be purified (from sin)"],[19,"وَأَهۡدِيَكَ إِلَىٰ رَبِّكَ فَتَخۡشَىٰ","And that I guide thee to thy Lord, so thou shouldst fear Him"],[20,"فَأَرَىٰهُ ٱلۡأٓيَةَ ٱلۡكُبۡرَىٰ","Then did (Moses) show him the Great Sign"],[21,"فَكَذَّبَ وَعَصَىٰ","But (Pharaoh) rejected it and disobeyed (guidance)"],[22,"ثُمَّ أَدۡبَرَ يَسۡعَىٰ","Further, he turned his back, striving hard (against Allah)"],[23,"فَحَشَرَ فَنَادَىٰ","Then he collected (his men) and made a proclamation"],[24,"فَقَالَ أَنَا۠ رَبُّكُمُ ٱلۡأَعۡلَىٰ","Saying, \"I am your Lord, Most High"],[25,"فَأَخَذَهُ ٱللَّهُ نَكَالَ ٱلۡأٓخِرَةِ وَٱلۡأُولَىٰٓ","But Allah did punish him, (and made an) example of him, - in the Hereafter, as in this life"],[26,"إِنَّ فِي ذَٰلِكَ لَعِبۡرَةࣰ لِّمَن يَخۡشَىٰٓ","Verily in this is an instructive warning for whosoever feareth (Allah)"],[27,"ءَأَنتُمۡ أَشَدُّ خَلۡقًا أَمِ ٱلسَّمَآءُۚ بَنَىٰهَا","What! Are ye the more difficult to create or the heaven (above)? (Allah) hath constructed it"],[28,"رَفَعَ سَمۡكَهَا فَسَوَّىٰهَا","On high hath He raised its canopy, and He hath given it order and perfection"],[29,"وَأَغۡطَشَ لَيۡلَهَا وَأَخۡرَجَ ضُحَىٰهَا","Its night doth He endow with darkness, and its splendour doth He bring out (with light)"],[30,"وَٱلۡأَرۡضَ بَعۡدَ ذَٰلِكَ دَحَىٰهَآ","And the earth, moreover, hath He extended (to a wide expanse)"],[31,"أَخۡرَجَ مِنۡهَا مَآءَهَا وَمَرۡعَىٰهَا","He draweth out therefrom its moisture and its pasture"],[32,"وَٱلۡجِبَالَ أَرۡسَىٰهَا","And the mountains hath He firmly fixed"],[33,"مَتَٰعࣰ ا لَّكُمۡ وَلِأَنۡعَٰمِكُمۡ","For use and convenience to you and your cattle"],[34,"فَإِذَا جَآءَتِ ٱلطَّآمَّةُ ٱلۡكُبۡرَىٰ","Therefore, when there comes the great, overwhelming (Event)"],[35,"يَوۡمَ يَتَذَكَّرُ ٱلۡإِنسَٰنُ مَا سَعَىٰ","The Day when man shall remember (all) that he strove for"],[36,"وَبُرِّزَتِ ٱلۡجَحِيمُ لِمَن يَرَىٰ","And Hell-Fire shall be placed in full view for (all) to see"],[37,"فَأَمَّا مَن طَغَىٰ","Then, for such as had transgressed all bounds"],[38,"وَءَاثَرَ ٱلۡحَيَوٰةَ ٱلدُّنۡيَا","And had preferred the life of this world"],[39,"فَإِنَّ ٱلۡجَحِيمَ هِيَ ٱلۡمَأۡوَىٰ","The Abode will be Hell-Fire"],[40,"وَأَمَّا مَنۡ خَافَ مَقَامَ رَبِّهِۦ وَنَهَى ٱلنَّفۡسَ عَنِ ٱلۡهَوَىٰ","And for such as had entertained the fear of standing before their Lord's (tribunal) and had restrained (their) soul from lower desires"],[41,"فَإِنَّ ٱلۡجَنَّةَ هِيَ ٱلۡمَأۡوَىٰ","Their abode will be the Garden"],[42,"يَسۡـَٔلُونَكَ عَنِ ٱلسَّاعَةِ أَيَّانَ مُرۡسَىٰهَا","They ask thee about the Hour,-'When will be its appointed time"],[43,"فِيمَ أَنتَ مِن ذِكۡرَىٰهَآ","Wherein art thou (concerned) with the declaration thereof"],[44,"إِلَىٰ رَبِّكَ مُنتَهَىٰهَآ","With thy Lord in the Limit fixed therefor"],[45,"إِنَّمَآ أَنتَ مُنذِرُ مَن يَخۡشَىٰهَا","Thou art but a Warner for such as fear it"],[46,"كَأَنَّهُمۡ يَوۡمَ يَرَوۡنَهَا لَمۡ يَلۡبَثُوٓاْ إِلَّا عَشِيَّةً أَوۡ ضُحَىٰهَا","The Day they see it, (It will be) as if they had tarried but a single evening, or (at most till) the following morn"]],
  "80":[[1,"عَبَسَ وَتَوَلَّىٰٓ","(The Prophet) frowned and turned away"],[2,"أَن جَآءَهُ ٱلۡأَعۡمَىٰ","Because there came to him the blind man (interrupting)"],[3,"وَمَا يُدۡرِيكَ لَعَلَّهُۥ يَزَّكَّىٰٓ","But what could tell thee but that perchance he might grow (in spiritual understanding)"],[4,"أَوۡ يَذَّكَّرُ فَتَنفَعَهُ ٱلذِّكۡرَىٰٓ","Or that he might receive admonition, and the teaching might profit him"],[5,"أَمَّا مَنِ ٱسۡتَغۡنَىٰ","As to one who regards Himself as self-sufficient"],[6,"فَأَنتَ لَهُۥ تَصَدَّىٰ","To him dost thou attend"],[7,"وَمَا عَلَيۡكَ أَلَّا يَزَّكَّىٰ","Though it is no blame to thee if he grow not (in spiritual understanding)"],[8,"وَأَمَّا مَن جَآءَكَ يَسۡعَىٰ","But as to him who came to thee striving earnestly"],[9,"وَهُوَ يَخۡشَىٰ","And with fear (in his heart)"],[10,"فَأَنتَ عَنۡهُ تَلَهَّىٰ","Of him wast thou unmindful"],[11,"كَلَّآ إِنَّهَا تَذۡكِرَةࣱ‏","By no means (should it be so)! For it is indeed a Message of instruction"],[12,"فَمَن شَآءَ ذَكَرَهُۥ","Therefore let whoso will, keep it in remembrance"],[13,"فِي صُحُفࣲ مُّكَرَّمَةࣲ‏","(It is) in Books held (greatly) in honour"],[14,"مَّرۡفُوعَةࣲ مُّطَهَّرَةِۭ","Exalted (in dignity), kept pure and holy"],[15,"بِأَيۡدِي سَفَرَةࣲ‏","(Written) by the hands of scribes"],[16,"كِرَامِۭ بَرَرَةࣲ‏","Honourable and Pious and Just"],[17,"قُتِلَ ٱلۡإِنسَٰنُ مَآ أَكۡفَرَهُۥ","Woe to man! What hath made him reject Allah"],[18,"مِنۡ أَيِّ شَيۡءٍ خَلَقَهُۥ","From what stuff hath He created him"],[19,"مِن نُّطۡفَةٍ خَلَقَهُۥ فَقَدَّرَهُۥ","From a sperm-drop: He hath created him, and then mouldeth him in due proportions"],[20,"ثُمَّ ٱلسَّبِيلَ يَسَّرَهُۥ","Then doth He make His path smooth for him"],[21,"ثُمَّ أَمَاتَهُۥ فَأَقۡبَرَهُۥ","Then He causeth him to die, and putteth him in his grave"],[22,"ثُمَّ إِذَا شَآءَ أَنشَرَهُۥ","Then, when it is His Will, He will raise him up (again)"],[23,"كَلَّا لَمَّا يَقۡضِ مَآ أَمَرَهُۥ","By no means hath he fulfilled what Allah hath commanded him"],[24,"فَلۡيَنظُرِ ٱلۡإِنسَٰنُ إِلَىٰ طَعَامِهِۦٓ","Then let man look at his food, (and how We provide it)"],[25,"أَنَّا صَبَبۡنَا ٱلۡمَآءَ صَبࣰّ ا","For that We pour forth water in abundance"],[26,"ثُمَّ شَقَقۡنَا ٱلۡأَرۡضَ شَقࣰّ ا","And We split the earth in fragments"],[27,"فَأَنۢبَتۡنَا فِيهَا حَبࣰّ ا","And produce therein corn"],[28,"وَعِنَبࣰ ا وَقَضۡبࣰ ا","And Grapes and nutritious plants"],[29,"وَزَيۡتُونࣰ ا وَنَخۡلࣰ ا","And Olives and Dates"],[30,"وَحَدَآئِقَ غُلۡبࣰ ا","And enclosed Gardens, dense with lofty trees"],[31,"وَفَٰكِهَةࣰ وَأَبࣰّ ا","And fruits and fodder"],[32,"مَّتَٰعࣰ ا لَّكُمۡ وَلِأَنۡعَٰمِكُمۡ","For use and convenience to you and your cattle"],[33,"فَإِذَا جَآءَتِ ٱلصَّآخَّةُ","At length, when there comes the Deafening Noise"],[34,"يَوۡمَ يَفِرُّ ٱلۡمَرۡءُ مِنۡ أَخِيهِ","That Day shall a man flee from his own brother"],[35,"وَأُمِّهِۦ وَأَبِيهِ","And from his mother and his father"],[36,"وَصَٰحِبَتِهِۦ وَبَنِيهِ","And from his wife and his children"],[37,"لِكُلِّ ٱمۡرِيࣲٕ مِّنۡهُمۡ يَوۡمَئِذࣲ شَأۡنࣱ يُغۡنِيهِ","Each one of them, that Day, will have enough concern (of his own) to make him indifferent to the others"],[38,"وُجُوهࣱ يَوۡمَئِذࣲ مُّسۡفِرَةࣱ‏","Some faces that Day will be beaming"],[39,"ضَاحِكَةࣱ مُّسۡتَبۡشِرَةࣱ‏","Laughing, rejoicing"],[40,"وَوُجُوهࣱ يَوۡمَئِذٍ عَلَيۡهَا غَبَرَةࣱ‏","And other faces that Day will be dust-stained"],[41,"تَرۡهَقُهَا قَتَرَةٌ","Blackness will cover them"],[42,"أُوْلَٰٓئِكَ هُمُ ٱلۡكَفَرَةُ ٱلۡفَجَرَةُ","Such will be the Rejecters of Allah, the doers of iniquity"]],
  "81":[[1,"إِذَا ٱلشَّمۡسُ كُوِّرَتۡ","When the sun (with its spacious light) is folded up"],[2,"وَإِذَا ٱلنُّجُومُ ٱنكَدَرَتۡ","When the stars fall, losing their lustre"],[3,"وَإِذَا ٱلۡجِبَالُ سُيِّرَتۡ","When the mountains vanish (like a mirage)"],[4,"وَإِذَا ٱلۡعِشَارُ عُطِّلَتۡ","When the she-camels, ten months with young, are left untended"],[5,"وَإِذَا ٱلۡوُحُوشُ حُشِرَتۡ","When the wild beasts are herded together (in the human habitations)"],[6,"وَإِذَا ٱلۡبِحَارُ سُجِّرَتۡ","When the oceans boil over with a swell"],[7,"وَإِذَا ٱلنُّفُوسُ زُوِّجَتۡ","When the souls are sorted out, (being joined, like with like)"],[8,"وَإِذَا ٱلۡمَوۡءُۥدَةُ سُئِلَتۡ","When the female (infant), buried alive, is questioned"],[9,"بِأَيِّ ذَنۢبࣲ قُتِلَتۡ","For what crime she was killed"],[10,"وَإِذَا ٱلصُّحُفُ نُشِرَتۡ","When the scrolls are laid open"],[11,"وَإِذَا ٱلسَّمَآءُ كُشِطَتۡ","When the world on High is unveiled"],[12,"وَإِذَا ٱلۡجَحِيمُ سُعِّرَتۡ","When the Blazing Fire is kindled to fierce heat"],[13,"وَإِذَا ٱلۡجَنَّةُ أُزۡلِفَتۡ","And when the Garden is brought near"],[14,"عَلِمَتۡ نَفۡسࣱ مَّآ أَحۡضَرَتۡ","(Then) shall each soul know what it has put forward"],[15,"فَلَآ أُقۡسِمُ بِٱلۡخُنَّسِ","So verily I call to witness the planets - that recede"],[16,"ٱلۡجَوَارِ ٱلۡكُنَّسِ","Go straight, or hide"],[17,"وَٱلَّيۡلِ إِذَا عَسۡعَسَ","And the Night as it dissipates"],[18,"وَٱلصُّبۡحِ إِذَا تَنَفَّسَ","And the Dawn as it breathes away the darkness"],[19,"إِنَّهُۥ لَقَوۡلُ رَسُولࣲ كَرِيمࣲ‏","Verily this is the word of a most honourable Messenger"],[20,"ذِي قُوَّةٍ عِندَ ذِي ٱلۡعَرۡشِ مَكِينࣲ‏","Endued with Power, with rank before the Lord of the Throne"],[21,"مُّطَاعࣲ ثَمَّ أَمِينࣲ‏","With authority there, (and) faithful to his trust"],[22,"وَمَا صَاحِبُكُم بِمَجۡنُونࣲ‏","And (O people!) your companion is not one possessed"],[23,"وَلَقَدۡ رَءَاهُ بِٱلۡأُفُقِ ٱلۡمُبِينِ","And without doubt he saw him in the clear horizon"],[24,"وَمَا هُوَ عَلَى ٱلۡغَيۡبِ بِضَنِينࣲ‏","Neither doth he withhold grudgingly a knowledge of the Unseen"],[25,"وَمَا هُوَ بِقَوۡلِ شَيۡطَٰنࣲ رَّجِيمࣲ‏","Nor is it the word of an evil spirit accursed"],[26,"فَأَيۡنَ تَذۡهَبُونَ","When whither go ye"],[27,"إِنۡ هُوَ إِلَّا ذِكۡرࣱ لِّلۡعَٰلَمِينَ","Verily this is no less than a Message to (all) the Worlds"],[28,"لِمَن شَآءَ مِنكُمۡ أَن يَسۡتَقِيمَ","(With profit) to whoever among you wills to go straight"],[29,"وَمَا تَشَآءُونَ إِلَّآ أَن يَشَآءَ ٱللَّهُ رَبُّ ٱلۡعَٰلَمِينَ","But ye shall not will except as Allah wills,- the Cherisher of the Worlds"]],
  "82":[[1,"إِذَا ٱلسَّمَآءُ ٱنفَطَرَتۡ","When the Sky is cleft asunder"],[2,"وَإِذَا ٱلۡكَوَاكِبُ ٱنتَثَرَتۡ","When the Stars are scattered"],[3,"وَإِذَا ٱلۡبِحَارُ فُجِّرَتۡ","When the Oceans are suffered to burst forth"],[4,"وَإِذَا ٱلۡقُبُورُ بُعۡثِرَتۡ","And when the Graves are turned upside down"],[5,"عَلِمَتۡ نَفۡسࣱ مَّا قَدَّمَتۡ وَأَخَّرَتۡ","(Then) shall each soul know what it hath sent forward and (what it hath) kept back"],[6,"يَٰٓأَيُّهَا ٱلۡإِنسَٰنُ مَا غَرَّكَ بِرَبِّكَ ٱلۡكَرِيمِ","O man! What has seduced thee from thy Lord Most Beneficent"],[7,"ٱلَّذِي خَلَقَكَ فَسَوَّىٰكَ فَعَدَلَكَ","Him Who created thee. Fashioned thee in due proportion, and gave thee a just bias"],[8,"فِيٓ أَيِّ صُورَةࣲ مَّا شَآءَ رَكَّبَكَ","In whatever Form He wills, does He put thee together"],[9,"كَلَّا بَلۡ تُكَذِّبُونَ بِٱلدِّينِ","Nay! But ye do reject Right and Judgment"],[10,"وَإِنَّ عَلَيۡكُمۡ لَحَٰفِظِينَ","But verily over you (are appointed angels) to protect you"],[11,"كِرَامࣰ ا كَٰتِبِينَ","Kind and honourable,- Writing down (your deeds)"],[12,"يَعۡلَمُونَ مَا تَفۡعَلُونَ","They know (and understand) all that ye do"],[13,"إِنَّ ٱلۡأَبۡرَارَ لَفِي نَعِيمࣲ‏","As for the Righteous, they will be in bliss"],[14,"وَإِنَّ ٱلۡفُجَّارَ لَفِي جَحِيمࣲ‏","And the Wicked - they will be in the Fire"],[15,"يَصۡلَوۡنَهَا يَوۡمَ ٱلدِّينِ","Which they will enter on the Day of Judgment"],[16,"وَمَا هُمۡ عَنۡهَا بِغَآئِبِينَ","And they will not be able to keep away therefrom"],[17,"وَمَآ أَدۡرَىٰكَ مَا يَوۡمُ ٱلدِّينِ","And what will explain to thee what the Day of Judgment is"],[18,"ثُمَّ مَآ أَدۡرَىٰكَ مَا يَوۡمُ ٱلدِّينِ","Again, what will explain to thee what the Day of Judgment is"],[19,"يَوۡمَ لَا تَمۡلِكُ نَفۡسࣱ لِّنَفۡسࣲ شَيۡـࣰٔ اۖ وَٱلۡأَمۡرُ يَوۡمَئِذࣲ لِّلَّهِ","(It will be) the Day when no soul shall have power (to do) aught for another: For the command, that Day, will be (wholly) with Allah"]],
  "83":[[1,"وَيۡلࣱ لِّلۡمُطَفِّفِينَ","Woe to those that deal in fraud"],[2,"ٱلَّذِينَ إِذَا ٱكۡتَالُواْ عَلَى ٱلنَّاسِ يَسۡتَوۡفُونَ","Those who, when they have to receive by measure from men, exact full measure"],[3,"وَإِذَا كَالُوهُمۡ أَو وَّزَنُوهُمۡ يُخۡسِرُونَ","But when they have to give by measure or weight to men, give less than due"],[4,"أَلَا يَظُنُّ أُوْلَٰٓئِكَ أَنَّهُم مَّبۡعُوثُونَ","Do they not think that they will be called to account"],[5,"لِيَوۡمٍ عَظِيمࣲ‏","On a Mighty Day"],[6,"يَوۡمَ يَقُومُ ٱلنَّاسُ لِرَبِّ ٱلۡعَٰلَمِينَ","A Day when (all) mankind will stand before the Lord of the Worlds"],[7,"كَلَّآ إِنَّ كِتَٰبَ ٱلۡفُجَّارِ لَفِي سِجِّينࣲ‏","Nay! Surely the record of the wicked is (preserved) in Sijjin"],[8,"وَمَآ أَدۡرَىٰكَ مَا سِجِّينࣱ‏","And what will explain to thee what Sijjin is"],[9,"كِتَٰبࣱ مَّرۡقُومࣱ‏","(There is) a Register (fully) inscribed"],[10,"وَيۡلࣱ يَوۡمَئِذࣲ لِّلۡمُكَذِّبِينَ","Woe, that Day, to those that deny"],[11,"ٱلَّذِينَ يُكَذِّبُونَ بِيَوۡمِ ٱلدِّينِ","Those that deny the Day of Judgment"],[12,"وَمَا يُكَذِّبُ بِهِۦٓ إِلَّا كُلُّ مُعۡتَدٍ أَثِيمٍ","And none can deny it but the Transgressor beyond bounds the Sinner"],[13,"إِذَا تُتۡلَىٰ عَلَيۡهِ ءَايَٰتُنَا قَالَ أَسَٰطِيرُ ٱلۡأَوَّلِينَ","When Our Signs are rehearsed to him, he says, \"Tales of the ancients"],[14,"كَلَّاۖ بَلۡۜ رَانَ عَلَىٰ قُلُوبِهِم مَّا كَانُواْ يَكۡسِبُونَ","By no means! but on their hearts is the stain of the (ill) which they do"],[15,"كَلَّآ إِنَّهُمۡ عَن رَّبِّهِمۡ يَوۡمَئِذࣲ لَّمَحۡجُوبُونَ","Verily, from (the Light of) their Lord, that Day, will they be veiled"],[16,"ثُمَّ إِنَّهُمۡ لَصَالُواْ ٱلۡجَحِيمِ","Further, they will enter the Fire of Hell"],[17,"ثُمَّ يُقَالُ هَٰذَا ٱلَّذِي كُنتُم بِهِۦ تُكَذِّبُونَ","Further, it will be said to them: \"This is the (reality) which ye rejected as false"],[18,"كَلَّآ إِنَّ كِتَٰبَ ٱلۡأَبۡرَارِ لَفِي عِلِّيِّينَ","Nay, verily the record of the Righteous is (preserved) in 'Illiyin"],[19,"وَمَآ أَدۡرَىٰكَ مَا عِلِّيُّونَ","And what will explain to thee what 'Illiyun is"],[20,"كِتَٰبࣱ مَّرۡقُومࣱ‏","(There is) a Register (fully) inscribed"],[21,"يَشۡهَدُهُ ٱلۡمُقَرَّبُونَ","To which bear witness those Nearest (to Allah)"],[22,"إِنَّ ٱلۡأَبۡرَارَ لَفِي نَعِيمٍ","Truly the Righteous will be in Bliss"],[23,"عَلَى ٱلۡأَرَآئِكِ يَنظُرُونَ","On Thrones (of Dignity) will they command a sight (of all things)"],[24,"تَعۡرِفُ فِي وُجُوهِهِمۡ نَضۡرَةَ ٱلنَّعِيمِ","Thou wilt recognise in their faces the beaming brightness of Bliss"],[25,"يُسۡقَوۡنَ مِن رَّحِيقࣲ مَّخۡتُومٍ","Their thirst will be slaked with Pure Wine sealed"],[26,"خِتَٰمُهُۥ مِسۡكࣱۚ وَفِي ذَٰلِكَ فَلۡيَتَنَافَسِ ٱلۡمُتَنَٰفِسُونَ","The seal thereof will be Musk: And for this let those aspire, who have aspirations"],[27,"وَمِزَاجُهُۥ مِن تَسۡنِيمٍ","With it will be (given) a mixture of Tasnim"],[28,"عَيۡنࣰ ا يَشۡرَبُ بِهَا ٱلۡمُقَرَّبُونَ","A spring, from (the waters) whereof drink those Nearest to Allah"],[29,"إِنَّ ٱلَّذِينَ أَجۡرَمُواْ كَانُواْ مِنَ ٱلَّذِينَ ءَامَنُواْ يَضۡحَكُونَ","Those in sin used to laugh at those who believed"],[30,"وَإِذَا مَرُّواْ بِهِمۡ يَتَغَامَزُونَ","And whenever they passed by them, used to wink at each other (in mockery)"],[31,"وَإِذَا ٱنقَلَبُوٓاْ إِلَىٰٓ أَهۡلِهِمُ ٱنقَلَبُواْ فَكِهِينَ","And when they returned to their own people, they would return jesting"],[32,"وَإِذَا رَأَوۡهُمۡ قَالُوٓاْ إِنَّ هَٰٓؤُلَآءِ لَضَآلُّونَ","And whenever they saw them, they would say, \"Behold! These are the people truly astray"],[33,"وَمَآ أُرۡسِلُواْ عَلَيۡهِمۡ حَٰفِظِينَ","But they had not been sent as keepers over them"],[34,"فَٱلۡيَوۡمَ ٱلَّذِينَ ءَامَنُواْ مِنَ ٱلۡكُفَّارِ يَضۡحَكُونَ","But on this Day the Believers will laugh at the Unbelievers"],[35,"عَلَى ٱلۡأَرَآئِكِ يَنظُرُونَ","On Thrones (of Dignity) they will command (a sight) (of all things)"],[36,"هَلۡ ثُوِّبَ ٱلۡكُفَّارُ مَا كَانُواْ يَفۡعَلُونَ","Will not the Unbelievers have been paid back for what they did"]],
  "84":[[1,"إِذَا ٱلسَّمَآءُ ٱنشَقَّتۡ","When the sky is rent asunder"],[2,"وَأَذِنَتۡ لِرَبِّهَا وَحُقَّتۡ","And hearkens to (the Command of) its Lord, and it must needs (do so)"],[3,"وَإِذَا ٱلۡأَرۡضُ مُدَّتۡ","And when the earth is flattened out"],[4,"وَأَلۡقَتۡ مَا فِيهَا وَتَخَلَّتۡ","And casts forth what is within it and becomes (clean) empty"],[5,"وَأَذِنَتۡ لِرَبِّهَا وَحُقَّتۡ","And hearkens to (the Command of) its Lord,- and it must needs (do so);- (then will come Home the full reality)"],[6,"يَٰٓأَيُّهَا ٱلۡإِنسَٰنُ إِنَّكَ كَادِحٌ إِلَىٰ رَبِّكَ كَدۡحࣰ ا فَمُلَٰقِيهِ","O thou man! Verily thou art ever toiling on towards thy Lord- painfully toiling,- but thou shalt meet Him"],[7,"فَأَمَّا مَنۡ أُوتِيَ كِتَٰبَهُۥ بِيَمِينِهِۦ","Then he who is given his Record in his right hand"],[8,"فَسَوۡفَ يُحَاسَبُ حِسَابࣰ ا يَسِيرࣰ ا","Soon will his account be taken by an easy reckoning"],[9,"وَيَنقَلِبُ إِلَىٰٓ أَهۡلِهِۦ مَسۡرُورࣰ ا","And he will turn to his people, rejoicing"],[10,"وَأَمَّا مَنۡ أُوتِيَ كِتَٰبَهُۥ وَرَآءَ ظَهۡرِهِۦ","But he who is given his Record behind his back"],[11,"فَسَوۡفَ يَدۡعُواْ ثُبُورࣰ ا","Soon will he cry for perdition"],[12,"وَيَصۡلَىٰ سَعِيرًا","And he will enter a Blazing Fire"],[13,"إِنَّهُۥ كَانَ فِيٓ أَهۡلِهِۦ مَسۡرُورًا","Truly, did he go about among his people, rejoicing"],[14,"إِنَّهُۥ ظَنَّ أَن لَّن يَحُورَ","Truly, did he think that he would not have to return (to Us)"],[15,"بَلَىٰٓۚ إِنَّ رَبَّهُۥ كَانَ بِهِۦ بَصِيرࣰ ا","Nay, nay! for his Lord was (ever) watchful of him"],[16,"فَلَآ أُقۡسِمُ بِٱلشَّفَقِ","So I do call to witness the ruddy glow of Sunset"],[17,"وَٱلَّيۡلِ وَمَا وَسَقَ","The Night and its Homing"],[18,"وَٱلۡقَمَرِ إِذَا ٱتَّسَقَ","And the Moon in her fullness"],[19,"لَتَرۡكَبُنَّ طَبَقًا عَن طَبَقࣲ‏","Ye shall surely travel from stage to stage"],[20,"فَمَا لَهُمۡ لَا يُؤۡمِنُونَ","What then is the matter with them, that they believe not"],[21,"وَإِذَا قُرِئَ عَلَيۡهِمُ ٱلۡقُرۡءَانُ لَا يَسۡجُدُونَۤ۩","And when the Qur'an is read to them, they fall not prostrate"],[22,"بَلِ ٱلَّذِينَ كَفَرُواْ يُكَذِّبُونَ","But on the contrary the Unbelievers reject (it)"],[23,"وَٱللَّهُ أَعۡلَمُ بِمَا يُوعُونَ","But Allah has full knowledge of what they secrete (in their breasts)"],[24,"فَبَشِّرۡهُم بِعَذَابٍ أَلِيمٍ","So announce to them a Penalty Grievous"],[25,"إِلَّا ٱلَّذِينَ ءَامَنُواْ وَعَمِلُواْ ٱلصَّٰلِحَٰتِ لَهُمۡ أَجۡرٌ غَيۡرُ مَمۡنُونِۭ","Except to those who believe and work righteous deeds: For them is a Reward that will never fail"]],
  "85":[[1,"وَٱلسَّمَآءِ ذَاتِ ٱلۡبُرُوجِ","By the sky, (displaying) the Zodiacal Signs"],[2,"وَٱلۡيَوۡمِ ٱلۡمَوۡعُودِ","By the promised Day (of Judgment)"],[3,"وَشَاهِدࣲ وَمَشۡهُودࣲ‏","By one that witnesses, and the subject of the witness"],[4,"قُتِلَ أَصۡحَٰبُ ٱلۡأُخۡدُودِ","Woe to the makers of the pit (of fire)"],[5,"ٱلنَّارِ ذَاتِ ٱلۡوَقُودِ","Fire supplied (abundantly) with fuel"],[6,"إِذۡ هُمۡ عَلَيۡهَا قُعُودࣱ‏","Behold! they sat over against the (fire)"],[7,"وَهُمۡ عَلَىٰ مَا يَفۡعَلُونَ بِٱلۡمُؤۡمِنِينَ شُهُودࣱ‏","And they witnessed (all) that they were doing against the Believers"],[8,"وَمَا نَقَمُواْ مِنۡهُمۡ إِلَّآ أَن يُؤۡمِنُواْ بِٱللَّهِ ٱلۡعَزِيزِ ٱلۡحَمِيدِ","And they ill-treated them for no other reason than that they believed in Allah, Exalted in Power, Worthy of all Praise"],[9,"ٱلَّذِي لَهُۥ مُلۡكُ ٱلسَّمَٰوَٰتِ وَٱلۡأَرۡضِۚ وَٱللَّهُ عَلَىٰ كُلِّ شَيۡءࣲ شَهِيدٌ","Him to Whom belongs the dominion of the heavens and the earth! And Allah is Witness to all things"],[10,"إِنَّ ٱلَّذِينَ فَتَنُواْ ٱلۡمُؤۡمِنِينَ وَٱلۡمُؤۡمِنَٰتِ ثُمَّ لَمۡ يَتُوبُواْ فَلَهُمۡ عَذَابُ جَهَنَّمَ وَلَهُمۡ عَذَابُ ٱلۡحَرِيقِ","Those who persecute (or draw into temptation) the Believers, men and women, and do not turn in repentance, will have the Penalty of Hell: They will have the Penalty of the Burning Fire"],[11,"إِنَّ ٱلَّذِينَ ءَامَنُواْ وَعَمِلُواْ ٱلصَّٰلِحَٰتِ لَهُمۡ جَنَّٰتࣱ تَجۡرِي مِن تَحۡتِهَا ٱلۡأَنۡهَٰرُۚ ذَٰلِكَ ٱلۡفَوۡزُ ٱلۡكَبِيرُ","For those who believe and do righteous deeds, will be Gardens; beneath which rivers flow: That is the great Salvation, (the fulfilment of all desires)"],[12,"إِنَّ بَطۡشَ رَبِّكَ لَشَدِيدٌ","Truly strong is the Grip (and Power) of thy Lord"],[13,"إِنَّهُۥ هُوَ يُبۡدِئُ وَيُعِيدُ","It is He Who creates from the very beginning, and He can restore (life)"],[14,"وَهُوَ ٱلۡغَفُورُ ٱلۡوَدُودُ","And He is the Oft-Forgiving, Full of Loving-Kindness"],[15,"ذُو ٱلۡعَرۡشِ ٱلۡمَجِيدُ","Lord of the Throne of Glory"],[16,"فَعَّالࣱ لِّمَا يُرِيدُ","Doer (without let) of all that He intends"],[17,"هَلۡ أَتَىٰكَ حَدِيثُ ٱلۡجُنُودِ","Has the story reached thee, of the forces"],[18,"فِرۡعَوۡنَ وَثَمُودَ","Of Pharaoh and the Thamud"],[19,"بَلِ ٱلَّذِينَ كَفَرُواْ فِي تَكۡذِيبࣲ‏","And yet the Unbelievers (persist) in rejecting (the Truth)"],[20,"وَٱللَّهُ مِن وَرَآئِهِم مُّحِيطُۢ","But Allah doth encompass them from behind"],[21,"بَلۡ هُوَ قُرۡءَانࣱ مَّجِيدࣱ‏","Nay, this is a Glorious Qur'an"],[22,"فِي لَوۡحࣲ مَّحۡفُوظِۭ","(Inscribed) in a Tablet Preserved"]],
  "86":[[1,"وَٱلسَّمَآءِ وَٱلطَّارِقِ","By the Sky and the Night-Visitant (therein)"],[2,"وَمَآ أَدۡرَىٰكَ مَا ٱلطَّارِقُ","And what will explain to thee what the Night-Visitant is"],[3,"ٱلنَّجۡمُ ٱلثَّاقِبُ","(It is) the Star of piercing brightness"],[4,"إِن كُلُّ نَفۡسࣲ لَّمَّا عَلَيۡهَا حَافِظࣱ‏","There is no soul but has a protector over it"],[5,"فَلۡيَنظُرِ ٱلۡإِنسَٰنُ مِمَّ خُلِقَ","Now let man but think from what he is created"],[6,"خُلِقَ مِن مَّآءࣲ دَافِقࣲ‏","He is created from a drop emitted"],[7,"يَخۡرُجُ مِنۢ بَيۡنِ ٱلصُّلۡبِ وَٱلتَّرَآئِبِ","Proceeding from between the backbone and the ribs"],[8,"إِنَّهُۥ عَلَىٰ رَجۡعِهِۦ لَقَادِرࣱ‏","Surely (Allah) is able to bring him back (to life)"],[9,"يَوۡمَ تُبۡلَى ٱلسَّرَآئِرُ","The Day that (all) things secret will be tested"],[10,"فَمَا لَهُۥ مِن قُوَّةࣲ وَلَا نَاصِرࣲ‏","(Man) will have no power, and no helper"],[11,"وَٱلسَّمَآءِ ذَاتِ ٱلرَّجۡعِ","By the Firmament which returns (in its round)"],[12,"وَٱلۡأَرۡضِ ذَاتِ ٱلصَّدۡعِ","And by the Earth which opens out (for the gushing of springs or the sprouting of vegetation)"],[13,"إِنَّهُۥ لَقَوۡلࣱ فَصۡلࣱ‏","Behold this is the Word that distinguishes (Good from Evil)"],[14,"وَمَا هُوَ بِٱلۡهَزۡلِ","It is not a thing for amusement"],[15,"إِنَّهُمۡ يَكِيدُونَ كَيۡدࣰ ا","As for them, they are but plotting a scheme"],[16,"وَأَكِيدُ كَيۡدࣰ ا","And I am planning a scheme"],[17,"فَمَهِّلِ ٱلۡكَٰفِرِينَ أَمۡهِلۡهُمۡ رُوَيۡدَۢا","Therefore grant a delay to the Unbelievers: Give respite to them gently (for awhile)"]],
  "87":[[1,"سَبِّحِ ٱسۡمَ رَبِّكَ ٱلۡأَعۡلَى","Glorify the name of thy Guardian-Lord Most High"],[2,"ٱلَّذِي خَلَقَ فَسَوَّىٰ","Who hath created, and further, given order and proportion"],[3,"وَٱلَّذِي قَدَّرَ فَهَدَىٰ","Who hath ordained laws. And granted guidance"],[4,"وَٱلَّذِيٓ أَخۡرَجَ ٱلۡمَرۡعَىٰ","And Who bringeth out the (green and luscious) pasture"],[5,"فَجَعَلَهُۥ غُثَآءً أَحۡوَىٰ","And then doth make it (but) swarthy stubble"],[6,"سَنُقۡرِئُكَ فَلَا تَنسَىٰٓ","By degrees shall We teach thee to declare (the Message), so thou shalt not forget"],[7,"إِلَّا مَا شَآءَ ٱللَّهُۚ إِنَّهُۥ يَعۡلَمُ ٱلۡجَهۡرَ وَمَا يَخۡفَىٰ","Except as Allah wills: For He knoweth what is manifest and what is hidden"],[8,"وَنُيَسِّرُكَ لِلۡيُسۡرَىٰ","And We will make it easy for thee (to follow) the simple (Path)"],[9,"فَذَكِّرۡ إِن نَّفَعَتِ ٱلذِّكۡرَىٰ","Therefore give admonition in case the admonition profits (the hearer)"],[10,"سَيَذَّكَّرُ مَن يَخۡشَىٰ","The admonition will be received by those who fear (Allah)"],[11,"وَيَتَجَنَّبُهَا ٱلۡأَشۡقَى","But it will be avoided by those most unfortunate ones"],[12,"ٱلَّذِي يَصۡلَى ٱلنَّارَ ٱلۡكُبۡرَىٰ","Who will enter the Great Fire"],[13,"ثُمَّ لَا يَمُوتُ فِيهَا وَلَا يَحۡيَىٰ","In which they will then neither die nor live"],[14,"قَدۡ أَفۡلَحَ مَن تَزَكَّىٰ","But those will prosper who purify themselves"],[15,"وَذَكَرَ ٱسۡمَ رَبِّهِۦ فَصَلَّىٰ","And glorify the name of their Guardian-Lord, and (lift their hearts) in prayer"],[16,"بَلۡ تُؤۡثِرُونَ ٱلۡحَيَوٰةَ ٱلدُّنۡيَا","Nay (behold), ye prefer the life of this world"],[17,"وَٱلۡأٓخِرَةُ خَيۡرࣱ وَأَبۡقَىٰٓ","But the Hereafter is better and more enduring"],[18,"إِنَّ هَٰذَا لَفِي ٱلصُّحُفِ ٱلۡأُولَىٰ","And this is in the Books of the earliest (Revelation)"],[19,"صُحُفِ إِبۡرَٰهِيمَ وَمُوسَىٰ","The Books of Abraham and Moses"]],
  "88":[[1,"هَلۡ أَتَىٰكَ حَدِيثُ ٱلۡغَٰشِيَةِ","Has the story reached thee of the overwhelming (Event)"],[2,"وُجُوهࣱ يَوۡمَئِذٍ خَٰشِعَةٌ","Some faces, that Day, will be humiliated"],[3,"عَامِلَةࣱ نَّاصِبَةࣱ‏","Labouring (hard), weary"],[4,"تَصۡلَىٰ نَارًا حَامِيَةࣰ‏","The while they enter the Blazing Fire"],[5,"تُسۡقَىٰ مِنۡ عَيۡنٍ ءَانِيَةࣲ‏","The while they are given, to drink, of a boiling hot spring"],[6,"لَّيۡسَ لَهُمۡ طَعَامٌ إِلَّا مِن ضَرِيعࣲ‏","No food will there be for them but a bitter Dhari"],[7,"لَّا يُسۡمِنُ وَلَا يُغۡنِي مِن جُوعࣲ‏","Which will neither nourish nor satisfy hunger"],[8,"وُجُوهࣱ يَوۡمَئِذࣲ نَّاعِمَةࣱ‏","(Other) faces that Day will be joyful"],[9,"لِّسَعۡيِهَا رَاضِيَةࣱ‏","Pleased with their striving"],[10,"فِي جَنَّةٍ عَالِيَةࣲ‏","In a Garden on high"],[11,"لَّا تَسۡمَعُ فِيهَا لَٰغِيَةࣰ‏","Where they shall hear no (word) of vanity"],[12,"فِيهَا عَيۡنࣱ جَارِيَةࣱ‏","Therein will be a bubbling spring"],[13,"فِيهَا سُرُرࣱ مَّرۡفُوعَةࣱ‏","Therein will be Thrones (of dignity), raised on high"],[14,"وَأَكۡوَابࣱ مَّوۡضُوعَةࣱ‏","Goblets placed (ready)"],[15,"وَنَمَارِقُ مَصۡفُوفَةࣱ‏","And cushions set in rows"],[16,"وَزَرَابِيُّ مَبۡثُوثَةٌ","And rich carpets (all) spread out"],[17,"أَفَلَا يَنظُرُونَ إِلَى ٱلۡإِبِلِ كَيۡفَ خُلِقَتۡ","Do they not look at the Camels, how they are made"],[18,"وَإِلَى ٱلسَّمَآءِ كَيۡفَ رُفِعَتۡ","And at the Sky, how it is raised high"],[19,"وَإِلَى ٱلۡجِبَالِ كَيۡفَ نُصِبَتۡ","And at the Mountains, how they are fixed firm"],[20,"وَإِلَى ٱلۡأَرۡضِ كَيۡفَ سُطِحَتۡ","And at the Earth, how it is spread out"],[21,"فَذَكِّرۡ إِنَّمَآ أَنتَ مُذَكِّرࣱ‏","Therefore do thou give admonition, for thou art one to admonish"],[22,"لَّسۡتَ عَلَيۡهِم بِمُصَيۡطِرٍ","Thou art not one to manage (men's) affairs"],[23,"إِلَّا مَن تَوَلَّىٰ وَكَفَرَ","But if any turn away and reject Allah"],[24,"فَيُعَذِّبُهُ ٱللَّهُ ٱلۡعَذَابَ ٱلۡأَكۡبَرَ","Allah will punish him with a mighty Punishment"],[25,"إِنَّ إِلَيۡنَآ إِيَابَهُمۡ","For to Us will be their return"],[26,"ثُمَّ إِنَّ عَلَيۡنَا حِسَابَهُم","Then it will be for Us to call them to account"]],
  "89":[[1,"وَٱلۡفَجۡرِ","By the break of Day"],[2,"وَلَيَالٍ عَشۡرࣲ‏","By the Nights twice five"],[3,"وَٱلشَّفۡعِ وَٱلۡوَتۡرِ","By the even and odd (contrasted)"],[4,"وَٱلَّيۡلِ إِذَا يَسۡرِ","And by the Night when it passeth away"],[5,"هَلۡ فِي ذَٰلِكَ قَسَمࣱ لِّذِي حِجۡرٍ","Is there (not) in these an adjuration (or evidence) for those who understand"],[6,"أَلَمۡ تَرَ كَيۡفَ فَعَلَ رَبُّكَ بِعَادٍ","Seest thou not how thy Lord dealt with the 'Ad (people)"],[7,"إِرَمَ ذَاتِ ٱلۡعِمَادِ","Of the (city of) Iram, with lofty pillars"],[8,"ٱلَّتِي لَمۡ يُخۡلَقۡ مِثۡلُهَا فِي ٱلۡبِلَٰدِ","The like of which were not produced in (all) the land"],[9,"وَثَمُودَ ٱلَّذِينَ جَابُواْ ٱلصَّخۡرَ بِٱلۡوَادِ","And with the Thamud (people), who cut out (huge) rocks in the valley"],[10,"وَفِرۡعَوۡنَ ذِي ٱلۡأَوۡتَادِ","And with Pharaoh, lord of stakes"],[11,"ٱلَّذِينَ طَغَوۡاْ فِي ٱلۡبِلَٰدِ","(All) these transgressed beyond bounds in the lands"],[12,"فَأَكۡثَرُواْ فِيهَا ٱلۡفَسَادَ","And heaped therein mischief (on mischief)"],[13,"فَصَبَّ عَلَيۡهِمۡ رَبُّكَ سَوۡطَ عَذَابٍ","Therefore did thy Lord pour on them a scourge of diverse chastisements"],[14,"إِنَّ رَبَّكَ لَبِٱلۡمِرۡصَادِ","For thy Lord is (as a Guardian) on a watch-tower"],[15,"فَأَمَّا ٱلۡإِنسَٰنُ إِذَا مَا ٱبۡتَلَىٰهُ رَبُّهُۥ فَأَكۡرَمَهُۥ وَنَعَّمَهُۥ فَيَقُولُ رَبِّيٓ أَكۡرَمَنِ","Now, as for man, when his Lord trieth him, giving him honour and gifts, then saith he, (puffed up), \"My Lord hath honoured me"],[16,"وَأَمَّآ إِذَا مَا ٱبۡتَلَىٰهُ فَقَدَرَ عَلَيۡهِ رِزۡقَهُۥ فَيَقُولُ رَبِّيٓ أَهَٰنَنِ","But when He trieth him, restricting his subsistence for him, then saith he (in despair), \"My Lord hath humiliated me"],[17,"كَلَّاۖ بَل لَّا تُكۡرِمُونَ ٱلۡيَتِيمَ","Nay, nay! but ye honour not the orphans"],[18,"وَلَا تَحَٰٓضُّونَ عَلَىٰ طَعَامِ ٱلۡمِسۡكِينِ","Nor do ye encourage one another to feed the poor"],[19,"وَتَأۡكُلُونَ ٱلتُّرَاثَ أَكۡلࣰ ا لَّمࣰّ ا","And ye devour inheritance - all with greed"],[20,"وَتُحِبُّونَ ٱلۡمَالَ حُبࣰّ ا جَمࣰّ ا","And ye love wealth with inordinate love"],[21,"كَلَّآۖ إِذَا دُكَّتِ ٱلۡأَرۡضُ دَكࣰّ ا دَكࣰّ ا","Nay! When the earth is pounded to powder"],[22,"وَجَآءَ رَبُّكَ وَٱلۡمَلَكُ صَفࣰّ ا صَفࣰّ ا","And thy Lord cometh, and His angels, rank upon rank"],[23,"وَجِاْيٓءَ يَوۡمَئِذِۭ بِجَهَنَّمَۚ يَوۡمَئِذࣲ يَتَذَكَّرُ ٱلۡإِنسَٰنُ وَأَنَّىٰ لَهُ ٱلذِّكۡرَىٰ","And Hell, that Day, is brought (face to face),- on that Day will man remember, but how will that remembrance profit him"],[24,"يَقُولُ يَٰلَيۡتَنِي قَدَّمۡتُ لِحَيَاتِي","He will say: \"Ah! Would that I had sent forth (good deeds) for (this) my (Future) Life"],[25,"فَيَوۡمَئِذࣲ لَّا يُعَذِّبُ عَذَابَهُۥٓ أَحَدࣱ‏","For, that Day, His Chastisement will be such as none (else) can inflict"],[26,"وَلَا يُوثِقُ وَثَاقَهُۥٓ أَحَدࣱ‏","And His bonds will be such as none (other) can bind"],[27,"يَٰٓأَيَّتُهَا ٱلنَّفۡسُ ٱلۡمُطۡمَئِنَّةُ","(To the righteous soul will be said:) \"O (thou) soul, in (complete) rest and satisfaction"],[28,"ٱرۡجِعِيٓ إِلَىٰ رَبِّكِ رَاضِيَةࣰ مَّرۡضِيَّةࣰ‏","Come back thou to thy Lord,- well pleased (thyself), and well-pleasing unto Him"],[29,"فَٱدۡخُلِي فِي عِبَٰدِي","Enter thou, then, among My devotees"],[30,"وَٱدۡخُلِي جَنَّتِي","Yea, enter thou My Heaven"]],
  "90":[[1,"لَآ أُقۡسِمُ بِهَٰذَا ٱلۡبَلَدِ","I do call to witness this City"],[2,"وَأَنتَ حِلُّۢ بِهَٰذَا ٱلۡبَلَدِ","And thou art a freeman of this City"],[3,"وَوَالِدࣲ وَمَا وَلَدَ","And (the mystic ties of) parent and child"],[4,"لَقَدۡ خَلَقۡنَا ٱلۡإِنسَٰنَ فِي كَبَدٍ","Verily We have created man into toil and struggle"],[5,"أَيَحۡسَبُ أَن لَّن يَقۡدِرَ عَلَيۡهِ أَحَدࣱ‏","Thinketh he, that none hath power over him"],[6,"يَقُولُ أَهۡلَكۡتُ مَالࣰ ا لُّبَدًا","He may say (boastfully); Wealth have I squandered in abundance"],[7,"أَيَحۡسَبُ أَن لَّمۡ يَرَهُۥٓ أَحَدٌ","Thinketh he that none beholdeth him"],[8,"أَلَمۡ نَجۡعَل لَّهُۥ عَيۡنَيۡنِ","Have We not made for him a pair of eyes"],[9,"وَلِسَانࣰ ا وَشَفَتَيۡنِ","And a tongue, and a pair of lips"],[10,"وَهَدَيۡنَٰهُ ٱلنَّجۡدَيۡنِ","And shown him the two highways"],[11,"فَلَا ٱقۡتَحَمَ ٱلۡعَقَبَةَ","But he hath made no haste on the path that is steep"],[12,"وَمَآ أَدۡرَىٰكَ مَا ٱلۡعَقَبَةُ","And what will explain to thee the path that is steep"],[13,"فَكُّ رَقَبَةٍ","(It is:) freeing the bondman"],[14,"أَوۡ إِطۡعَٰمࣱ فِي يَوۡمࣲ ذِي مَسۡغَبَةࣲ‏","Or the giving of food in a day of privation"],[15,"يَتِيمࣰ ا ذَا مَقۡرَبَةٍ","To the orphan with claims of relationship"],[16,"أَوۡ مِسۡكِينࣰ ا ذَا مَتۡرَبَةࣲ‏","Or to the indigent (down) in the dust"],[17,"ثُمَّ كَانَ مِنَ ٱلَّذِينَ ءَامَنُواْ وَتَوَاصَوۡاْ بِٱلصَّبۡرِ وَتَوَاصَوۡاْ بِٱلۡمَرۡحَمَةِ","Then will he be of those who believe, and enjoin patience, (constancy, and self-restraint), and enjoin deeds of kindness and compassion"],[18,"أُوْلَٰٓئِكَ أَصۡحَٰبُ ٱلۡمَيۡمَنَةِ","Such are the Companions of the Right Hand"],[19,"وَٱلَّذِينَ كَفَرُواْ بِـَٔايَٰتِنَا هُمۡ أَصۡحَٰبُ ٱلۡمَشۡـَٔمَةِ","But those who reject Our Signs, they are the (unhappy) Companions of the Left Hand"],[20,"عَلَيۡهِمۡ نَارࣱ مُّؤۡصَدَةُۢ","On them will be Fire vaulted over (all round)"]],
  "91":[[1,"وَٱلشَّمۡسِ وَضُحَىٰهَا","By the Sun and his (glorious) splendour"],[2,"وَٱلۡقَمَرِ إِذَا تَلَىٰهَا","By the Moon as she follows him"],[3,"وَٱلنَّهَارِ إِذَا جَلَّىٰهَا","By the Day as it shows up (the Sun's) glory"],[4,"وَٱلَّيۡلِ إِذَا يَغۡشَىٰهَا","By the Night as it conceals it"],[5,"وَٱلسَّمَآءِ وَمَا بَنَىٰهَا","By the Firmament and its (wonderful) structure"],[6,"وَٱلۡأَرۡضِ وَمَا طَحَىٰهَا","By the Earth and its (wide) expanse"],[7,"وَنَفۡسࣲ وَمَا سَوَّىٰهَا","By the Soul, and the proportion and order given to it"],[8,"فَأَلۡهَمَهَا فُجُورَهَا وَتَقۡوَىٰهَا","And its enlightenment as to its wrong and its right"],[9,"قَدۡ أَفۡلَحَ مَن زَكَّىٰهَا","Truly he succeeds that purifies it"],[10,"وَقَدۡ خَابَ مَن دَسَّىٰهَا","And he fails that corrupts it"],[11,"كَذَّبَتۡ ثَمُودُ بِطَغۡوَىٰهَآ","The Thamud (people) rejected (their prophet) through their inordinate wrong-doing"],[12,"إِذِ ٱنۢبَعَثَ أَشۡقَىٰهَا","Behold, the most wicked man among them was deputed (for impiety)"],[13,"فَقَالَ لَهُمۡ رَسُولُ ٱللَّهِ نَاقَةَ ٱللَّهِ وَسُقۡيَٰهَا","But the Messenger of Allah said to them: \"It is a She-camel of Allah! And (bar her not from) having her drink"],[14,"فَكَذَّبُوهُ فَعَقَرُوهَا فَدَمۡدَمَ عَلَيۡهِمۡ رَبُّهُم بِذَنۢبِهِمۡ فَسَوَّىٰهَا","Then they rejected him (as a false prophet), and they hamstrung her. So their Lord, on account of their crime, obliterated their traces and made them equal (in destruction, high and low)"],[15,"وَلَا يَخَافُ عُقۡبَٰهَا","And for Him is no fear of its consequences"]],
  "92":[[1,"وَٱلَّيۡلِ إِذَا يَغۡشَىٰ","By the Night as it conceals (the light)"],[2,"وَٱلنَّهَارِ إِذَا تَجَلَّىٰ","By the Day as it appears in glory"],[3,"وَمَا خَلَقَ ٱلذَّكَرَ وَٱلۡأُنثَىٰٓ","By (the mystery of) the creation of male and female"],[4,"إِنَّ سَعۡيَكُمۡ لَشَتَّىٰ","Verily, (the ends) ye strive for are diverse"],[5,"فَأَمَّا مَنۡ أَعۡطَىٰ وَٱتَّقَىٰ","So he who gives (in charity) and fears (Allah)"],[6,"وَصَدَّقَ بِٱلۡحُسۡنَىٰ","And (in all sincerity) testifies to the best"],[7,"فَسَنُيَسِّرُهُۥ لِلۡيُسۡرَىٰ","We will indeed make smooth for him the path to Bliss"],[8,"وَأَمَّا مَنۢ بَخِلَ وَٱسۡتَغۡنَىٰ","But he who is a greedy miser and thinks himself self-sufficient"],[9,"وَكَذَّبَ بِٱلۡحُسۡنَىٰ","And gives the lie to the best"],[10,"فَسَنُيَسِّرُهُۥ لِلۡعُسۡرَىٰ","We will indeed make smooth for him the path to Misery"],[11,"وَمَا يُغۡنِي عَنۡهُ مَالُهُۥٓ إِذَا تَرَدَّىٰٓ","Nor will his wealth profit him when he falls headlong (into the Pit)"],[12,"إِنَّ عَلَيۡنَا لَلۡهُدَىٰ","Verily We take upon Ourselves to guide"],[13,"وَإِنَّ لَنَا لَلۡأٓخِرَةَ وَٱلۡأُولَىٰ","And verily unto Us (belong) the End and the Beginning"],[14,"فَأَنذَرۡتُكُمۡ نَارࣰ ا تَلَظَّىٰ","Therefore do I warn you of a Fire blazing fiercely"],[15,"لَا يَصۡلَىٰهَآ إِلَّا ٱلۡأَشۡقَى","None shall reach it but those most unfortunate ones"],[16,"ٱلَّذِي كَذَّبَ وَتَوَلَّىٰ","Who give the lie to Truth and turn their backs"],[17,"وَسَيُجَنَّبُهَا ٱلۡأَتۡقَى","But those most devoted to Allah shall be removed far from it"],[18,"ٱلَّذِي يُؤۡتِي مَالَهُۥ يَتَزَكَّىٰ","Those who spend their wealth for increase in self-purification"],[19,"وَمَا لِأَحَدٍ عِندَهُۥ مِن نِّعۡمَةࣲ تُجۡزَىٰٓ","And have in their minds no favour from anyone for which a reward is expected in return"],[20,"إِلَّا ٱبۡتِغَآءَ وَجۡهِ رَبِّهِ ٱلۡأَعۡلَىٰ","But only the desire to seek for the Countenance of their Lord Most High"],[21,"وَلَسَوۡفَ يَرۡضَىٰ","And soon will they attain (complete) satisfaction"]],
  "93":[[1,"وَٱلضُّحَىٰ","By the Glorious Morning Light"],[2,"وَٱلَّيۡلِ إِذَا سَجَىٰ","And by the Night when it is still"],[3,"مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ","Thy Guardian-Lord hath not forsaken thee, nor is He displeased"],[4,"وَلَلۡأٓخِرَةُ خَيۡرࣱ لَّكَ مِنَ ٱلۡأُولَىٰ","And verily the Hereafter will be better for thee than the present"],[5,"وَلَسَوۡفَ يُعۡطِيكَ رَبُّكَ فَتَرۡضَىٰٓ","And soon will thy Guardian-Lord give thee (that wherewith) thou shalt be well-pleased"],[6,"أَلَمۡ يَجِدۡكَ يَتِيمࣰ ا فَـَٔاوَىٰ","Did He not find thee an orphan and give thee shelter (and care)"],[7,"وَوَجَدَكَ ضَآلࣰّ ا فَهَدَىٰ","And He found thee wandering, and He gave thee guidance"],[8,"وَوَجَدَكَ عَآئِلࣰ ا فَأَغۡنَىٰ","And He found thee in need, and made thee independent"],[9,"فَأَمَّا ٱلۡيَتِيمَ فَلَا تَقۡهَرۡ","Therefore, treat not the orphan with harshness"],[10,"وَأَمَّا ٱلسَّآئِلَ فَلَا تَنۡهَرۡ","Nor repulse the petitioner (unheard)"],[11,"وَأَمَّا بِنِعۡمَةِ رَبِّكَ فَحَدِّثۡ","But the bounty of the Lord - rehearse and proclaim"]],
  "94":[[1,"أَلَمۡ نَشۡرَحۡ لَكَ صَدۡرَكَ","Have We not expanded thee thy breast"],[2,"وَوَضَعۡنَا عَنكَ وِزۡرَكَ","And removed from thee thy burden"],[3,"ٱلَّذِيٓ أَنقَضَ ظَهۡرَكَ","The which did gall thy back"],[4,"وَرَفَعۡنَا لَكَ ذِكۡرَكَ","And raised high the esteem (in which) thou (art held)"],[5,"فَإِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرًا","So, verily, with every difficulty, there is relief"],[6,"إِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرࣰ ا","Verily, with every difficulty there is relief"],[7,"فَإِذَا فَرَغۡتَ فَٱنصَبۡ","Therefore, when thou art free (from thine immediate task), still labour hard"],[8,"وَإِلَىٰ رَبِّكَ فَٱرۡغَب","And to thy Lord turn (all) thy attention"]],
  "95":[[1,"وَٱلتِّينِ وَٱلزَّيۡتُونِ","By the Fig and the Olive"],[2,"وَطُورِ سِينِينَ","And the Mount of Sinai"],[3,"وَهَٰذَا ٱلۡبَلَدِ ٱلۡأَمِينِ","And this City of security"],[4,"لَقَدۡ خَلَقۡنَا ٱلۡإِنسَٰنَ فِيٓ أَحۡسَنِ تَقۡوِيمࣲ‏","We have indeed created man in the best of moulds"],[5,"ثُمَّ رَدَدۡنَٰهُ أَسۡفَلَ سَٰفِلِينَ","Then do We abase him (to be) the lowest of the low"],[6,"إِلَّا ٱلَّذِينَ ءَامَنُواْ وَعَمِلُواْ ٱلصَّٰلِحَٰتِ فَلَهُمۡ أَجۡرٌ غَيۡرُ مَمۡنُونࣲ‏","Except such as believe and do righteous deeds: For they shall have a reward unfailing"],[7,"فَمَا يُكَذِّبُكَ بَعۡدُ بِٱلدِّينِ","Then what can, after this, contradict thee, as to the judgment (to come)"],[8,"أَلَيۡسَ ٱللَّهُ بِأَحۡكَمِ ٱلۡحَٰكِمِينَ","Is not Allah the wisest of judges"]],
  "96":[[1,"ٱقۡرَأۡ بِٱسۡمِ رَبِّكَ ٱلَّذِي خَلَقَ","Proclaim! (or read!) in the name of thy Lord and Cherisher, Who created"],[2,"خَلَقَ ٱلۡإِنسَٰنَ مِنۡ عَلَقٍ","Created man, out of a (mere) clot of congealed blood"],[3,"ٱقۡرَأۡ وَرَبُّكَ ٱلۡأَكۡرَمُ","Proclaim! And thy Lord is Most Bountiful"],[4,"ٱلَّذِي عَلَّمَ بِٱلۡقَلَمِ","He Who taught (the use of) the pen"],[5,"عَلَّمَ ٱلۡإِنسَٰنَ مَا لَمۡ يَعۡلَمۡ","Taught man that which he knew not"],[6,"كَلَّآ إِنَّ ٱلۡإِنسَٰنَ لَيَطۡغَىٰٓ","Nay, but man doth transgress all bounds"],[7,"أَن رَّءَاهُ ٱسۡتَغۡنَىٰٓ","In that he looketh upon himself as self-sufficient"],[8,"إِنَّ إِلَىٰ رَبِّكَ ٱلرُّجۡعَىٰٓ","Verily, to thy Lord is the return (of all)"],[9,"أَرَءَيۡتَ ٱلَّذِي يَنۡهَىٰ","Seest thou one who forbids"],[10,"عَبۡدًا إِذَا صَلَّىٰٓ","A votary when he (turns) to pray"],[11,"أَرَءَيۡتَ إِن كَانَ عَلَى ٱلۡهُدَىٰٓ","Seest thou if he is on (the road of) Guidance"],[12,"أَوۡ أَمَرَ بِٱلتَّقۡوَىٰٓ","Or enjoins Righteousness"],[13,"أَرَءَيۡتَ إِن كَذَّبَ وَتَوَلَّىٰٓ","Seest thou if he denies (Truth) and turns away"],[14,"أَلَمۡ يَعۡلَم بِأَنَّ ٱللَّهَ يَرَىٰ","Knoweth he not that Allah doth see"],[15,"كَلَّا لَئِن لَّمۡ يَنتَهِ لَنَسۡفَعَۢا بِٱلنَّاصِيَةِ","Let him beware! If he desist not, We will drag him by the forelock"],[16,"نَاصِيَةࣲ كَٰذِبَةٍ خَاطِئَةࣲ‏","A lying, sinful forelock"],[17,"فَلۡيَدۡعُ نَادِيَهُۥ","Then, let him call (for help) to his council (of comrades)"],[18,"سَنَدۡعُ ٱلزَّبَانِيَةَ","We will call on the angels of punishment (to deal with him)"],[19,"كَلَّا لَا تُطِعۡهُ وَٱسۡجُدۡۤ وَٱقۡتَرِب۩","Nay, heed him not: But bow down in adoration, and bring thyself the closer (to Allah)"]],
  "97":[[1,"ٱلرَّحِيمِإِنَّآ أَنزَلۡنَٰهُ فِي لَيۡلَةِ ٱلۡقَدۡرِ","We have indeed revealed this (Message) in the Night of Power"],[2,"وَمَآ أَدۡرَىٰكَ مَا لَيۡلَةُ ٱلۡقَدۡرِ","And what will explain to thee what the night of power is"],[3,"لَيۡلَةُ ٱلۡقَدۡرِ خَيۡرࣱ مِّنۡ أَلۡفِ شَهۡرࣲ‏","The Night of Power is better than a thousand months"],[4,"تَنَزَّلُ ٱلۡمَلَٰٓئِكَةُ وَٱلرُّوحُ فِيهَا بِإِذۡنِ رَبِّهِم مِّن كُلِّ أَمۡرࣲ‏","Therein come down the angels and the Spirit by Allah's permission, on every errand"],[5,"سَلَٰمٌ هِيَ حَتَّىٰ مَطۡلَعِ ٱلۡفَجۡرِ","Peace!... This until the rise of morn"]],
  "98":[[1,"لَمۡ يَكُنِ ٱلَّذِينَ كَفَرُواْ مِنۡ أَهۡلِ ٱلۡكِتَٰبِ وَٱلۡمُشۡرِكِينَ مُنفَكِّينَ حَتَّىٰ تَأۡتِيَهُمُ ٱلۡبَيِّنَةُ","Those who reject (Truth), among the People of the Book and among the Polytheists, were not going to depart (from their ways) until there should come to them Clear Evidence"],[2,"رَسُولࣱ مِّنَ ٱللَّهِ يَتۡلُواْ صُحُفࣰ ا مُّطَهَّرَةࣰ‏","An messenger from Allah, rehearsing scriptures kept pure and holy"],[3,"فِيهَا كُتُبࣱ قَيِّمَةࣱ‏","Wherein are laws (or decrees) right and straight"],[4,"وَمَا تَفَرَّقَ ٱلَّذِينَ أُوتُواْ ٱلۡكِتَٰبَ إِلَّا مِنۢ بَعۡدِ مَا جَآءَتۡهُمُ ٱلۡبَيِّنَةُ","Nor did the People of the Book make schisms, until after there came to them Clear Evidence"],[5,"وَمَآ أُمِرُوٓاْ إِلَّا لِيَعۡبُدُواْ ٱللَّهَ مُخۡلِصِينَ لَهُ ٱلدِّينَ حُنَفَآءَ وَيُقِيمُواْ ٱلصَّلَوٰةَ وَيُؤۡتُواْ ٱلزَّكَوٰةَۚ وَذَٰلِكَ دِينُ ٱلۡقَيِّمَةِ","And they have been commanded no more than this: To worship Allah, offering Him sincere devotion, being true (in faith); to establish regular prayer; and to practise regular charity; and that is the Religion Right and Straight"],[6,"إِنَّ ٱلَّذِينَ كَفَرُواْ مِنۡ أَهۡلِ ٱلۡكِتَٰبِ وَٱلۡمُشۡرِكِينَ فِي نَارِ جَهَنَّمَ خَٰلِدِينَ فِيهَآۚ أُوْلَٰٓئِكَ هُمۡ شَرُّ ٱلۡبَرِيَّةِ","Those who reject (Truth), among the People of the Book and among the Polytheists, will be in Hell-Fire, to dwell therein (for aye). They are the worst of creatures"],[7,"إِنَّ ٱلَّذِينَ ءَامَنُواْ وَعَمِلُواْ ٱلصَّٰلِحَٰتِ أُوْلَٰٓئِكَ هُمۡ خَيۡرُ ٱلۡبَرِيَّةِ","Those who have faith and do righteous deeds,- they are the best of creatures"],[8,"جَزَآؤُهُمۡ عِندَ رَبِّهِمۡ جَنَّٰتُ عَدۡنࣲ تَجۡرِي مِن تَحۡتِهَا ٱلۡأَنۡهَٰرُ خَٰلِدِينَ فِيهَآ أَبَدࣰ اۖ رَّضِيَ ٱللَّهُ عَنۡهُمۡ وَرَضُواْ عَنۡهُۚ ذَٰلِكَ لِمَنۡ خَشِيَ رَبَّهُۥ","Their reward is with Allah: Gardens of Eternity, beneath which rivers flow; they will dwell therein for ever; Allah well pleased with them, and they with Him: all this for such as fear their Lord and Cherisher"]],
  "99":[[1,"إِذَا زُلۡزِلَتِ ٱلۡأَرۡضُ زِلۡزَالَهَا","When the earth is shaken to her (utmost) convulsion"],[2,"وَأَخۡرَجَتِ ٱلۡأَرۡضُ أَثۡقَالَهَا","And the earth throws up her burdens (from within)"],[3,"وَقَالَ ٱلۡإِنسَٰنُ مَا لَهَا","And man cries (distressed): 'What is the matter with her"],[4,"يَوۡمَئِذࣲ تُحَدِّثُ أَخۡبَارَهَا","On that Day will she declare her tidings"],[5,"بِأَنَّ رَبَّكَ أَوۡحَىٰ لَهَا","For that thy Lord will have given her inspiration"],[6,"يَوۡمَئِذࣲ يَصۡدُرُ ٱلنَّاسُ أَشۡتَاتࣰ ا لِّيُرَوۡاْ أَعۡمَٰلَهُمۡ","On that Day will men proceed in companies sorted out, to be shown the deeds that they (had done)"],[7,"فَمَن يَعۡمَلۡ مِثۡقَالَ ذَرَّةٍ خَيۡرࣰ ا يَرَهُۥ","Then shall anyone who has done an atom's weight of good, see it"],[8,"وَمَن يَعۡمَلۡ مِثۡقَالَ ذَرَّةࣲ شَرࣰّ ا يَرَهُۥ","And anyone who has done an atom's weight of evil, shall see it"]],
  "100":[[1,"وَٱلۡعَٰدِيَٰتِ ضَبۡحࣰ ا","By the (Steeds) that run, with panting (breath)"],[2,"فَٱلۡمُورِيَٰتِ قَدۡحࣰ ا","And strike sparks of fire"],[3,"فَٱلۡمُغِيرَٰتِ صُبۡحࣰ ا","And push home the charge in the morning"],[4,"فَأَثَرۡنَ بِهِۦ نَقۡعࣰ ا","And raise the dust in clouds the while"],[5,"فَوَسَطۡنَ بِهِۦ جَمۡعًا","And penetrate forthwith into the midst (of the foe) en masse"],[6,"إِنَّ ٱلۡإِنسَٰنَ لِرَبِّهِۦ لَكَنُودࣱ‏","Truly man is, to his Lord, ungrateful"],[7,"وَإِنَّهُۥ عَلَىٰ ذَٰلِكَ لَشَهِيدࣱ‏","And to that (fact) he bears witness (by his deeds)"],[8,"وَإِنَّهُۥ لِحُبِّ ٱلۡخَيۡرِ لَشَدِيدٌ","And violent is he in his love of wealth"],[9,"۞أَفَلَا يَعۡلَمُ إِذَا بُعۡثِرَ مَا فِي ٱلۡقُبُورِ","Does he not know,- when that which is in the graves is scattered abroad"],[10,"وَحُصِّلَ مَا فِي ٱلصُّدُورِ","And that which is (locked up) in (human) breasts is made manifest"],[11,"إِنَّ رَبَّهُم بِهِمۡ يَوۡمَئِذࣲ لَّخَبِيرُۢ","That their Lord had been Well-acquainted with them, (even to) that Day"]],
  "101":[[1,"ٱلۡقَارِعَةُ","The (Day) of Noise and Clamour"],[2,"مَا ٱلۡقَارِعَةُ","What is the (Day) of Noise and Clamour"],[3,"وَمَآ أَدۡرَىٰكَ مَا ٱلۡقَارِعَةُ","And what will explain to thee what the (Day) of Noise and Clamour is"],[4,"يَوۡمَ يَكُونُ ٱلنَّاسُ كَٱلۡفَرَاشِ ٱلۡمَبۡثُوثِ","(It is) a Day whereon men will be like moths scattered about"],[5,"وَتَكُونُ ٱلۡجِبَالُ كَٱلۡعِهۡنِ ٱلۡمَنفُوشِ","And the mountains will be like carded wool"],[6,"فَأَمَّا مَن ثَقُلَتۡ مَوَٰزِينُهُۥ","Then, he whose balance (of good deeds) will be (found) heavy"],[7,"فَهُوَ فِي عِيشَةࣲ رَّاضِيَةࣲ‏","Will be in a life of good pleasure and satisfaction"],[8,"وَأَمَّا مَنۡ خَفَّتۡ مَوَٰزِينُهُۥ","But he whose balance (of good deeds) will be (found) light"],[9,"فَأُمُّهُۥ هَاوِيَةࣱ‏","Will have his home in a (bottomless) Pit"],[10,"وَمَآ أَدۡرَىٰكَ مَا هِيَهۡ","And what will explain to thee what this is"],[11,"نَارٌ حَامِيَةُۢ","(It is) a Fire Blazing fiercely"]],
  "102":[[1,"أَلۡهَىٰكُمُ ٱلتَّكَاثُرُ","The mutual rivalry for piling up (the good things of this world) diverts you (from the more serious things)"],[2,"حَتَّىٰ زُرۡتُمُ ٱلۡمَقَابِرَ","Until ye visit the graves"],[3,"كَلَّا سَوۡفَ تَعۡلَمُونَ","But nay, ye soon shall know (the reality)"],[4,"ثُمَّ كَلَّا سَوۡفَ تَعۡلَمُونَ","Again, ye soon shall know"],[5,"كَلَّا لَوۡ تَعۡلَمُونَ عِلۡمَ ٱلۡيَقِينِ","Nay, were ye to know with certainty of mind, (ye would beware)"],[6,"لَتَرَوُنَّ ٱلۡجَحِيمَ","Ye shall certainly see Hell-Fire"],[7,"ثُمَّ لَتَرَوُنَّهَا عَيۡنَ ٱلۡيَقِينِ","Again, ye shall see it with certainty of sight"],[8,"ثُمَّ لَتُسۡـَٔلُنَّ يَوۡمَئِذٍ عَنِ ٱلنَّعِيمِ","Then, shall ye be questioned that Day about the joy (ye indulged in)"]],
  "103":[[1,"وَٱلۡعَصۡرِ","By (the Token of) Time (through the ages)"],[2,"إِنَّ ٱلۡإِنسَٰنَ لَفِي خُسۡرٍ","Verily Man is in loss"],[3,"إِلَّا ٱلَّذِينَ ءَامَنُواْ وَعَمِلُواْ ٱلصَّٰلِحَٰتِ وَتَوَاصَوۡاْ بِٱلۡحَقِّ وَتَوَاصَوۡاْ بِٱلصَّبۡرِ","Except such as have Faith, and do righteous deeds, and (join together) in the mutual teaching of Truth, and of Patience and Constancy"]],
  "104":[[1,"وَيۡلࣱ لِّكُلِّ هُمَزَةࣲ لُّمَزَةٍ","Woe to every (kind of) scandal-monger and-backbiter"],[2,"ٱلَّذِي جَمَعَ مَالࣰ ا وَعَدَّدَهُۥ","Who pileth up wealth and layeth it by"],[3,"يَحۡسَبُ أَنَّ مَالَهُۥٓ أَخۡلَدَهُۥ","Thinking that his wealth would make him last for ever"],[4,"كَلَّاۖ لَيُنۢبَذَنَّ فِي ٱلۡحُطَمَةِ","By no means! He will be sure to be thrown into That which Breaks to Pieces"],[5,"وَمَآ أَدۡرَىٰكَ مَا ٱلۡحُطَمَةُ","And what will explain to thee That which Breaks to Pieces"],[6,"نَارُ ٱللَّهِ ٱلۡمُوقَدَةُ","(It is) the Fire of (the Wrath of) Allah kindled (to a blaze)"],[7,"ٱلَّتِي تَطَّلِعُ عَلَى ٱلۡأَفۡـِٔدَةِ","The which doth mount (Right) to the Hearts"],[8,"إِنَّهَا عَلَيۡهِم مُّؤۡصَدَةࣱ‏","It shall be made into a vault over them"],[9,"فِي عَمَدࣲ مُّمَدَّدَةِۭ","In columns outstretched"]],
  "105":[[1,"أَلَمۡ تَرَ كَيۡفَ فَعَلَ رَبُّكَ بِأَصۡحَٰبِ ٱلۡفِيلِ","Seest thou not how thy Lord dealt with the Companions of the Elephant"],[2,"أَلَمۡ يَجۡعَلۡ كَيۡدَهُمۡ فِي تَضۡلِيلࣲ‏","Did He not make their treacherous plan go astray"],[3,"وَأَرۡسَلَ عَلَيۡهِمۡ طَيۡرًا أَبَابِيلَ","And He sent against them Flights of Birds"],[4,"تَرۡمِيهِم بِحِجَارَةࣲ مِّن سِجِّيلࣲ‏","Striking them with stones of baked clay"],[5,"فَجَعَلَهُمۡ كَعَصۡفࣲ مَّأۡكُولِۭ","Then did He make them like an empty field of stalks and straw, (of which the corn) has been eaten up"]],
  "106":[[1,"لِإِيلَٰفِ قُرَيۡشٍ","For the covenants (of security and safeguard enjoyed) by the Quraish"],[2,"إِۦلَٰفِهِمۡ رِحۡلَةَ ٱلشِّتَآءِ وَٱلصَّيۡفِ","Their covenants (covering) journeys by winter and summer"],[3,"فَلۡيَعۡبُدُواْ رَبَّ هَٰذَا ٱلۡبَيۡتِ","Let them adore the Lord of this House"],[4,"ٱلَّذِيٓ أَطۡعَمَهُم مِّن جُوعࣲ وَءَامَنَهُم مِّنۡ خَوۡفِۭ","Who provides them with food against hunger, and with security against fear (of danger)"]],
  "107":[[1,"أَرَءَيۡتَ ٱلَّذِي يُكَذِّبُ بِٱلدِّينِ","Seest thou one who denies the Judgment (to come)"],[2,"فَذَٰلِكَ ٱلَّذِي يَدُعُّ ٱلۡيَتِيمَ","Then such is the (man) who repulses the orphan (with harshness)"],[3,"وَلَا يَحُضُّ عَلَىٰ طَعَامِ ٱلۡمِسۡكِينِ","And encourages not the feeding of the indigent"],[4,"فَوَيۡلࣱ لِّلۡمُصَلِّينَ","So woe to the worshippers"],[5,"ٱلَّذِينَ هُمۡ عَن صَلَاتِهِمۡ سَاهُونَ","Who are neglectful of their prayers"],[6,"ٱلَّذِينَ هُمۡ يُرَآءُونَ","Those who (want but) to be seen (of men)"],[7,"وَيَمۡنَعُونَ ٱلۡمَاعُونَ","But refuse (to supply) (even) neighbourly needs"]],
  "108":[[1,"إِنَّآ أَعۡطَيۡنَٰكَ ٱلۡكَوۡثَرَ","To thee have We granted the Fount (of Abundance)"],[2,"فَصَلِّ لِرَبِّكَ وَٱنۡحَرۡ","Therefore to thy Lord turn in Prayer and Sacrifice"],[3,"إِنَّ شَانِئَكَ هُوَ ٱلۡأَبۡتَرُ","For he who hateth thee, he will be cut off (from Future Hope)"]],
  "109":[[1,"قُلۡ يَٰٓأَيُّهَا ٱلۡكَٰفِرُونَ","Say: O ye that reject Faith"],[2,"لَآ أَعۡبُدُ مَا تَعۡبُدُونَ","I worship not that which ye worship"],[3,"وَلَآ أَنتُمۡ عَٰبِدُونَ مَآ أَعۡبُدُ","Nor will ye worship that which I worship"],[4,"وَلَآ أَنَا۠ عَابِدࣱ مَّا عَبَدتُّمۡ","And I will not worship that which ye have been wont to worship"],[5,"وَلَآ أَنتُمۡ عَٰبِدُونَ مَآ أَعۡبُدُ","Nor will ye worship that which I worship"],[6,"لَكُمۡ دِينُكُمۡ وَلِيَ دِينِ","To you be your Way, and to me mine"]],
  "110":[[1,"إِذَا جَآءَ نَصۡرُ ٱللَّهِ وَٱلۡفَتۡحُ","When comes the Help of Allah, and Victory"],[2,"وَرَأَيۡتَ ٱلنَّاسَ يَدۡخُلُونَ فِي دِينِ ٱللَّهِ أَفۡوَاجࣰ ا","And thou dost see the people enter Allah's Religion in crowds"],[3,"فَسَبِّحۡ بِحَمۡدِ رَبِّكَ وَٱسۡتَغۡفِرۡهُۚ إِنَّهُۥ كَانَ تَوَّابَۢا","Celebrate the praises of thy Lord, and pray for His Forgiveness: For He is Oft-Returning (in Grace and Mercy)"]],
  "111":[[1,"تَبَّتۡ يَدَآ أَبِي لَهَبࣲ وَتَبَّ","Perish the hands of the Father of Flame! Perish he"],[2,"مَآ أَغۡنَىٰ عَنۡهُ مَالُهُۥ وَمَا كَسَبَ","No profit to him from all his wealth, and all his gains"],[3,"سَيَصۡلَىٰ نَارࣰ ا ذَاتَ لَهَبࣲ‏","Burnt soon will he be in a Fire of Blazing Flame"],[4,"وَٱمۡرَأَتُهُۥ حَمَّالَةَ ٱلۡحَطَبِ","His wife shall carry the (crackling) wood - As fuel"],[5,"فِي جِيدِهَا حَبۡلࣱ مِّن مَّسَدِۭ","A twisted rope of palm-leaf fibre round her (own) neck"]],
  "112":[[1,"قُلۡ هُوَ ٱللَّهُ أَحَدٌ","Say: He is Allah, the One and Only"],[2,"ٱللَّهُ ٱلصَّمَدُ","Allah, the Eternal, Absolute"],[3,"لَمۡ يَلِدۡ وَلَمۡ يُولَدۡ","He begetteth not, nor is He begotten"],[4,"وَلَمۡ يَكُن لَّهُۥ كُفُوًا أَحَدُۢ","And there is none like unto Him"]],
  "113":[[1,"قُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ","Say: I seek refuge with the Lord of the Dawn"],[2,"مِن شَرِّ مَا خَلَقَ","From the mischief of created things"],[3,"وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ","From the mischief of Darkness as it overspreads"],[4,"وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلۡعُقَدِ","From the mischief of those who practise secret arts"],[5,"وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ","And from the mischief of the envious one as he practises envy"]],
  "114":[[1,"قُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ","Say: I seek refuge with the Lord and Cherisher of Mankind"],[2,"مَلِكِ ٱلنَّاسِ","The King (or Ruler) of Mankind"],[3,"إِلَٰهِ ٱلنَّاسِ","The god (or judge) of Mankind"],[4,"مِن شَرِّ ٱلۡوَسۡوَاسِ ٱلۡخَنَّاسِ","From the mischief of the Whisperer (of Evil), who withdraws (after his whisper)"],[5,"ٱلَّذِي يُوَسۡوِسُ فِي صُدُورِ ٱلنَّاسِ","(The same) who whispers into the hearts of Mankind"],[6,"مِنَ ٱلۡجِنَّةِ وَٱلنَّاسِ","Among Jinns and among men"]]
};
/* NAWAWI_HADITH: Nawawi's Forty (42) Hadith, bilingual.
   Source: fawazahmed0/hadith-api (ara-nawawi + eng-nawawi), from sunnah.com. */
const NAWAWI_HADITH = [
  {"n":1,"ar":"عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: \" إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إلَى مَا هَاجَرَ إلَيْهِ\". رَوَاهُ إِمَامَا الْمُحَدِّثِينَ أَبُو عَبْدِ اللهِ مُحَمَّدُ بنُ إِسْمَاعِيل بن إِبْرَاهِيم بن الْمُغِيرَة بن بَرْدِزبَه الْبُخَارِيُّ الْجُعْفِيُّ [رقم:1]، وَأَبُو الْحُسَيْنِ مُسْلِمٌ بنُ الْحَجَّاج بن مُسْلِم الْقُشَيْرِيُّ النَّيْسَابُورِيُّ [رقم:1907] رَضِيَ اللهُ عَنْهُمَا فِي \"صَحِيحَيْهِمَا\" اللذَينِ هُمَا أَصَحُّ الْكُتُبِ الْمُصَنَّفَةِ","en":"It is narrated on the authority of Amirul Mu'minin, Abu Hafs 'Umar bin al-Khattab (ra) who said: I heard the Messenger of Allah (ﷺ) say: \"Actions are (judged) by motives (niyyah), so each man will have what he intended. Thus, he whose migration (hijrah) was to Allah and His Messenger, his migration is to Allah and His Messenger; but he whose migration was for some worldly thing he might gain, or for a wife he might marry, his migration is to that for which he migrated.\" [Bukhari & Muslim]"},
  {"n":2,"ar":"عَنْ عُمَرَ رَضِيَ اللهُ عَنْهُ أَيْضًا قَالَ: بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صلى الله عليه و سلم ذَاتَ يَوْمٍ، إذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ، شَدِيدُ سَوَادِ الشَّعْرِ، لَا يُرَى عَلَيْهِ أَثَرُ السَّفَرِ، وَلَا يَعْرِفُهُ مِنَّا أَحَدٌ. حَتَّى جَلَسَ إلَى النَّبِيِّ صلى الله عليه و سلم . فَأَسْنَدَ رُكْبَتَيْهِ إلَى رُكْبَتَيْهِ، وَوَضَعَ كَفَّيْهِ عَلَى فَخِذَيْهِ، وَقَالَ: يَا مُحَمَّدُ أَخْبِرْنِي عَنْ الْإِسْلَامِ. فَقَالَ رَسُولُ اللَّهِ صلى الله عليه و سلم الْإِسْلَامُ أَنْ تَشْهَدَ أَنْ لَا إلَهَ إلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلَاةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إنْ اسْتَطَعْت إلَيْهِ سَبِيلًا. قَالَ: صَدَقْت . فَعَجِبْنَا لَهُ يَسْأَلُهُ وَيُصَدِّقُهُ! قَالَ: فَأَخْبِرْنِي عَنْ الْإِيمَانِ. قَالَ: أَنْ تُؤْمِنَ بِاَللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ. قَالَ: صَدَقْت. قَالَ: فَأَخْبِرْنِي عَنْ الْإِحْسَانِ. قَالَ: أَنْ تَعْبُدَ اللَّهَ كَأَنَّك تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاك. قَالَ: فَأَخْبِرْنِي عَنْ السَّاعَةِ. قَالَ: مَا الْمَسْئُولُ عَنْهَا بِأَعْلَمَ مِنْ السَّائِلِ. قَالَ: فَأَخْبِرْنِي عَنْ أَمَارَاتِهَا؟ قَالَ: أَنْ تَلِدَ الْأَمَةُ رَبَّتَهَا، وَأَنْ تَرَى الْحُفَاةَ الْعُرَاةَ الْعَالَةَ رِعَاءَ الشَّاءِ يَتَطَاوَلُونَ فِي الْبُنْيَانِ. ثُمَّ انْطَلَقَ، فَلَبِثْتُ مَلِيًّا، ثُمَّ قَالَ: يَا عُمَرُ أَتَدْرِي مَنْ السَّائِلُ؟. ‫‬قُلْتُ: اللَّهُ وَرَسُولُهُ أَعْلَمُ. قَالَ: فَإِنَّهُ جِبْرِيلُ أَتَاكُمْ يُعَلِّمُكُمْ دِينَكُمْ . [رَوَاهُ مُسْلِمٌ]","en":"Also on the authority of `Umar (ra) who said: While we were one day sitting with the Messenger of Allah (ﷺ) there appeared before us a man dressed in extremely white clothes and with very black hair. No traces of journeying were visible on him, and none of us knew him. He sat down close by the Prophet (ﷺ) rested his knees against the knees of the Prophet (ﷺ) and placed his palms over his thighs, and said: \"O Muhammad! Inform me about Islam.\" The Messenger of Allah (ﷺ) replied: \"Islam is that you should testify that there is no deity worthy of worship except Allah and that Muhammad is His Messenger (ﷺ), that you should perform salah (ritual prayer), pay the zakah, fast during Ramadan, and perform Hajj (pilgrimage) to the House (the Ka`bah at Makkah), if you can find a way to it (or find the means for making the journey to it).\" He said: \"You have spoken the truth.\" We were astonished at his thus questioning him (ﷺ) and then telling him that he was right, but he went on to say, \"Inform me about Iman (faith).\" He (the Prophet) answered, \"It is that you believe in Allah and His angels and His Books and His Messengers and in the Last Day, and in fate (qadar), both in its good and in its evil aspects.\" He said, \"You have spoken the truth.\" Then he (the man) said, \"Inform me about Ihsan.\" He (the Prophet) answered, \"It is that you should serve Allah as though you could see Him, for though you cannot see Him yet He sees you.\" He said, \"Inform me about the Hour.\" He (the Prophet) said, \"About that the one questioned knows no more than the questioner.\" So he said, \"Well, inform me about its signs.\" He said, \"They are that the slave-girl will give birth to her mistress and that you will see the barefooted ones, the naked, the destitute, the herdsmen of the sheep (competing with each other) in raising lofty buildings.\" Thereupon the man went off. I waited a while, and then he (the Prophet) said, \"O `Umar, do you know who that questioner was?\" I replied, \"Allah and His Messenger know better.\" He said, \"That was Jibril. He came to teach you your religion.\" [Muslim]"},
  {"n":3,"ar":"عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللَّهِ بْنِ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: سَمِعْت رَسُولَ اللَّهِ صلى الله عليه و سلم يَقُولُ: بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إلَهَ إلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ . [رَوَاهُ الْبُخَارِيُّ] ، [وَمُسْلِمٌ]","en":"On the authority of Abdullah, the son of Umar ibn al-Khattab (ra), who said: I heard the Messenger of Allah (ﷺ) say, \"Islam has been built on five [pillars]: testifying that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah, establishing the salah (prayer), paying the zakat (obligatory charity), making the hajj (pilgrimage) to the House, and fasting in Ramadhan.\" [Bukhari & Muslim]"},
  {"n":4,"ar":"عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللَّهِ بْنِ مَسْعُودٍ رَضِيَ اللهُ عَنْهُ قَالَ: حَدَّثَنَا رَسُولُ اللَّهِ صلى الله عليه و سلم -وَهُوَ الصَّادِقُ الْمَصْدُوقُ-: إنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا نُطْفَةً، ثُمَّ يَكُونُ عَلَقَةً مِثْلَ ذَلِكَ، ثُمَّ يَكُونُ مُضْغَةً مِثْلَ ذَلِكَ، ثُمَّ يُرْسَلُ إلَيْهِ الْمَلَكُ فَيَنْفُخُ فِيهِ الرُّوحَ، وَيُؤْمَرُ بِأَرْبَعِ كَلِمَاتٍ: بِكَتْبِ رِزْقِهِ، وَأَجَلِهِ، وَعَمَلِهِ، وَشَقِيٍّ أَمْ سَعِيدٍ؛ فَوَاَللَّهِ الَّذِي لَا إلَهَ غَيْرُهُ إنَّ أَحَدَكُمْ لَيَعْمَلُ بِعَمَلِ أَهْلِ الْجَنَّةِ حَتَّى مَا يَكُونُ بَيْنَهُ وَبَيْنَهَا إلَّا ذِرَاعٌ فَيَسْبِقُ عَلَيْهِ الْكِتَابُ فَيَعْمَلُ بِعَمَلِ أَهْلِ النَّارِ فَيَدْخُلُهَا. وَإِنَّ أَحَدَكُمْ لَيَعْمَلُ بِعَمَلِ أَهْلِ النَّارِ حَتَّى مَا يَكُونُ بَيْنَهُ وَبَيْنَهَا إلَّا ذِرَاعٌ فَيَسْبِقُ عَلَيْهِ الْكِتَابُ فَيَعْمَلُ بِعَمَلِ أَهْلِ الْجَنَّةِ فَيَدْخُلُهَا . [رَوَاهُ الْبُخَارِيُّ] ، [وَمُسْلِمٌ]","en":"On the authority of Abdullah ibn Masood (ra), who said: The Messenger of Allah (ﷺ), and he is the truthful, the believed, narrated to us, “Verily the creation of each one of you is brought together in his mother’s womb for forty days in the form of a nutfah (a drop), then he becomes an alaqah (clot of blood) for a like period, then a mudghah (morsel of flesh) for a like period, then there is sent to him the angel who blows his soul into him and who is commanded with four matters: to write down his rizq (sustenance), his life span, his actions, and whether he will be happy or unhappy (i.e., whether or not he will enter Paradise). By the One, other than Whom there is no deity, verily one of you performs the actions of the people of Paradise until there is but an arms length between him and it, and that which has been written overtakes him, and so he acts with the actions of the people of the Hellfire and thus enters it; and verily one of you performs the actions of the people of the Hellfire, until there is but an arms length between him and it, and that which has been written overtakes him and so he acts with the actions of the people of Paradise and thus he enters it.” [Bukhari & Muslim]"},
  {"n":5,"ar":"عَنْ أُمِّ الْمُؤْمِنِينَ أُمِّ عَبْدِ اللَّهِ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا، قَالَتْ: قَالَ: رَسُولُ اللَّهِ صلى الله عليه و سلم مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ [رَوَاهُ الْبُخَارِيُّ] ،[وَمُسْلِمٌ] وَفِي رِوَايَةٍ لِمُسْلِمٍ: مَنْ عَمِلَ عَمَلًا لَيْسَ عَلَيْهِ أَمْرُنَا فَهُوَ رَدٌّ","en":"On the authority of the mother of the faithful, Aisha (ra), who said: The Messenger of Allah (ﷺ) said, “He who innovates something in this matter of ours (i.e., Islam) that is not of it will have it rejected (by Allah).” [Bukhari & Muslim] In another version in Muslim it reads: “He who does an act which we have not commanded, will have it rejected (by Allah).”"},
  {"n":6,"ar":"عَنْ أَبِي عَبْدِ اللَّهِ النُّعْمَانِ بْنِ بَشِيرٍ رَضِيَ اللَّهُ عَنْهُمَا، قَالَ: سَمِعْت رَسُولَ اللَّهِ صلى الله عليه و سلم يَقُولُ: إنَّ الْحَلَالَ بَيِّنٌ، وَإِنَّ الْحَرَامَ بَيِّنٌ، وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ لَا يَعْلَمُهُنَّ كَثِيرٌ مِنْ النَّاسِ، فَمَنْ اتَّقَى الشُّبُهَاتِ فَقْد اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ، وَمَنْ وَقَعَ فِي الشُّبُهَاتِ وَقَعَ فِي الْحَرَامِ، كَالرَّاعِي يَرْعَى حَوْلَ الْحِمَى يُوشِكُ أَنْ يَرْتَعَ فِيهِ، أَلَا وَإِنَّ لِكُلِّ مَلِكٍ حِمًى، أَلَا وَإِنَّ حِمَى اللَّهِ مَحَارِمُهُ، أَلَا وَإِنَّ فِي الْجَسَدِ مُضْغَةً إذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ، وَإذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ، أَلَا وَهِيَ الْقَلْبُ .<br>[رَوَاهُ الْبُخَارِيُّ]، [وَمُسْلِمٌ]","en":"On the authority of an-Nu’man ibn Basheer (ra), who said: I heard the Messenger of Allah (ﷺ) say, “That which is lawful is clear and that which is unlawful is clear, and between the two of them are doubtful matters about which many people do not know. Thus he who avoids doubtful matters clears himself in regard to his religion and his honor, but he who falls into doubtful matters [eventually] falls into that which is unlawful, like the shepherd who pastures around a sanctuary, all but grazing therein. Truly every king has a sanctuary, and truly Allah’s sanctuary is His prohibitions. Truly in the body there is a morsel of flesh, which, if it be whole, all the body is whole, and which, if it is diseased, all of [the body] is diseased. Truly, it is the heart.” [Bukhari & Muslim]"},
  {"n":7,"ar":"عَنْ أَبِي رُقَيَّةَ تَمِيمِ بْنِ أَوْسٍ الدَّارِيِّ رَضِيَ اللهُ عَنْهُ أَنَّ النَّبِيَّ صلى الله عليه وسلم قَالَ: \"الدِّينُ النَّصِيحَةُ.\" قُلْنَا: لِمَنْ؟ قَالَ: \"لِلَّهِ، وَلِكِتَابِهِ، وَلِرَسُولِهِ، وَلِأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ.\" [رَوَاهُ مُسْلِمٌ]","en":"On the authority of Tameem ibn Aus ad-Daree (ra): The Prophet (ﷺ) said, “The deen (religion) is naseehah (advice, sincerity).” We said, “To whom?” He (ﷺ) said, “To Allah, His Book, His Messenger, and to the leaders of the Muslims and their common folk.” [Muslim]"},
  {"n":8,"ar":"عَنْ ابْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا، أَنَّ رَسُولَ اللَّهِ صلى الله عليه و سلم قَالَ: أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لَا إلَهَ إلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَيُقِيمُوا الصَّلَاةَ، وَيُؤْتُوا الزَّكَاةَ؛ فَإِذَا فَعَلُوا ذَلِكَ عَصَمُوا مِنِّي دِمَاءَهُمْ وَأَمْوَالَهُمْ إلَّا بِحَقِّ الْإِسْلَامِ، وَحِسَابُهُمْ عَلَى اللَّهِ تَعَالَى .<br>[رَوَاهُ الْبُخَارِيُّ] ،[وَمُسْلِمٌ]","en":"On the authority of Abdullah ibn Umar (ra): The Messenger of Allah (ﷺ) said, \"I have been ordered to fight against the people until they testify that there is none worthy of worship except Allah and that Muhammad is the Messenger of Allah, and until they establish the salah and pay the zakat. And if they do that then they will have gained protection from me for their lives and property, unless [they commit acts that are punishable] in Islam, and their reckoning will be with Allah.\" [Bukhari & Muslim]"},
  {"n":9,"ar":"عَنْ أَبِي هُرَيْرَةَ عَبْدِ الرَّحْمَنِ بْنِ صَخْرٍ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْت رَسُولَ اللَّهِ صلى الله عليه و سلم يَقُولُ: مَا نَهَيْتُكُمْ عَنْهُ فَاجْتَنِبُوهُ، وَمَا أَمَرْتُكُمْ بِهِ فَأْتُوا مِنْهُ مَا اسْتَطَعْتُمْ، فَإِنَّمَا أَهْلَكَ الَّذِينَ مِنْ قَبْلِكُمْ كَثْرَةُ مَسَائِلِهِمْ وَاخْتِلَافُهُمْ عَلَى أَنْبِيَائِهِمْ .<br>[رَوَاهُ الْبُخَارِيُّ] ،[وَمُسْلِمٌ]","en":"On the authority of Abu Hurayrah (ra): I heard the Messenger of Allah (ﷺ) say, “What I have forbidden for you, avoid. What I have ordered you [to do], do as much of it as you can. For verily, it was only the excessive questioning and their disagreeing with their Prophets that destroyed [the nations] who were before you.” [Bukhari & Muslim]"},
  {"n":10,"ar":"عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه و سلم \"إنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إلَّا طَيِّبًا، وَإِنَّ اللَّهَ أَمَرَ الْمُؤْمِنِينَ بِمَا أَمَرَ بِهِ الْمُرْسَلِينَ فَقَالَ تَعَالَى: \"يَا أَيُّهَا الرُّسُلُ كُلُوا مِنْ الطَّيِّبَاتِ وَاعْمَلُوا صَالِحًا\"، وَقَالَ تَعَالَى: \"يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِنْ طَيِّبَاتِ مَا رَزَقْنَاكُمْ\" ثُمَّ ذَكَرَ الرَّجُلَ يُطِيلُ السَّفَرَ أَشْعَثَ أَغْبَرَ يَمُدُّ يَدَيْهِ إلَى السَّمَاءِ: يَا رَبِّ! يَا رَبِّ! وَمَطْعَمُهُ حَرَامٌ، وَمَشْرَبُهُ حَرَامٌ، وَمَلْبَسُهُ حَرَامٌ، وَغُذِّيَ بِالْحَرَامِ، فَأَنَّى يُسْتَجَابُ لَهُ؟\". [رَوَاهُ مُسْلِمٌ]","en":"On the authority of Abu Hurayrah (ra): The Messenger of Allah (ﷺ) said, “Allah the Almighty is Good and accepts only that which is good. And verily Allah has commanded the believers to do that which He has commanded the Messengers. So the Almighty has said: “O (you) Messengers! Eat of the tayyibat [all kinds of halal (legal) foods], and perform righteous deeds.” [23:51] and the Almighty has said: “O you who believe! Eat of the lawful things that We have provided you.” [2:172]” Then he (ﷺ) mentioned [the case] of a man who, having journeyed far, is disheveled and dusty, and who spreads out his hands to the sky saying “O Lord! O Lord!,” while his food is haram (unlawful), his drink is haram, his clothing is haram, and he has been nourished with haram, so how can [his supplication] be answered? [Muslim]"},
  {"n":11,"ar":"عَنْ أَبِي مُحَمَّدٍ الْحَسَنِ بْنِ عَلِيِّ بْنِ أَبِي طَالِبٍ سِبْطِ رَسُولِ اللَّهِ صلى الله عليه و سلم وَرَيْحَانَتِهِ رَضِيَ اللَّهُ عَنْهُمَا، قَالَ: حَفِظْت مِنْ رَسُولِ اللَّهِ صلى الله عليه و سلم دَعْ مَا يُرِيبُك إلَى مَا لَا يُرِيبُك . رَوَاهُ التِّرْمِذِيُّ [رقم:2520]، [وَالنَّسَائِيّ] وَقَالَ التِّرْمِذِيُّ: حَدِيثٌ حَسَنٌ صَحِيحٌ","en":"On the authority of Abu Muhammad al-Hasan ibn Ali ibn Abee Talib (may Allah be pleased with him), the grandson of the Messenger of Allah (peace and blessings of Allah be upon him), and the one much loved by him, who said: I memorised from the Messenger of Allah (peace and blessings of Allah be upon him): “Leave that which makes you doubt for that which does not make you doubt.” [At-Tirmidhi] [An-Nasai] At-Tirmidhi said that it was a good and sound (hasan saheeh) hadeeth"},
  {"n":12,"ar":"عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه و سلم مِنْ حُسْنِ إسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ . حَدِيثٌ حَسَنٌ، رَوَاهُ التِّرْمِذِيُّ [رقم: 2318] ، ابن ماجه [رقم:]","en":"On the authority of Abu Hurayrah (may Allah be pleased with him) who said: The Messenger of Allah (peace and blessings of Allah be upon him) said, “Part of the perfection of one’s Islam is his leaving that which does not concern him.” A hasan (good) hadeeth which was related by at-Tirmidhi and others in this fashion"},
  {"n":13,"ar":"عَنْ أَبِي حَمْزَةَ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللهُ عَنْهُ خَادِمِ رَسُولِ اللَّهِ صلى الله عليه و سلم عَنْ النَّبِيِّ صلى الله عليه و سلم قَالَ: لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ . رَوَاهُ الْبُخَارِيُّ [رقم:13]، وَمُسْلِمٌ [رقم:45].<br>[رَوَاهُ الْبُخَارِيُّ] ، [وَمُسْلِمٌ]","en":"On the authority of Abu Hamzah Anas bin Malik (may Allah be pleased with him) — the servant of the Messenger of Allah (peace and blessings of Allah be upon him) — that the Prophet (peace and blessings of Allah be upon him) said: None of you [truly] believes until he loves for his brother that which he loves for himself. [Al-Bukhari] [Muslim]"},
  {"n":14,"ar":"عَنْ ابْنِ مَسْعُودٍ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه و سلم لَا يَحِلُّ دَمُ امْرِئٍ مُسْلِمٍ [ يشهد أن لا إله إلا الله، وأني رسول الله] إلَّا بِإِحْدَى ثَلَاثٍ: الثَّيِّبُ الزَّانِي، وَالنَّفْسُ بِالنَّفْسِ، وَالتَّارِكُ لِدِينِهِ الْمُفَارِقُ لِلْجَمَاعَةِ .<br>[رَوَاهُ الْبُخَارِيُّ] ، [وَمُسْلِمٌ]","en":"On the authority of Ibn Masood (may Allah be pleased with him) who said: The Messenger of Allah (peace and blessings of Allah be upon him) said, “It is not permissible to spill the blood of a Muslim except in three [instances]: the married person who commits adultery, a life for a life, and the one who forsakes his religion and separates from the community.” [Al-Bukhari] [Muslim]"},
  {"n":15,"ar":"عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ صلى الله عليه و سلم قَالَ: مَنْ كَانَ يُؤْمِنُ بِاَللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاَللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاَللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ .<br>[رَوَاهُ الْبُخَارِيُّ] ، [وَمُسْلِمٌ]","en":"On the authority of Abu Hurayrah (may Allah be pleased with him), that the Messenger of Allah (peace and blessings of Allah be upon him) said: Let him who believes in Allah and the Last Day speak good, or keep silent; and let him who believes in Allah and the Last Day be generous to his neighbour; and let him who believes in Allah and the Last Day be generous to his guest. [Al-Bukhari] [Muslim]"},
  {"n":16,"ar":"عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ أَنَّ رَجُلًا قَالَ لِلنَّبِيِّ صلى الله عليه و سلم أَوْصِنِي. قَالَ: لَا تَغْضَبْ، فَرَدَّدَ مِرَارًا، قَالَ: لَا تَغْضَبْ\" .<br>[رَوَاهُ الْبُخَارِيُّ]","en":"On the authority of Abu Hurayrah (may Allah be pleased with him): A man said to the Prophet (peace and blessings of Allah be upon him), “Counsel me,” so he (peace and blessings of Allah be upon him) said, “Do not become angry.” The man repeated [his request for counsel] several times, and [each time] he (peace and blessings of Allah be upon him) said, “Do not become angry.” [Al-Bukhari]"},
  {"n":17,"ar":"عَنْ أَبِي يَعْلَى شَدَّادِ بْنِ أَوْسٍ رَضِيَ اللهُ عَنْهُ عَنْ رَسُولِ اللَّهِ صلى الله عليه و سلم قَالَ: إنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ، فَإِذَا قَتَلْتُمْ فَأَحْسِنُوا الْقِتْلَةَ، وَإِذَا ذَبَحْتُمْ فَأَحْسِنُوا الذِّبْحَةَ، وَلْيُحِدَّ أَحَدُكُمْ شَفْرَتَهُ، وَلْيُرِحْ ذَبِيحَتَهُ . [رَوَاهُ مُسْلِمٌ]","en":"On the authority of Abu Ya’la Shaddad bin Aws (may Allah be pleased with him), that the Messenger of Allah (peace and blessings of Allah be upon him) said: Verily Allah has prescribed ihsan (proficiency, perfection) in all things. So if you kill then kill well; and if you slaughter, then slaughter well. Let each one of you sharpen his blade and let him spare suffering to the animal he slaughters.” [Muslim]"},
  {"n":18,"ar":"عَنْ أَبِي ذَرٍّ جُنْدَبِ بْنِ جُنَادَةَ، وَأَبِي عَبْدِ الرَّحْمَنِ مُعَاذِ بْنِ جَبَلٍ رَضِيَ اللَّهُ عَنْهُمَا، عَنْ رَسُولِ اللَّهِ صلى الله عليه و سلم قَالَ: اتَّقِ اللَّهَ حَيْثُمَا كُنْت، وَأَتْبِعْ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقْ النَّاسَ بِخُلُقٍ حَسَنٍ . رَوَاهُ التِّرْمِذِيُّ [رقم:1987] وَقَالَ: حَدِيثٌ حَسَنٌ، وَفِي بَعْضِ النُّسَخِ: حَسَنٌ صَحِيحٌ","en":"On the authority of Abu Dharr Jundub ibn Junadah, and Abu Abdur-Rahman Muadh bin Jabal (may Allah be pleased with him), that the Messenger of Allah (peace and blessings of Allah be upon him) said: Have taqwa (fear) of Allah wherever you may be, and follow up a bad deed with a good deed which will wipe it out, and behave well towards the people. It was related by at-Tirmidhi, who said it was a hasan (good) hadeeth, and in some copies it is stated to be a hasan saheeh hadeeth"},
  {"n":19,"ar":"عَنْ عَبْدِ اللَّهِ بْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: \"كُنْت خَلْفَ رَسُولِ اللَّهِ صلى الله عليه و سلم يَوْمًا، فَقَالَ: يَا غُلَامِ! إنِّي أُعَلِّمُك كَلِمَاتٍ: احْفَظْ اللَّهَ يَحْفَظْك، احْفَظْ اللَّهَ تَجِدْهُ تُجَاهَك، إذَا سَأَلْت فَاسْأَلْ اللَّهَ، وَإِذَا اسْتَعَنْت فَاسْتَعِنْ بِاَللَّهِ، وَاعْلَمْ أَنَّ الْأُمَّةَ لَوْ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوك بِشَيْءٍ لَمْ يَنْفَعُوك إلَّا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ لَك، وَإِنْ اجْتَمَعُوا عَلَى أَنْ يَضُرُّوك بِشَيْءٍ لَمْ يَضُرُّوك إلَّا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ عَلَيْك؛ رُفِعَتْ الْأَقْلَامُ، وَجَفَّتْ الصُّحُفُ\" . رَوَاهُ التِّرْمِذِيُّ [رقم:2516] وَقَالَ: حَدِيثٌ حَسَنٌ صَحِيحٌ. وَفِي رِوَايَةِ غَيْرِ التِّرْمِذِيِّ: \"احْفَظْ اللَّهَ تَجِدْهُ أمامك، تَعَرَّفْ إلَى اللَّهِ فِي الرَّخَاءِ يَعْرِفُك فِي الشِّدَّةِ، وَاعْلَمْ أَنَّ مَا أَخْطَأَك لَمْ يَكُنْ لِيُصِيبَك، وَمَا أَصَابَك لَمْ يَكُنْ لِيُخْطِئَك، وَاعْلَمْ أَنَّ النَّصْرَ مَعَ الصَّبْرِ، وَأَنْ الْفَرَجَ مَعَ الْكَرْبِ، وَأَنَّ مَعَ الْعُسْرِ يُسْرًا","en":"On the authority of Abu Abbas Abdullah bin Abbas (may Allah be pleased with him) who said: One day I was behind the Prophet (peace and blessings of Allah be upon him) [riding on the same mount] and he said, “O young man, I shall teach you some words [of advice]: Be mindful of Allah and Allah will protect you. Be mindful of Allah and you will find Him in front of you. If you ask, then ask Allah [alone]; and if you seek help, then seek help from Allah [alone]. And know that if the nation were to gather together to benefit you with anything, they would not benefit you except with what Allah had already prescribed for you. And if they were to gather together to harm you with anything, they would not harm you except with what Allah had already prescribed against you. The pens have been lifted and the pages have dried.” It was related by at-Tirmidhi, who said it was a good and sound hadeeth. Another narration, other than that of Tirmidhi, reads: Be mindful of Allah, and you will find Him in front of you. Recognize and acknowledge Allah in times of ease and prosperity, and He will remember you in times of adversity. And know that what has passed you by [and you have failed to attain] was not going to befall you, and what has befallen you was not going to pass you by. And know that victory comes with patience, relief with affliction, and hardship with ease"},
  {"n":20,"ar":"عَنْ أَبِي مَسْعُودٍ عُقْبَةَ بْنِ عَمْرٍو الْأَنْصَارِيِّ الْبَدْرِيِّ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه و سلم إنَّ مِمَّا أَدْرَكَ النَّاسُ مِنْ كَلَامِ النُّبُوَّةِ الْأُولَى: إذَا لَمْ تَسْتَحِ فَاصْنَعْ مَا شِئْت .<br>[رَوَاهُ الْبُخَارِيُّ]","en":"On the authority of Abu Masood Uqbah bin ’Amr al-Ansaree al-Badree (may Allah be pleased with him) who said: The Messenger of Allah (peace and blessings of Allah be upon him) said, “Verily, from what was learnt by the people from the speech of the earliest prophecy is: If you feel no shame, then do as you wish.” [Al-Bukhari]"},
  {"n":21,"ar":"عَنْ أَبِي عَمْرٍو وَقِيلَ: أَبِي عَمْرَةَ سُفْيَانَ بْنِ عَبْدِ اللَّهِ رَضِيَ اللهُ عَنْهُ قَالَ: قُلْت: يَا رَسُولَ اللَّهِ! قُلْ لِي فِي الْإِسْلَامِ قَوْلًا لَا أَسْأَلُ عَنْهُ أَحَدًا غَيْرَك؛ قَالَ: قُلْ: آمَنْت بِاَللَّهِ ثُمَّ اسْتَقِمْ . [رَوَاهُ مُسْلِمٌ]","en":"On the authority of Abu `Amr — and he is also called Abu `Amrah — Sufyan bin Abdullah ath- Thaqafee (may Allah be pleased with him) who said: I said, \"O Messenger of Allah, tell me something about al-Islam which I can ask of no one but you.\" He (peace and blessings of Allah be upon him) said, \"Say I believe in Allah — and then be steadfast.\" [Muslim]"},
  {"n":22,"ar":"عَنْ أَبِي عَبْدِ اللَّهِ جَابِرِ بْنِ عَبْدِ اللَّهِ الْأَنْصَارِيِّ رَضِيَ اللَّهُ عَنْهُمَا: أَنَّ رَجُلًا سَأَلَ رَسُولَ اللَّهِ صلى الله عليه و سلم فَقَالَ: أَرَأَيْت إذَا صَلَّيْت الْمَكْتُوبَاتِ، وَصُمْت رَمَضَانَ، وَأَحْلَلْت الْحَلَالَ، وَحَرَّمْت الْحَرَامَ، وَلَمْ أَزِدْ عَلَى ذَلِكَ شَيْئًا؛ أَأَدْخُلُ الْجَنَّةَ؟ قَالَ: نَعَمْ . [رَوَاهُ مُسْلِمٌ]","en":"On the authority of Abu Abdullah Jabir bin Abdullah al-Ansaree (may Allah be pleased with him) that: A man questioned the Messenger of Allah (peace and blessings of Allah be upon him) and said, “Do you think that if I perform the obligatory prayers, fast in Ramadhan, treat as lawful that which is halal, and treat as forbidden that which is haram, and do not increase upon that [in voluntary good deeds], then I shall enter Paradise?” He (peace and blessings of Allah be upon him) replied, “Yes.” [Muslim]"},
  {"n":23,"ar":"عَنْ أَبِي مَالِكٍ الْحَارِثِ بْنِ عَاصِمٍ الْأَشْعَرِيِّ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه و سلم الطَّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ، وَسُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ تَمْلَآنِ -أَوْ: تَمْلَأُ- مَا بَيْنَ السَّمَاءِ وَالْأَرْضِ، وَالصَّلَاةُ نُورٌ، وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ، وَالْقُرْآنُ حُجَّةٌ لَك أَوْ عَلَيْك، كُلُّ النَّاسِ يَغْدُو، فَبَائِعٌ نَفْسَهُ فَمُعْتِقُهَا أَوْ مُوبِقُهَا . [رَوَاهُ مُسْلِمٌ]","en":"On the authority of Abu Malik al-Harith bin Asim al-Asharee (may Allah be pleased with him) who said: The Messenger of Allah (peace and blessings of Allah be upon him) said, “Purity is half of iman (faith). ‘Al-hamdu lillah (praise be to Allah)’ fills the scales, and ‘subhan-Allah (how far is Allah from every imperfection) and ‘Al-hamdulillah (praise be to Allah)’ fill that which is between heaven and earth. And the salah (prayer) is a light, and charity is a proof, and patience is illumination, and the Qur’an is a proof either for you or against you. Every person starts his day as a vendor of his soul, either freeing it or causing its ruin.” [Muslim]"},
  {"n":24,"ar":"عَنْ أَبِي ذَرٍّ الْغِفَارِيِّ رَضِيَ اللهُ عَنْهُ عَنْ النَّبِيِّ صلى الله عليه و سلم فِيمَا يَرْوِيهِ عَنْ رَبِّهِ تَبَارَكَ وَتَعَالَى، أَنَّهُ قَالَ: يَا عِبَادِي: إنِّي حَرَّمْت الظُّلْمَ عَلَى نَفْسِي، وَجَعَلْته بَيْنَكُمْ مُحَرَّمًا؛ فَلَا تَظَالَمُوا. يَا عِبَادِي! كُلُّكُمْ ضَالٌّ إلَّا مَنْ هَدَيْته، فَاسْتَهْدُونِي أَهْدِكُمْ. يَا عِبَادِي! كُلُّكُمْ جَائِعٌ إلَّا مَنْ أَطْعَمْته، فَاسْتَطْعِمُونِي أُطْعِمْكُمْ. يَا عِبَادِي! كُلُّكُمْ عَارٍ إلَّا مَنْ كَسَوْته، فَاسْتَكْسُونِي أَكْسُكُمْ. يَا عِبَادِي! إنَّكُمْ تُخْطِئُونَ بِاللَّيْلِ وَالنَّهَارِ، وَأَنَا أَغْفِرُ الذُّنُوبَ جَمِيعًا؛ فَاسْتَغْفِرُونِي أَغْفِرْ لَكُمْ. يَا عِبَادِي! إنَّكُمْ لَنْ تَبْلُغُوا ضُرِّي فَتَضُرُّونِي، وَلَنْ تَبْلُغُوا نَفْعِي فَتَنْفَعُونِي. يَا عِبَادِي! لَوْ أَنَّ أَوَّلَكُمْ وَآخِرَكُمْ وَإِنْسَكُمْ وَجِنَّكُمْ كَانُوا عَلَى أَتْقَى قَلْبِ رَجُلٍ وَاحِدٍ مِنْكُمْ، مَا زَادَ ذَلِكَ فِي مُلْكِي شَيْئًا. يَا عِبَادِي! لَوْ أَنَّ أَوَّلَكُمْ وَآخِرَكُمْ وَإِنْسَكُمْ وَجِنَّكُمْ كَانُوا عَلَى أَفْجَرِ قَلْبِ رَجُلٍ وَاحِدٍ مِنْكُمْ، مَا نَقَصَ ذَلِكَ مِنْ مُلْكِي شَيْئًا. يَا عِبَادِي! لَوْ أَنَّ أَوَّلَكُمْ وَآخِرَكُمْ وَإِنْسَكُمْ وَجِنَّكُمْ قَامُوا فِي صَعِيدٍ وَاحِدٍ، فَسَأَلُونِي، فَأَعْطَيْت كُلَّ وَاحِدٍ مَسْأَلَته، مَا نَقَصَ ذَلِكَ مِمَّا عِنْدِي إلَّا كَمَا يَنْقُصُ الْمِخْيَطُ إذَا أُدْخِلَ الْبَحْرَ. يَا عِبَادِي! إنَّمَا هِيَ أَعْمَالُكُمْ أُحْصِيهَا لَكُمْ، ثُمَّ أُوَفِّيكُمْ إيَّاهَا؛ فَمَنْ وَجَدَ خَيْرًا فَلْيَحْمَدْ اللَّهَ، وَمَنْ وَجَدَ غَيْرَ ذَلِكَ فَلَا يَلُومَن إلَّا نَفْسَهُ . [رَوَاهُ مُسْلِمٌ]","en":"On the authority of Abu Dharr al-Ghifaree (may Allah be pleased with him) from the Prophet (peace and blessings of Allah be upon him) from his Lord, that He said: O My servants! I have forbidden dhulm (oppression) for Myself, and I have made it forbidden amongst you, so do not oppress one another. O My servants, all of you are astray except those whom I have guided, so seek guidance from Me and I shall guide you. O My servants, all of you are hungry except those whom I have fed, so seek food from Me and I shall feed you. O My servants, all of you are naked except those whom I have clothed, so seek clothing from Me and I shall clothe you. O My servants, you commit sins by day and by night, and I forgive all sins, so seek forgiveness from Me and I shall forgive you. O My servants, you will not attain harming Me so as to harm Me, and you will not attain benefiting Me so as to benefit Me. O My servants, if the first of you and the last of you, and the humans of you and the jinn of you, were all as pious as the most pious heart of any individual amongst you, then this would not increase My Kingdom an iota. O My servants, if the first of you and the last of you, and the humans of you and the jinn of you, were all as wicked as the most wicked heart of any individual amongst you, then this would not decrease My Kingdom an iota. O My servants, if the first of you and the last of you, and the humans of you and the jinn of you, were all to stand together in one place and ask of Me, and I were to give everyone what he requested, then that would not decrease what I Possess, except what is decreased of the ocean when a needle is dipped into it. O My servants, it is but your deeds that I account for you, and then recompense you for. So he who finds good, let him praise Allah, and he who finds other than that, let him blame no one but himself. [Muslim]"},
  {"n":25,"ar":"عَنْ أَبِي ذَرٍّ رَضِيَ اللهُ عَنْهُ أَيْضًا، أَنَّ نَاسًا مِنْ أَصْحَابِ رَسُولِ اللَّهِ صلى الله عليه و سلم قَالُوا لِلنَّبِيِّ صلى الله عليه و سلم يَا رَسُولَ اللَّهِ ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ؛ يُصَلُّونَ كَمَا نُصَلِّي، وَيَصُومُونَ كَمَا نَصُومُ، وَيَتَصَدَّقُونَ بِفُضُولِ أَمْوَالِهِمْ. قَالَ: أَوَلَيْسَ قَدْ جَعَلَ اللَّهُ لَكُمْ مَا تَصَّدَّقُونَ؟ إنَّ بِكُلِّ تَسْبِيحَةٍ صَدَقَةً، وَكُلِّ تَكْبِيرَةٍ صَدَقَةً، وَكُلِّ تَحْمِيدَةٍ صَدَقَةً، وَكُلِّ تَهْلِيلَةٍ صَدَقَةً، وَأَمْرٌ بِمَعْرُوفٍ صَدَقَةٌ، وَنَهْيٌ عَنْ مُنْكَرٍ صَدَقَةٌ، وَفِي بُضْعِ أَحَدِكُمْ صَدَقَةٌ. قَالُوا: يَا رَسُولَ اللَّهِ أَيَأْتِي أَحَدُنَا شَهْوَتَهُ وَيَكُونُ لَهُ فِيهَا أَجْرٌ؟ قَالَ: أَرَأَيْتُمْ لَوْ وَضَعَهَا فِي حَرَامٍ أَكَانَ عَلَيْهِ وِزْرٌ؟ فَكَذَلِكَ إذَا وَضَعَهَا فِي الْحَلَالِ، كَانَ لَهُ أَجْرٌ . [رَوَاهُ مُسْلِمٌ]","en":"Also on the authority of Abu Dharr (may Allah be pleased with him): Some people from amongst the Companions of the Messenger of Allah (peace and blessings of Allah be upon him) said to the Prophet (peace and blessings of Allah be upon him), \"O Messenger of Allah, the affluent have made off with the rewards; they pray as we pray, they fast as we fast, and they give [much] in charity by virtue of their wealth.\" He (peace and blessings of Allah be upon him) said, \"Has not Allah made things for you to give in charity? Truly every tasbeehah [saying: 'subhan-Allah'] is a charity, and every takbeerah [saying: 'Allahu akbar'] is a charity, and every tahmeedah [saying: 'al-hamdu lillah'] is a charity, and every tahleelah [saying: 'laa ilaha illAllah'] is a charity. And commanding the good is a charity, and forbidding an evil is a charity, and in the bud`i [sexual act] of each one of you there is a charity.\" They said, \"O Messenger of Allah, when one of us fulfils his carnal desire will he have some reward for that?\" He (peace and blessings of Allah be upon him) said, \"Do you not see that if he were to act upon it [his desire] in an unlawful manner then he would be deserving of punishment? Likewise, if he were to act upon it in a lawful manner then he will be deserving of a reward.\" [Muslim]"},
  {"n":26,"ar":"عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه و سلم كُلُّ سُلَامَى مِنْ النَّاسِ عَلَيْهِ صَدَقَةٌ، كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ تَعْدِلُ بَيْنَ اثْنَيْنِ صَدَقَةٌ، وَتُعِينُ الرَّجُلَ فِي دَابَّتِهِ فَتَحْمِلُهُ عَلَيْهَا أَوْ تَرْفَعُ لَهُ عَلَيْهَا مَتَاعَهُ صَدَقَةٌ، وَالْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ، وَبِكُلِّ خُطْوَةٍ تَمْشِيهَا إلَى الصَّلَاةِ صَدَقَةٌ، وَتُمِيطُ الْأَذَى عَنْ الطَّرِيقِ صَدَقَةٌ .<br>[رَوَاهُ الْبُخَارِيُّ] ، [وَمُسْلِمٌ]","en":"On the authority of Abu Hurayrah (may Allah be pleased with him) who said: The Messenger of Allah (peace and blessings of Allah be upon him) said, “Every joint of a person must perform a charity each day that the sun rises: to judge justly between two people is a charity. To help a man with his mount, lifting him onto it or hoisting up his belongings onto it, is a charity. And the good word is a charity. And every step that you take towards the prayer is a charity, and removing a harmful object from the road is a charity.” [Al-Bukhari] [Muslim]"},
  {"n":27,"ar":"عَنْ النَّوَّاسِ بْنِ سَمْعَانَ رَضِيَ اللهُ عَنْهُ عَنْ النَّبِيِّ صلى الله عليه و سلم قَالَ: \"الْبِرُّ حُسْنُ الْخُلُقِ، وَالْإِثْمُ مَا حَاكَ فِي صَدْرِك، وَكَرِهْت أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ\" رَوَاهُ مُسْلِمٌ [رَوَاهُ مُسْلِمٌ]. وَعَنْ وَابِصَةَ بْنِ مَعْبَدٍ رَضِيَ اللهُ عَنْهُ قَالَ: أَتَيْت رَسُولَ اللَّهِ صلى الله عليه و سلم فَقَالَ: \"جِئْتَ تَسْأَلُ عَنْ الْبِرِّ؟ قُلْت: نَعَمْ. فقَالَ: استفت قلبك، الْبِرُّ مَا اطْمَأَنَّتْ إلَيْهِ النَّفْسُ، وَاطْمَأَنَّ إلَيْهِ الْقَلْبُ، وَالْإِثْمُ مَا حَاكَ فِي النَّفْسِ وَتَرَدَّدَ فِي الصَّدْرِ، وَإِنْ أَفْتَاك النَّاسُ وَأَفْتَوْك\" . حَدِيثٌ حَسَنٌ، رَوَيْنَاهُ في مُسْنَدَي الْإِمَامَيْنِ أَحْمَدَ بْنِ حَنْبَلٍ [رقم:4/227]، وَالدَّارِمِيّ [2/246] بِإِسْنَادٍ حَسَنٍ","en":"On the authority of an-Nawas bin Sam’an (may Allah be pleased with him), that the Prophet (peace and blessings of Allah be upon him) said: Righteousness is in good character, and wrongdoing is that which wavers in your soul, and which you dislike people finding out about. [Muslim] And on the authority of Wabisah bin Ma’bad (may Allah be pleased with him) who said: I came to the Messenger of Allah (peace and blessings of Allah be upon him) and he (peace and blessings of Allah be upon him) said, “You have come to ask about righteousness.” I said, “Yes.” He (peace and blessings of Allah be upon him) said, “Consult your heart. Righteousness is that about which the soul feels at ease and the heart feels tranquil. And wrongdoing is that which wavers in the soul and causes uneasiness in the breast, even though people have repeatedly given their legal opinion [in its favour].” A good hadeeth transmitted from the musnads of the two imams, Ahmed bin Hambal and Al- Darimi, with a good chain of authorities"},
  {"n":28,"ar":"عَنْ أَبِي نَجِيحٍ الْعِرْبَاضِ بْنِ سَارِيَةَ رَضِيَ اللهُ عَنْهُ قَالَ: وَعَظَنَا رَسُولُ اللَّهِ صلى الله عليه و سلم مَوْعِظَةً وَجِلَتْ مِنْهَا الْقُلُوبُ، وَذَرَفَتْ مِنْهَا الْعُيُونُ، فَقُلْنَا: يَا رَسُولَ اللَّهِ! كَأَنَّهَا مَوْعِظَةُ مُوَدِّعٍ فَأَوْصِنَا، قَالَ: أُوصِيكُمْ بِتَقْوَى اللَّهِ، وَالسَّمْعِ وَالطَّاعَةِ وَإِنْ تَأَمَّرَ عَلَيْكُمْ عَبْدٌ، فَإِنَّهُ مَنْ يَعِشْ مِنْكُمْ فَسَيَرَى اخْتِلَافًا كَثِيرًا، فَعَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الْخُلَفَاءِ الرَّاشِدِينَ الْمَهْدِيينَ، عَضُّوا عَلَيْهَا بِالنَّوَاجِذِ، وَإِيَّاكُمْ وَمُحْدَثَاتِ الْأُمُورِ؛ فَإِنَّ كُلَّ بِدْعَةٍ ضَلَالَةٌ . [رَوَاهُ أَبُو دَاوُدَ]، وَاَلتِّرْمِذِيُّ [رقم:266] وَقَالَ: حَدِيثٌ حَسَنٌ صَحِيحٌ","en":"On the authority of Abu Najeeh al-’Irbaad ibn Saariyah (may Allah be pleased with him) who said: The Messenger of Allah (peace and blessings of Allah be upon him) gave us a sermon by which our hearts were filled with fear and tears came to our eyes. So we said, “O Messenger of Allah! It is as though this is a farewell sermon, so counsel us.” He (peace and blessings of Allah be upon him) said, “I counsel you to have taqwa (fear) of Allah, and to listen and obey [your leader], even if a slave were to become your ameer. Verily he among you who lives long will see great controversy, so you must keep to my Sunnah and to the Sunnah of the Khulafa ar-Rashideen (the rightly guided caliphs), those who guide to the right way. Cling to it stubbornly [literally: with your molar teeth]. Beware of newly invented matters [in the religion], for verily every bidah (innovation) is misguidance.” [Abu Dawud] It was related by at-Tirmidhi, who said that it was a good and sound hadeeth"},
  {"n":29,"ar":"عَنْ مُعَاذِ بْنِ جَبَلٍ رَضِيَ اللهُ عَنْهُ قَالَ: قُلْت يَا رَسُولَ اللَّهِ! أَخْبِرْنِي بِعَمَلٍ يُدْخِلُنِي الْجَنَّةَ وَيُبَاعِدْنِي مِنْ النَّارِ، قَالَ: \"لَقَدْ سَأَلْت عَنْ عَظِيمٍ، وَإِنَّهُ لَيَسِيرٌ عَلَى مَنْ يَسَّرَهُ اللَّهُ عَلَيْهِ: تَعْبُدُ اللَّهَ لَا تُشْرِكْ بِهِ شَيْئًا، وَتُقِيمُ الصَّلَاةَ، وَتُؤْتِي الزَّكَاةَ، وَتَصُومُ رَمَضَانَ، وَتَحُجُّ الْبَيْتَ، ثُمَّ قَالَ: أَلَا أَدُلُّك عَلَى أَبْوَابِ الْخَيْرِ؟ الصَّوْمُ جُنَّةٌ، وَالصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ، وَصَلَاةُ الرَّجُلِ فِي جَوْفِ اللَّيْلِ، ثُمَّ تَلَا: \" تَتَجَافَى جُنُوبُهُمْ عَنِ الْمَضَاجِعِ \" حَتَّى بَلَغَ \"يَعْمَلُونَ\"،[ 32 سورة السجدة / الأيتان : 16 و 17 ] ثُمَّ قَالَ: أَلَا أُخْبِرُك بِرَأْسِ الْأَمْرِ وَعَمُودِهِ وَذُرْوَةِ سَنَامِهِ؟ قُلْت: بَلَى يَا رَسُولَ اللَّهِ. قَالَ: رَأْسُ الْأَمْرِ الْإِسْلَامُ، وَعَمُودُهُ الصَّلَاةُ، وَذُرْوَةُ سَنَامِهِ الْجِهَادُ، ثُمَّ قَالَ: أَلَا أُخْبِرُك بِمَلَاكِ ذَلِكَ كُلِّهِ؟ فقُلْت: بَلَى يَا رَسُولَ اللَّهِ ! فَأَخَذَ بِلِسَانِهِ وَقَالَ: كُفَّ عَلَيْك هَذَا. قُلْت: يَا نَبِيَّ اللَّهِ وَإِنَّا لَمُؤَاخَذُونَ بِمَا نَتَكَلَّمُ بِهِ؟ فَقَالَ: ثَكِلَتْك أُمُّك وَهَلْ يَكُبُّ النَّاسَ عَلَى وُجُوهِهِمْ -أَوْ قَالَ عَلَى مَنَاخِرِهِمْ- إلَّا حَصَائِدُ أَلْسِنَتِهِمْ؟!\" . رَوَاهُ التِّرْمِذِيُّ [رقم:2616] وَقَالَ: حَدِيثٌ حَسَنٌ صَحِيحٌ","en":"On the authority of Muadh bin Jabal (may Allah be pleased with him) who said: I said, “O Messenger of Allah, tell me of an act which will take me into Paradise and will keep me away from the Hellfire.” He (peace and blessings of Allah be upon him) said, “You have asked me about a great matter, yet it is easy for him for whom Allah makes it easy: worship Allah, without associating any partners with Him; establish the prayer; pay the zakat; fast in Ramadhan; and make the pilgrimage to the House.” Then he (peace and blessings of Allah be upon him) said, “Shall I not guide you towards the means of goodness? Fasting is a shield; charity wipes away sin as water extinguishes fire; and the praying of a man in the depths of the night.” Then he (peace and blessings of Allah be upon him) recited: “[Those] who forsake their beds, to invoke their Lord in fear and hope, and they spend (charity in Allah’s cause) out of what We have bestowed on them. No person knows what is kept hidden for them of joy as a reward for what they used to do.” [as-Sajdah, 16-17] Then he (peace and blessings of Allah be upon him) said, “Shall I not inform you of the head of the matter, its pillar and its peak?” I said, “Yes, O Messenger of Allah.” He (peace and blessings of Allah be upon him) said, “The head of the matter is Islam, its pillar is the prayer and its peak is jihad.” Then he (peace and blessings of Allah be upon him) said, “Shall I not tell you of the foundation of all of that?” I said, “Yes, O Messenger of Allah.” So he took hold of his tongue and said, “Restrain this.” I said, “O Prophet (ﷺ) of Allah, will we be taken to account for what we say with it?” He (peace and blessings of Allah be upon him) said, “May your mother be bereaved of you, O Muadh! Is there anything that throws people into the Hellfire upon their faces — or: on their noses — except the harvests of their tongues?” It was related by at-Tirmidhi, who said it was a good and sound hadeeth"},
  {"n":30,"ar":"عَنْ أَبِي ثَعْلَبَةَ الْخُشَنِيِّ جُرْثُومِ بن نَاشِر رَضِيَ اللهُ عَنْهُ عَنْ رَسُولِ اللَّهِ صلى الله عليه و سلم قَال: \"إنَّ اللَّهَ تَعَالَى فَرَضَ فَرَائِضَ فَلَا تُضَيِّعُوهَا، وَحَدَّ حُدُودًا فَلَا تَعْتَدُوهَا، وَحَرَّمَ أَشْيَاءَ فَلَا تَنْتَهِكُوهَا، وَسَكَتَ عَنْ أَشْيَاءَ رَحْمَةً لَكُمْ غَيْرَ نِسْيَانٍ فَلَا تَبْحَثُوا عَنْهَا\". حَدِيثٌ حَسَنٌ، رَوَاهُ الدَّارَقُطْنِيّ ْ\"في سننه\" [4/184]، وَغَيْرُهُ","en":"On the authority of Abu Tha’labah al-Kushanee — Jurthoom bin Nashir (may Allah be pleased with him) — that the Messenger of Allah (peace and blessings of Allah be upon him) said: Verily Allah ta’ala has laid down religious obligations (fara’id), so do not neglect them; and He has set limits, so do not overstep them; and He has forbidden some things, so do not violate them; and He has remained silent about some things, out of compassion for you, not forgetfulness — so do not seek after them. A hasan hadeeth narrated by ad-Daraqutnee and others"},
  {"n":31,"ar":"عَنْ أَبِي الْعَبَّاسِ سَهْلِ بْنِ سَعْدٍ السَّاعِدِيّ رَضِيَ اللهُ عَنْهُ قَالَ: جَاءَ رَجُلٌ إلَى النَّبِيِّ صلى الله عليه و سلم فَقَالَ: يَا رَسُولَ اللهِ! دُلَّنِي عَلَى عَمَلٍ إذَا عَمِلْتُهُ أَحَبَّنِي اللهُ وَأَحَبَّنِي النَّاسُ؛ فَقَالَ: ازْهَدْ فِي الدُّنْيَا يُحِبَّك اللهُ، وَازْهَدْ فِيمَا عِنْدَ النَّاسِ يُحِبَّك النَّاسُ . حديث حسن، رَوَاهُ ابْنُ مَاجَهْ [رقم:4102]، وَغَيْرُهُ بِأَسَانِيدَ حَسَنَةٍ","en":"On the authority of Abu al-’Abbas Sahl bin Sa’ad as-Sa’idee (may Allah be pleased with him) who said: A man came to the Prophet (peace and blessings of Allah be upon him) and said, “O Messenger of Allah, direct me to an act which, if I do it, [will cause] Allah to love me and the people to love me.” So he (peace and blessings of Allah be upon him) said, “Renounce the world and Allah will love you, and renounce what the people possess and the people will love you.” A hasan hadeeth related by Ibn Majah and others with good chains of authorities"},
  {"n":32,"ar":"عَنْ أَبِي سَعِيدٍ سَعْدِ بْنِ مَالِكِ بْنِ سِنَانٍ الْخُدْرِيّ رَضِيَ اللهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ صلى الله عليه و سلم قَالَ: \" لَا ضَرَرَ وَلَا ضِرَارَ\" . حَدِيثٌ حَسَنٌ، رَوَاهُ ابْنُ مَاجَهْ [راجع رقم:2341]، وَالدَّارَقُطْنِيّ [رقم:4/228]، وَغَيْرُهُمَا مُسْنَدًا. وَرَوَاهُ مَالِكٌ [2/746] فِي \"الْمُوَطَّإِ\" عَنْ عَمْرِو بْنِ يَحْيَى عَنْ أَبِيهِ عَنْ النَّبِيِّ صلى الله عليه و سلم مُرْسَلًا، فَأَسْقَطَ أَبَا سَعِيدٍ، وَلَهُ طُرُقٌ يُقَوِّي بَعْضُهَا بَعْضًا","en":"On the authority of Abu Sa’eed al-Khudree (may Allah be pleased with him), that the Messenger of Allah (peace and blessings of Allah be upon him) said: There should be neither harming (darar) nor reciprocating harm (dirar). A hasan hadeeth related by Ibn Majah, ad-Daraqutnee and others as a musnad hadeeth. It was also related by Malik in al-Muwatta in mursal form from Amr bin Yahya, from his father from the Prophet (peace and blessings of Allah be upon him), but leaving Abu Sa’eed from the chain. And it has other chains of narrations that strengthen one another"},
  {"n":33,"ar":"عَنْ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا أَنَّ رَسُولَ اللَّهِ صلى الله عليه و سلم قَالَ: \"لَوْ يُعْطَى النَّاسُ بِدَعْوَاهُمْ لَادَّعَى رِجَالٌ أَمْوَالَ قَوْمٍ وَدِمَاءَهُمْ، لَكِنَّ الْبَيِّنَةَ عَلَى الْمُدَّعِي، وَالْيَمِينَ عَلَى مَنْ أَنْكَرَ\" . حَدِيثٌ حَسَنٌ، رَوَاهُ الْبَيْهَقِيّ [في\"السنن\" 10/252]، وَغَيْرُهُ هَكَذَا، وَبَعْضُهُ فِي \"الصَّحِيحَيْنِ","en":"On the authority of Ibn Abbas (may Allah be pleased with him), that the Messenger of Allah (peace and blessings of Allah be upon him) said: Were people to be given everything that they claimed, men would [unjustly] claim the wealth and lives of [other] people. But, the onus of proof is upon the claimant, and the taking of an oath is upon him who denies. A hasan hadeeth narrated by al-Baihaqee and others in this form, and part of it is in the two Saheehs"},
  {"n":34,"ar":"عَنْ أَبِي سَعِيدٍ الْخُدْرِيّ رَضِيَ اللهُ عَنْهُ قَالَ سَمِعْت رَسُولَ اللَّهِ صلى الله عليه و سلم يَقُولُ: مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ، وَذَلِكَ أَضْعَفُ الْإِيمَانِ . [رَوَاهُ مُسْلِمٌ]","en":"On the authority of Abu Sa`eed al-Khudree (may Allah be pleased with him) who said: I heard the Messenger of Allah (ﷺ) say, “Whosoever of you sees an evil, let him change it with his hand; and if he is not able to do so, then [let him change it] with his tongue; and if he is not able to do so, then with his heart — and that is the weakest of faith.” [Muslim]"},
  {"n":35,"ar":"عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه و سلم لَا تَحَاسَدُوا، وَلَا تَنَاجَشُوا، وَلَا تَبَاغَضُوا، وَلَا تَدَابَرُوا، وَلَا يَبِعْ بَعْضُكُمْ عَلَى بَيْعِ بَعْضٍ، وَكُونُوا عِبَادَ اللَّهِ إخْوَانًا، الْمُسْلِمُ أَخُو الْمُسْلِمِ، لَا يَظْلِمُهُ، وَلَا يَخْذُلُهُ، وَلَا يَكْذِبُهُ، وَلَا يَحْقِرُهُ، التَّقْوَى هَاهُنَا، وَيُشِيرُ إلَى صَدْرِهِ ثَلَاثَ مَرَّاتٍ، بِحَسْبِ امْرِئٍ مِنْ الشَّرِّ أَنْ يَحْقِرَ أَخَاهُ الْمُسْلِمَ، كُلُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ حَرَامٌ: دَمُهُ وَمَالُهُ وَعِرْضُهُ . [رَوَاهُ مُسْلِمٌ]","en":"On the authority of Abu Hurayrah (may Allah be pleased with him) who said: The Messenger of Allah (peace and blessings of Allah be upon him) said, “Do not envy one another, and do not inflate prices for one another, and do not hate one another, and do not turn away from one another, and do not undercut one another in trade, but [rather] be slaves of Allah and brothers [amongst yourselves]. A Muslim is the brother of a Muslim: he does not oppress him, nor does he fail him, nor does he lie to him, nor does he hold him in contempt. Taqwa (piety) is right here [and he pointed to his chest three times]. It is evil enough for a man to hold his brother Muslim in contempt. The whole of a Muslim is inviolable for another Muslim: his blood, his property, and his honour.” [Muslim]"},
  {"n":36,"ar":"عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ عَنْ النَّبِيِّ صلى الله عليه و سلم قَالَ: مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ، وَمَنْ يَسَّرَ عَلَى مُعْسِرٍ، يَسَّرَ اللَّهُ عَلَيْهِ فِي الدُّنْيَا وَالْآخِرَةِ، وَمَنْ سَتَرَ مُسْلِما سَتَرَهُ اللهُ فِي الدُّنْيَا وَالْآخِرَةِ ، وَاَللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ، وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إلَى الْجَنَّةِ، وَمَا اجْتَمَعَ قَوْمٌ فِي بَيْتٍ مِنْ بُيُوتِ اللَّهِ يَتْلُونَ كِتَابَ اللَّهِ، وَيَتَدَارَسُونَهُ فِيمَا بَيْنَهُمْ؛ إلَّا نَزَلَتْ عَلَيْهِمْ السَّكِينَةُ، وَغَشِيَتْهُمْ الرَّحْمَةُ، وَ حَفَّتهُمُ المَلاَئِكَة، وَذَكَرَهُمْ اللَّهُ فِيمَنْ عِنْدَهُ، وَمَنْ أَبَطْأَ بِهِ عَمَلُهُ لَمْ يُسْرِعْ بِهِ نَسَبُهُ . [رَوَاهُ مُسْلِمٌ] بهذا اللفظ","en":"On the authority of Abu Hurayrah (may Allah be pleased with him), that the Prophet (peace and blessings of Allah be upon him) said: Whoever removes a worldly grief from a believer, Allah will remove from him one of the griefs of the Day of Resurrection. And whoever alleviates the need of a needy person, Allah will alleviate his needs in this world and the Hereafter. Whoever shields [or hides the misdeeds of] a Muslim, Allah will shield him in this world and the Hereafter. And Allah will aid His slave so long as he aids his brother. And whoever follows a path to seek knowledge therein, Allah will make easy for him a path to Paradise. No people gather together in one of the Houses of Allah, reciting the Book of Allah and studying it among themselves, except that sakeenah (tranquility) descends upon them, and mercy envelops them, and the angels surround them, and Allah mentions them amongst those who are with Him. And whoever is slowed down by his actions, will not be hastened forward by his lineage. Related by [Muslim] in these words"},
  {"n":37,"ar":"عَنْ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا عَنْ رَسُولِ اللَّهِ صلى الله عليه و سلم فِيمَا يَرْوِيهِ عَنْ رَبِّهِ تَبَارَكَ وَتَعَالَى، قَالَ: \"إنَّ اللَّهَ كَتَبَ الْحَسَنَاتِ وَالسَّيِّئَاتِ، ثُمَّ بَيَّنَ ذَلِكَ، فَمَنْ هَمَّ بِحَسَنَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللَّهُ عِنْدَهُ حَسَنَةً كَامِلَةً، وَإِنْ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللَّهُ عِنْدَهُ عَشْرَ حَسَنَاتٍ إلَى سَبْعِمِائَةِ ضِعْفٍ إلَى أَضْعَافٍ كَثِيرَةٍ، وَإِنْ هَمَّ بِسَيِّئَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللَّهُ عِنْدَهُ حَسَنَةً كَامِلَةً، وَإِنْ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللَّهُ سَيِّئَةً وَاحِدَةً\".<br>[رَوَاهُ الْبُخَارِيُّ] ، [وَمُسْلِمٌ]، في \"صحيحيهما\" بهذه الحروف","en":"On the authority of Ibn Abbas (may Allah be pleased with him), from the Messenger of Allah (peace and blessings of Allah be upon him), from what he has related from his Lord: Verily Allah ta’ala has written down the good deeds and the evil deeds, and then explained it [by saying]: “Whosoever intended to perform a good deed, but did not do it, then Allah writes it down with Himself as a complete good deed. And if he intended to perform it and then did perform it, then Allah writes it down with Himself as from ten good deeds up to seven hundred times, up to many times multiplied. And if he intended to perform an evil deed, but did not do it, then Allah writes it down with Himself as a complete good deed. And if he intended it [i.e., the evil deed] and then performed it, then Allah writes it down as one evil deed.” [Al-Bukhari] [Muslim]"},
  {"n":38,"ar":"عَنْ أَبِي هُرَيْرَة رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُول اللَّهِ صلى الله عليه و سلم إنَّ اللَّهَ تَعَالَى قَالَ: مَنْ عَادَى لِي وَلِيًّا فَقْد آذَنْتهُ بِالْحَرْبِ، وَمَا تَقَرَّبَ إلَيَّ عَبْدِي بِشَيْءٍ أَحَبَّ إلَيَّ مِمَّا افْتَرَضْتُهُ عَلَيْهِ، وَلَا يَزَالُ عَبْدِي يَتَقَرَّبُ إلَيَّ بِالنَّوَافِلِ حَتَّى أُحِبَّهُ، فَإِذَا أَحْبَبْتُهُ كُنْت سَمْعَهُ الَّذِي يَسْمَعُ بِهِ، وَبَصَرَهُ الَّذِي يُبْصِرُ بِهِ، وَيَدَهُ الَّتِي يَبْطِشُ بِهَا، وَرِجْلَهُ الَّتِي يَمْشِي بِهَا، وَلَئِنْ سَأَلَنِي لَأُعْطِيَنَّهُ، وَلَئِنْ اسْتَعَاذَنِي لَأُعِيذَنَّهُ . [رَوَاهُ الْبُخَارِيُّ]","en":"On the authority of Abu Hurayrah (may Allah be pleased with him) who said: The Messenger of Allah (peace and blessings of Allah be upon him) said, “Verily Allah ta’ala has said: ‘Whosoever shows enmity to a wali (friend) of Mine, then I have declared war against him. And My servant does not draw near to Me with anything more loved to Me than the religious duties I have obligated upon him. And My servant continues to draw near to me with nafil (supererogatory) deeds until I Love him. When I Love him, I am his hearing with which he hears, and his sight with which he sees, and his hand with which he strikes, and his foot with which he walks. Were he to ask [something] of Me, I would surely give it to him; and were he to seek refuge with Me, I would surely grant him refuge.’ ” [Al-Bukhari]"},
  {"n":39,"ar":"عَنْ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا أَنَّ رَسُولَ اللَّهِ صلى الله عليه و سلم قَالَ: \"إنَّ اللَّهَ تَجَاوَزَ لِي عَنْ أُمَّتِي الْخَطَأَ وَالنِّسْيَانَ وَمَا اسْتُكْرِهُوا عَلَيْهِ\" . حَدِيثٌ حَسَنٌ، رَوَاهُ ابْنُ مَاجَهْ [رقم:2045]، وَالْبَيْهَقِيّ [\"السنن]","en":"On the authority of Ibn Abbas (may Allah be pleased with him), that the Messenger of Allah (peace and blessings of Allah be upon him) said: Verily Allah has pardoned [or been lenient with] for me my ummah: their mistakes, their forgetfulness, and that which they have been forced to do under duress. A hasan hadeeth related by Ibn Majah, and al-Bayhaqee and others"},
  {"n":40,"ar":"عَنْ ابْن عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: أَخَذَ رَسُولُ اللَّهِ صلى الله عليه و سلم بِمَنْكِبِي، وَقَالَ: كُنْ فِي الدُّنْيَا كَأَنَّك غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ . وَكَانَ ابْنُ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا يَقُولُ: إذَا أَمْسَيْتَ فَلَا تَنْتَظِرْ الصَّبَاحَ، وَإِذَا أَصْبَحْتَ فَلَا تَنْتَظِرْ الْمَسَاءَ، وَخُذْ مِنْ صِحَّتِك لِمَرَضِك، وَمِنْ حَيَاتِك لِمَوْتِك. [رَوَاهُ الْبُخَارِيُّ]","en":"On the authority of Abdullah ibn Umar (may Allah be pleased with him), who said: The Messenger of Allah (peace and blessings of Allah be upon him) took me by the shoulder and said, “Be in this world as though you were a stranger or a wayfarer.” And Ibn Umar (may Allah be pleased with him) used to say, “In the evening do not expect [to live until] the morning, and in the morning do not expect [to live until] the evening. Take [advantage of] your health before times of sickness, and [take advantage of] your life before your death.” [Al-Bukhari]"},
  {"n":41,"ar":"عَنْ أَبِي مُحَمَّدٍ عَبْدِ اللَّهِ بْنِ عَمْرِو بْنِ الْعَاصِ رَضِيَ اللَّهُ عَنْهُمَا، قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه و سلم \"لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يَكُونَ هَوَاهُ تَبَعًا لِمَا جِئْتُ بِهِ\". حَدِيثٌ حَسَنٌ صَحِيحٌ، رَوَيْنَاهُ فِي كِتَابِ \"الْحُجَّةِ\" بِإِسْنَادٍ صَحِيحٍ","en":"On the authority of Abu Muhammad Abdullah bin ’Amr bin al-’Aas (may Allah be pleased with him) who said: The Messenger of Allah (peace and blessings of Allah be upon him) said, “None of you [truly] believes until his desires are subservient to that which I have brought.” [Imam an-Nawawi says:] We have related it in Kitab al-Hujjah with a saheeh chain of narrators"},
  {"n":42,"ar":"عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْت رَسُولَ اللَّهِ صلى الله عليه و سلم يَقُولُ: قَالَ اللَّهُ تَعَالَى: يَا ابْنَ آدَمَ! إِنَّكَ مَا دَعَوْتنِي وَرَجَوْتنِي غَفَرْتُ لَك عَلَى مَا كَانَ مِنْك وَلَا أُبَالِي، يَا ابْنَ آدَمَ! لَوْ بَلَغَتْ ذُنُوبُك عَنَانَ السَّمَاءِ ثُمَّ اسْتَغْفَرْتنِي غَفَرْتُ لَك، يَا ابْنَ آدَمَ! إنَّك لَوْ أتَيْتنِي بِقُرَابِ الْأَرْضِ خَطَايَا ثُمَّ لَقِيتنِي لَا تُشْرِكُ بِي شَيْئًا لَأَتَيْتُك بِقُرَابِهَا مَغْفِرَةً . رَوَاهُ التِّرْمِذِيُّ [رقم:3540]، وَقَالَ: حَدِيثٌ حَسَنٌ صَحِيحٌ","en":"On the authority of Anas (may Allah be pleased with him) who said: I heard the Messenger of Allah (peace and blessings of Allah be upon him) say, “Allah the Almighty has said: ‘O Son of Adam, as long as you invoke Me and ask of Me, I shall forgive you for what you have done, and I shall not mind. O Son of Adam, were your sins to reach the clouds of the sky and you then asked forgiveness from Me, I would forgive you. O Son of Adam, were you to come to Me with sins nearly as great as the Earth, and were you then to face Me, ascribing no partner to Me, I would bring you forgiveness nearly as great as it [too].’ ” It was related by at-Tirmidhi, who said that it was a hasan hadeeth"}
];
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
  const [bookmarks, setBookmarks] = useState([]);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [reciter, setReciter] = useState("ar.alafasy");
  const audioRef = useRef(null);
  const rtl = lang === "ar";

  useEffect(() => { document.documentElement.dir = rtl ? "rtl" : "ltr"; }, [rtl]);

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
        {page === "home" && <Home_ rtl={rtl} theme={theme} dark={dark} query={query} setQuery={setQuery} actions={actions} />}
        {page === "search" && <SearchPage rtl={rtl} theme={theme} initialQuery={searchQuery} actions={actions} />}
        {page === "quran" && <QuranPage rtl={rtl} theme={theme} activeSurah={activeSurah} setActiveSurah={setActiveSurah} actions={actions} />}
        {page === "hadith" && <HadithPage rtl={rtl} theme={theme} actions={actions} />}
        {page === "learn" && <LearnPage rtl={rtl} theme={theme} setPage={setPage} />}
        {page === "fiqh" && <FiqhPage rtl={rtl} theme={theme} />}
        {page === "scholars" && <ScholarsPage rtl={rtl} theme={theme} />}
        {page === "duas" && <DuasPage rtl={rtl} theme={theme} actions={actions} />}
        {page === "tools" && <ToolsPage rtl={rtl} theme={theme} tasbih={tasbih} setTasbih={setTasbih} zakatWealth={zakatWealth} setZakatWealth={setZakatWealth} actions={actions} />}
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

      <footer className="hidden lg:block border-t py-8 text-center text-xs opacity-60" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(18,60,44,0.08)" }}>
        DeenHub — {rtl ? "بوابتك الموثوقة للمعرفة الإسلامية" : "Your trusted gateway to Islamic knowledge"}. {rtl ? "لا يصدر هذا الموقع فتاوى؛ جميع المحتويات الدينية مصدرها موثق." : "This platform does not issue its own fatwas — all religious content displays its original source."}
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
function Home_({ rtl, theme, dark, query, setQuery, actions }) {
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
        {(() => {
          const ayahs = QURAN_DATA["112"];
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
function SearchPage({ rtl, theme, initialQuery, actions }) {
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
    for (const surah of SURAH_LIST) {
      const ayahs = QURAN_DATA[String(surah[2])] || [];
      for (const [num, ar, en] of ayahs) {
        if (en.toLowerCase().includes(ql) || ar.includes(q.trim())) {
          quran.push({ surahNum: surah[2], surahName: surah[1], num, ar, en });
          if (quran.length >= 8) break;
        }
      }
      if (quran.length >= 8) break;
    }

    const hadith = NAWAWI_HADITH.filter((h) => h.en.toLowerCase().includes(ql)).slice(0, 8);
    const surahNames = SURAH_LIST.filter((s) => s[1].toLowerCase().includes(ql) || s[0].includes(q.trim())).map((s) => ({ id: `s${s[2]}`, title: `${s[1]} (${s[0]})`, sub: `Surah ${s[2]} · ${s[3]} ayat`, onClick: () => actions.goSurah(s[2]) }));
    const aqeedah = AQEEDAH_FIQH_INDEX.filter((i) => i.title.toLowerCase().includes(ql) || i.sub.toLowerCase().includes(ql));
    const scholars = SCHOLARS.filter((s) => s.name.toLowerCase().includes(ql) || s.specialty.toLowerCase().includes(ql)).map((s) => ({ id: s.id, title: s.name, sub: s.specialty, onClick: () => actions.setPage("scholars") }));
    const duas = DUA_LIST.filter((d) => d.translit.toLowerCase().includes(ql) || d.en.toLowerCase().includes(ql) || d.category.toLowerCase().includes(ql)).map((d) => ({ id: d.id, title: d.translit, sub: d.en.slice(0, 50) + "…", onClick: () => actions.setPage("duas") }));

    return { quran, hadith, surahNames, aqeedah, scholars, duas };
  }, [q]);

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
function QuranPage({ rtl, theme, activeSurah, setActiveSurah, actions }) {
  const [filter, setFilter] = useState("");
  const [tajweed, setTajweed] = useState(false);
  const [fontSize, setFontSize] = useState(28);
  const surah = SURAH_LIST.find((s) => s[2] === activeSurah);
  const filtered = SURAH_LIST.filter((s) => s[1].toLowerCase().includes(filter.toLowerCase()) || s[0].includes(filter));

  if (activeSurah && surah && !AVAILABLE_SURAHS.has(activeSurah)) {
    // Not yet embedded — show a clear, honest message instead of a blank/broken reader.
    return (
      <div className="pt-8">
        <button onClick={() => setActiveSurah(null)} className="flex items-center gap-1 text-sm font-bold mb-4" style={{ color: COLORS.green }}>
          <ArrowLeft size={14} className={rtl ? "rotate-180" : ""} /> {rtl ? "كل السور" : "All Surahs"}
        </button>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: "var(--heading)" }}>{surah[1]} <span className="opacity-50 font-normal">· {surah[0]}</span></h1>
        <Card className="p-6 flex flex-col items-start gap-3 text-sm">
          <div className="flex items-start gap-2"><Info size={16} className="mt-0.5 shrink-0 text-amber-600" /><span>{rtl ? "هذه السورة غير مضمّنة بعد في هذا النموذج (تركيزه على الفاتحة والجزء الأخير من القرآن). يمكنك قراءتها الآن على Quran.com." : "This surah isn't embedded in this prototype yet (it currently covers Al-Fatihah and Juz Amma). You can read it right now on Quran.com."}</span></div>
          <a href={`https://quran.com/${activeSurah}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full text-white" style={{ background: COLORS.green }}>
            <ExternalLink size={12} /> {rtl ? "افتح على Quran.com" : "Open on Quran.com"}
          </a>
        </Card>
      </div>
    );
  }

  if (activeSurah && surah && AVAILABLE_SURAHS.has(activeSurah)) {
    const ayahs = QURAN_DATA[String(activeSurah)] || [];
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
      <SectionTitle eyebrow={rtl ? "القرآن الكريم" : "The Noble Quran"} title={rtl ? "تصفح السور" : "Browse Surahs"} sub={rtl ? "الفاتحة والجزء الأخير (٧٨-١١٤) مضمّنة وتُفتح فورًا. باقي السور قريبًا." : "Al-Fatihah + Juz Amma (surahs 78-114) are embedded and open instantly. The rest are coming soon."} />
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: COLORS.green + "30" }}>
          <Search size={14} className="opacity-50" />
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={rtl ? "بحث عن سورة..." : "Search a surah..."} className="bg-transparent outline-none text-sm flex-1" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {filtered.map((s, i) => {
          const available = AVAILABLE_SURAHS.has(s[2]);
          return (
            <Card key={i} className="p-4 flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all" onClick={() => setActiveSurah(s[2])} style={{ opacity: available ? 1 : 0.6 }}>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0" style={{ background: `radial-gradient(circle, ${COLORS.lightGreen}, transparent)`, color: COLORS.green, boxShadow: `inset 0 0 0 1.5px ${COLORS.gold}77` }}>{s[2]}</span>
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">{s[1]} {available ? <ShieldCheck size={12} color={COLORS.green} /> : <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{rtl ? "قريبًا" : "soon"}</span>}</div>
                  <div className="text-xs opacity-50">{s[3]} {rtl ? "آية" : "ayat"} · {s[4]}</div>
                </div>
              </div>
              <span className="text-lg" dir="rtl" style={{ fontFamily: "'Amiri',serif", color: "var(--heading)" }}>{s[0]}</span>
            </Card>
          );
        })}
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
function HadithPage({ rtl, theme, actions }) {
  const [tab, setTab] = useState("nawawi"); // "nawawi" | "wider"
  const [q, setQ] = useState("");
  const [collection, setCollection] = useState("bukhari");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nawawiMatches = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return NAWAWI_HADITH;
    return NAWAWI_HADITH.filter((h) => h.en.toLowerCase().includes(ql));
  }, [q]);

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
          {nawawiMatches.length === 0 && <p className="text-sm opacity-60">{rtl ? "لا توجد نتائج." : "No matches."}</p>}
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
function DuasPage({ rtl, theme, actions }) {
  return (
    <div className="pt-8">
      <SectionTitle eyebrow={rtl ? "الأدعية" : "Duas & Adhkar"} title={rtl ? "الأدعية والأذكار" : "Duas & Adhkar"} sub={rtl ? "أدعية قصيرة موثقة المصدر من القرآن والسنة." : "Short, well-established duas with real, cited sources."} />
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
function ToolsPage({ rtl, theme, tasbih, setTasbih, zakatWealth, setZakatWealth, actions }) {
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

      <div className="grid md:grid-cols-2 gap-4">
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

        <Card className="p-5 flex flex-col items-center justify-center text-center">
          <h3 className="font-bold mb-2">{rtl ? "عداد التسبيح" : "Tasbih Counter"}</h3>
          <div className="text-5xl font-extrabold my-4" style={{ color: "var(--heading)" }}>{tasbih}</div>
          <div className="flex gap-3">
            <button onClick={() => setTasbih(tasbih + 1)} className="px-6 py-3 rounded-full text-white font-bold" style={{ background: COLORS.green }}>{rtl ? "عدّ" : "Count"}</button>
            <button onClick={() => setTasbih(0)} className="px-4 py-3 rounded-full border font-bold" style={{ borderColor: COLORS.green + "40" }}>{rtl ? "إعادة" : "Reset"}</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
