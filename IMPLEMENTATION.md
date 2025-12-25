# 30 Plants A Week - Setup Guide

## Features Implemented

### ✅ Dashboard (Current Week Fast Entry)

- **Weekly streak display** - Shows current consecutive completed weeks
- **Plants left counter** - Dynamic display of remaining plants to reach goal
- **Add plant with autocomplete** - Fuzzy search across plant names and aliases
- **Smart duplicate detection** - Prevents adding same plant twice in a week
- **Current week plants display** - Chips showing all plants added this week
- **Quick links** to history and settings

### ✅ Autocomplete (Global Plant DB)

- **Fuzzy search** with trigram indexes for performance
- **Normalized matching** - Case-insensitive, trimmed
- **Alias support** - Search by alternative names (e.g., "Möhre" → "Karotte")
- **Category filtering** - Plants categorized (vegetable, fruit, legume, etc.)
- **Emoji display** - Visual plant representation

### ✅ Weekly Streak

- **Current streak calculation** - Counts consecutive completed weeks
- **SQL function** - `get_current_streak(user_id)` for database-level calculation
- **Client-side calculation** - Also available in TypeScript for flexibility
- **Completion criteria** - Week counts if ended AND unique_plants >= goal

### ✅ Past Weeks View

- **Last 12 weeks display** - Scrollable history
- **Stats overview** - Streak, success rate, total plants
- **Filtering** - All weeks, completed, incomplete
- **Expandable details** - Click to see full plant list per week
- **Progress bars** - Visual representation of goal completion
- **Goal snapshot** - Historical accuracy (uses week.goal, not current profile goal)

### ✅ Settings: Custom Minimum

- **Weekly goal adjustment** - Range: 1-200 plants
- **Apply to current week** - Optional immediate effect
- **Default behavior** - New goal applies to next week
- **Notification settings** - Enable/disable daily reminders with time picker
- **Dark mode toggle** - Appearance customization
- **Account info** - Email and member since date

## Database Schema

### Tables

1. **plants** - Canonical plant names with emoji and category
2. **plant_aliases** - Alternative names for plants
3. **profiles** - Extended user data (goal, timezone, notifications)
4. **weeks** - Weekly tracking periods with goal snapshot
5. **week_plants** - Junction table (prevents duplicate plants per week)
6. **push_devices** - Device tokens for push notifications

### Key Features

- **RLS policies** - Row-level security on all tables
- **Unique constraints** - No duplicate plants in same week
- **Trigram indexes** - Fast fuzzy search (requires pg_trgm extension)
- **Automatic timestamps** - updated_at triggers
- **Profile auto-creation** - Trigger on auth.users insert

### Functions

- `get_current_week(user_id)` - Get/create current week for user
- `get_current_streak(user_id)` - Calculate consecutive completed weeks
- `normalize_text(text)` - Standardize text for matching

## Setup Instructions

### 1. Prerequisites

```bash
# Node.js 18+ and npm installed
node --version
npm --version
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API** and copy:
   - Project URL
   - Anon (public) key

### 4. Run Database Migrations

In Supabase Dashboard → **SQL Editor**, run migrations in order:

```sql
-- 1. Run: packages/shared/supabase/migrations/001_initial_schema.sql
-- 2. Run: packages/shared/supabase/migrations/002_streak_function.sql
-- 3. Run: packages/shared/supabase/migrations/003_search_indexes.sql
```

Or using Supabase CLI:

```bash
# Install CLI
npm install -g supabase

# Link project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 5. Configure Auth Providers

In Supabase Dashboard → **Authentication** → **Providers**:

1. **Email** - Enable email/password and magic links
2. **Google** (optional) - Add OAuth credentials
3. **GitHub** (optional) - Add OAuth credentials

### 6. Set Redirect URLs

In Supabase Dashboard → **Authentication** → **URL Configuration**:

Add redirect URLs:

```
http://localhost:4322/auth/callback
https://your-domain.com/auth/callback
thirtyplants://auth/callback  (for mobile)
```

### 7. Environment Variables

Create `apps/app/.env.local`:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App URL (for auth redirects)
VITE_APP_URL=http://localhost:4322
```

### 8. Run Development Server

```bash
# Run both landing and app
npm run dev

# Or run app only
npm run dev:app
```

Access at: **http://localhost:4322**

## Project Structure

```
├── apps/
│   ├── app/                    # Main dashboard app
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── index.astro       # Dashboard with add plant
│   │   │   │   ├── history.astro    # Past weeks view
│   │   │   │   ├── settings.astro   # Goal & preferences
│   │   │   │   └── signin.astro     # Authentication
│   │   │   ├── lib/
│   │   │   │   ├── db.ts            # Database queries
│   │   │   │   ├── auth.ts          # Server-side auth
│   │   │   │   └── supabase.ts      # Supabase client
│   │   │   └── layouts/
│   │   │       └── MainLayout.astro # App shell with nav
│   │   └── .env.local               # Environment variables
│   └── landing/                # Landing page
├── packages/
│   └── shared/                 # Shared utilities
│       ├── src/
│       │   ├── types/          # TypeScript types
│       │   └── utils/          # Date/week helpers
│       └── supabase/
│           └── migrations/     # SQL migrations
└── package.json
```

## Key Functions

### Database Queries (`apps/app/src/lib/db.ts`)

```typescript
// Week management
ensureCurrentWeek(supabase, userId); // Get/create current week
getWeek(supabase, userId, weekStart); // Get specific week
getRecentWeeks(supabase, userId, limit); // Get last N weeks

