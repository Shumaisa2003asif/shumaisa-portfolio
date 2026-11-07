import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { journey } from '../data/content'
import { WordsPullUp } from './motion/WordsPullUp'

function Milestone({ item, index }: { item: (typeof journey)[number]; index: number }) {
  const left = index % 2 === 0
  const reduce = useReducedMotion()
  return (
    <li className="relative grid grid-cols-[28px_1fr] gap-x-5 md:grid-cols-[1fr_56px_1fr] md:gap-x-0">
      {/* node on the line */}
      <div className="relative col-start-1 row-start-1 flex justify-center md:col-start-2">
        <motion.span
          className="relative z-10 mt-2 block h-3.5 w-3.5 rounded-full border-2 border-olive bg-ivory"
          initial={{ backgroundColor: '#F5F0E6' }}
          whileInView={{ backgroundColor: '#344438' }}
          viewport={{ once: true, margin: '0px 0px -45% 0px' }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <motion.div
        className={`col-start-2 row-start-1 pb-14 md:pb-20 ${left ? 'md:col-start-1 md:pr-12 md:text-right' : 'md:col-start-3 md:pl-12'}`}
        initial={reduce ? false : { opacity: 0, x: left ? -24 : 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '0px 0px -20% 0px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-sm text-clay">{item.year}</p>
        <h3 className="mt-2 font-serif text-3xl leading-tight text-olive md:text-4xl">{item.title}</h3>
        <p className={`text-pretty mt-3 max-w-[44ch] text-[17px] leading-relaxed text-olive/80 ${left ? 'md:ml-auto' : ''}`}>{item.body}</p>
      </motion.div>
    </li>
  )
}

export function Journey() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 65%', 'end 65%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="journey" className="relative overflow-hidden bg-sand/45 py-28 md:py-40">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply" />
      <div className="relative mx-auto max-w-[1180px] px-5 md:px-10">
        <div className="mb-16 flex flex-wrap items-end gap-x-6 gap-y-2 md:mb-24 md:justify-center">
          <WordsPullUp text="My journey" className="font-serif text-[15vw] leading-[0.9] text-olive md:text-[7.5rem]" />
          <span className="font-hand text-3xl text-clay md:pb-4">(so far)</span>
        </div>

        <ol ref={listRef} className="relative">
          {/* the track and the line that draws itself as you scroll */}
          <span aria-hidden className="absolute bottom-0 left-[14px] top-2 w-px -translate-x-1/2 bg-olive/15 md:left-1/2" />
          <motion.span
            aria-hidden
            className="absolute bottom-0 left-[14px] top-2 w-[2px] origin-top bg-olive md:left-1/2"
            style={{ x: '-50%', scaleY: reduce ? 1 : progress }}
          />
          {journey.map((item, i) => (
            <Milestone key={`${item.year}-${item.title}`} item={item} index={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}
