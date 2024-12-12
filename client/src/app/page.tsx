import { KanbanBoard } from '@/components/kanban-board'

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-cover bg-center">
      <div className="bg-black bg-opacity-50 min-h-screen">
        <div className="container mx-auto p-4">
          <KanbanBoard />
        </div>
      </div>
    </main>
  )
}

