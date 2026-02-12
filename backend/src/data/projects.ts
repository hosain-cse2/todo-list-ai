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
  {
    id: "3",
    name: "Learning",
    description: "Courses, books, and skills to pick up.",
    todos: [
      { id: "8", text: "Finish Next.js docs", completed: true, createdAt: "2024-01-11" },
      { id: "9", text: "Practice TypeScript generics", completed: false, createdAt: "2024-01-10" },
      { id: "10", text: "Watch Prisma tutorial", completed: false, createdAt: "2024-01-09" },
    ],
  },
  {
    id: "4",
    name: "Home",
    description: "Household chores and errands.",
    todos: [
      { id: "11", text: "Grocery shopping", completed: false, createdAt: "2024-01-14" },
      { id: "12", text: "Pay electricity bill", completed: true, createdAt: "2024-01-13" },
      { id: "13", text: "Clean kitchen", completed: false, createdAt: "2024-01-12" },
      { id: "14", text: "Water plants", completed: true, createdAt: "2024-01-11" },
    ],
  },
  {
    id: "5",
    name: "Side Project",
    description: "Ideas and tasks for your side project.",
    todos: [
      { id: "15", text: "Set up repo", completed: true, createdAt: "2024-01-08" },
      { id: "16", text: "Design landing page", completed: false, createdAt: "2024-01-07" },
      { id: "17", text: "Deploy to Vercel", completed: false, createdAt: "2024-01-06" },
    ],
  },
];

