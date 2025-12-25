/**
 * Utility functions shared across apps
 */

// ============================================================================
// DATE & WEEK UTILITIES
// ============================================================================

/**
 * Get the start of the ISO week (Monday) for a given date in a timezone
 * @param timezone - IANA timezone string (e.g., 'Europe/Berlin', 'America/New_York')
 * @param date - Date to calculate from (defaults to now)
 * @returns ISO date string (YYYY-MM-DD) for Monday of the week
 */
export function getWeekStartDate(timezone: string = 'UTC', date: Date = new Date()): string {
  // Convert to target timezone
  const dateStr = date.toLocaleString('en-US', { timeZone: timezone });
  const localDate = new Date(dateStr);

  // Get day of week (0 = Sunday, 1 = Monday, ...)
  const day = localDate.getDay();

  // Calculate days to subtract to get to Monday
  const diff = day === 0 ? -6 : 1 - day;

  // Get Monday
  const monday = new Date(localDate);
  monday.setDate(localDate.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  return formatDateISO(monday);
}

/**
 * Get the end of the ISO week (Sunday) for a given week start
 * @param weekStart - ISO date string (YYYY-MM-DD) of Monday
 * @returns ISO date string (YYYY-MM-DD) for Sunday of the week
 */
export function getWeekEndDate(weekStart: string): string {
  const monday = new Date(weekStart + 'T00:00:00Z');
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return formatDateISO(sunday);
}

/**
 * Format a Date to ISO date string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: string | Date, locale: string = 'de-DE'): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a week range for display (e.g., "20. - 26. Jan 2025")
 */
export function formatWeekRange(weekStart: string, locale: string = 'de-DE'): string {
  const start = new Date(weekStart + 'T00:00:00');
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const startDay = start.toLocaleDateString(locale, { day: 'numeric' });
  const endDay = end.toLocaleDateString(locale, { day: 'numeric' });
  const month = end.toLocaleDateString(locale, { month: 'short' });
  const year = end.getFullYear();

  return `${startDay}. - ${endDay}. ${month} ${year}`;
}

/**
 * Check if a week is the current week
 */
export function isCurrentWeek(weekStart: string, timezone: string = 'UTC'): boolean {
  return weekStart === getWeekStartDate(timezone);
}

/**
 * Check if a week is completed (ended)
 */
export function isWeekCompleted(weekEnd: string, timezone: string = 'UTC'): boolean {
  const now = new Date();
  const nowStr = now.toLocaleString('en-US', { timeZone: timezone });
  const today = formatDateISO(new Date(nowStr));
  return today > weekEnd;
}

// ============================================================================
// CALCULATION UTILITIES
// ============================================================================

/**
 * Calculate weekly progress percentage
 */
export function calculateProgress(uniquePlants: number, goal: number = 30): number {
  return Math.min(Math.round((uniquePlants / goal) * 100), 100);
}

/**
 * Calculate plants left to reach goal
 */
export function calculatePlantsLeft(uniquePlants: number, goal: number = 30): number {
  return Math.max(goal - uniquePlants, 0);
}

// ============================================================================
// TEXT UTILITIES
// ============================================================================

/**
 * Normalize text for search/comparison (lowercase, trim)
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
