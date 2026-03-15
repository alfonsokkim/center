import { useEffect, useMemo, useRef, useState } from "react"

type DotStar = {
  id: string
  left: string
  top: string
  size: number
  opacity: number
}

type OrbitPlanet = {
  id: string
  asset: string
  radius: number
  angle: number
  speed: number
  size: number
  label: string
  details: [string, string, string]
}

type OrbitRing = {
  id: string
  radius: number
}

function createStars<T extends DotStar>(
  count: number,
  createStar: (index: number, random: () => number) => T
) {
  let seed = 42

  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  return Array.from({ length: count }, (_, index) => createStar(index, random))
}

function createOrbitPlanets() {
  const planetAssets = [
    "/assets/purple-planet.png",
    "/assets/light-blue-planet.png",
    "/assets/yellow-planet.png",
    "/assets/blue-planet.png",
    "/assets/grey-planet.png",
    "/assets/orange-planet.png",
    "/assets/earth-planet.png",
    "/assets/red-planet.png",
  ]

  const shuffled = [...planetAssets]
  let seed = 17

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = (seed * 1103515245 + 12345) % 2147483648
    const swapIndex = seed % (index + 1)
    const current = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = current
  }

  const planets: OrbitPlanet[] = [
    {
      id: "planet-1",
      asset: shuffled[0],
      radius: 27,
      angle: -2.72,
      speed: 1.1,
      size: 15,
      label: "YouTube",
      details: [
        "Weekly uploads driving strong engagement",
        "Short-form clips boosting channel reach",
        "Audience retention up across tutorials",
      ],
    },
    {
      id: "planet-2",
      asset: shuffled[1],
      radius: 27,
      angle: -0.5,
      speed: 1.1,
      size: 12.5,
      label: "Instagram",
      details: [
        "Reels are outperforming static posts",
        "Story taps increased after campaign launch",
        "Follower growth is trending steadily upward",
      ],
    },
    {
      id: "planet-3",
      asset: shuffled[2],
      radius: 27,
      angle: 1.18,
      speed: 1.1,
      size: 10.5,
      label: "TikTok",
      details: [
        "High replay rate on recent explainer videos",
        "Comments are clustering around study tips",
        "Posting cadence is helping discoverability",
      ],
    },
    {
      id: "planet-4",
      asset: shuffled[3],
      radius: 47,
      angle: -1.78,
      speed: 0.55,
      size: 11.5,
      label: "Discord",
      details: [
        "Community activity spikes after live sessions",
        "Pinned resources are the most opened items",
        "Support threads are resolving faster this week",
      ],
    },
    {
      id: "planet-5",
      asset: shuffled[4],
      radius: 47,
      angle: 0.5,
      speed: 0.55,
      size: 12.5,
      label: "LinkedIn",
      details: [
        "Professional updates are earning more saves",
        "Career-focused posts have the best click-through",
        "Network reach expanded after alumni reshares",
      ],
    },
    {
      id: "planet-6",
      asset: shuffled[5],
      radius: 47,
      angle: 2.22,
      speed: 0.55,
      size: 10,
      label: "Spotify",
      details: [
        "Focus playlists are the most replayed assets",
        "Morning listening sessions are trending highest",
        "New themed drops are improving completion rate",
      ],
    },
  ]

  return planets
}

function createOrbitRings() {
  const rings: OrbitRing[] = [
    { id: "outer", radius: 47 },
    { id: "inner", radius: 27 },
  ]

  return rings
}

