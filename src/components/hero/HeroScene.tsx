import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { Island } from './Island'

type Props = {
  /** Pointer position over the hero, -1..1 on each axis. */
  px: MotionValue<number>
  py: MotionValue<number>
  /** 0 while the hero fills the screen, 1 once it has scrolled away. */
  scrollProgress: MotionValue<number>
}

/**
 * The cinematic backdrop: a 16:9 stage scaled to cover its container (container query units),
 * focused on the girl so portrait screens crop around her, with four parallax depths.
 */
export function HeroScene({ px, py, scrollProgress }: Props) {
  const reduce = useReducedMotion()
  const spring = { stiffness: 40, damping: 18, mass: 0.6 }
  const sx = useSpring(px, spring)
  const sy = useSpring(py, spring)

  const depth = (amount: number) => ({
    x: useTransform(sx, (v) => (reduce ? 0 : v * amount)),
    y: useTransform(sy, (v) => (reduce ? 0 : v * amount * 0.5)),
  })
  const sky = depth(-6)
  const mid = depth(-12)
  const land = depth(-20)
  const front = depth(-34)
  const scrollY = useTransform(scrollProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '14%'])
  const landScrollY = useTransform(scrollProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '6%'])

  const stageW = 'max(100cqw, 177.78cqh)'
  const stageH = 'max(100cqh, 56.25cqw)'

  return (
    <motion.div
      className="absolute"
      style={{
        width: stageW,
        height: stageH,
        top: `calc(50cqh - ${stageH} / 2)`,
        // keep the girl (x = 57% of the stage) near the centre on narrow screens
        left: `clamp(calc(100cqw - ${stageW}), calc(50cqw - 0.57 * ${stageW}), 0px)`,
        y: scrollY,
      }}
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.img
        src="/hero/sky.webp"
        alt=""
        className="absolute inset-[-2%] h-[104%] w-[104%] max-w-none object-cover"
        style={sky}
        {...{ fetchpriority: "high" }}
        decoding="async"
      />
      {/* sun bloom */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ background: 'radial-gradient(60% 55% at 98% 49%, rgba(255,196,120,0.45), rgba(255,170,90,0.12) 45%, transparent 70%)' }}
      />
      <motion.div className="absolute inset-0" style={mid}>
        <motion.img
          src="/hero/clouds-mid.webp"
          alt=""
          className="absolute left-0 top-0 h-full w-[150%] max-w-none"
          animate={reduce ? undefined : { x: ['0%', '-30%'] }}
          transition={{ duration: 140, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
        />
      </motion.div>
      <motion.div className="absolute inset-0" style={{ y: landScrollY }}>
        <motion.div className="absolute inset-0" style={land}>
          <Island />
        </motion.div>
      </motion.div>
      <motion.div className="absolute inset-x-0 bottom-0 h-[42.3%]" style={front}>
        <motion.img
          src="/hero/clouds-front.webp"
          alt=""
          className="absolute left-0 top-0 h-full w-[150%] max-w-none"
          initial={{ x: '-30%' }}
          animate={reduce ? undefined : { x: ['-30%', '0%'] }}
          transition={{ duration: 110, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
        />
      </motion.div>
    </motion.div>
  )
}
