export interface KanbanCard {
  id: string
  createdAt: string | Date
  updatedAt: string | Date
  title: string
  description?: string
  type: "issue" | "pr"
  repo: string
  bounty?: number
  organization?: string
  url: string
  status: "todo" | "in-progress" | "completed"
  userId: string
}

export interface User {
  id: string
  createdAt: string | Date
  updatedAt: string | Date
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  credits: number
  kanbanCards: KanbanCard[]
}