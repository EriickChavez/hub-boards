import { useState, useEffect } from "react";
import type { Project } from "../types/types";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, color: string) => void;
  project?: Project | null;
}

const PALETTE = [
  { name: "Azul", value: "#0071e3" },
  { name: "Verde", value: "#34c759" },
  { name: "Naranja", value: "#ff9500" },
  { name: "Púrpura", value: "#af52de" },
  { name: "Rosa", value: "#ff2d55" },
  { name: "Gris", value: "#8e8e93" },
];

export default function ProjectModal({ isOpen, onClose, onSave, project }: ProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#0071e3");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || "");
      setColor(project.color || "#0071e3");
    } else {
      setName("");
      setDescription("");
      setColor("#0071e3");
    }
  }, [isOpen, project]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onSave(trimmedName, description.trim(), color);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setColor("#0071e3");
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
          width: "400px",
          maxWidth: "90%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", color: "#1d1d1f", fontWeight: 600 }}>
          {project ? "Editar Proyecto" : "Nuevo Proyecto"}
        </h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "#86868b" }}>Nombre del Proyecto</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Rediseño Web"
            autoFocus
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(0,0,0,0.15)",
              background: "rgba(255, 255, 255, 0.6)",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s",
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
            placeholder="Describe brevemente los objetivos de este tablero..."
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

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "#86868b" }}>Color de Acento</label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {PALETTE.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setColor(item.value)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: item.value,
                  border: color === item.value ? "3px solid #1d1d1f" : "2px solid transparent",
                  outline: "none",
                  cursor: "pointer",
                  transition: "transform 0.15s, border-color 0.15s",
                  transform: color === item.value ? "scale(1.1)" : "scale(1)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                title={item.name}
              />
            ))}
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
            disabled={!name.trim()}
            style={{
              padding: "10px 20px",
              border: "none",
              background: name.trim() ? color : "#d2d2d7",
              color: "white",
              borderRadius: "10px",
              cursor: name.trim() ? "pointer" : "default",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow: name.trim() ? `0 4px 12px ${color}33` : "none",
              transition: "background-color 0.2s, box-shadow 0.2s",
            }}
          >
            {project ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
