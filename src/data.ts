import { User } from './types';

// Timestamps are in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)

export const seniors: User[] = [
  { id: 101, name: 'Ousmane', surname: 'Sow', createdAt: '2023-09-05T10:00:00Z' },
  { id: 102, name: 'Mariama', surname: 'Diallo', createdAt: '2023-09-05T11:30:00Z' },
  { id: 103, name: 'Cheikh', surname: 'Fall', createdAt: '2023-09-06T14:00:00Z' },
  { id: 104, name: 'Fatou', surname: 'Ndiaye', createdAt: '2024-08-20T09:00:00Z' },
];

export const freshmen: User[] = [
  { id: 1, name: 'Aïssatou', surname: 'Gueye', createdAt: '2023-10-15T09:15:00Z' },
  { id: 2, name: 'Moussa', surname: 'Diop', createdAt: '2023-10-15T09:30:00Z' },
  { id: 3, name: 'Aminata', surname: 'Cissé', createdAt: '2023-10-16T11:00:00Z' },
  { id: 4, name: 'Ibrahima', surname: 'Camara', createdAt: '2023-10-16T11:05:00Z' },
  { id: 5, name: 'Khadija', surname: 'Ba', createdAt: '2023-11-01T15:20:00Z' },
  { id: 6, name: 'Mamadou', surname: 'Thiam', createdAt: '2024-09-01T10:00:00Z' },
  { id: 7, name: 'Penda', surname: 'Sarr', createdAt: '2024-09-01T10:05:00Z' },
  { id: 8, name: 'Alioune', surname: 'Faye', createdAt: '2024-09-02T12:00:00Z' },
];
