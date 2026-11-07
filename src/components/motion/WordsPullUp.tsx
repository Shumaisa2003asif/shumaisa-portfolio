import { motion, useInView } from 'framer-motion'
import { Fragment, useRef } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

type Props = {
  text: string
  /** Accessible name when it should differ from the visible text. */
  label?: string
  className?: string
  style?: React.CSSProperties
  /** Superscript asterisk after the final character (Prisma signature). */
  showAsterisk?: boolean
  /** Split into letters instead of words — used for single-word display type. */
  byLetter?: boolean
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

/** Each word (or letter) slides up inside a clipping mask when it enters view. */
export function WordsPullUp({
  text,
  label,
  className = '',
  style,
  showAsterisk,
  byLetter,
  delay = 0,
  stagger = 0.08,
  as = 'h2',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const parts = byLetter ? Array.from(text) : text.split(' ')
  const Tag = motion[as]

  return (
    <Tag ref={ref as never} className={className} style={style} aria-label={label ?? text}>
      {parts.map((part, i) => {
        const last = i === parts.length - 1
        return (
          <Fragment key={i}>
            <span aria-hidden className="relative inline-block align-bottom">
              <span className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
                <motion.span
                  className="inline-block will-change-transform"
                  initial={{ y: '105%', opacity: 0 }}
                  animate={inView ? { y: '0%', opacity: 1 } : undefined}
                  transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
                >
                  {part}
                </motion.span>
              </span>
              {last && showAsterisk && (
                <motion.span
                  className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] leading-none"
                  initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
                  animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
                  transition={{ duration: 0.9, ease: EASE, delay: delay + parts.length * stagger + 0.25 }}
                >
                  *
                </motion.span>
              )}
            </span>
            {!byLetter && !last && ' '}
          </Fragment>
        )
      })}
    </Tag>
  )
}
