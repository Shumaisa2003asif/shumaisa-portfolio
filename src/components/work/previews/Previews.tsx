import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Store, User, Warehouse } from 'lucide-react'
import { useRef } from 'react'
import type { Project } from '../../../data/content'

/** Runs looping motion only while the preview is on screen. */
function useLive() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  return { ref, live: inView && !reduce }
}

/* ------------------------------------------------------------------ Mapalz */
export function MapalzPreview({ hover }: { hover: boolean }) {
  const shots = [
    { src: '/images/mapalz-customer.webp', alt: 'Mapalz customer storefront', rest: { x: '-14%', y: '-10%', rotate: -7 }, open: { x: '-22%', y: '-14%', rotate: -10 } },
    { src: '/images/mapalz-seller.webp', alt: 'Mapalz seller dashboard', rest: { x: '12%', y: '-4%', rotate: 5 }, open: { x: '20%', y: '-8%', rotate: 8 } },
    { src: '/images/mapalz-wholesaler.webp', alt: 'Mapalz wholesale hub dashboard', rest: { x: '0%', y: '10%', rotate: -1 }, open: { x: '0%', y: '14%', rotate: 0 } },
  ]
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {shots.map((s, i) => (
        <motion.img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading="lazy"
          decoding="async"
          className="absolute w-[62%] rounded-lg shadow-[0_24px_50px_-20px_rgba(52,68,56,0.55)] ring-1 ring-black/5"
          style={{ zIndex: i }}
          initial={false}
          animate={hover ? s.open : s.rest}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      ))}
      <img src="/logos/mapalz.webp" alt="" className="absolute left-5 top-5 h-8 w-auto md:left-7 md:top-7" />
    </div>
  )
}

