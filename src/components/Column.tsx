import './Column.css';
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Card from "./Card";
import type { HubTask, TaskStatus } from "../types/types";

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: HubTask[];
  onTaskClick?: (id: string) => void;
}

export default function Column({
  id,
  title,
  tasks,
  onTaskClick,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="hub-board-column" ref={setNodeRef} style={{ minHeight: "200px", background: "rgba(245, 245, 247, 0.6)", borderRadius: "16px" }}>
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="column-count">{tasks.length}</span>
      </div>
      <div className="column-cards-container">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <Card key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
