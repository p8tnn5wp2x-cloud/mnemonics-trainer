import React from "react";

const s = { stroke: "currentColor", strokeWidth: 2.5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const st = (w = 2.5) => ({ ...s, strokeWidth: w });

const illustrations: Record<string, React.ReactNode> = {
  ТЕЛЕФОН: (
    <>
      <rect x="18" y="5" width="28" height="54" rx="5" {...s} />
      <circle cx="32" cy="52" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="25" y1="12" x2="39" y2="12" {...st(2)} />
    </>
  ),
  ШКАФ: (
    <>
      <rect x="6" y="6" width="52" height="54" rx="2" {...s} />
      <line x1="32" y1="6" x2="32" y2="60" {...s} />
      <line x1="6" y1="16" x2="58" y2="16" {...s} />
      <circle cx="26" cy="34" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="38" cy="34" r="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  КНИГА: (
    <>
      <path d="M32 14 Q18 10 7 14 L7 56 Q18 52 32 56" {...s} />
      <path d="M32 14 Q46 10 57 14 L57 56 Q46 52 32 56" {...s} />
      <line x1="32" y1="14" x2="32" y2="56" {...st(2)} />
      <line x1="11" y1="24" x2="28" y2="21" {...st(1.5)} />
      <line x1="11" y1="31" x2="28" y2="29" {...st(1.5)} />
      <line x1="36" y1="21" x2="53" y2="24" {...st(1.5)} />
      <line x1="36" y1="29" x2="53" y2="31" {...st(1.5)} />
    </>
  ),
  ТЕЛЕВИЗОР: (
    <>
      <rect x="5" y="8" width="54" height="38" rx="3" {...s} />
      <line x1="22" y1="46" x2="18" y2="58" {...s} />
      <line x1="42" y1="46" x2="46" y2="58" {...s} />
      <line x1="16" y1="58" x2="48" y2="58" {...s} />
    </>
  ),
  ЧАШКА: (
    <>
      <path d="M12 18 L16 54 Q17 58 22 58 L42 58 Q47 58 48 54 L52 18 Z" {...s} />
      <path d="M52 28 Q62 28 62 38 Q62 48 52 46" {...s} />
      <line x1="12" y1="18" x2="52" y2="18" {...s} />
    </>
  ),
  ПЛИТА: (
    <>
      <rect x="6" y="8" width="52" height="50" rx="3" {...s} />
      <circle cx="22" cy="26" r="7" {...s} />
      <circle cx="42" cy="26" r="7" {...s} />
      <circle cx="22" cy="46" r="7" {...s} />
      <circle cx="42" cy="46" r="7" {...s} />
    </>
  ),
  СОБАКА: (
    <>
      <ellipse cx="30" cy="44" rx="18" ry="11" {...s} />
      <circle cx="44" cy="24" r="10" {...s} />
      <path d="M38 17 Q40 8 46 10" {...s} />
      <path d="M50 20 Q58 16 57 28" {...s} />
      <circle cx="46" cy="22" r="1.5" fill="currentColor" stroke="none" />
      <path d="M20 53 L17 62" {...s} />
      <path d="M28 55 L27 62" {...s} />
      <path d="M36 55 L37 62" {...s} />
      <path d="M42 53 L44 62" {...s} />
    </>
  ),
  ХОЛОДИЛЬНИК: (
    <>
      <rect x="14" y="4" width="36" height="58" rx="4" {...s} />
      <line x1="14" y1="22" x2="50" y2="22" {...s} />
      <line x1="28" y1="13" x2="28" y2="20" {...st(2)} />
      <line x1="28" y1="33" x2="28" y2="50" {...st(2)} />
    </>
  ),
  БАНКА: (
    <>
      <path d="M14 22 L14 54 Q14 61 32 61 Q50 61 50 54 L50 22" {...s} />
      <ellipse cx="32" cy="22" rx="18" ry="6" {...s} />
      <path d="M22 14 L22 22" {...st(2)} />
      <path d="M42 14 L42 22" {...st(2)} />
      <line x1="22" y1="14" x2="42" y2="14" {...st(2)} />
    </>
  ),
  КАСКА: (
    <>
      <path d="M7 36 Q7 10 32 9 Q57 10 57 36" {...s} />
      <line x1="5" y1="36" x2="59" y2="36" {...s} />
      <path d="M5 36 Q5 44 10 44 L54 44 Q59 44 59 36" {...s} />
      <line x1="22" y1="9" x2="20" y2="4" {...st(2)} />
    </>
  ),
  ОБОИ: (
    <>
      <rect x="8" y="8" width="34" height="50" rx="2" {...s} />
      <line x1="8" y1="19" x2="42" y2="19" {...st(1.5)} />
      <line x1="8" y1="30" x2="42" y2="30" {...st(1.5)} />
      <line x1="8" y1="41" x2="42" y2="41" {...st(1.5)} />
      <ellipse cx="48" cy="33" rx="8" ry="26" {...s} />
      <ellipse cx="48" cy="33" rx="2" ry="26" {...st(1)} />
    </>
  ),
  ЛИСТЬЯ: (
    <>
      <path d="M32 58 L32 22" {...s} />
      <path d="M32 22 Q50 10 54 28 Q38 34 32 22" {...s} />
      <path d="M32 36 Q14 24 12 42 Q28 44 32 36" {...s} />
      <path d="M32 58 Q26 50 22 52" {...st(2)} />
    </>
  ),
  КОФТА: (
    <>
      <path d="M20 8 L10 20 L18 26 L18 58 L46 58 L46 26 L54 20 L44 8" {...s} />
      <path d="M20 8 Q32 14 44 8" {...s} />
      <path d="M10 20 L6 38 L18 38" {...s} />
      <path d="M54 20 L58 38 L46 38" {...s} />
    </>
  ),
  ПОГОНЫ: (
    <>
      <path d="M8 28 L8 44 L56 44 L56 28 L50 18 L14 18 Z" {...s} />
      <line x1="8" y1="34" x2="56" y2="34" {...st(1.5)} />
      <circle cx="20" cy="24" r="3" {...s} />
      <circle cx="32" cy="22" r="3" {...s} />
      <circle cx="44" cy="24" r="3" {...s} />
    </>
  ),
  ПИРОЖОК: (
    <>
      <path d="M10 38 Q10 16 32 14 Q54 16 54 38 Q54 54 32 56 Q10 54 10 38 Z" {...s} />
      <path d="M16 28 Q32 20 48 28" {...st(1.5)} />
    </>
  ),
  ЛИМОН: (
    <>
      <path d="M8 32 Q8 10 32 8 Q48 8 56 20 L58 28 Q58 50 40 56 Q16 58 8 44 Z" {...s} />
      <line x1="56" y1="20" x2="60" y2="14" {...st(2)} />
      <line x1="8" y1="44" x2="4" y2="50" {...st(2)} />
    </>
  ),
  ВЕЛОСИПЕД: (
    <>
      <circle cx="16" cy="46" r="14" {...s} />
      <circle cx="48" cy="46" r="14" {...s} />
      <path d="M16 46 L32 22 L48 46" {...s} />
      <path d="M32 22 L36 34" {...s} />
      <line x1="28" y1="22" x2="36" y2="22" {...s} />
      <path d="M32 10 L32 18" {...st(2)} />
      <line x1="28" y1="10" x2="36" y2="10" {...st(2)} />
    </>
  ),
  ПЛАТОК: (
    <>
      <path d="M8 8 L56 8 L32 56 Z" {...s} />
      <path d="M8 8 Q32 20 56 8" {...st(1.5)} />
      <circle cx="20" cy="20" r="2" fill="currentColor" stroke="none" />
      <circle cx="44" cy="20" r="2" fill="currentColor" stroke="none" />
      <circle cx="32" cy="30" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  ЧАЙ: (
    <>
      <path d="M14 24 L18 58 Q18 61 22 61 L42 61 Q46 61 46 58 L50 24 Z" {...s} />
      <path d="M50 34 Q58 34 58 42 Q58 50 50 48" {...s} />
      <line x1="14" y1="24" x2="50" y2="24" {...s} />
      <path d="M24 18 Q26 12 24 6" {...st(2)} />
      <path d="M32 16 Q34 10 32 4" {...st(2)} />
    </>
  ),
  ПРОГРАММА: (
    <>
      <rect x="8" y="6" width="48" height="54" rx="3" {...s} />
      <line x1="16" y1="20" x2="48" y2="20" {...st(1.5)} />
      <line x1="16" y1="28" x2="48" y2="28" {...st(1.5)} />
      <line x1="16" y1="36" x2="36" y2="36" {...st(1.5)} />
      <path d="M16 46 L22 52 L16 58" {...st(2)} />
      <line x1="26" y1="58" x2="36" y2="58" {...st(2)} />
    </>
  ),
  МАГНИТОФОН: (
    <>
      <rect x="4" y="14" width="56" height="38" rx="4" {...s} />
      <circle cx="20" cy="32" r="9" {...s} />
      <circle cx="44" cy="32" r="9" {...s} />
      <circle cx="20" cy="32" r="3" fill="currentColor" stroke="none" />
      <circle cx="44" cy="32" r="3" fill="currentColor" stroke="none" />
      <line x1="29" y1="32" x2="35" y2="32" {...st(1.5)} />
    </>
  ),
  КРАН: (
    <>
      <path d="M26 8 L26 24" {...s} />
      <path d="M26 24 Q26 32 38 32 L54 32" {...s} />
      <path d="M54 32 L54 44" {...s} />
      <path d="M50 44 Q50 52 54 52 Q58 52 58 44" {...s} />
      <line x1="20" y1="8" x2="32" y2="8" {...s} />
      <line x1="22" y1="4" x2="22" y2="12" {...st(2)} />
      <line x1="30" y1="4" x2="30" y2="12" {...st(2)} />
    </>
  ),
  РОЗЕТКА: (
    <>
      <circle cx="32" cy="32" r="24" {...s} />
      <circle cx="32" cy="32" r="14" {...s} />
      <line x1="27" y1="27" x2="27" y2="37" {...st(3)} />
      <line x1="37" y1="27" x2="37" y2="37" {...st(3)} />
    </>
  ),
  ФОРТОЧКА: (
    <>
      <rect x="6" y="6" width="52" height="52" rx="2" {...s} />
      <rect x="14" y="14" width="36" height="24" rx="1" {...s} />
      <line x1="32" y1="14" x2="32" y2="38" {...st(1.5)} />
      <line x1="14" y1="26" x2="50" y2="26" {...st(1.5)} />
      <path d="M14 14 L50 38" {...st(1)} />
    </>
  ),
  САХАР: (
    <>
      <rect x="10" y="22" width="20" height="20" rx="2" {...s} />
      <rect x="34" y="22" width="20" height="20" rx="2" {...s} />
      <rect x="22" y="8" width="20" height="20" rx="2" {...s} />
      <rect x="22" y="36" width="20" height="20" rx="2" {...s} />
    </>
  ),
  ХЛЕБ: (
    <>
      <path d="M8 32 Q8 10 32 8 Q56 10 56 32 L56 54 L8 54 Z" {...s} />
      <line x1="8" y1="54" x2="56" y2="54" {...s} />
      <path d="M16" y1="54" x2="16" y2="38" {...s} />
      <line x1="16" y1="38" x2="16" y2="54" {...st(1.5)} />
      <line x1="24" y1="36" x2="24" y2="54" {...st(1.5)} />
      <line x1="32" y1="35" x2="32" y2="54" {...st(1.5)} />
      <line x1="40" y1="36" x2="40" y2="54" {...st(1.5)} />
      <line x1="48" y1="38" x2="48" y2="54" {...st(1.5)} />
    </>
  ),
  ЛОЖКА: (
    <>
      <ellipse cx="32" cy="16" rx="10" ry="12" {...s} />
      <path d="M24 26 L28 54" {...s} />
      <path d="M40 26 L36 54" {...s} />
      <line x1="28" y1="54" x2="36" y2="54" {...s} />
    </>
  ),
  КЕПКА: (
    <>
      <path d="M8 36 Q8 18 32 16 Q56 18 56 36" {...s} />
      <line x1="4" y1="36" x2="60" y2="36" {...s} />
      <path d="M4 36 Q4 42 8 42 L56 42 Q60 42 60 36" {...s} />
      <path d="M4 42 L4 36 Q4 38 0 44 L10 44" {...st(1.5)} />
    </>
  ),
  ТАПОЧКИ: (
    <>
      <path d="M6 42 Q6 32 16 30 L36 30 Q50 30 56 38 L58 42 Q58 50 52 52 L12 52 Q6 52 6 42 Z" {...s} />
      <path d="M16 30 Q14 22 22 20 L32 20 Q40 20 36 30" {...s} />
    </>
  ),
  НОСОК: (
    <>
      <path d="M22 8 L22 44 Q22 58 38 58 Q54 58 54 44 Q54 38 46 36 L42 36 L42 8 Z" {...s} />
      <line x1="22" y1="16" x2="42" y2="16" {...st(1.5)} />
    </>
  ),
  ТРУБА: (
    <>
      <rect x="20" y="4" width="24" height="56" rx="12" {...s} />
      <ellipse cx="32" cy="4" rx="12" ry="4" {...s} />
      <ellipse cx="32" cy="60" rx="12" ry="4" {...s} />
    </>
  ),
  ШТАНЫ: (
    <>
      <path d="M8 8 L8 36 Q8 54 20 54 L28 54 L32 36 L36 54 L44 54 Q56 54 56 36 L56 8 Z" {...s} />
      <line x1="8" y1="8" x2="56" y2="8" {...s} />
      <path d="M28 54 Q30 44 32 36 Q34 44 36 54" {...st(1.5)} />
      <line x1="8" y1="14" x2="56" y2="14" {...st(1.5)} />
    </>
  ),
  РУЧКА: (
    <>
      <rect x="28" y="4" width="8" height="44" rx="4" {...s} />
      <path d="M28 44 Q28 58 32 60 Q36 58 36 44" {...s} />
      <line x1="28" y1="12" x2="36" y2="12" {...st(1.5)} />
    </>
  ),
  РАКОВИНА: (
    <>
      <path d="M6 30 Q6 10 32 8 Q58 10 58 30 L58 40 Q58 48 32 50 Q6 48 6 40 Z" {...s} />
      <ellipse cx="32" cy="52" rx="10" ry="4" {...s} />
      <path d="M32 50 L32 56" {...s} />
      <path d="M22 56 L42 56" {...s} />
      <circle cx="32" cy="28" r="6" {...s} />
      <path d="M28 28 L36 28" {...st(2)} />
    </>
  ),
  ЦВЕТОК: (
    <>
      <circle cx="32" cy="26" r="8" {...s} />
      <ellipse cx="32" cy="12" rx="6" ry="8" {...s} />
      <ellipse cx="44" cy="18" rx="6" ry="8" transform="rotate(60 44 18)" {...s} />
      <ellipse cx="44" cy="34" rx="6" ry="8" transform="rotate(-60 44 34)" {...s} />
      <ellipse cx="32" cy="40" rx="6" ry="8" {...s} />
      <ellipse cx="20" cy="34" rx="6" ry="8" transform="rotate(60 20 34)" {...s} />
      <ellipse cx="20" cy="18" rx="6" ry="8" transform="rotate(-60 20 18)" {...s} />
      <path d="M32 34 L32 62" {...s} />
    </>
  ),
  ПИЖАМА: (
    <>
      <path d="M20 8 L10 22 L18 28 L18 58 L46 58 L46 28 L54 22 L44 8" {...s} />
      <path d="M20 8 Q32 14 44 8" {...s} />
      <path d="M10 22 L6 40 L18 40" {...s} />
      <path d="M54 22 L58 40 L46 40" {...s} />
      <line x1="18" y1="36" x2="46" y2="36" {...st(1.5)} />
      <line x1="18" y1="44" x2="46" y2="44" {...st(1.5)} />
    </>
  ),
  ВИДЕО: (
    <>
      <rect x="4" y="16" width="40" height="32" rx="4" {...s} />
      <path d="M44 26 L58 18 L58 46 L44 38 Z" {...s} />
      <circle cx="18" cy="32" r="6" {...s} />
      <circle cx="18" cy="32" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  ЙОГУРТ: (
    <>
      <path d="M16 18 L12 56 Q12 62 32 62 Q52 62 52 56 L48 18 Z" {...s} />
      <line x1="14" y1="18" x2="50" y2="18" {...s} />
      <ellipse cx="32" cy="18" rx="18" ry="5" {...s} />
      <path d="M22 30 Q32 36 42 30" {...st(1.5)} />
    </>
  ),
  МЁД: (
    <>
      <path d="M14 24 L14 52 Q14 62 32 62 Q50 62 50 52 L50 24 Z" {...s} />
      <line x1="14" y1="24" x2="50" y2="24" {...s} />
      <path d="M20 14 L20 24" {...s} />
      <path d="M44 14 L44 24" {...s} />
      <line x1="20" y1="14" x2="44" y2="14" {...s} />
      <path d="M22 38 Q32 32 42 38 Q32 44 22 38 Z" {...st(1.5)} />
    </>
  ),
  НОЖ: (
    <>
      <path d="M24 4 L24 44 Q24 60 32 60 Q40 60 40 44 L40 4 Z" {...s} />
      <line x1="24" y1="4" x2="40" y2="4" {...s} />
      <path d="M24 4 Q16 4 14 16 L24 20 Z" {...s} />
      <line x1="24" y1="44" x2="40" y2="44" {...st(1.5)} />
    </>
  ),
  ФИАЛКА: (
    <>
      <circle cx="32" cy="24" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="32" cy="12" rx="5" ry="7" {...st(1.5)} />
      <ellipse cx="42" cy="18" rx="5" ry="7" transform="rotate(60 42 18)" {...st(1.5)} />
      <ellipse cx="42" cy="30" rx="5" ry="7" transform="rotate(-60 42 30)" {...st(1.5)} />
      <ellipse cx="32" cy="36" rx="5" ry="7" {...st(1.5)} />
      <ellipse cx="22" cy="30" rx="5" ry="7" transform="rotate(60 22 30)" {...st(1.5)} />
      <ellipse cx="22" cy="18" rx="5" ry="7" transform="rotate(-60 22 18)" {...st(1.5)} />
      <path d="M32 30 L28 56 Q28 62 32 62 Q36 62 36 56 L32 30" {...s} />
    </>
  ),
  ВИЛКА: (
    <>
      <line x1="22" y1="4" x2="22" y2="28" {...s} />
      <line x1="32" y1="4" x2="32" y2="28" {...s} />
      <line x1="42" y1="4" x2="42" y2="28" {...s} />
      <path d="M22 28 Q22 36 32 38 Q42 36 42 28" {...s} />
      <path d="M32 38 L32 62" {...s} />
    </>
  ),
  ЧАЙНИК: (
    <>
      <path d="M10 22 L10 52 Q10 60 32 60 Q54 60 54 52 L54 22 Q54 14 32 14 Q10 14 10 22 Z" {...s} />
      <path d="M54 30 Q64 30 64 40 Q64 48 54 46" {...s} />
      <ellipse cx="32" cy="14" rx="14" ry="4" {...s} />
      <ellipse cx="32" cy="8" rx="8" ry="3" {...s} />
    </>
  ),
  ОБЕЗЬЯНА: (
    <>
      <circle cx="32" cy="26" r="16" {...s} />
      <circle cx="20" cy="14" r="7" {...s} />
      <circle cx="44" cy="14" r="7" {...s} />
      <circle cx="26" cy="30" r="3" {...st(1.5)} />
      <circle cx="38" cy="30" r="3" {...st(1.5)} />
      <path d="M26 38 Q32 44 38 38" {...st(2)} />
      <path d="M8 26 Q4 18 8 14" {...st(1.5)} />
      <path d="M56 26 Q60 18 56 14" {...st(1.5)} />
    </>
  ),
  ДЖИП: (
    <>
      <rect x="4" y="28" width="56" height="26" rx="4" {...s} />
      <path d="M14 28 L18 12 L46 12 L50 28" {...s} />
      <circle cx="16" cy="56" r="8" {...s} />
      <circle cx="48" cy="56" r="8" {...s} />
      <line x1="24" y1="28" x2="40" y2="28" {...st(1.5)} />
      <rect x="20" y="14" width="10" height="10" rx="1" {...st(1.5)} />
      <rect x="34" y="14" width="10" height="10" rx="1" {...st(1.5)} />
    </>
  ),
  РОБОТ: (
    <>
      <rect x="16" y="22" width="32" height="28" rx="3" {...s} />
      <rect x="20" y="10" width="24" height="14" rx="3" {...s} />
      <circle cx="26" cy="36" r="4" {...s} />
      <circle cx="38" cy="36" r="4" {...s} />
      <line x1="28" y1="44" x2="36" y2="44" {...st(2)} />
      <line x1="16" y1="30" x2="6" y2="28" {...s} />
      <line x1="48" y1="30" x2="58" y2="28" {...s} />
      <line x1="22" y1="50" x2="20" y2="62" {...s} />
      <line x1="42" y1="50" x2="44" y2="62" {...s} />
      <line x1="32" y1="10" x2="32" y2="6" {...s} />
      <circle cx="32" cy="4" r="3" {...s} />
    </>
  ),
  СВИНКА: (
    <>
      <ellipse cx="32" cy="38" rx="22" ry="16" {...s} />
      <circle cx="32" cy="22" r="12" {...s} />
      <ellipse cx="32" cy="22" rx="6" ry="4" {...s} />
      <circle cx="30" cy="21" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="34" cy="21" r="1.5" fill="currentColor" stroke="none" />
      <path d="M22 16 Q18 8 20 6" {...st(2)} />
      <path d="M42 16 Q46 8 44 6" {...st(2)} />
      <path d="M18 46 L14 58" {...s} />
      <path d="M26 52 L24 62" {...s} />
      <path d="M38 52 L40 62" {...s} />
      <path d="M46 46 L50 58" {...s} />
      <path d="M42 40 Q50 36 54 42" {...st(1.5)} />
    </>
  ),
  НАКЛЕЙКА: (
    <>
      <path d="M32 6 L37 22 L54 22 L40 32 L46 50 L32 40 L18 50 L24 32 L10 22 L27 22 Z" {...s} />
    </>
  ),
  КОНФЕТЫ: (
    <>
      <ellipse cx="32" cy="36" rx="16" ry="12" {...s} />
      <path d="M16 36 Q8 28 8 20 Q16 14 20 26" {...s} />
      <path d="M48 36 Q56 28 56 20 Q48 14 44 26" {...s} />
      <line x1="16" y1="42" x2="8" y2="52" {...st(2)} />
      <line x1="32" y1="48" x2="32" y2="58" {...st(2)} />
      <line x1="48" y1="42" x2="56" y2="52" {...st(2)} />
    </>
  ),
  КОНЬКИ: (
    <>
      <path d="M8 30 Q8 22 20 20 L52 20 Q58 22 58 30 Q58 38 52 40 L12 40 Q8 38 8 30 Z" {...s} />
      <path d="M16 40 L10 52 L54 52 L58 40" {...s} />
      <line x1="10" y1="52" x2="10" y2="58" {...st(2)} />
      <line x1="54" y1="52" x2="54" y2="58" {...st(2)} />
      <line x1="6" y1="58" x2="58" y2="58" {...s} />
    </>
  ),
};

interface WordIllustrationProps {
  word: string;
  className?: string;
  size?: number;
}

export function WordIllustration({ word, className = "", size = 80 }: WordIllustrationProps) {
  const content = illustrations[word.toUpperCase()];
  if (!content) return null;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}

export function hasIllustration(word: string): boolean {
  return word.toUpperCase() in illustrations;
}
