export type TaskStatus = 'backlog' | 'todo' | 'inprogress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface HubTask {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    color: string;
    createdAt: string;
    tasks: HubTask[];
}