// Plant operations
listWeekPlants(supabase, weekId); // Get plants for week
addPlantToWeek(supabase, weekId, input); // Add plant (handles duplicates)
removePlantFromWeek(supabase, weekId, plantId); // Remove plant

// Search
searchPlants(supabase, query, limit); // Autocomplete search

// Settings
updateWeeklyGoal(supabase, userId, input); // Change goal
updateProfile(supabase, userId, updates); // Update preferences

// Streak
calculateStreak(weeks); // Client-side streak calculation
// Also available: get_current_streak(user_id) SQL function
```

### Utilities (`packages/shared/src/utils/index.ts`)

```typescript
// Week calculations
getWeekStartDate(timezone, date); // Get Monday of ISO week
getWeekEndDate(weekStart); // Get Sunday of week
formatWeekRange(weekStart, locale); // Format "20. - 26. Jan 2025"
isCurrentWeek(weekStart, timezone); // Check if week is current
isWeekCompleted(weekEnd, timezone); // Check if week has ended

// Progress
calculateProgress(uniquePlants, goal); // Percentage
calculatePlantsLeft(uniquePlants, goal); // Remaining count

// Text
normalizeText(text); // Lowercase, trim
```

## Implementation Details

### Week Start Calculation

- Uses ISO week (Monday-Sunday)
- Respects user timezone from `profiles.timezone`
- Function: `getWeekStartDate(timezone)` in shared/utils

### Duplicate Prevention

- Unique constraint: `UNIQUE(week_id, plant_id)` on week_plants
- Client-side check: `addPlantToWeek()` returns `{ success, error }`
- SQL error code 23505 → user-friendly message

### Autocomplete Strategy

1. User types 2+ characters
2. 300ms debounce delay
3. Search `plants.name` and `plant_aliases.alias` with `ILIKE '%query%'`
4. Trigram indexes (`gin_trgm_ops`) for performance
5. Return up to 10 results with match type (name/alias)

### Streak Calculation

1. Get completed weeks (week_end < today AND unique_count >= goal)
2. Count consecutive weeks from most recent backward
3. Break on first incomplete week
4. Available as SQL function: `SELECT get_current_streak(user_id)`

### Goal Changes

- **Default**: New goal applies to future weeks only
- **Apply to current week**: Optional checkbox updates `weeks.goal` for active week
- **Historical accuracy**: Past weeks always use their snapshot goal, never profile.weekly_goal

## Mobile Support (Capacitor)

The app uses **PKCE flow** for mobile compatibility:

```typescript
// apps/app/src/lib/supabase.ts
createBrowserClient({
  auth: {
    flowType: 'pkce', // Works with web + mobile
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
```

Redirect URL detection:

- Web: `http://localhost:4322/auth/callback`
- Mobile: `thirtyplants://auth/callback`

## Performance Optimizations

### Database

- Trigram indexes for fuzzy search
- Composite indexes for common queries
- RLS policies with explicit auth checks
- Connection pooling via Supabase

### Client

- Debounced autocomplete (300ms)
- Optimistic UI updates
- Lazy loading of plant details
- Minimal re-renders

## Troubleshooting

### "operator class 'gin_trgm_ops' does not exist"

Run this first in SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### "Cannot resolve @30-plants/shared"

Check package.json exports and npm workspaces setup. Run:

```bash
npm install
```

### Auth redirects not working

1. Check `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Verify redirect URLs in Supabase Dashboard match your domain
3. Clear browser cookies and try again

### Plants not loading

1. Check Supabase RLS policies are enabled
2. Verify initial plant data was inserted (001_initial_schema.sql)
3. Check browser console for errors

## Next Steps

### Recommended Enhancements

1. **CSV plant import** - Bulk add plants to database
2. **Weekly reports** - Email summary of completed weeks
3. **Social features** - Share progress with friends
4. **Recipe suggestions** - Based on logged plants
5. **Nutrition tracking** - Integrate macro/micro nutrients
6. **Photos** - Attach meal photos to plants
7. **Notes per plant** - Add preparation methods, recipes
8. **Plant categories** - Advanced filtering and stats
9. **Export data** - Download CSV of all weeks
10. **PWA support** - Offline functionality

### Mobile App

Deploy to iOS/Android using Capacitor:

```bash
cd apps/mobile
npm install
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios
```

## Support

For issues or questions:

- Check console for errors
- Verify Supabase RLS policies
- Ensure migrations ran successfully
- Test with sample data first

## License

MIT
