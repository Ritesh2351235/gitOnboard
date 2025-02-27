"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash, Edit, Check, X } from "lucide-react"
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { KanbanCard, User } from "src/types" // Adjust the import path to your types

// Create a client
const queryClient = new QueryClient();

export default function KanbanBoard() {
  const { user } = useUser()
  const [isAdding, setIsAdding] = useState(false)
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [newCard, setNewCard] = useState<Partial<KanbanCard>>({
    title: "",
    description: "",
    type: "issue",
    repo: "",
    bounty: 0,
    organization: "",
    url: "",
    status: "todo",
  })

  // Wrap the component content with QueryClientProvider
  return (
    <QueryClientProvider client={queryClient}>
      <KanbanBoardContent
        user={user as User | null | undefined}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
        editingCardId={editingCardId}
        setEditingCardId={setEditingCardId}
        newCard={newCard}
        setNewCard={setNewCard}
      />
    </QueryClientProvider>
  )
}

// Define types for the component props
interface KanbanBoardContentProps {
  user: User | null | undefined;
  isAdding: boolean;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  editingCardId: string | null;
  setEditingCardId: React.Dispatch<React.SetStateAction<string | null>>;
  newCard: Partial<KanbanCard>;
  setNewCard: React.Dispatch<React.SetStateAction<Partial<KanbanCard>>>;
}

// Separate component to use React Query hooks
function KanbanBoardContent({
  user,
  isAdding,
  setIsAdding,
  editingCardId,
  setEditingCardId,
  newCard,
  setNewCard
}: KanbanBoardContentProps) {
  const queryClient = useQueryClient()

  // Fetch Kanban cards
  const { data: cards, isLoading } = useQuery({
    queryKey: ["kanbanCards"],
    queryFn: async () => {
      // Fix the typo in the URL: kaban → kanban
      const res = await fetch("/api/kanban/create")
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to fetch cards: ${res.status} ${errorData.error || ''}`);
      }
      return res.json()
    },
  })

  // Add a new card
  const addMutation = useMutation({
    mutationFn: async (card: Partial<KanbanCard>) => {
      const res = await fetch("/api/kanban/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...card, userId: user?.id }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to add card: ${res.status} ${errorData.error || ''}`);
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanbanCards"] })
      setIsAdding(false)
      setNewCard({
        title: "",
        description: "",
        type: "issue",
        repo: "",
        bounty: 0,
        organization: "",
        url: "",
        status: "todo",
      })
    },
    onError: (error) => {
      // Add some error handling to show to the user
      console.error("Error adding card:", error);
      // You might want to set some state here to show an error message
    }
  })

  // Update a card
  const updateMutation = useMutation({
    mutationFn: async (card: KanbanCard) => {
      const res = await fetch("/api/kanban/create", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      })
      if (!res.ok) throw new Error("Failed to update card")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanbanCards"] })
      setEditingCardId(null)
    },
  })

  // Delete a card
  const deleteMutation = useMutation({
    mutationFn: async (cardId: string) => {
      const res = await fetch(`/api/kanban/create?id=${cardId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete card")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanbanCards"] })
    },
  })

  // Group cards by status
  const groupedCards = cards?.reduce((acc: Record<string, KanbanCard[]>, card: KanbanCard) => {
    // Initialize the array for the status if it doesn't exist
    if (!acc[card.status]) {
      acc[card.status] = []
    }
    // Push the card into the appropriate status array
    acc[card.status]?.push(card)
    return acc
  }, {} as Record<string, KanbanCard[]>)

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Card
        </Button>
      </div>

      {/* Add Card Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Card</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={newCard.title}
                  onChange={(e) =>
                    setNewCard({ ...newCard, title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={newCard.description}
                  onChange={(e) =>
                    setNewCard({ ...newCard, description: e.target.value })
                  }
                />
                <Input
                  placeholder="Repository"
                  value={newCard.repo}
                  onChange={(e) =>
                    setNewCard({ ...newCard, repo: e.target.value })
                  }
                />
                <Input
                  placeholder="Bounty"
                  type="number"
                  value={newCard.bounty}
                  onChange={(e) =>
                    setNewCard({ ...newCard, bounty: Number(e.target.value) })
                  }
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => addMutation.mutate(newCard)}
                    disabled={addMutation.isPending}
                  >
                    {addMutation.isPending ? "Adding..." : "Add"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["todo", "in-progress", "completed"].map((status) => (
          <Card key={status}>
            <CardHeader>
              <CardTitle className="capitalize">{status}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedCards?.[status]?.map((card: KanbanCard) => (
                <Card key={card.id} className="p-4">
                  {editingCardId === card.id ? (
                    <div className="space-y-4">
                      <Input
                        value={card.title}
                        onChange={(e) =>
                          updateMutation.mutate({ ...card, title: e.target.value })
                        }
                      />
                      <Textarea
                        value={card.description}
                        onChange={(e) =>
                          updateMutation.mutate({
                            ...card,
                            description: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingCardId(null)}
                          variant="outline"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => updateMutation.mutate(card)}
                          disabled={updateMutation.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="font-semibold">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {card.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCardId(card.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(card.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}