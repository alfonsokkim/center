import { Line } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import type { Group } from "three"
import nodes from "../data/nodes"

export default function OrbitLines() {
  const groupRef = useRef<Group>(null)
  const rings = useMemo(
    () =>
      nodes.map((node) => {
        const points: [number, number, number][] = []

        for (let step = 0; step <= 128; step += 1) {
          const angle = (step / 128) * Math.PI * 2
          points.push([
            Math.cos(angle) * node.orbitRadius,
            Math.sin(angle) * node.orbitRadius,
            0,
          ])
        }

        return { key: node.name, points }
      }),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.2

    groupRef.current.children.forEach((child) => {
      const material = Reflect.get(child, "material")
      if (material && typeof material === "object" && "opacity" in material) {
        Reflect.set(material, "opacity", opacity)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {rings.map((ring) => (
        <Line
          key={ring.key}
          points={ring.points}
          color="#00e1ff"
          transparent
          lineWidth={1.4}
        />
      ))}
    </group>
  )
}
