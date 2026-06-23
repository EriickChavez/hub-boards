import { create } from "zustand";
import type { HubTask, TaskStatus, TaskPriority, Project } from "../types/types";
import { getProjectsFromDB, saveProjectsToDB, SEED_PROJECTS } from "./db";

interface BoardState {
  projects: Project[];
  selectedProjectId: string | null;
  isLoading: boolean;

  // Modals state
  isProjectModalOpen: boolean;
  editingProjectId: string | null;
  isTaskModalOpen: boolean;
  editingTaskId: string | null;

  // Search & Filters inside board view
  taskSearch: string;
  priorityFilter: "all" | TaskPriority;

  // Actions
  loadFromDB: () => Promise<void>;
  setSelectedProjectId: (id: string | null) => void;
  setTaskSearch: (search: string) => void;
  setPriorityFilter: (filter: "all" | TaskPriority) => void;

  // Project Modals UI Actions
  setIsProjectModalOpen: (isOpen: boolean) => void;
  openCreateProjectModal: () => void;
  openEditProjectModal: (projectId: string) => void;

  // Project CRUD Actions
  addProject: (name: string, description: string, color: string) => Promise<void>;
  updateProject: (projectId: string, name: string, description: string, color: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;

  // Task Modals UI Actions
  setIsTaskModalOpen: (isOpen: boolean) => void;
  openCreateTaskModal: () => void;
  openEditTaskModal: (taskId: string) => void;

  // Task CRUD Actions
  addTask: (title: string, description: string, priority: TaskPriority, status?: TaskStatus) => Promise<void>;
  updateTask: (taskId: string, updatedFields: Partial<Omit<HubTask, 'id'>>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  projects: [],
  selectedProjectId: null,
  isLoading: true,

  isProjectModalOpen: false,
  editingProjectId: null,
  isTaskModalOpen: false,
  editingTaskId: null,

  taskSearch: "",
  priorityFilter: "all",

  // Load from IndexedDB
  loadFromDB: async () => {
    set({ isLoading: true });
    try {
      const storedProjects = await getProjectsFromDB();
      if (storedProjects.length === 0) {
        // Seed DB on first load
        await saveProjectsToDB(SEED_PROJECTS);
        set({ projects: SEED_PROJECTS, isLoading: false });
      } else {
        set({ projects: storedProjects, isLoading: false });
      }
    } catch (e) {
      console.error("Failed to load projects from DB:", e);
      set({ projects: SEED_PROJECTS, isLoading: false });
    }
  },

  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setTaskSearch: (search) => set({ taskSearch: search }),
  setPriorityFilter: (filter) => set({ priorityFilter: filter }),

  // Project Modal Actions
  setIsProjectModalOpen: (isOpen) => set({ isProjectModalOpen: isOpen }),
  openCreateProjectModal: () => set({ isProjectModalOpen: true, editingProjectId: null }),
  openEditProjectModal: (projectId) => set({ isProjectModalOpen: true, editingProjectId: projectId }),

  // Project CRUD
  addProject: async (name, description, color) => {
    const newProject: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      description,
      color,
      createdAt: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
      tasks: [],
    };
    
    const updatedProjects = [...get().projects, newProject];
    set({ projects: updatedProjects, selectedProjectId: newProject.id, isProjectModalOpen: false });
    await saveProjectsToDB(updatedProjects);
  },

  updateProject: async (projectId, name, description, color) => {
    const updatedProjects = get().projects.map((p) =>
      p.id === projectId ? { ...p, name, description, color } : p
    );
    set({ projects: updatedProjects, isProjectModalOpen: false, editingProjectId: null });
    await saveProjectsToDB(updatedProjects);
  },

  deleteProject: async (projectId) => {
    const updatedProjects = get().projects.filter((p) => p.id !== projectId);
    const selectedProjectId = get().selectedProjectId === projectId ? null : get().selectedProjectId;
    
    set({ projects: updatedProjects, selectedProjectId });
    await saveProjectsToDB(updatedProjects);
  },

  // Task Modal Actions
  setIsTaskModalOpen: (isOpen) => set({ isTaskModalOpen: isOpen }),
  openCreateTaskModal: () => set({ isTaskModalOpen: true, editingTaskId: null }),
  openEditTaskModal: (taskId) => set({ isTaskModalOpen: true, editingTaskId: taskId }),

  // Task CRUD
  addTask: async (title, description, priority, status = "backlog") => {
    const selectedId = get().selectedProjectId;
    if (!selectedId) return;

    const newTask: HubTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      description,
      status,
      priority,
    };

    const updatedProjects = get().projects.map((project) =>
      project.id === selectedId
        ? { ...project, tasks: [...project.tasks, newTask] }
        : project
    );

    set({ projects: updatedProjects, isTaskModalOpen: false });
    await saveProjectsToDB(updatedProjects);
  },

  updateTask: async (taskId, updatedFields) => {
    const selectedId = get().selectedProjectId;
    if (!selectedId) return;

    const updatedProjects = get().projects.map((project) =>
      project.id === selectedId
        ? {
            ...project,
            tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, ...updatedFields } : t)),
          }
        : project
    );

    set({ projects: updatedProjects, isTaskModalOpen: false, editingTaskId: null });
    await saveProjectsToDB(updatedProjects);
  },

  deleteTask: async (taskId) => {
    const selectedId = get().selectedProjectId;
    if (!selectedId) return;

    const updatedProjects = get().projects.map((project) =>
      project.id === selectedId
        ? { ...project, tasks: project.tasks.filter((t) => t.id !== taskId) }
        : project
    );

    set({ projects: updatedProjects, isTaskModalOpen: false, editingTaskId: null });
    await saveProjectsToDB(updatedProjects);
  },

  moveTask: async (taskId, newStatus) => {
    const selectedId = get().selectedProjectId;
    if (!selectedId) return;

    const updatedProjects = get().projects.map((project) =>
      project.id === selectedId
        ? {
            ...project,
            tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
          }
        : project
    );

    set({ projects: updatedProjects });
    await saveProjectsToDB(updatedProjects);
  },
}));
