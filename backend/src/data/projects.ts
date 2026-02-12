export interface ProjectTodo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  todos: ProjectTodo[];
}

export const projects: Project[] = [
  {
    id: "1",
    name: "Personal Tasks",
    description: "Capture your daily todos and personal tasks.",
    todos: [
      {
        id: "1",
        text: "Complete project proposal",
        completed: false,
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        text: "Review code changes",
        completed: true,
        createdAt: "2024-01-14",
      },
      {
        id: "3",
        text: "Update documentation",
        completed: false,
        createdAt: "2024-01-13",
      },
      {
        id: "4",
        text: "Schedule team meeting",
        completed: true,
        createdAt: "2024-01-12",
      },
    ],
  },
  {
    id: "2",
    name: "Work",
    description: "Track work items and priorities.",
    todos: [
      {
        id: "5",
        text: "Plan next sprint",
        completed: false,
        createdAt: "2024-01-10",
      },
      {
        id: "6",
        text: "Refine backlog",
        completed: false,
        createdAt: "2024-01-09",
      },
      {
        id: "7",
        text: "Prepare demo slides",
        completed: true,
        createdAt: "2024-01-08",
      },
    ],
  },
];

