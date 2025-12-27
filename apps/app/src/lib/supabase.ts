import type { AstroCookies } from 'astro';
import { createBrowserClient } from '@supabase/ssr';
import { createServerClient as createServerClientSSR } from '@supabase/ssr';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Server-side client creator for Astro pages and API routes
// Uses @supabase/ssr for proper cookie handling
export function createServerClient(cookies: AstroCookies, headers: Headers) {
  return createServerClientSSR(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // Parse cookies from request headers since Astro's AstroCookies doesn't have getAll()
        const cookieHeader = headers.get('cookie');
        if (!cookieHeader) return [];

        return cookieHeader.split(';').map((cookie) => {
          const [name, ...valueParts] = cookie.trim().split('=');
          const value = valueParts.join('=');
          return { name, value: decodeURIComponent(value) };
        });
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options);
        });
      },
    },
  });
}

// Client-side supabase client for use in browser
// Uses @supabase/ssr for proper cookie handling
let browserClient: any = null;

export function getBrowserClient() {
  // Server-side rendering: return null or throw error
  // Browser client should only be used in browser context
  if (typeof window === 'undefined') {
    throw new Error('getBrowserClient should only be called in browser context');
  }

  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          const value = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1];
          return value ? decodeURIComponent(value) : null;
        },
        set(name: string, value: string, options: any) {
          let cookie = `${name}=${encodeURIComponent(value)}`;
          if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
          if (options?.path) cookie += `; path=${options.path}`;
          if (options?.secure) cookie += '; secure';
          if (options?.sameSite) cookie += `; samesite=${options.sameSite}`;
          document.cookie = cookie;
        },
        remove(name: string, options: any) {
          document.cookie = `${name}=; path=${options?.path || '/'}; max-age=0`;
        },
      },
    });

    console.log('[Supabase] Browser client created with SSR cookie support');
  }

  return browserClient;
}

// Helper to get redirect URL based on environment
export function getRedirectUrl(path: string = '/auth/callback'): string {
  // For Capacitor mobile apps
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    return `thirtyplants://auth/callback`;
  }

  // For web
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://app.domain.com';
  return `${baseUrl}${path}`;
}
