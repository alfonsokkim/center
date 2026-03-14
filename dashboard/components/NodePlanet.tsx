import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

type Props = {
  name: string
  modelPath: string
  orbitProgress: number
  orbitRadius: number
  orbitSpeed: number
  startAngle: number
}

export default function NodePlanet({
  name,
  modelPath,
  orbitProgress,
  orbitRadius,
  orbitSpeed,
  startAngle,
}: Props) {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF(modelPath)

  useFrame((_, delta) => {
    if (ref.current) {
      const angle = startAngle + orbitProgress * orbitSpeed
      ref.current.position.x = Math.cos(angle) * orbitRadius
      ref.current.position.y = Math.sin(angle) * orbitRadius
      ref.current.position.z = 0
      ref.current.rotation.y += delta * 0.35
    }
  })

  return (
    <primitive
      ref={ref}
      object={scene.clone()}
      name={name}
      scale={0.65}
    />
  )
}

useGLTF.preload("/models/history.glb")
useGLTF.preload("/models/analytics.glb")
useGLTF.preload("/models/settings.glb")
useGLTF.preload("/models/profile.glb")
