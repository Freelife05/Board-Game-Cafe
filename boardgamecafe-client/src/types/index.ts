export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  expiresAt: string;
}

export interface BoardGame {
  id: number;
  title: string;
  genre: string;
  minPlayers: number;
  maxPlayers: number;
  difficultyLevel: string;
  playTimeMinutes: number;
  condition: string;
  pricePerHour: number;
  isAvailable: boolean;
  imageUrl?: string;
  description?: string;
  addedAt: string;
}

export interface CafeTable {
  id: number;
  tableNumber: number;
  capacity: number;
  isVIP: boolean;
  hourlyRate: number;
  status: string;
  locationZone: string;
  description?: string;
}

export interface Reservation {
  id: number;
  userId: number;
  userName: string;
  tableId: number;
  tableNumber: number;
  boardGameId?: number;
  boardGameTitle?: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  partySize: number;
  totalCost: number;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProblemDetails {
  title: string;
  status: number;
  detail: string;
}
