import { useState, useEffect } from "react";
import type { TaskPriority, TaskStatus, HubTask } from "../types/types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, priority: TaskPriority, status: TaskStatus) => void;
  onDelete?: (id: string) => void;
  task?: HubTask | null;
}

export default function TaskModal({ isOpen, onClose, onSave, onDelete, task }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("backlog");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setStatus(task.status);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("backlog");
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onSave(trimmedTitle, description.trim(), priority, status);
    handleClose();
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("backlog");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          padding: "28px",
          borderRadius: "20px",
          width: "420px",
          maxWidth: "90%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "20px", color: "#1d1d1f", fontWeight: 600 }}>
            {task ? "Editar Tarea" : "Nueva Tarea"}
          </h2>
          {task && onDelete && (
            <button
              onClick={handleDelete}
              style={{
                background: "transparent",
                border: "none",
                color: "#ff3b30",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                borderRadius: "6px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 59, 48, 0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              🗑️ Eliminar
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "#86868b" }}>Título de la Tarea</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Programar API de login"
            autoFocus
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(0,0,0,0.15)",
              background: "rgba(255, 255, 255, 0.6)",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              width: "100%",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "#86868b" }}>Descripción (Opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Añade detalles sobre esta tarea..."
            rows={3}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(0,0,0,0.15)",
              background: "rgba(255, 255, 255, 0.6)",
              fontSize: "14px",
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
              width: "100%",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#86868b" }}>Prioridad</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(0,0,0,0.15)",
                background: "rgba(255, 255, 255, 0.8)",
                fontSize: "14px",
                outline: "none",
                width: "100%",
              }}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#86868b" }}>Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(0,0,0,0.15)",
                background: "rgba(255, 255, 255, 0.8)",
                fontSize: "14px",
                outline: "none",
                width: "100%",
              }}
            >
              <option value="backlog">Backlog</option>
              <option value="todo">Por Hacer</option>
              <option value="inprogress">En Progreso</option>
              <option value="done">Completado</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={handleClose}
            style={{
              padding: "10px 20px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#86868b",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            style={{
              padding: "10px 20px",
              border: "none",
              background: title.trim() ? "#0071e3" : "#d2d2d7",
              color: "white",
              borderRadius: "10px",
              cursor: title.trim() ? "pointer" : "default",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow: title.trim() ? "0 4px 12px rgba(0, 113, 227, 0.3)" : "none",
              transition: "background-color 0.2s, box-shadow 0.2s",
            }}
          >
            {task ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
