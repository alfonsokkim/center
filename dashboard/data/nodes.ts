type Node = {
  name: string
  modelPath: string
  orbitRadius: number
  orbitSpeed: number
  startAngle: number
}

const nodes: Node[] = [
  {
    name: "History",
    modelPath: "/models/history.glb",
    orbitRadius: 4.2,
    orbitSpeed: 1,
    startAngle: 0,
  },
  {
    name: "Analytics",
    modelPath: "/models/analytics.glb",
    orbitRadius: 6.3,
    orbitSpeed: 0.72,
    startAngle: Math.PI * 0.9,
  },
  {
    name: "Settings",
    modelPath: "/models/settings.glb",
    orbitRadius: 8.2,
    orbitSpeed: 0.52,
    startAngle: Math.PI * 1.45,
  },
  {
    name: "Profile",
    modelPath: "/models/profile.glb",
    orbitRadius: 10.3,
    orbitSpeed: 0.36,
    startAngle: Math.PI * 0.35,
  },
]

export default nodes
