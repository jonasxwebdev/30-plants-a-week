/**
 * Database query functions for the app
 * All functions expect a Supabase client instance
 */

import type {
  AddPlantInput,
  AutocompleteResult,
  Plant,
  PlantWithDetails,
  Profile,
  UpdateGoalInput,
  Week,
  WeekPlant,
  WeekWithPlants,
} from '@repo/shared';
import { calculateProgress, getWeekEndDate, getWeekStartDate, isWeekCompleted } from '@repo/shared';

import type { SupabaseClient } from '@supabase/supabase-js';

// ============================================================================
// PROFILE QUERIES
// ============================================================================

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Profile>
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

// ============================================================================
// WEEK QUERIES
// ============================================================================

/**
 * Ensure current week exists for user (upsert)
 * Returns the current week row
 */
export async function ensureCurrentWeek(supabase: SupabaseClient, userId: string): Promise<Week> {
  // Get user profile for timezone and goal
  const profile = await getProfile(supabase, userId);

  // Calculate current week start/end in user's timezone
  const weekStart = getWeekStartDate(profile.timezone);
  const weekEnd = getWeekEndDate(weekStart);

  // Try to get existing week
  const { data: existingWeek, error: selectError } = await supabase
    .from('weeks')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', weekStart)
    .single();

  if (existingWeek && !selectError) {
    return existingWeek as Week;
  }

  // Create new week if it doesn't exist
  const { data, error } = await supabase
    .from('weeks')
    .insert({
      user_id: userId,
      week_start: weekStart,
      week_end: weekEnd,
      goal: profile.weekly_goal,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Week;
}

/**
 * Get a specific week by week_start date
 */
export async function getWeek(
  supabase: SupabaseClient,
  userId: string,
  weekStart: string
): Promise<Week | null> {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', weekStart)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data as Week | null;
}

/**
 * Get last N weeks for user
 */
export async function getRecentWeeks(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 12
): Promise<WeekWithPlants[]> {
  const { data: weeks, error: weeksError } = await supabase
    .from('weeks')
    .select('*')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(limit);

  if (weeksError) throw weeksError;

  // Get plants for each week
  const weeksWithPlants = await Promise.all(
    (weeks as Week[]).map(async (week) => {
      const plants = await listWeekPlants(supabase, week.id);
      const uniqueCount = plants.length;
      const percentage = calculateProgress(uniqueCount, week.goal);
      const completed = isWeekCompleted(week.week_end) && uniqueCount >= week.goal;

      return {
        ...week,
        plants,
        unique_count: uniqueCount,
        percentage,
        completed,
      } as WeekWithPlants;
    })
  );

  return weeksWithPlants;
}

/**
 * Update week notes
 */
export async function updateWeekNotes(supabase: SupabaseClient, weekId: string, notes: string) {
  const { data, error } = await supabase
    .from('weeks')
    .update({ notes, updated_at: new Date().toISOString() })
    .eq('id', weekId)
    .select()
    .single();

  if (error) throw error;
  return data as Week;
}

/**
 * Update week goal
 */
export async function updateWeekGoal(supabase: SupabaseClient, weekId: string, goal: number) {
  const { data, error } = await supabase
    .from('weeks')
    .update({ goal, updated_at: new Date().toISOString() })
    .eq('id', weekId)
    .select()
    .single();

  if (error) throw error;
  return data as Week;
}

// ============================================================================
// WEEK_PLANTS QUERIES
// ============================================================================

/**
 * List all plants for a week with details
 */
export async function listWeekPlants(
  supabase: SupabaseClient,
  weekId: string
): Promise<PlantWithDetails[]> {
  const { data, error } = await supabase
    .from('week_plants')
    .select(
      `
      logged_at,
      quantity,
      notes,
      plants:plant_id (
        id,
        name,
        normalized_name,
        emoji,
        category,
        description,
        created_at,
        updated_at
      )
    `
    )
    .eq('week_id', weekId)
    .order('logged_at', { ascending: false });

  if (error) throw error;

  // Flatten the structure
  return (data as any[]).map((wp) => ({
    ...wp.plants,
    logged_at: wp.logged_at,
    quantity: wp.quantity,
    notes: wp.notes,
  })) as PlantWithDetails[];
}

/**
 * Add a plant to a week
 * Returns success status and error message if duplicate
 */
export async function addPlantToWeek(
  supabase: SupabaseClient,
  weekId: string,
  input: AddPlantInput
): Promise<{ success: boolean; error?: string; data?: WeekPlant }> {
  const { data, error } = await supabase
    .from('week_plants')
    .insert({
      week_id: weekId,
      plant_id: input.plant_id,
      quantity: input.quantity || 1,
      notes: input.notes,
    })
    .select()
    .single();

  if (error) {
    // Check for unique constraint violation (duplicate plant in week)
    if (error.code === '23505') {
      return {
        success: false,
        error: 'Du hast diese Pflanze bereits diese Woche hinzugefügt',
      };
    }
    throw error;
  }

  return { success: true, data: data as WeekPlant };
}

/**
 * Remove a plant from a week
 */
export async function removePlantFromWeek(
  supabase: SupabaseClient,
  weekId: string,
  plantId: string
) {
  const { error } = await supabase
    .from('week_plants')
    .delete()
    .eq('week_id', weekId)
    .eq('plant_id', plantId);

  if (error) throw error;
}

// ============================================================================
// PLANT SEARCH & AUTOCOMPLETE
// ============================================================================

/**
 * Search plants by name or alias for autocomplete
 */
export async function searchPlants(
  supabase: SupabaseClient,
  query: string,
  limit: number = 10
): Promise<AutocompleteResult[]> {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const searchPattern = `%${normalizedQuery}%`;

  // Search in plants table
  const { data: plantMatches, error: plantError } = await supabase
    .from('plants')
    .select('*')
    .ilike('name', searchPattern)
    .limit(limit);

  if (plantError) throw plantError;

  // Search in plant_aliases table
  const { data: aliasMatches, error: aliasError } = await supabase
    .from('plant_aliases')
    .select(
      `
      alias,
      plant:plant_id (
        id,
        name,
        normalized_name,
        emoji,
        category,
        description,
        created_at,
        updated_at
      )
    `
    )
    .ilike('alias', searchPattern)
    .limit(limit);

  if (aliasError) throw aliasError;

  // Combine results
  const results: AutocompleteResult[] = [];

  // Add plant name matches
  (plantMatches as Plant[]).forEach((plant) => {
    results.push({
      plant,
      match_type: 'name',
      match_text: plant.name,
    });
  });

  // Add alias matches (avoid duplicates)
  const addedPlantIds = new Set(results.map((r) => r.plant.id));
  (aliasMatches as any[]).forEach((match) => {
    if (match.plant && !addedPlantIds.has(match.plant.id)) {
      results.push({
        plant: match.plant as Plant,
        match_type: 'alias',
        match_text: match.alias,
      });
      addedPlantIds.add(match.plant.id);
    }
  });

  return results;
}

/**
 * Check if a plant name exists as an exact match
 */
export async function checkExactPlantMatch(
  supabase: SupabaseClient,
  query: string
): Promise<boolean> {
  const normalizedQuery = query.toLowerCase().trim();

  // Check exact match in plants table
  const { data: plantMatch, error: plantError } = await supabase
    .from('plants')
    .select('id')
    .eq('normalized_name', normalizedQuery)
    .single();

  if (!plantError && plantMatch) return true;

  // Check exact match in aliases table
  const { data: aliasMatch, error: aliasError } = await supabase
    .from('plant_aliases')
    .select('plant_id')
    .ilike('alias', normalizedQuery)
    .single();

  return !aliasError && !!aliasMatch;
}

/**
 * Get user's custom plants
 */
export async function getUserCustomPlants(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 20
): Promise<Plant[]> {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Plant[];
}

/**
 * Get recommended plants from previous weeks that aren't in current week
 */
export async function getRecommendedPlants(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 10
): Promise<Plant[]> {
  const profile = await getProfile(supabase, userId);
  const currentWeekStart = getWeekStartDate(profile.timezone);

  // Get current week
  const currentWeek = await getWeek(supabase, userId, currentWeekStart);
  if (!currentWeek) return [];

  // Get plants from current week
  const currentWeekPlants = await listWeekPlants(supabase, currentWeek.id);
  const currentPlantIds = new Set(currentWeekPlants.map((p) => p.id));

  // Get last 3 weeks (excluding current)
  const { data: pastWeeks, error: weeksError } = await supabase
    .from('weeks')
    .select('id')
    .eq('user_id', userId)
    .lt('week_start', currentWeekStart)
    .order('week_start', { ascending: false })
    .limit(3);

  if (weeksError || !pastWeeks || pastWeeks.length === 0) return [];

  const pastWeekIds = pastWeeks.map((w) => w.id);

  // Get plants from those weeks
  const { data: weekPlants, error: plantsError } = await supabase
    .from('week_plants')
    .select(
      `
      plant:plant_id (
        id,
        name,
        normalized_name,
        emoji,
        category,
        description,
        created_at,
        updated_at,
        user_id
      )
    `
    )
    .in('week_id', pastWeekIds);

  if (plantsError || !weekPlants) return [];

  // Filter out plants already in current week and deduplicate
  const seenPlantIds = new Set<string>();
  const recommendations: Plant[] = [];

  for (const wp of weekPlants as any[]) {
    if (wp.plant && !currentPlantIds.has(wp.plant.id) && !seenPlantIds.has(wp.plant.id)) {
      seenPlantIds.add(wp.plant.id);
      recommendations.push(wp.plant as Plant);

      if (recommendations.length >= limit) break;
    }
  }

  return recommendations;
}

/**
 * Get a plant by ID
 */
export async function getPlant(supabase: SupabaseClient, plantId: string): Promise<Plant | null> {
  const { data, error } = await supabase.from('plants').select('*').eq('id', plantId).single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Plant | null;
}

// ============================================================================
// SETTINGS
// ============================================================================

/**
 * Update weekly goal in profile and optionally apply to current week
 */
export async function updateWeeklyGoal(
  supabase: SupabaseClient,
  userId: string,
  input: UpdateGoalInput
): Promise<{ profile: Profile; week?: Week }> {
  // Validate goal
  if (input.weekly_goal < 1 || input.weekly_goal > 200) {
    throw new Error('Wöchentliches Ziel muss zwischen 1 und 200 liegen');
  }

  // Update profile
  const profile = await updateProfile(supabase, userId, {
    weekly_goal: input.weekly_goal,
  });

  // If applying to current week, update it
  let week: Week | undefined;
  if (input.apply_to_current_week) {
    const currentWeek = await ensureCurrentWeek(supabase, userId);

    const { data, error } = await supabase
      .from('weeks')
      .update({ goal: input.weekly_goal })
      .eq('id', currentWeek.id)
      .select()
      .single();

    if (error) throw error;
    week = data as Week;
  }

  return { profile, week };
}

// ============================================================================
// STREAK CALCULATION (client-side for now)
// ============================================================================

/**
 * Calculate current streak from recent weeks
 * A week counts if: completed (week ended) AND unique_count >= goal
 */
export function calculateStreak(weeks: WeekWithPlants[]): number {
  if (weeks.length === 0) return 0;

  let streak = 0;

  // Sort by week_start descending (most recent first)
  const sortedWeeks = [...weeks].sort((a, b) => b.week_start.localeCompare(a.week_start));

  // Count consecutive completed weeks from most recent
  for (const week of sortedWeeks) {
    // Only count if week has ended
    if (!isWeekCompleted(week.week_end)) continue;

    if (week.completed) {
      streak++;
    } else {
      break; // Streak broken
    }
  }

  return streak;
}
