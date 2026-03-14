import { useGLTF } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Rocket() {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF("/models/rocket.glb")

  useFrame((_, delta) => {
    if (ref.current && ref.current.position.z > 2.2) {
      ref.current.position.z -= delta * 2
      ref.current.rotation.z = Math.sin(performance.now() * 0.002) * 0.03
    }
  })

  return (
    <primitive
      ref={ref}
      object={scene.clone()}
      position={[0, 1, 10]}
      rotation={[0, Math.PI, 0]}
      scale={0.8}
    />
  )
}

useGLTF.preload("/models/rocket.glb")
