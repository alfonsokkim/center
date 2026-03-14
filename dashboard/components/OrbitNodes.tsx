import nodes from "../data/nodes"
import NodePlanet from "./NodePlanet"

type Props = {
  orbitProgress: number
}

export default function OrbitNodes({ orbitProgress }: Props) {
  return (
    <>
      {nodes.map((node, index) => (
        <NodePlanet
          key={index}
          name={node.name}
          modelPath={node.modelPath}
          orbitProgress={orbitProgress}
          orbitRadius={node.orbitRadius}
          orbitSpeed={node.orbitSpeed}
          startAngle={node.startAngle}
        />
      ))}
    </>
  )
}
