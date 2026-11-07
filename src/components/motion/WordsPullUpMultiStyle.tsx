import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export type Segment = { text: string; className?: string }

type Props = {
  segments: Segment[]
  className?: string
  align?: 'left' | 'center'
  delay?: number
  as?: 'h2' | 'h3' | 'p'
}

/** Several differently-styled phrases, split into words that pull up one after another. */
export function WordsPullUpMultiStyle({ segments, className = '', align = 'left', delay = 0, as = 'h2' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const words = segments.flatMap((s) => s.text.split(' ').map((w) => ({ w, className: s.className ?? '' })))
  const Tag = motion[as]

  return (
    <Tag
      ref={ref as never}
      className={`flex flex-wrap ${align === 'center' ? 'justify-center text-center' : 'justify-start'} ${className}`}
      aria-label={segments.map((s) => s.text).join(' ')}
    >
      {words.map(({ w, className: c }, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] mr-[0.25em]">
          <motion.span
            className={`inline-block ${c}`}
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.08 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
