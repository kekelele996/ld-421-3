export type Reservation = {
  id: string;
  equipmentId: string;
  reserverId: string;
  startsAt: string;
  endsAt: string;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  approverId?: string;
};

export type ConflictItem = {
  type: "borrow" | "maintenance" | "reservation";
  id: string;
  startsAt: string;
  endsAt: string;
  label: string;
};

export type TimelineEvent = {
  type: "borrow" | "maintenance" | "reservation";
  id: string;
  startsAt: string;
  endsAt: string;
  title: string;
  status?: string;
};
