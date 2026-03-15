const BASE_URL = "http://localhost:8000"

export type RecentEvent = {
  id: string
  sessionId: string
  url: string
  title: string
  relevanceScore: number
  duration: number
}

export async function getRecentEvents(limit = 6) {
  const response = await fetch(`${BASE_URL}/session/events/recent?limit=${limit}`)

  if (!response.ok) {
    throw new Error(`Failed to load recent events: ${response.status}`)
  }

  return response.json() as Promise<{ events: RecentEvent[] }>
}
