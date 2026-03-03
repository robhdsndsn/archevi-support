export const typeColorMap: Record<string, string> = {
  bug: "bg-red-100 text-red-800 ring-red-600/20",
  feature: "bg-purple-100 text-purple-800 ring-purple-600/20",
  support: "bg-blue-100 text-blue-800 ring-blue-600/20",
  incident: "bg-orange-100 text-orange-800 ring-orange-600/20",
  service: "bg-cyan-100 text-cyan-800 ring-cyan-600/20",
  maintenance: "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
  access: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  feedback: "bg-pink-100 text-pink-800 ring-pink-600/20",
};

export const priorityColorMap: Record<string, string> = {
  low: "bg-blue-100 text-blue-800 ring-blue-600/20",
  medium: "bg-green-100 text-green-800 ring-green-600/20",
  high: "bg-red-100 text-red-800 ring-red-600/20",
};

/**
 * Normalizes priority values from legacy formats.
 * Handles: "Low" -> "low", "Normal" -> "medium", "High" -> "high"
 */
export function normalizePriority(p: string): string {
  const lower = p.toLowerCase();
  if (lower === "normal") return "medium";
  return lower;
}

export function getTypeColor(type: string): string {
  return typeColorMap[type?.toLowerCase()] ?? "bg-gray-100 text-gray-800 ring-gray-600/20";
}

export function getPriorityColor(priority: string): string {
  const normalized = normalizePriority(priority);
  return priorityColorMap[normalized] ?? "bg-gray-100 text-gray-800 ring-gray-600/20";
}
