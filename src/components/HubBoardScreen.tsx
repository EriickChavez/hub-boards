import { useEffect } from "react";
import Board from "./Board";
import TaskModal from "./TaskModal";
import ProjectModal from "./ProjectModal";
import ProjectsDashboard from "./ProjectsDashboard";
import { useBoardStore } from "../store/useBoardStore";
import type { TaskPriority, TaskStatus } from "../types/types";
import "./HubBoardScreen.css";

export default function HubBoardScreen() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    isLoading,
    loadFromDB,
    
    isProjectModalOpen,
    setIsProjectModalOpen,
    editingProjectId,
    
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTaskId,
    
    taskSearch,
    setTaskSearch,
    priorityFilter,
    setPriorityFilter,

    openCreateProjectModal,
    openEditProjectModal,
    addProject,
    updateProject,
    deleteProject,

    openCreateTaskModal,
    openEditTaskModal,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  } = useBoardStore();

  // Load from IndexedDB database on component mount
  useEffect(() => {
    loadFromDB();
  }, [loadFromDB]);

  // Derived states
  const currentProject = projects.find((p) => p.id === selectedProjectId) || null;
  const tasks = currentProject?.tasks ?? [];
  const editingProject = projects.find((p) => p.id === editingProjectId) || null;
  const editingTask = tasks.find((t) => t.id === editingTaskId) || null;

  // Handlers for Project Saving
  const handleProjectSave = (name: string, description: string, color: string) => {
    if (editingProject) {
      updateProject(editingProject.id, name, description, color);
    } else {
      addProject(name, description, color);
    }
  };

  // Handlers for Task Saving
  const handleTaskSave = (
    title: string,
    description: string,
    priority: TaskPriority,
    status: TaskStatus
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, { title, description, priority, status });
    } else {
      addTask(title, description, priority, status);
    }
  };

  // Filter tasks based on search query and priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(taskSearch.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  // Render macOS style glassmorphic loading screen
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#f5f5f7",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            padding: "32px 48px",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div className="macos-spinner" />
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#86868b", letterSpacing: "-0.1px" }}>
            Conectando a base de datos...
          </span>
        </div>
      </div>
    );
  }

  // If no project is selected, render the Projects Dashboard
  if (!selectedProjectId || !currentProject) {
    return (
      <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
        <ProjectsDashboard
          projects={projects}
          onSelectProject={setSelectedProjectId}
          onCreateProject={openCreateProjectModal}
          onEditProject={openEditProjectModal}
          onDeleteProject={deleteProject}
        />

        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onSave={handleProjectSave}
          project={editingProject}
        />
      </div>
    );
  }

  // Calculate task completions for header
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="board-view-container">
      <header className="board-view-header">
        <div className="board-header-top">
          <div className="board-header-left">
            <button
              className="btn-back"
              onClick={() => {
                setSelectedProjectId(null);
                setTaskSearch("");
                setPriorityFilter("all");
              }}
            >
              ← Volver a Proyectos
            </button>
            <div className="project-title-container">
              <span
                className="project-color-dot"
                style={{
                  backgroundColor: currentProject.color,
                  "--accent-dot-color": currentProject.color,
                } as React.CSSProperties}
              />
              <h1 className="board-project-name">{currentProject.name}</h1>
            </div>
          </div>

          <div className="board-header-right">
            <button
              onClick={() => openEditProjectModal(currentProject.id)}
              className="btn-icon-secondary"
              title="Editar Proyecto"
            >
              ✏️
            </button>
            <button
              onClick={openCreateTaskModal}
              className="btn-primary"
            >
              + Nueva Tarea
            </button>
          </div>
        </div>

        {currentProject.description && (
          <p className="project-meta-desc">{currentProject.description}</p>
        )}

        <div className="board-header-bottom">
          <div className="board-filters">
            <div className="board-search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar tarea..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="board-search-input"
              />
            </div>

            <div className="priority-filters-group">
              <button
                className={`btn-filter-tab ${priorityFilter === "all" ? "active" : ""}`}
                onClick={() => setPriorityFilter("all")}
              >
                Todas
              </button>
              <button
                className={`btn-filter-tab ${priorityFilter === "high" ? "active" : ""}`}
                onClick={() => setPriorityFilter("high")}
              >
                Alta
              </button>
              <button
                className={`btn-filter-tab ${priorityFilter === "medium" ? "active" : ""}`}
                onClick={() => setPriorityFilter("medium")}
              >
                Media
              </button>
              <button
                className={`btn-filter-tab ${priorityFilter === "low" ? "active" : ""}`}
                onClick={() => setPriorityFilter("low")}
              >
                Baja
              </button>
            </div>
          </div>

          <div style={{ fontSize: "14px", color: "#86868b", fontWeight: 500 }}>
            {completedTasks} de {totalTasks} tareas completadas
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <Board
        tasks={filteredTasks}
        onTaskMove={moveTask}
        onTaskClick={openEditTaskModal}
      />

      {/* Task Modal (handles both creation & editing/deleting tasks) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleTaskSave}
        onDelete={deleteTask}
        task={editingTask}
      />

      {/* Project Modal (handles project editing inside board view) */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleProjectSave}
        project={editingProject}
      />
    </div>
  );
}
