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
