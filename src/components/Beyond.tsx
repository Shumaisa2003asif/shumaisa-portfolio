import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { WordsPullUp } from './motion/WordsPullUp'

function Piece({
  children,
  className,
  rotate,
  progress,
  drift,
}: {
  children: React.ReactNode
  className: string
  rotate: number
  progress: MotionValue<number>
  drift: number
}) {
  const reduce = useReducedMotion()
  const y = useTransform(progress, [0, 1], reduce ? [0, 0] : [drift, -drift])
  return (
    <motion.figure
      className={`relative ${className}`}
      style={{ y, rotate }}
      whileHover={reduce ? undefined : { rotate: 0, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.figure>
  )
}

const Tape = ({ className = '' }: { className?: string }) => (
  <span aria-hidden className={`absolute h-6 w-20 bg-lavender/70 ${className}`} />
)

export function Beyond() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  return (
    <section ref={ref} id="beyond" className="relative overflow-hidden bg-sand/45 py-28 md:py-40">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply" />
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="grid grid-cols-12 items-end gap-6">
          <WordsPullUp text="Beyond the screen" className="col-span-12 font-serif text-[14vw] leading-[0.9] text-olive md:col-span-8 md:text-[7.5rem]" />
          <p className="col-span-12 max-w-[36ch] text-[17px] leading-relaxed text-olive/80 md:col-span-4 md:pb-3">
            The things that refill the well: light, books, sketches and the occasional rabbit hole.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-14 sm:grid-cols-2 md:mt-24 lg:block lg:h-[760px] lg:relative">
          {/* photography */}
          <Piece progress={scrollYProgress} drift={30} rotate={-4} className="mx-auto w-[min(86%,340px)] bg-[#FBF8F1] p-3 pb-16 shadow-[0_24px_50px_-28px_rgba(52,68,56,0.6)] lg:absolute lg:left-[2%] lg:top-[4%] lg:w-[330px]">
            <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-3" />
            <img src="/images/golden-hour.webp" alt="Golden-hour clouds" loading="lazy" className="aspect-[9/10] w-full object-cover" />
            <figcaption className="absolute bottom-4 left-4 right-4 font-hand text-2xl leading-tight text-olive">
              golden hour, above the clouds
            </figcaption>
            <span className="absolute -right-3 -top-8 font-mono text-xs text-olive/70 lg:-right-20 lg:top-6">photography</span>
          </Piece>

          {/* reading */}
          <Piece progress={scrollYProgress} drift={-20} rotate={3} className="mx-auto w-[min(86%,300px)] lg:absolute lg:left-[33%] lg:top-[36%] lg:w-[300px]">
            <svg viewBox="0 0 260 220" className="w-full" aria-hidden>
              <rect x="20" y="170" width="220" height="34" rx="3" fill="#344438" />
              <rect x="34" y="136" width="200" height="34" rx="3" fill="#C88769" />
              <rect x="14" y="104" width="214" height="32" rx="3" fill="#7F927A" />
              <rect x="40" y="74" width="180" height="30" rx="3" fill="#B9A9C9" />
              <rect x="28" y="46" width="196" height="28" rx="3" fill="#D9CBB8" stroke="#344438" strokeOpacity="0.2" />
              {[187, 153, 120, 89, 60].map((y) => (
                <path key={y} d={`M${y % 2 ? 60 : 70} ${y} H${y % 2 ? 200 : 190}`} stroke="#F5F0E6" strokeOpacity="0.55" strokeWidth="2" />
              ))}
              <path d="M150 46 C150 30 160 18 176 16" stroke="#344438" strokeWidth="2" fill="none" />
              <path d="M176 16 C186 22 188 30 182 36 C174 34 172 26 176 16 Z" fill="#7F927A" />
            </svg>
            <figcaption className="mt-4">
              <span className="block font-mono text-xs text-olive/70">reading</span>
              <span className="mt-1 block font-hand text-2xl leading-tight text-olive">always one book ahead of my to-do list</span>
            </figcaption>
          </Piece>

          {/* creativity */}
          <Piece progress={scrollYProgress} drift={40} rotate={-2} className="mx-auto w-[min(86%,320px)] bg-[#FBF8F1] p-6 shadow-[0_24px_50px_-28px_rgba(52,68,56,0.6)] lg:absolute lg:right-[22%] lg:top-[0%] lg:w-[320px]">
            <div
              aria-hidden
              className="absolute inset-0 opacity-60"
              style={{ backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(52,68,56,0.12) 27px 28px)' }}
            />
            <svg viewBox="0 0 260 200" className="relative w-full" aria-hidden>
              <path d="M30 150 C70 136 120 140 150 120 C130 110 112 104 92 112 C80 90 50 96 46 118 C34 118 26 130 30 150 Z" fill="none" stroke="#344438" strokeWidth="2" />
              <path d="M84 112 L84 96 M78 102 L90 102" stroke="#344438" strokeWidth="2" />
              <circle cx="200" cy="54" r="22" fill="none" stroke="#C88769" strokeWidth="2.5" />
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2
                return <path key={i} d={`M${200 + Math.cos(a) * 30} ${54 + Math.sin(a) * 30} L${200 + Math.cos(a) * 40} ${54 + Math.sin(a) * 40}`} stroke="#C88769" strokeWidth="2.5" strokeLinecap="round" />
              })}
              <path d="M40 40 C60 20 90 60 110 40 C130 20 150 60 170 40" fill="none" stroke="#7F927A" strokeWidth="2" strokeLinecap="round" />
              <path d="M180 160 l8 -16 l8 16 l-16 -10 h16 z" fill="none" stroke="#344438" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <figcaption className="relative mt-3">
              <span className="block font-mono text-xs text-olive/70">creativity</span>
              <span className="mt-1 block font-hand text-2xl leading-tight text-olive">sketches before screens</span>
            </figcaption>
          </Piece>

          {/* discovering ideas */}
          <Piece progress={scrollYProgress} drift={-35} rotate={5} className="mx-auto w-[min(80%,260px)] bg-[#F3E9F7] px-6 py-7 shadow-[0_24px_50px_-28px_rgba(52,68,56,0.6)] lg:absolute lg:bottom-[2%] lg:right-[2%] lg:w-[270px]">
            <Tape className="-top-3 left-6 -rotate-6 bg-sage/60" />
            <p className="font-hand text-[28px] leading-[1.15] text-olive">
              open tabs: 37
              <br />
              all of them important
            </p>
            <figcaption className="mt-4 font-mono text-xs text-olive/70">discovering new ideas</figcaption>
          </Piece>
        </div>
      </div>
    </section>
  )
}
