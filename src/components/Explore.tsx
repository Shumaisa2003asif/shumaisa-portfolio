import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { explorations } from '../data/content'
import { WordsPullUp } from './motion/WordsPullUp'

type Key = (typeof explorations)[number]['key']

const draw = (reduce: boolean | null, delay = 0) => ({
  initial: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const, delay },
})

/** Small line drawings, one per area, that draw themselves in when selected. */
function Illustration({ k }: { k: Key }) {
  const reduce = useReducedMotion()
  const s = { fill: 'none', stroke: '#344438', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  switch (k) {
    case 'ai': {
      const layers = [[40, 70, 100, 130, 160], [55, 100, 145], [80, 120]]
      const xs = [40, 100, 160]
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          {layers.slice(0, -1).flatMap((ys, li) =>
            ys.flatMap((y1, a) =>
              layers[li + 1].map((y2, b) => (
                <motion.line key={`${li}-${a}-${b}`} x1={xs[li]} y1={y1} x2={xs[li + 1]} y2={y2} {...s} strokeWidth={1} strokeOpacity={0.35} {...draw(reduce, 0.05 * (a + b))} />
              )),
            ),
          )}
          {layers.flatMap((ys, li) =>
            ys.map((y, i) => (
              <motion.circle key={`n${li}-${i}`} cx={xs[li]} cy={y} r={li === 2 ? 9 : 7} fill={li === 2 && i === 0 ? '#C88769' : '#F5F0E6'} stroke="#344438" strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + li * 0.15 + i * 0.04 }} />
            )),
          )}
        </svg>
      )
    }
    case 'software':
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <motion.path d="M70 60 L35 100 L70 140" {...s} strokeWidth={4} {...draw(reduce)} />
          <motion.path d="M130 60 L165 100 L130 140" {...s} strokeWidth={4} {...draw(reduce, 0.15)} />
          <motion.path d="M112 50 L88 150" {...s} strokeWidth={4} stroke="#C88769" {...draw(reduce, 0.3)} />
          <motion.rect x="92" y="164" width="16" height="4" rx="2" fill="#344438" animate={reduce ? undefined : { opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        </svg>
      )
    case 'ux':
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <motion.rect x="40" y="70" width="120" height="44" rx="22" {...s} {...draw(reduce)} />
          <motion.path d="M70 92 L130 92" {...s} strokeOpacity={0.35} {...draw(reduce, 0.2)} />
          <motion.circle cx="118" cy="106" r="10" fill="#B9A9C9" initial={{ scale: 0, opacity: 0.8 }} animate={reduce ? { scale: 1 } : { scale: [0, 2.6], opacity: [0.8, 0] }} transition={{ duration: 1.4, repeat: reduce ? 0 : Infinity, repeatDelay: 0.6 }} />
          <motion.path d="M116 104 L116 146 L127 136 L135 154 L143 150 L135 133 L150 133 Z" {...s} fill="#F5F0E6" initial={{ x: 30, y: 30, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} />
        </svg>
      )
    case 'product':
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <motion.path d="M30 150 C70 150 70 100 100 100 C130 100 130 50 170 50" {...s} strokeDasharray="5 7" {...draw(reduce)} />
          {[
            [30, 150, 'idea'],
            [100, 100, 'mvp'],
            [170, 50, 'v1'],
          ].map(([x, y, label], i) => (
            <motion.g key={label as string} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 + i * 0.25, type: 'spring', stiffness: 220, damping: 16 }} style={{ originX: `${x}px`, originY: `${y}px` }}>
              <circle cx={x as number} cy={y as number} r="16" fill={i === 2 ? '#7F927A' : '#F5F0E6'} stroke="#344438" strokeWidth={2} />
              <text x={x as number} y={(y as number) + 36} textAnchor="middle" className="fill-olive font-mono text-[12px]">
                {label}
              </text>
            </motion.g>
          ))}
        </svg>
      )
    case 'creative':
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <motion.circle cx="132" cy="78" r="26" fill="#C88769" opacity="0.85" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 0.85 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
          <motion.path d="M40 132 C40 112 62 104 76 114 C82 94 112 92 120 112 C138 106 156 118 152 134 Z" {...s} fill="#F5F0E6" animate={reduce ? undefined : { x: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.path d="M30 160 L170 160" {...s} strokeOpacity={0.3} {...draw(reduce, 0.2)} />
        </svg>
      )
    case 'business':
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <motion.path d="M40 150 L40 92 L160 92 L160 150" {...s} {...draw(reduce)} />
          <motion.path d="M32 92 L48 60 L152 60 L168 92 Z" {...s} fill="#B9A9C9" fillOpacity={0.5} {...draw(reduce, 0.1)} />
          <motion.path d="M84 150 L84 116 L116 116 L116 150" {...s} {...draw(reduce, 0.25)} />
          <motion.path d="M120 44 L140 30 L156 36 L176 14" {...s} stroke="#C88769" strokeWidth={3} {...draw(reduce, 0.45)} />
        </svg>
      )
  }
}

export function Explore() {
  const [active, setActive] = useState<Key>('ai')
  const current = explorations.find((e) => e.key === active)!

  return (
    <section id="explore" className="relative bg-ivory py-28 md:py-40">
      <div className="mx-auto grid max-w-[1320px] grid-cols-12 gap-x-6 gap-y-12 px-5 md:px-10">
        <div className="col-span-12 lg:col-span-7">
          <WordsPullUp text="What I explore" className="font-serif text-[15vw] leading-[0.9] text-olive md:text-[7.5rem]" />
          <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-olive/80">
            Six things I keep coming back to. Pick one to see why.
          </p>

          <ul className="mt-12 border-t border-olive/15">
            {explorations.map((e) => {
              const on = e.key === active
              return (
                <li key={e.key} className="border-b border-olive/15">
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`explore-${e.key}`}
                    onClick={() => setActive(e.key)}
                    onMouseEnter={() => window.matchMedia('(min-width: 1024px)').matches && setActive(e.key)}
                    onFocus={() => setActive(e.key)}
                    className="group flex w-full items-center justify-between gap-4 py-5 text-left md:py-6"
                  >
                    <span
                      className={`font-serif text-[2rem] leading-none transition-[color,transform] duration-500 sm:text-4xl md:text-5xl ${
                        on ? 'translate-x-0 text-olive md:translate-x-3' : 'text-olive/35 group-hover:text-olive/60'
                      }`}
                    >
                      {e.title}
                    </span>
                    <motion.span
                      aria-hidden
                      className="h-3 w-3 shrink-0 rounded-full bg-terracotta"
                      animate={{ scale: on ? 1 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        id={`explore-${e.key}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="flex items-start gap-5 pb-6 md:pl-3">
                          <div className="h-24 w-24 shrink-0">
                            <Illustration k={e.key} />
                          </div>
                          <p className="max-w-[48ch] text-[17px] leading-relaxed text-olive/80">{e.body}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </div>

        {/* illustration panel, desktop */}
        <div className="col-span-5 hidden lg:block">
          <div className="sticky top-24 mt-40">
          <div className="relative aspect-square overflow-hidden rounded-[45%_55%_52%_48%/48%_45%_55%_52%] bg-sand/60">
            <div className="bg-noise pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.key}
                className="absolute inset-[16%]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Illustration k={current.key} />
              </motion.div>
            </AnimatePresence>
          </div>
          <p aria-live="polite" className="mx-auto mt-6 max-w-[40ch] text-center text-[17px] leading-relaxed text-olive/80">
            {current.body}
          </p>
          </div>
        </div>
      </div>
    </section>
  )
}
