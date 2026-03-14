import { useState, useEffect } from "react"

export default function LandingSequence() {
  const [, setPhase] = useState(0)

  useEffect(() => {
    const firstTimer = window.setTimeout(() => setPhase(1), 2000)
    const secondTimer = window.setTimeout(() => setPhase(2), 4000)

    return () => {
      window.clearTimeout(firstTimer)
      window.clearTimeout(secondTimer)
    }
  }, [])

  return null
}
