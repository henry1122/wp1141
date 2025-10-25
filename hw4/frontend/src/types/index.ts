export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface TrailCoordinate {
  lat: number;
  lng: number;
}

export interface Trail {
  id: number;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  distance: number;
  duration: number;
  elevation_gain: number;
  coordinates: TrailCoordinate[];
  start_location: string;
  end_location: string;
  tags: string[];
  rating: number;
  review_count: number;
  user_id: number;
  author_username: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTrailRequest {
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  distance: number;
  duration: number;
  elevation_gain: number;
  coordinates: TrailCoordinate[];
  start_location: string;
  end_location: string;
  tags: string[];
}

export interface UpdateTrailRequest extends Partial<CreateTrailRequest> {
  id: number;
}

export interface AuthRequest {
  username?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TrailsResponse {
  trails: Trail[];
  pagination: PaginationInfo;
}

export interface TrailFilters {
  page?: number;
  limit?: number;
  difficulty?: string;
  min_distance?: number;
  max_distance?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}


