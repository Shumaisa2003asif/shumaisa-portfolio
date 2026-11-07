import { useEffect, useState } from 'react'

/** True on devices with a precise pointer (mouse/trackpad) — gates hover-only flourishes. */
export function usePointerFine() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}
