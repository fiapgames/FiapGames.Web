export type OrderStatus = 'Pending' | 'Approved' | 'Rejected';

export interface GameDto {
  id: string;
  title: string;
  description: string;
  price: number;
  genre: string;
  active: boolean;
  createdAt: string;
}

export interface CreateGameDto {
  title: string;
  description: string;
  price: number;
  genre: string;
}

export interface UpdateGameDto {
  title: string;
  description: string;
  price: number;
  genre: string;
  active: boolean;
}

export interface PurchaseRequestDto {
  userId: string;
}

export interface OrderDto {
  id: string;
  userId: string;
  gameId: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryItemDto {
  gameId: string;
  title: string;
  genre: string;
  orderId: string;
  purchasedAt: string;
}

export interface LibraryResponseDto {
  userId: string;
  userName: string;
  userEmail: string;
  games: LibraryItemDto[];
}

export interface UserDto {
  id: string;
  nome: string;
  email: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateUserDto {
  nome: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: string;
  user: UserDto;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  traceId?: string;
  // Users API returns { message } instead of ProblemDetails for some errors (e.g. duplicate email).
  message?: string;
}

export interface ValidationProblemDetails extends ProblemDetails {
  errors?: Record<string, string[]>;
}
