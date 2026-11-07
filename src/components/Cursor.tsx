import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePointerFine } from '../hooks/usePointerFine'

/** A soft ring that trails the (still visible) system cursor and swells over anything clickable. */
export function Cursor() {
  const fine = usePointerFine()
  const reduce = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!fine || reduce) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const t = e.target as Element | null
      setActive(!!t?.closest('a, button, [role="button"]'))
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [fine, reduce, x, y])

  if (!fine || reduce) return null
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[60] mix-blend-difference" style={{ x: sx, y: sy }}>
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
        animate={{ width: active ? 54 : 26, height: active ? 54 : 26, opacity: visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </motion.div>
  )
}
