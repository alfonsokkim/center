import { useGLTF } from "@react-three/drei"
import { useRef } from "react"
// import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Planet() {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF("/models/center-planet.glb")

    const scale = 0.05
    const yOffset = scale * -40
    const zOffset = scale * -60

//   useFrame((_, delta) => {
//     if (ref.current) {
//     //   ref.current.rotation.y += delta * 0.2
//     }
//   })

  return (
    <primitive
    ref={ref}
    object={scene.clone()}
    scale={scale}
    position={[0, yOffset, zOffset]}
    />
  )
}

useGLTF.preload("/models/center-planet.glb")
