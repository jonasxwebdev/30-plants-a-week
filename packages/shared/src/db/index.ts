/**
 * Database helper functions for Supabase
 */

import type { Plant, UserProfile, WeeklyLog } from '../types';

export interface SupabaseClient {
  from(table: string): any;
  auth: any;
}

/**
 * Get all plants from the global plants table
 */
export async function getAllPlants(supabase: SupabaseClient): Promise<Plant[]> {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

/**
 * Get weekly logs for a user
 */
export async function getWeeklyLogs(
  supabase: SupabaseClient,
  userId: string,
  weekStart: string
): Promise<WeeklyLog[]> {
  const { data, error } = await supabase
    .from('weekly_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', weekStart);

  if (error) throw error;
  return data;
}

/**
 * Log a plant serving for the current week
 */
export async function logPlantServing(
  supabase: SupabaseClient,
  userId: string,
  plantId: string,
  weekStart: string,
  count: number = 1,
  notes?: string
): Promise<WeeklyLog> {
  const { data, error } = await supabase
    .from('weekly_logs')
    .upsert({
      user_id: userId,
      plant_id: plantId,
      week_start: weekStart,
      count,
      notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user profile
 */
export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}
