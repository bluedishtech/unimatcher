export interface User {
  id: number;
  name: string;
  surname: string;
  createdAt: string; // ISO 8601 date string
}

export interface Match {
  senior: User;
  freshmen: User[];
}