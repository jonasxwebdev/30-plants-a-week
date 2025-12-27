/**
 * Shared types and interfaces for the 30 Plants A Week app
 */

// ============================================================================
// DATABASE TYPES (matching SQL schema)
// ============================================================================

export interface Plant {
  id: string;
  name: string;
  normalized_name: string;
  emoji?: string | null;
  category?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlantAlias {
  id: string;
  plant_id: string;
  alias: string;
  normalized_alias: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email?: string | null;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  weekly_goal: number;
  week_start_day: number; // 0=Sunday, 1=Monday
  timezone: string;
  notification_enabled: boolean;
  notification_time: string;
  show_stats_to_friends?: boolean;
  show_streak_to_friends?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Week {
  id: string;
  user_id: string;
  week_start: string; // DATE (YYYY-MM-DD)
  week_end: string; // DATE (YYYY-MM-DD)
  goal: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeekPlant {
  id: string;
  week_id: string;
  plant_id: string;
  logged_at: string;
  quantity: number;
  notes?: string | null;
}

export interface PushDevice {
  id: string;
  user_id: string;
  device_token: string;
  device_type: 'ios' | 'android' | 'web';
  device_name?: string | null;
  last_used_at: string;
  created_at: string;
}

// ============================================================================
// VIEW TYPES (for UI consumption)
// ============================================================================

export interface WeekWithPlants extends Week {
  plants: PlantWithDetails[];
  unique_count: number;
  percentage: number;
  completed: boolean;
}

export interface PlantWithDetails extends Plant {
  logged_at?: string;
  quantity?: number;
  notes?: string | null;
}

export interface AutocompleteResult {
  plant: Plant;
  match_type: 'name' | 'alias';
  match_text: string;
}

export interface WeeklyProgress {
  week_start: string;
  week_end: string;
  goal: number;
  unique_count: number;
  percentage: number;
  completed: boolean;
}

export interface StreakInfo {
  current_streak: number;
  best_streak: number;
  last_completed_week?: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface AddPlantInput {
  plant_id: string;
  quantity?: number;
  notes?: string;
}

export interface UpdateGoalInput {
  weekly_goal: number;
  apply_to_current_week?: boolean;
}

// ============================================================================
// FRIENDS TYPES
// ============================================================================

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface FriendStats {
  user_id: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
  weekly_goal: number;
  current_streak: number;
  current_week_count: number;
  current_week_goal: number;
  total_plants_logged: number;
  completed_weeks: number;
}

export interface FriendRequest {
  id: string;
  from_user: {
    id: string;
    username: string;
    full_name?: string | null;
    avatar_url?: string | null;
  };
  created_at: string;
}

export interface FriendProfile {
  id: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
}
