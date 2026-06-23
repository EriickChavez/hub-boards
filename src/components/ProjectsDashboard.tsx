import React, { useState } from "react";
import type { Project } from "../types/types";
import "./ProjectsDashboard.css";

interface ProjectsDashboardProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onEditProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
}

export default function ProjectsDashboard({
  projects,
  onSelectProject,
  onCreateProject,
  onEditProject,
  onDeleteProject,
}: ProjectsDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <span className="dashboard-logo-icon">📊</span>
          <div>
            <h1 className="dashboard-title">Mis Proyectos</h1>
            <p className="dashboard-subtitle">Administra y organiza tus tableros de tareas</p>
          </div>
        </div>
        
        <div className="dashboard-header-actions">
          <div className="dashboard-search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar proyecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dashboard-search-input"
            />
          </div>
          <button onClick={onCreateProject} className="btn-primary">
            + Nuevo Proyecto
          </button>
        </div>
      </header>

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>{searchTerm ? "No se encontraron proyectos" : "No tienes proyectos creados"}</h3>
          <p>
            {searchTerm
              ? "Prueba con otro término de búsqueda o crea uno nuevo."
              : "Comienza creando tu primer proyecto para organizar tus tableros estilo Trello."}
          </p>
          {!searchTerm && (
            <button onClick={onCreateProject} className="btn-primary" style={{ marginTop: "16px" }}>
              Crear Proyecto
            </button>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => {
            const totalTasks = project.tasks.length;
            const doneTasks = project.tasks.filter((t) => t.status === "done").length;
            const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

            const backlogCount = project.tasks.filter((t) => t.status === "backlog").length;
            const todoCount = project.tasks.filter((t) => t.status === "todo").length;
            const inProgressCount = project.tasks.filter((t) => t.status === "inprogress").length;
            const doneCount = project.tasks.filter((t) => t.status === "done").length;

            return (
              <div
                key={project.id}
                className="project-card"
                onClick={() => onSelectProject(project.id)}
                style={{ "--project-color": project.color } as React.CSSProperties}
              >
                <div className="project-card-header">
                  <div className="project-color-bar" style={{ backgroundColor: project.color }} />
                  <div className="project-card-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProject(project.id);
                      }}
                      className="card-action-btn edit-btn"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.name}"? Se perderán todas sus tareas.`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      className="card-action-btn delete-btn"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="project-card-body">
                  <h3 className="project-card-name">{project.name}</h3>
                  <p className="project-card-desc">
                    {project.description || "Sin descripción proporcionada."}
                  </p>
                </div>

                <div className="project-card-footer">
                  <div className="project-progress-container">
                    <div className="progress-text-row">
                      <span>Progreso</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%`, backgroundColor: project.color }}
                      />
                    </div>
                  </div>

                  <div className="project-stats-row">
                    <span className="stat-badge backlog" title="Backlog">
                      {backlogCount} B
                    </span>
                    <span className="stat-badge todo" title="Por Hacer">
                      {todoCount} H
                    </span>
                    <span className="stat-badge inprogress" title="En Progreso">
                      {inProgressCount} P
                    </span>
                    <span className="stat-badge done" title="Completado">
                      {doneCount} C
                    </span>
                    <span className="stat-date">{project.createdAt}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="project-card create-new-card" onClick={onCreateProject}>
            <div className="create-new-content">
              <span className="create-new-icon">➕</span>
              <h3>Nuevo Proyecto</h3>
              <p>Crea un tablero de Kanban independiente</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