export default function Dashboard() {
  const [orbitProgress, setOrbitProgress] = useState(0)
  const [activePlanetId, setActivePlanetId] = useState<string | null>(null)
  const orbitVelocityRef = useRef(0)
  const closeTimeoutRef = useRef<number | null>(null)

  const dotStars = useMemo(
    () =>
      createStars(90, (index, random) => ({
        id: `dot-${index}`,
        left: `${random() * 100}%`,
        top: `${random() * 100}%`,
        size: 2 + random() * 4,
        opacity: 0.45 + random() * 0.4,
      })),
    []
  )

  const sparkleStars = useMemo(
    () =>
      createStars(28, (index, random) => ({
        id: `sparkle-${index}`,
        left: `${random() * 100}%`,
        top: `${random() * 100}%`,
        size: 12 + random() * 18,
        opacity: 0.35 + random() * 0.45,
        rotation: random() * 30 - 15,
      })),
    []
  )

  const orbitPlanets = useMemo(() => createOrbitPlanets(), [])
  const orbitRings = useMemo(() => createOrbitRings(), [])

  useEffect(() => {
    let frameId = 0
    let lastTime = 0

    const animate = (time: number) => {
      const deltaSeconds =
        lastTime === 0 ? 1 / 60 : Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time

      orbitVelocityRef.current *= Math.pow(0.22, deltaSeconds)

      setOrbitProgress((current) => {
        const next = current + orbitVelocityRef.current * deltaSeconds
        return Math.abs(orbitVelocityRef.current) < 0.0001 ? current : next
      })

      frameId = window.requestAnimationFrame(animate)
    }

    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const openPlanetModal = (planetId: string) => {
    clearCloseTimeout()
    setActivePlanetId(planetId)
  }

  const schedulePlanetModalClose = (planetId: string) => {
    clearCloseTimeout()
    closeTimeoutRef.current = window.setTimeout(() => {
      setActivePlanetId((current) => (current === planetId ? null : current))
      closeTimeoutRef.current = null
    }, 140)
  }

  return (
    <main
      className="dashboard"
      onWheel={(event) => {
        const velocityDelta = event.deltaY * 0.0011
        const maxVelocity = 1.66

        orbitVelocityRef.current = Math.max(
          -maxVelocity,
          Math.min(maxVelocity, orbitVelocityRef.current + velocityDelta)
        )
      }}
    >
      <div className="dashboard__stars" aria-hidden="true">
        {dotStars.map((star) => (
          <span
            key={star.id}
            className="dashboard__dot-star"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        ))}

        {sparkleStars.map((star) => (
          <span
            key={star.id}
            className="dashboard__sparkle-star"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              transform: `translate(-50%, -50%) rotate(${star.rotation}deg)`,
            }}
          >
            <svg viewBox="0 0 100 100" role="presentation" focusable="false">
              <path
                d="M50 0 C55 30 55 45 100 50 C55 55 55 70 50 100 C45 70 45 55 0 50 C45 45 45 30 50 0Z"
                fill="#b2b6cf"
              />
            </svg>
          </span>
        ))}
      </div>

      <div className="dashboard__orbits">
        {orbitRings.map((ring) => (
          <div
            key={ring.id}
            className="dashboard__orbit"
            aria-hidden="true"
            style={{
              width: `${ring.radius * 2}vmin`,
              height: `${ring.radius * 2}vmin`,
            }}
          />
        ))}

        {orbitPlanets.map((planet) => {
          const angle = planet.angle + orbitProgress * planet.speed
          const showModalBelow = Math.sin(angle) < -0.2
          return (
            <div
              key={planet.id}
              className="dashboard__planet-wrap"
              style={{
                left: `calc(50% + ${Math.cos(angle) * planet.radius}vmin)`,
                top: `calc(50% + ${Math.sin(angle) * planet.radius}vmin)`,
              }}
            >
              <img
                alt={planet.label}
                className="dashboard__planet"
                onBlur={() => {
                  schedulePlanetModalClose(planet.id)
                }}
                onFocus={() => {
                  openPlanetModal(planet.id)
                }}
                onMouseEnter={() => {
                  openPlanetModal(planet.id)
                }}
                onMouseLeave={() => {
                  schedulePlanetModalClose(planet.id)
                }}
                src={planet.asset}
                style={{ width: `${planet.size}vmin` }}
              />

              <div
                className={`dashboard__planet-modal${
                  activePlanetId === planet.id
                    ? " dashboard__planet-modal--visible"
                    : ""
                }${
                  showModalBelow
                    ? " dashboard__planet-modal--below"
                    : ""
                }`}
                onMouseEnter={() => {
                  openPlanetModal(planet.id)
                }}
                onMouseLeave={() => {
                  schedulePlanetModalClose(planet.id)
                }}
              >
                <p className="dashboard__planet-modal-title">{planet.label}</p>
                <ul className="dashboard__planet-modal-list">
                  {planet.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}

        <img
          alt=""
          aria-hidden="true"
          className="dashboard__sun"
          src="/assets/sun.png"
        />
      </div>
    </main>
  )
}
