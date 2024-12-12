import React, { useState, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Plus, X, Image, Trash2, MoreHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CardDetailsModal } from './card-details-modal'

interface Comment {
  id: string
  author: string
  content: string
  avatar: string
}

interface Task {
  id: string
  content: string
  priority: 'low' | 'medium' | 'high'
  description: string
  assignee: string
  comments: Comment[]
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: 'task-1', content: 'Create login page', priority: 'high', description: 'Implement a secure login page with email and password fields', assignee: 'John Doe', comments: [] },
      { id: 'task-2', content: 'Design database schema', priority: 'medium', description: 'Create an efficient database schema for the application', assignee: 'Jane Smith', comments: [] },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: 'task-3', content: 'Implement user authentication', priority: 'high', description: 'Set up user authentication system using JWT', assignee: 'Alice Johnson', comments: [] },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: 'task-4', content: 'Project setup', priority: 'low', description: 'Initialize the project and set up the development environment', assignee: 'Bob Wilson', comments: [] },
    ],
  },
]

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [newTaskContents, setNewTaskContents] = useState<{ [key: string]: string }>({})
  const [newTaskPriorities, setNewTaskPriorities] = useState<{ [key: string]: 'low' | 'medium' | 'high' }>({})
  const [addingCard, setAddingCard] = useState<{ [key: string]: boolean }>({})
  const [selectedCard, setSelectedCard] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId)
    const destColumn = columns.find(col => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks)
      const [reorderedItem] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, reorderedItem)

      const newColumns = columns.map(col =>
        col.id === sourceColumn.id ? { ...col, tasks: newTasks } : col
      )

      setColumns(newColumns)
      return
    }

    const sourceTasks = Array.from(sourceColumn.tasks)
    const [movedTask] = sourceTasks.splice(source.index, 1)
    const destTasks = Array.from(destColumn.tasks)
    destTasks.splice(destination.index, 0, movedTask)

    const newColumns = columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, tasks: sourceTasks }
      }
      if (col.id === destination.droppableId) {
        return { ...col, tasks: destTasks }
      }
      return col
    })

    setColumns(newColumns)
  }

  const addNewColumn = () => {
    if (newColumnTitle.trim() === '') return
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: newColumnTitle,
      tasks: [],
    }
    setColumns([...columns, newColumn])
    setNewColumnTitle('')
  }

  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter(column => column.id !== columnId))
  }

  const addNewTask = (columnId: string) => {
    const taskContent = newTaskContents[columnId]
    const taskPriority = newTaskPriorities[columnId] || 'medium'
    if (!taskContent || taskContent.trim() === '') return

    const newTask: Task = {
      id: `task-${Date.now()}`,
      content: taskContent,
      priority: taskPriority,
      description: '',
      assignee: '',
      comments: [],
    }

    const newColumns = columns.map(col => {
      if (col.id === columnId) {
        return { ...col, tasks: [...col.tasks, newTask] }
      }
      return col
    })

    setColumns(newColumns)
    setNewTaskContents({ ...newTaskContents, [columnId]: '' })
    setNewTaskPriorities({ ...newTaskPriorities, [columnId]: 'medium' })
    setAddingCard({ ...addingCard, [columnId]: false })
  }

  const handleCardClick = (task: Task) => {
    setSelectedCard(task)
    setIsModalOpen(true)
  }

  const handleCardUpdate = (updatedCard: Task) => {
    const newColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => task.id === updatedCard.id ? updatedCard : task)
    }))
    setColumns(newColumns)
  }

  const handleCardDelete = (cardId: string) => {
    const newColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== cardId)
    }))
    setColumns(newColumns)
  }

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = e.target?.result as string
        document.body.style.backgroundImage = `url(${img})`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
      }
      reader.readAsDataURL(file)
    }
  }, [])

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <div className="flex items-center">
          <label htmlFor="image-upload" className="cursor-pointer">
            <Image className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {columns.map(column => (
            <div key={column.id} className="bg-gray-100 p-4 rounded-lg w-80 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">{column.title}</h2>
                <Button variant="ghost" size="icon" onClick={() => deleteColumn(column.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="group relative"
                            >
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">{task.content}</p>
                                      <p className="text-sm text-gray-500">{task.assignee}</p>
                                    </div>
                                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                                      {task.priority}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCardClick(task)
                                }}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </ScrollArea>
                )}
              </Droppable>
              <div className="mt-4">
                {addingCard[column.id] ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="New task..."
                      value={newTaskContents[column.id] || ''}
                      onChange={(e) => setNewTaskContents({ ...newTaskContents, [column.id]: e.target.value })}
                    />
                    <Select
                      value={newTaskPriorities[column.id] || 'medium'}
                      onValueChange={(value) => setNewTaskPriorities({ ...newTaskPriorities, [column.id]: value as 'low' | 'medium' | 'high' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex space-x-2">
                      <Button onClick={() => addNewTask(column.id)} className="flex-1">
                        Add Card
                      </Button>
                      <Button variant="outline" onClick={() => setAddingCard({ ...addingCard, [column.id]: false })}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setAddingCard({ ...addingCard, [column.id]: true })} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Card
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div className="bg-gray-100 p-4 rounded-lg w-80 flex-shrink-0">
            <Input
              placeholder="New list title..."
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="mb-2"
            />
            <Button onClick={addNewColumn} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add List
            </Button>
          </div>
        </div>
      </DragDropContext>
      <CardDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCard(null)
        }}
        card={selectedCard}
        onUpdate={handleCardUpdate}
        onDelete={handleCardDelete}
      />
    </div>
  )
}

