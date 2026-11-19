import type { Project, Task } from "./types";
export const initialProjects: Project[] = [
  { id: 1, name: "Production line modernization", department: "Production", progress: 78, status: "On track", due: "Nov 28, 2026", color: "violet" },
  { id: 2, name: "Warehouse inventory audit", department: "Warehouse", progress: 54, status: "At risk", due: "Dec 04, 2026", color: "cyan" },
  { id: 3, name: "Preventive maintenance cycle", department: "Maintenance", progress: 91, status: "On track", due: "Nov 24, 2026", color: "blue" },
  { id: 4, name: "Energy monitoring rollout", department: "Power Operations", progress: 32, status: "Planning", due: "Dec 18, 2026", color: "orange" }
];
export const initialTasks: Task[] = [
  { id: 101, title: "Review production quality report", department: "Production", owner: "M. Weber", due: "Today", status: "In progress", priority: "High" },
  { id: 102, title: "Validate incoming inventory records", department: "Warehouse", owner: "A. Fischer", due: "Today", status: "Review", priority: "Medium" },
  { id: 103, title: "Approve maintenance checklist", department: "Maintenance", owner: "L. Schmidt", due: "Nov 21", status: "In progress", priority: "High" },
  { id: 104, title: "Update energy usage dashboard", department: "Power Operations", owner: "J. Bauer", due: "Nov 22", status: "Completed", priority: "Low" },
  { id: 105, title: "Prepare weekly operations summary", department: "Production", owner: "S. Klein", due: "Nov 23", status: "In progress", priority: "Medium" }
];
export const activity = [
  { initials: "MW", name: "M. Weber", action: "updated production quality report", time: "12 min ago", tone: "purple" },
  { initials: "AF", name: "A. Fischer", action: "submitted an inventory audit", time: "48 min ago", tone: "cyan" },
  { initials: "LS", name: "L. Schmidt", action: "completed a maintenance checklist", time: "2 hours ago", tone: "blue" }
];
export const chartData = [
  { day: "Mon", planned: 62, actual: 54 }, { day: "Tue", planned: 68, actual: 61 },
  { day: "Wed", planned: 65, actual: 70 }, { day: "Thu", planned: 76, actual: 68 },
  { day: "Fri", planned: 81, actual: 77 }, { day: "Sat", planned: 73, actual: 84 },
  { day: "Sun", planned: 88, actual: 82 }
];