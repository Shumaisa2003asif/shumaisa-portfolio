import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { projects, type Project } from '../../data/content'
import { useCaseStudyRoute } from '../../hooks/useHashRoute'
import { usePointerFine } from '../../hooks/usePointerFine'
import { WordsPullUp } from '../motion/WordsPullUp'
import { CaseStudy } from './CaseStudy'
import { Preview } from './previews/Previews'

// Each spread gets its own proportions so the list reads like a magazine, not a grid.
const LAYOUTS = [
  { preview: 'lg:col-span-7', text: 'lg:col-span-4 lg:col-start-9 lg:pt-24', aspect: 'aspect-[5/4]', flip: false },
  { preview: 'lg:col-span-6 lg:col-start-7', text: 'lg:col-span-4 lg:col-start-2 lg:row-start-1 lg:pt-40', aspect: 'aspect-[4/5] md:aspect-[1/1]', flip: true },
  { preview: 'lg:col-span-8', text: 'lg:col-span-3 lg:col-start-10 lg:pt-10', aspect: 'aspect-[4/3] md:aspect-[16/10]', flip: false },
  { preview: 'lg:col-span-6 lg:col-start-6', text: 'lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:pt-28', aspect: 'aspect-[1/1] md:aspect-[6/5]', flip: true },
]

function ProjectSpread({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const layout = LAYOUTS[index % LAYOUTS.length]
  const fine = usePointerFine()
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 18 })
  const sry = useSpring(ry, { stiffness: 150, damping: 18 })

  const tilt = fine && !reduce
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    setHover(false)
  }

  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-8">
      <div className={`col-span-12 ${layout.preview}`} style={{ perspective: 1200 }}>
        <motion.div
          onPointerMove={onMove}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={onLeave}
          className="relative w-full cursor-pointer"
          style={{ rotateX: srx, rotateY: sry }}
        >
          <motion.div
            layoutId={`preview-${project.slug}`}
            className={`relative w-full overflow-hidden rounded-[2rem] ${layout.aspect}`}
            style={{ background: project.tone }}
            initial={reduce ? false : { clipPath: 'inset(18% 10% 18% 10% round 2rem)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-noise pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply" />
            <motion.div
              className="absolute inset-0"
              animate={{ scale: hover && tilt ? 1.04 : 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Preview project={project} hover={hover} />
            </motion.div>
          </motion.div>
          <button
            type="button"
            onClick={onOpen}
            onFocus={() => setHover(true)}
            onBlur={onLeave}
            aria-label={`Open the ${project.name} case study`}
            className="absolute inset-0 rounded-[2rem] focus-visible:outline-offset-4"
          />
        </motion.div>
      </div>

      <div className={`col-span-12 md:col-span-9 ${layout.text}`}>
        <p className="flex items-baseline justify-between gap-4 font-mono text-xs text-olive/70">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </p>
        <h3 className="mt-3 font-serif text-5xl leading-[0.95] text-olive md:text-6xl">{project.name}</h3>
        <p className="text-pretty mt-5 text-[17px] leading-relaxed text-olive/85">{project.description}</p>
        <p className="mt-6 font-hand text-2xl leading-none text-clay">my part</p>
        <p className="mt-1 text-[15px] leading-relaxed text-olive/80">{project.contribution}</p>
        <p className="mt-5 font-mono text-[11px] leading-relaxed text-olive/60">{project.stack.join(', ')}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={onOpen}
            className="group inline-flex items-center gap-2 rounded-full bg-olive py-1.5 pl-5 pr-1.5 text-[15px] font-medium text-ivory transition-[gap] duration-300 hover:gap-3"
          >
            Read the case study
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ivory transition-transform duration-300 group-hover:scale-110">
              <ArrowRight className="h-4 w-4 text-olive" aria-hidden />
            </span>
          </button>
          {project.link && (
            <a
              href={project.link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[15px] text-olive underline decoration-olive/30 underline-offset-4 transition-colors hover:decoration-olive"
            >
              {project.link.label}
              <ArrowRight className="h-4 w-4 -rotate-45" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function Work() {
  const { slug, open, navigate, close } = useCaseStudyRoute()
  const active = projects.find((p) => p.slug === slug) ?? null

  return (
    <section id="work" className="relative bg-ivory pb-28 pt-10 md:pb-40">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="grid grid-cols-12 items-end gap-6 pt-16 md:pt-20">
          <WordsPullUp
            text="Selected work"
            className="col-span-12 font-serif text-[15vw] leading-[0.9] tracking-[-0.02em] text-olive md:col-span-8 md:text-[8vw] lg:text-[7.5rem]"
          />
          <p className="col-span-12 max-w-[38ch] text-[17px] leading-relaxed text-olive/80 md:col-span-4 md:pb-3">
            Four projects across commerce, AI and security. Open any of them for the longer story.
          </p>
        </div>

        <div className="mt-20 space-y-28 md:mt-28 md:space-y-40">
          {projects.map((p, i) => (
            <ProjectSpread key={p.slug} project={p} index={i} onOpen={() => open(p.slug)} />
          ))}
        </div>
      </div>

      <AnimatePresence>{active && <CaseStudy key={active.slug} project={active} onClose={close} onNavigate={navigate} />}</AnimatePresence>
    </section>
  )
}
