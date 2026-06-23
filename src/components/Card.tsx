import { useSortable } from "@dnd-kit/sortable";
import "./Card.css";
import { CSS } from "@dnd-kit/utilities";
import type { HubTask } from "../types/types";

interface CardProps {
  task: HubTask;
  onClick?: (id: string) => void;
}

export default function Card({ task, onClick }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(task.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`hub-card hub-card-${task.priority}`}
      style={style}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div className="hub-card-content">
        <div className="hub-card-header-row">
          <span className="hub-card-id">{task.id.split('-').pop()}</span>
          <span className={`hub-card-priority-badge priority-${task.priority}`}>
            {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
          </span>
        </div>
        <h4 className="hub-card-title">{task.title}</h4>
        {task.description && (
          <p className="hub-card-description">{task.description}</p>
        )}
      </div>
    </div>
  );
}
