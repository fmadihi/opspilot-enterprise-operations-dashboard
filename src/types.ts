export type TaskStatus = "In progress" | "Review" | "Completed";
export type Task = { id: number; title: string; department: string; owner: string; due: string; status: TaskStatus; priority: "High" | "Medium" | "Low" };
export type Project = { id: number; name: string; department: string; progress: number; status: string; due: string; color: string };
export type FormField = { name: string; label: string; type: "text" | "email" | "select" | "date" | "textarea"; required?: boolean; options?: string[] };