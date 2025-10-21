export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  current_xp: number;
  total_xp: number;
  xp_per_level: number;
  profile_image?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  xp_reward: number;
  completed: boolean;
  completed_at?: string;
  difficulty: string;
  created_at: string;
  updated_at: string;
}

export interface DefaultMission {
  id: string;
  title: string;
  description?: string;
  xp_reward: number;
  category: string;
  difficulty: string;
}

export interface Env {
  DB: D1Database;
}
