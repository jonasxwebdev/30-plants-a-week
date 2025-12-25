# 30 Plants A Week - App

Dashboard app for tracking your weekly plant intake.

## 🔐 Supabase Authentication Setup

This app uses Supabase Auth with PKCE flow for secure authentication on both web and mobile (Capacitor).

### Setup Instructions

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Configure Auth Providers in Supabase**
   
   In your Supabase dashboard, go to **Authentication > Providers**:
   
   **Email Auth:**
   - Enable "Email" provider
   - Enable "Confirm email" (or disable for development)
   - For magic links: Enable "Secure email change" and "Secure password change"

   **Google OAuth:**
   - Enable "Google" provider
   - Add your OAuth credentials
   - Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

   **GitHub OAuth:**
   - Enable "GitHub" provider
   - Add your OAuth App credentials
   - Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

4. **Configure Redirect URLs**
   
   In Supabase dashboard, go to **Authentication > URL Configuration**:
   
   **Site URL:** (for production)
   ```
   https://app.domain.com
   ```
   
   **Redirect URLs:** (add all these)
   ```
   https://app.domain.com/auth/callback
   http://localhost:4321/auth/callback
   thirtyplants://auth/callback
   ```

5. **For Mobile (Capacitor) Setup**
   
   The app automatically detects Capacitor and uses the deep link:
   ```
   thirtyplants://auth/callback
   ```
   
   Make sure to configure this in your mobile app's `capacitor.config.json`:
   ```json
   {
     "appId": "com.thirtyplants.app",
     "appName": "30 Plants A Week",
     "bundledWebRuntime": false,
     "plugins": {
       "SplashScreen": {
         "launchShowDuration": 0
       }
     },
     "server": {
       "androidScheme": "https"
     }
   }
   ```

## 🚀 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── supabase.ts       # Supabase client configuration
│   ├── auth.ts           # Server-side auth utilities
│   └── authClient.ts     # Client-side auth manager
├── layouts/
│   └── MainLayout.astro  # Main app layout with navigation
├── pages/
│   ├── index.astro       # Dashboard (protected)
│   ├── history.astro     # History (protected)
│   ├── settings.astro    # Settings (protected)
│   ├── signin.astro      # Sign in page
│   └── auth/
│       ├── callback.astro  # OAuth callback handler
│       └── signout.astro   # Sign out handler
```

## 🔒 Authentication Flow

### PKCE Flow (Web & Mobile)

1. User clicks "Sign in with Google/GitHub" or submits magic link/password
2. Supabase redirects to provider (or sends email)
3. User authenticates with provider
4. Provider redirects to `/auth/callback?code=...`
5. App calls `exchangeCodeForSession(code)` to get tokens
6. Tokens are stored in httpOnly cookies
7. User is redirected to dashboard

### Protected Routes

All main pages (`/`, `/history`, `/settings`) are protected with the `requireAuth` guard:

```typescript
const { redirect, user } = await requireAuth(Astro.cookies);
if (redirect) {
  return Astro.redirect(redirect);
}
```

## 🎨 Features

- ✅ Email magic link authentication
- ✅ Email/password authentication
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ PKCE flow for mobile compatibility
- ✅ HttpOnly cookie session management
- ✅ Server-side auth guards
- ✅ Automatic session refresh
- ✅ Dark mode support
- ✅ Mobile-first responsive design

## 📱 Mobile (Capacitor) Notes

When running in Capacitor:
- Deep link: `thirtyplants://auth/callback`
- The app detects Capacitor via `window.Capacitor`
- Auth flow automatically uses the correct redirect URL
- Sessions persist in local storage

## 🔧 Troubleshooting

**Issue: "Invalid redirect URL"**
- Make sure your redirect URL is added in Supabase dashboard
- Check that the URL matches exactly (including protocol)

**Issue: "Failed to exchange code"**
- Verify your Supabase URL and anon key are correct
- Check that PKCE flow is enabled (it's the default in supabase-js v2)

**Issue: "Session not persisting"**
- Make sure cookies are enabled
- Check that `httpOnly` cookies are working in your environment
- In development, use `http://localhost` not `127.0.0.1`
