import type { AstroCookies } from 'astro';
import { createServerClient } from './supabase';

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}

/**
 * Get the current authenticated user from cookies/session
 * Use this in Astro pages and API routes
 */
export async function getUser(cookies: AstroCookies, headers: Headers): Promise<AuthUser | null> {
  const supabase = createServerClient(cookies, headers);

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Require authentication - redirect to signin if not authenticated
 * Use this in protected pages
 */
export async function requireAuth(cookies: AstroCookies, headers: Headers, redirectTo?: string) {
  const user = await getUser(cookies, headers);

  if (!user) {
    const redirect = redirectTo || '/signin';
    return {
      redirect,
      user: null,
    };
  }

  return {
    redirect: null,
    user,
  };
}
