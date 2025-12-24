/**
 * Shared types and interfaces for the 30 Plants A Week app
 */

export interface Plant {
  id: string;
  name: string;
  category: PlantCategory;
  description?: string;
  created_at: string;
}

export enum PlantCategory {
  VEGETABLE = 'vegetable',
  FRUIT = 'fruit',
  LEGUME = 'legume',
  GRAIN = 'grain',
  NUT = 'nut',
  SEED = 'seed',
  HERB = 'herb',
  SPICE = 'spice',
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyLog {
  id: string;
  user_id: string;
  plant_id: string;
  week_start: string; // ISO date string (Monday)
  count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyProgress {
  week_start: string;
  unique_plants: number;
  total_servings: number;
  goal: number;
  percentage: number;
}
