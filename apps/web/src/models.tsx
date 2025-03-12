import { Timestamp } from "firebase/firestore";

export interface Auditable {
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
}
