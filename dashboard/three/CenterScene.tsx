import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import Planet from "../components/Planet"
import OrbitNodes from "../components/OrbitNodes"
import OrbitLines from "../components/OrbitLines"

type Props = {
  orbitProgress: number
}

function CameraRig() {
  const { camera } = useThree()
  const introTarget = useRef(new THREE.Vector3(0, 0, 16))

  useEffect(() => {
    camera.position.set(0, 0, 3.2)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame((_, delta) => {
    camera.position.lerp(introTarget.current, 1 - Math.exp(-delta * 1.2))
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function CenterScene({ orbitProgress }: Props) {
  return (
    <>
      <CameraRig />
      <Planet />
      <OrbitLines />
      <OrbitNodes orbitProgress={orbitProgress} />
    </>
  )
}
