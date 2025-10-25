export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface Trail {
  id: number;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  distance: number; // in kilometers
  duration: number; // in minutes
  elevation_gain: number; // in meters
  coordinates: string; // JSON string of coordinate array
  start_location: string;
  end_location: string;
  tags: string; // JSON string of tags array
  rating: number; // 1-5 stars
  review_count: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TrailCoordinate {
  lat: number;
  lng: number;
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
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}


