import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'

function AnimatedLetter({ char, progress, range }: { char: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return <motion.span style={{ opacity }}>{char}</motion.span>
}

/** Prisma's scroll-linked paragraph: every character brightens from 0.2 to 1 as it scrolls through view. */
export function ScrollRevealText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })

  if (reduce) return <p className={className}>{text}</p>

  const chars = Array.from(text)
  const total = chars.length
  // Group characters into words so lines only break between words.
  const words: { char: string; index: number }[][] = [[]]
  chars.forEach((char, index) => {
    if (char === ' ') words.push([])
    else words[words.length - 1].push({ char, index })
  })

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi}>
          <span aria-hidden className="inline-block whitespace-nowrap">
            {word.map(({ char, index }) => {
              const p = index / total
              return <AnimatedLetter key={index} char={char} progress={scrollYProgress} range={[p - 0.1, p + 0.05]} />
            })}
          </span>
          {wi < words.length - 1 && ' '}
        </span>
      ))}
    </p>
  )
}
