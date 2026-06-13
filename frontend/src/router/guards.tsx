import type { UserRole } from "../types/enums";

export function canVisit(role: UserRole, path: string) {
  if (role === "Student" && ["/borrow/approve", "/reservations/approve"].includes(path)) return false;
  return true;
}
