import { useEffect, useState } from 'react'

/**
 * Returns the milliseconds left until `end`, based on the wall clock so every
 * viewer of a shared link sees the same value and background tabs don't drift.
 */
export function useCountdown(end: number): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 200)
    return () => window.clearInterval(id)
  }, [end])

  return Math.max(0, end - now)
}
