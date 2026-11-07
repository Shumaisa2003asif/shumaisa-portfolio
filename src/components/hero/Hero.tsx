import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { nav, profile } from '../../data/content'
import { WordsPullUp } from '../motion/WordsPullUp'
import { HeroScene } from './HeroScene'

const EASE = [0.16, 1, 0.3, 1] as const
const LINK = 'rgba(225, 224, 204, 0.8)'

function Navbar() {
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex justify-center">
      <motion.nav
        aria-label="Main"
        className="relative rounded-b-2xl bg-black px-4 md:rounded-b-3xl md:px-8"
        initial={{ y: '-110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1, ease: EASE, delay: 1.1 }}
      >
        {/* concave corners so the pill reads as part of the frame */}
        <span
          aria-hidden
          className="absolute -left-4 top-0 h-4 w-4 md:-left-6 md:h-6 md:w-6"
          style={{ background: 'radial-gradient(circle at 0 100%, transparent 70%, #000 71%)' }}
        />
        <span
          aria-hidden
          className="absolute -right-4 top-0 h-4 w-4 md:-right-6 md:h-6 md:w-6"
          style={{ background: 'radial-gradient(circle at 100% 100%, transparent 70%, #000 71%)' }}
        />
        <ul className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-block py-3.5 text-[10px] transition-colors duration-200 sm:text-xs md:py-3 md:text-sm"
                style={{ color: LINK }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#E1E0CC')}
                onMouseLeave={(e) => (e.currentTarget.style.color = LINK)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const frameScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.94])
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-30%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width) * 2 - 1)
    py.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  return (
    <section ref={sectionRef} id="top" className="relative h-[100svh] min-h-[560px] bg-ivory p-4 md:p-6">
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-2xl bg-[#0d0f12] md:rounded-[2rem]"
        style={{ scale: frameScale, containerType: 'size' }}
        onPointerMove={onPointerMove}
      >
        <HeroScene px={px} py={py} scrollProgress={scrollYProgress} />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        {/* extra shade under the stacked copy on narrow screens */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 via-black/30 to-transparent lg:hidden" />

        <Navbar />

        <motion.div
          className="absolute inset-x-0 bottom-0 grid grid-cols-12 items-end gap-x-4 gap-y-6 px-4 pb-1 md:px-8 md:pb-2"
          style={{ y: copyY, opacity: copyOpacity }}
        >
          <div className="col-span-12 lg:col-span-8">
            <WordsPullUp
              as="h1"
              text={profile.first}
              label={profile.name}
              byLetter
              showAsterisk
              delay={0.35}
              stagger={0.06}
              className="whitespace-nowrap font-medium leading-[0.85] tracking-[-0.07em] text-[22.5vw] lg:text-[15.4vw]"
              style={{ color: '#E1E0CC' }}
            />
          </div>

          <div className="col-span-12 flex flex-col items-start gap-5 pb-4 sm:col-span-9 md:col-span-7 lg:col-span-4 lg:pb-[3.2vw]">
            <motion.p
              className="max-w-[34ch] text-xs text-primary/70 sm:text-sm md:text-base"
              style={{ lineHeight: 1.25 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1.4 }}
            >
              <span aria-hidden className="mr-0.5 text-primary">*</span>
              {profile.heroNote}
            </motion.p>
            <motion.a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-[gap] duration-300 hover:gap-3 sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1.6 }}
            >
              Explore my work
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10">
                <ArrowRight className="h-4 w-4 text-primary" aria-hidden />
              </span>
            </motion.a>
          </div>
        </motion.div>

        {/* scroll cue */}
        <motion.a
          href="#about"
          aria-label="Scroll to About"
          className="absolute right-3 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 text-[11px] text-primary/70 md:right-6 md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          <span className="[writing-mode:vertical-rl]">Scroll</span>
          <span className="relative h-14 w-px overflow-hidden bg-primary/25">
            <motion.span
              className="absolute inset-x-0 top-0 h-5 bg-primary"
              animate={reduce ? undefined : { y: ['-100%', '280%'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            />
          </span>
        </motion.a>
      </motion.div>
    </section>
  )
}
