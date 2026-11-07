import { motion } from 'framer-motion'

type P = [number, number]

/** Closed/open Catmull-Rom spline through the points, as an SVG path. */
function smooth(pts: P[], closed = true) {
  const n = pts.length
  const at = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))])
  let d = `M${pts[0][0]} ${pts[0][1]}`
  const segs = closed ? n : n - 1
  for (let i = 0; i < segs; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`
  }
  return closed ? `${d} Z` : d
}
const poly = (pts: P[]) => pts.map((p) => p.join(',')).join(' ')

// ---- geometry (stage units, 1600 x 900) ----
const BACK: P[] = [
  [300, 392], [380, 362], [480, 340], [590, 326], [700, 316], [800, 318], [900, 334], [985, 360], [1050, 390],
]
const FRONT: P[] = [
  [1060, 436], [1000, 462], [920, 488], [830, 508], [740, 518], [650, 516], [560, 504], [470, 486], [380, 464], [310, 442],
]
const PLATEAU = smooth([[262, 418], ...BACK, [1082, 414], ...FRONT])
const LIP = smooth([[262, 426], ...BACK.map(([x, y]) => [x, y + 6] as P), [1084, 424], ...FRONT.map(([x, y]) => [x, y + 13] as P)])

const LEFT_FACE: P[] = [
  [262, 418], [310, 442], [380, 464], [470, 486], [560, 504], [650, 516], [740, 518],
  [752, 600], [770, 700], [748, 800], [700, 870], [612, 852], [530, 790], [452, 722], [380, 640], [318, 560], [276, 478],
]
const RIGHT_FACE: P[] = [
  [740, 518], [830, 508], [920, 488], [1000, 462], [1060, 436], [1082, 414],
  [1094, 470], [1080, 552], [1046, 640], [992, 730], [924, 806], [842, 860], [770, 700], [752, 600],
]
const PATH = smooth(
  [[420, 424], [500, 436], [585, 452], [672, 458], [760, 462], [845, 466], [905, 466]],
  false,
)

// Telephone poles: base -> top
const POLES: { base: P; top: P }[] = [
  { base: [372, 444], top: [360, 168] },
  { base: [612, 352], top: [604, 120] },
]

export function Island() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="grass" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#26301f" />
          <stop offset="0.45" stopColor="#47522f" />
          <stop offset="0.8" stopColor="#7c7a3c" />
          <stop offset="1" stopColor="#b59a52" />
        </linearGradient>
        <radialGradient id="grassSun" cx="1" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#ffc779" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffc779" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="faceShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2f28" />
          <stop offset="0.5" stopColor="#2a2421" />
          <stop offset="1" stopColor="#4a4250" />
        </linearGradient>
        <linearGradient id="faceLit" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#4d3a2c" />
          <stop offset="0.6" stopColor="#8a6141" />
          <stop offset="1" stopColor="#c99461" />
        </linearGradient>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor="#8c7468" stopOpacity="0" />
          <stop offset="1" stopColor="#8c7468" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="dirt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a6448" />
          <stop offset="1" stopColor="#d2b07a" />
        </linearGradient>
        <linearGradient id="rock" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3f3934" />
          <stop offset="0.7" stopColor="#6d6054" />
          <stop offset="1" stopColor="#c09a70" />
        </linearGradient>
        <linearGradient id="sweater" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6e5258" />
          <stop offset="0.65" stopColor="#a87f86" />
          <stop offset="1" stopColor="#e2ae98" />
        </linearGradient>
        <linearGradient id="hijab" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#141217" />
          <stop offset="0.75" stopColor="#24202a" />
          <stop offset="1" stopColor="#4a3a34" />
        </linearGradient>
        <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f8ff" />
          <stop offset="1" stopColor="#a9c7ef" />
        </linearGradient>
        <radialGradient id="screenGlow">
          <stop offset="0" stopColor="#d6e7ff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#d6e7ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="windowGlow">
          <stop offset="0" stopColor="#ffd38a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd38a" stopOpacity="0" />
        </radialGradient>
        <filter id="tex" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.4" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 0.75" result="dark" />
          <feComposite in="dark" in2="SourceGraphic" operator="in" result="speck" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="speck" />
          </feMerge>
        </filter>
        <filter id="rockTex" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.07" numOctaves="4" seed="9" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.0" result="dark" />
          <feComposite in="dark" in2="SourceGraphic" operator="in" result="strata" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="strata" />
          </feMerge>
        </filter>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <clipPath id="cliffClip">
          <polygon points={poly(LEFT_FACE)} />
          <polygon points={poly(RIGHT_FACE)} />
        </clipPath>
      </defs>

      {/* ---- cliff faces ---- */}
      <g filter="url(#rockTex)">
        <polygon points={poly(LEFT_FACE)} fill="url(#faceShadow)" />
        <polygon points={poly(RIGHT_FACE)} fill="url(#faceLit)" />
      </g>
      {/* crags and fissures */}
      <g opacity="0.55" fill="none" strokeLinecap="round">
        <path d="M330 520 L352 600 L340 660" stroke="#1d1916" strokeWidth="3" />
        <path d="M430 560 L446 640 L470 700" stroke="#1d1916" strokeWidth="2.5" />
        <path d="M560 560 L572 650 L560 760" stroke="#1d1916" strokeWidth="3" />
        <path d="M680 560 L700 640 L690 740" stroke="#1d1916" strokeWidth="2" />
        <path d="M820 560 L812 640 L830 720" stroke="#3a2a1f" strokeWidth="3" />
        <path d="M930 540 L948 610 L930 700" stroke="#3a2a1f" strokeWidth="2.5" />
        <path d="M1030 500 L1040 560 L1020 620" stroke="#3a2a1f" strokeWidth="2" />
      </g>
      {/* warm light catching the sun-facing ridge of the right face */}
      <path d="M1082 414 L1094 470 L1080 552 L1046 640" stroke="#f6c37c" strokeWidth="5" fill="none" opacity="0.75" filter="url(#soft)" />
      <rect x="240" y="420" width="880" height="470" fill="url(#haze)" clipPath="url(#cliffClip)" />

      {/* ---- plateau ---- */}
      <path d={LIP} fill="#1d2418" />
      <g filter="url(#tex)">
        <path d={PLATEAU} fill="url(#grass)" />
      </g>
      <path d={PLATEAU} fill="url(#grassSun)" />
      {/* sunlit rim along the right edge */}
      <path
        d={smooth([[900, 334], [985, 360], [1050, 390], [1082, 414], [1060, 436], [1000, 462], [920, 488]], false)}
        stroke="#ffd08a"
        strokeWidth="3.5"
        fill="none"
        opacity="0.8"
        filter="url(#soft)"
      />

      {/* dirt path */}
      <path d={PATH} stroke="url(#dirt)" strokeWidth="20" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d={PATH} stroke="#e7c993" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.35" />

      {/* long shadows, cast to the left by the low sun */}
      <g fill="#10140e" opacity="0.45" filter="url(#soft)">
        <polygon points="612,352 470,392 476,398 616,358" />
        <polygon points="372,444 268,470 272,476 376,450" />
        <polygon points="428,420 468,434 400,452 352,440" />
        <ellipse cx="868" cy="470" rx="58" ry="8" />
      </g>

      {/* boulders at the back */}
      <g filter="url(#rockTex)">
        <polygon points="650,332 668,296 705,282 742,292 760,318 750,338 690,344" fill="url(#rock)" />
        <polygon points="736,334 750,312 774,306 794,320 786,340 752,344" fill="url(#rock)" />
        <polygon points="620,340 630,322 652,318 664,334 650,346" fill="url(#rock)" />
      </g>
      <path d="M672 296 C690 284 716 280 738 290 C722 288 700 290 680 300 Z" fill="#5d6534" />
      <path d="M752 312 C764 304 780 304 792 318 C780 312 766 310 752 316 Z" fill="#5d6534" />

      {/* hut */}
      <g>
        <polygon points="428,422 468,434 468,406 428,394" fill="#2c211b" />
        <polygon points="468,434 506,422 506,394 468,406" fill="#6b4a32" />
        <polygon points="468,406 506,394 487,374" fill="#86603f" />
        <polygon points="424,396 444,362 489,370 470,409" fill="#231d1a" />
        <path d="M444 362 L489 370" stroke="#c99a68" strokeWidth="1.5" />
        <polygon points="437,404 447,407 447,428 437,425" fill="#120e0c" />
        <circle cx="487" cy="412" r="20" fill="url(#windowGlow)" />
        <polygon points="481,408 493,404 493,414 481,418" fill="#ffd38a" />
      </g>

      {/* telephone poles and wires */}
      <g>
        <path d="M-40 236 Q170 262 360 176" stroke="#191512" strokeWidth="1.3" fill="none" opacity="0.8" />
        <path d="M-40 246 Q170 278 360 186" stroke="#191512" strokeWidth="1.1" fill="none" opacity="0.7" />
        <path d="M360 176 Q480 176 604 128" stroke="#191512" strokeWidth="1.3" fill="none" opacity="0.8" />
        <path d="M360 186 Q480 190 604 138" stroke="#191512" strokeWidth="1.1" fill="none" opacity="0.7" />
        {POLES.map(({ base, top }, i) => (
          <g key={i}>
            <line x1={base[0]} y1={base[1]} x2={top[0]} y2={top[1]} stroke="#211a15" strokeWidth={i === 0 ? 7 : 5} strokeLinecap="round" />
            <line x1={base[0] + 2.5} y1={base[1]} x2={top[0] + 2.5} y2={top[1]} stroke="#c58d58" strokeWidth="1.2" opacity="0.7" />
            <line x1={top[0] - 20} y1={top[1] + 10} x2={top[0] + 20} y2={top[1] + 6} stroke="#211a15" strokeWidth="4" />
            <line x1={top[0] - 16} y1={top[1] + 20} x2={top[0] + 16} y2={top[1] + 17} stroke="#211a15" strokeWidth="3" />
          </g>
        ))}
      </g>

      {/* grass tufts along the edge */}
      <g stroke="#6f7536" strokeWidth="2" strokeLinecap="round" opacity="0.8">
        {[[318, 440], [404, 468], [512, 492], [598, 508], [702, 516], [796, 512], [884, 496], [968, 472], [1040, 442]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} l-3 -9 M${x + 4} ${y} l1 -11 M${x + 8} ${y} l4 -8`} />
        ))}
      </g>

      <Girl x={905} y={468} scale={1.08} />
    </svg>
  )
}

