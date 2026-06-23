import './Board.css';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { HubTask, TaskStatus } from "../types/types";
import Column from "./Column";
import Card from "./Card";
import { useState } from "react";

const COLUMN_TITLES: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "Por Hacer",
  inprogress: "En Progreso",
  done: "Completado",
};

interface BoardProps {
  tasks: HubTask[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick?: (taskId: string) => void;
}

export default function Board({
  tasks,
  onTaskMove,
  onTaskClick,
}: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<HubTask | null>(null);

  // Configure pointer sensor activation constraint so that clicks work normally
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drag only starts after moving 8px, allowing clicks to trigger onTaskClick
      },
    }),
    useSensor(KeyboardSensor)
  );

  const columns: TaskStatus[] = ["backlog", "todo", "inprogress", "done"];

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id) || null;
    setActiveId(active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeTask = tasks.find((t) => t.id === activeId);
    
    // The overId can be a column ID or a card ID
    // If it's a card ID, we want to find its column
    let targetStatus = overId as TaskStatus;
    const isValidStatus = columns.includes(overId as TaskStatus);
    
    if (!isValidStatus) {
      // Over is a card, let's find the card's column
      const targetCard = tasks.find((t) => t.id === overId);
      if (targetCard) {
        targetStatus = targetCard.status;
      }
    }

    if (activeTask && activeTask.status !== targetStatus) {
      onTaskMove(activeId, targetStatus);
    }
    
    setActiveId(null);
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="hub-board-slider-container">
        {columns.map((col) => (
          <Column
            key={col}
            id={col}
            title={COLUMN_TITLES[col]}
            tasks={tasks.filter((t) => t.status === col)}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div style={{ transform: "rotate(3deg)" }}>
            <Card task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
