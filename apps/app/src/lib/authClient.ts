import { createBrowserClient, getRedirectUrl } from '../lib/supabase';

import type { Provider } from '@supabase/supabase-js';

class AuthManager {
  private supabase: any = null;

  private getClient() {
    if (!this.supabase) {
      this.supabase = createBrowserClient();
    }
    return this.supabase;
  }

  /**
   * Sign in with email magic link
   */
  async signInWithMagicLink(email: string) {
    const redirectTo = getRedirectUrl('/auth/callback');

    const { data, error } = await this.getClient().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign in with email and password
   */
  async signInWithPassword(email: string, password: string) {
    const { data, error } = await this.getClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string) {
    const redirectTo = getRedirectUrl('/auth/callback');

    const { data, error } = await this.getClient().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign in with OAuth provider (Google, GitHub, etc.)
   */
  async signInWithProvider(provider: Provider) {
    const redirectTo = getRedirectUrl('/auth/callback');

    const { data, error } = await this.getClient().auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await this.getClient().auth.signOut();
    if (error) throw error;

    // Redirect to signout endpoint to clear cookies
    window.location.href = '/auth/signout';
  }

  /**
   * Get current session
   */
  async getSession() {
    const {
      data: { session },
      error,
    } = await this.getClient().auth.getSession();
    if (error) throw error;
    return session;
  }

  /**
   * Get current user
   */
  async getUser() {
    const {
      data: { user },
      error,
    } = await this.getClient().auth.getUser();
    if (error) throw error;
    return user;
  }

  /**
   * Get the Supabase client instance
   * Use this to access Supabase features beyond auth
   */
  getSupabaseClient() {
    return this.getClient();
  }
}

export const authManager = new AuthManager();