/* ---------------------------------------------------------------- BOATMART */
export function BoatmartPreview() {
  const { ref, live } = useLive()
  const nodes = [
    { x: 16, y: 58, label: 'Wholesaler', Icon: Warehouse },
    { x: 50, y: 30, label: 'Seller', Icon: Store },
    { x: 84, y: 58, label: 'Customer', Icon: User },
  ]
  // cubic bezier control points in % of the preview box
  const routes: [number, number][][] = [
    [[16, 58], [24, 36], [38, 30], [50, 30]],
    [[50, 30], [62, 30], [76, 36], [84, 58]],
    [[84, 58], [66, 80], [34, 80], [16, 58]],
  ]
  return (
    <div ref={ref} className="absolute inset-0">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {routes.map(([a, b, c, d], i) => (
          <path
            key={i}
            d={`M${a} C${b} ${c} ${d}`}
            fill="none"
            stroke="#344438"
            strokeOpacity="0.25"
            strokeWidth="1.2"
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {/* parcels travelling the chain */}
      {routes.map((pts, i) => {
        const samples = sampleBezier(pts, 24)
        return [0, 1].map((k) => (
          <motion.span
            key={`${i}-${k}`}
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-[3px] md:h-3.5 md:w-3.5"
            style={{ background: i === 2 ? '#C88769' : '#344438' }}
            initial={{ left: `${pts[0][0]}%`, top: `${pts[0][1]}%`, opacity: 0 }}
            animate={
              live
                ? {
                    left: samples.map(([x]) => `${x}%`),
                    top: samples.map(([, y]) => `${y}%`),
                    opacity: samples.map((_, j) => (j === 0 || j === samples.length - 1 ? 0 : 1)),
                  }
                : { opacity: 0 }
            }
            transition={{ duration: 3.2, repeat: Infinity, delay: i * 1.05 + k * 1.6, ease: 'linear' }}
          />
        ))
      })}
      {nodes.map(({ x, y, label, Icon }) => (
        <div key={label} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${x}%`, top: `${y}%` }}>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ivory shadow-[0_10px_30px_-14px_rgba(52,68,56,0.6)] md:h-16 md:w-16">
            <Icon className="h-6 w-6 text-olive" strokeWidth={1.6} aria-hidden />
          </div>
          <p className="mt-2 font-mono text-[11px] text-olive/80">{label}</p>
        </div>
      ))}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-hand text-xl text-clay">one marketplace, three sides</p>
    </div>
  )
}

function sampleBezier([p0, p1, p2, p3]: [number, number][], n: number): [number, number][] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    const u = 1 - t
    const x = u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0]
    const y = u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1]
    return [x, y]
  })
}

/* ------------------------------------------------------- Plant disease */
export function PlantPreview() {
  const { ref, live } = useLive()
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[78%] aspect-[4/5]">
        <svg viewBox="0 0 200 250" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M100 244 C98 200 100 120 104 18" stroke="#56684F" strokeWidth="3" fill="none" />
          <path d="M104 22 C170 52 186 140 102 228 C18 150 30 60 104 22 Z" fill="#7F927A" />
          <path d="M104 22 C170 52 186 140 102 228" fill="#6c8067" opacity="0.6" />
          {[60, 92, 124, 156, 188].map((y, i) => (
            <path key={y} d={`M${102 - i * 0.3} ${y} C${118} ${y - 10} ${134 + i * 2} ${y - 14} ${146 - i * 4} ${y - 28}`} stroke="#56684F" strokeWidth="1.6" fill="none" opacity="0.7" />
          ))}
          {[60, 92, 124, 156].map((y, i) => (
            <path key={`l${y}`} d={`M${102} ${y + 8} C${86} ${y - 2} ${72 - i * 2} ${y - 6} ${62 + i * 3} ${y - 20}`} stroke="#56684F" strokeWidth="1.6" fill="none" opacity="0.7" />
          ))}
          {/* lesions */}
          {[
            [128, 104, 9], [138, 120, 5], [118, 126, 6], [74, 150, 5], [134, 92, 4],
          ].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r + 3} fill="#c9b36a" opacity="0.55" />
              <circle cx={x} cy={y} r={r} fill="#6b4a32" />
            </g>
          ))}
        </svg>
        {/* scan line */}
        <motion.div
          className="absolute inset-x-[-6%] h-10 bg-gradient-to-b from-transparent via-[#F5F0E6]/70 to-transparent"
          style={{ top: 0 }}
          animate={live ? { top: ['0%', '92%', '0%'] } : undefined}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-olive/70" />
        </motion.div>
        {/* detection box */}
        <motion.div
          className="absolute rounded-md border-2 border-clay"
          style={{ left: '52%', top: '33%', width: '24%', height: '20%' }}
          initial={{ opacity: 0, scale: 1.3 }}
          animate={live ? { opacity: [0, 0, 1, 1, 0], scale: [1.3, 1.3, 1, 1, 1] } : { opacity: 1, scale: 1 }}
          transition={{ duration: 5, repeat: Infinity, times: [0, 0.35, 0.45, 0.9, 1] }}
        >
          <span className="absolute -top-7 left-0 whitespace-nowrap rounded bg-clay px-1.5 py-0.5 font-mono text-[10px] text-ivory md:text-[11px]">
            early blight 94%
          </span>
        </motion.div>
      </div>
    </div>
  )
}

/* -------------------------------------------------- Intrusion detection */
const IDS_NODES: [number, number][] = [
  [14, 24], [36, 14], [60, 22], [84, 16], [24, 52], [50, 46], [76, 50], [16, 80], [44, 78], [70, 82], [90, 72],
]
const IDS_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [3, 6], [4, 5], [5, 6], [4, 7], [5, 8], [6, 9], [6, 10], [7, 8], [8, 9], [9, 10],
]
const SUSPECT = 6

export function IdsPreview() {
  const { ref, live } = useLive()
  return (
    <div ref={ref} className="absolute inset-0">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {IDS_EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={IDS_NODES[a][0]}
            y1={IDS_NODES[a][1]}
            x2={IDS_NODES[b][0]}
            y2={IDS_NODES[b][1]}
            stroke={a === SUSPECT || b === SUSPECT ? '#9C5B3F' : '#344438'}
            strokeOpacity={a === SUSPECT || b === SUSPECT ? 0.6 : 0.22}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {IDS_EDGES.slice(0, 10).map(([a, b], i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: b === SUSPECT || a === SUSPECT ? '#9C5B3F' : '#344438' }}
          initial={{ left: `${IDS_NODES[a][0]}%`, top: `${IDS_NODES[a][1]}%`, opacity: 0 }}
          animate={
            live
              ? { left: [`${IDS_NODES[a][0]}%`, `${IDS_NODES[b][0]}%`], top: [`${IDS_NODES[a][1]}%`, `${IDS_NODES[b][1]}%`], opacity: [0, 1, 0] }
              : { opacity: 0 }
          }
          transition={{ duration: 1.8, repeat: Infinity, delay: (i * 0.37) % 2.2, ease: 'linear' }}
        />
      ))}
      {IDS_NODES.map(([x, y], i) => (
        <span
          key={i}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${i === SUSPECT ? 'h-4 w-4 bg-clay' : 'h-3 w-3 bg-olive'}`}
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          {i === SUSPECT && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-clay"
              animate={live ? { scale: [1, 3.2], opacity: [0.8, 0] } : undefined}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </span>
      ))}
      <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-olive/90 p-3 font-mono text-[10px] leading-relaxed text-ivory/85 md:bottom-6 md:left-6 md:right-auto md:w-[62%] md:text-[11px]">
        <p className="text-ivory/50">10:42:05 192.168.0.12 normal</p>
        <p className="text-ivory/50">10:42:06 192.168.0.31 normal</p>
        <motion.p
          className="text-[#f0b48f]"
          animate={live ? { opacity: [0.35, 1, 0.35] } : undefined}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          10:42:07 10.0.4.17 port scan, flagged
        </motion.p>
      </div>
    </div>
  )
}

export function Preview({ project, hover }: { project: Project; hover: boolean }) {
  switch (project.preview) {
    case 'mapalz':
      return <MapalzPreview hover={hover} />
    case 'boatmart':
      return <BoatmartPreview />
    case 'plant':
      return <PlantPreview />
    case 'ids':
      return <IdsPreview />
  }
}