/** A girl in a black hijab and dusty-pink sweater, seen from behind, working on a glowing laptop. */
function Girl({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* laptop light on the grass */}
      <ellipse cx="44" cy="2" rx="34" ry="7" fill="#cfe2ff" opacity="0.28" filter="url(#soft)" />
      {/* folded legs under a long skirt */}
      <path d="M-25 3 C-28 -4 -24 -11 -16 -12 L26 -12 C40 -12 50 -7 50 -1 C50 4 44 6 36 6 L-19 6 C-23 6 -25 5 -25 3 Z" fill="#2a2529" />
      <path d="M26 -12 C40 -12 50 -7 50 -1" stroke="#e9b27e" strokeWidth="1.3" fill="none" opacity="0.6" />
      {/* laptop on her lap: the screen faces her, so from behind we see it glowing past her shoulder */}
      <motion.g
        initial={{ opacity: 0.85 }}
        animate={{ opacity: [0.85, 1, 0.9, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="34" cy="-30" r="34" fill="url(#screenGlow)" />
        <polygon points="16,-14 42,-14 47,-44 22,-46" fill="url(#screen)" stroke="#1b1d22" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="12,-13 46,-13 48,-10 10,-10" fill="#7c808a" />
      </motion.g>
      {/* sweater: back, waist and hips */}
      <path d="M-22 -4 C-21 -14 -17 -22 -16 -30 C-17 -38 -19 -44 -18 -49 C-12 -54 14 -55 22 -50 C24 -44 22 -36 21 -30 C21 -22 24 -12 24 -4 Z" fill="url(#sweater)" />
      {/* arms bent forward to the keyboard; the right one is lit by the sun */}
      <path d="M-17 -48 C-23 -44 -25 -34 -23 -25 C-21 -20 -16 -19 -13 -22 C-14 -30 -14 -40 -12 -46 Z" fill="#7a5c62" />
      <path d="M21 -48 C26 -42 28 -32 26 -24 C24 -20 20 -20 18 -23 C19 -30 19 -40 18 -46 Z" fill="#c9958f" />
      <path d="M24 -45 C27 -38 28 -30 26 -24" stroke="#ffcf96" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.9" />
      {/* hijab: fitted over the head, falling as a cape over the shoulders to a soft point at the back */}
      <path
        d="M3 -84 C11 -84 15 -78 15 -70 C15 -64 17 -59 23 -53 C25 -50 23 -47 19 -45 C14 -39 8 -33 3 -30 C-2 -33 -9 -39 -15 -45 C-19 -47 -20 -50 -18 -53 C-12 -59 -10 -64 -10 -70 C-10 -78 -5 -84 3 -84 Z"
        fill="url(#hijab)"
      />
      <path d="M3 -62 C3 -52 3 -42 3 -32" stroke="#3b3542" strokeWidth="1" fill="none" opacity="0.7" />
      <path d="M-8 -56 C-6 -50 -3 -44 0 -38" stroke="#3b3542" strokeWidth="0.9" fill="none" opacity="0.6" />
      <path d="M13 -56 C11 -50 9 -44 6 -38" stroke="#3b3542" strokeWidth="0.9" fill="none" opacity="0.5" />
      {/* rim light: warm sun along the right of the head and shoulder, cool screen light below */}
      <path d="M9 -83 C14 -80 16 -74 15 -67" stroke="#ffcf8c" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <path d="M17 -60 C19 -57 22 -55 23 -52" stroke="#ffcf8c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M21 -47 C17 -42 12 -37 7 -33" stroke="#cfe2ff" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.75" />
    </g>
  )
}
