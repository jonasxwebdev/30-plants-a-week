/**
 * Friends API Functions
 * Handles friend requests, friendships, and stats comparison
 */

import type { FriendProfile, FriendRequest, FriendStats, Friendship } from '@repo/shared/types';

import { createBrowserClient } from './supabase';

// Create a browser client instance
let supabase: any = null;

function getClient() {
  if (!supabase) {
    supabase = createBrowserClient();
  }
  return supabase;
}

/**
 * Search for users by username
 */
export async function searchUsersByUsername(query: string) {
  const { data, error } = await getClient()
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .ilike('username', `%${query}%`)
    .not('username', 'is', null)
    .limit(10);

  if (error) {
    console.error('Error searching users:', error);
    return { data: null, error };
  }

  return { data: data as FriendProfile[], error: null };
}

/**
 * Send a friend request to a user by username
 */
export async function sendFriendRequest(friendUsername: string) {
  try {
    // Get friend's ID from username
    const { data: friend, error: friendError } = await getClient()
      .from('profiles')
      .select('id')
      .eq('username', friendUsername)
      .single();

    if (friendError || !friend) {
      return { data: null, error: friendError || new Error('User not found') };
    }

    // Get current user
    const {
      data: { user },
    } = await getClient().auth.getUser();
    if (!user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    // Check if friendship already exists
    const { data: existing } = await getClient()
      .from('friendships')
      .select('id, status')
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${friend.id}),and(user_id.eq.${friend.id},friend_id.eq.${user.id})`
      )
      .single();

    if (existing) {
      return {
        data: null,
        error: new Error(`Friendship already ${existing.status}`),
      };
    }

    // Create friendship request
    const { data, error } = await getClient()
      .from('friendships')
      .insert({
        user_id: user.id,
        friend_id: friend.id,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending friend request:', error);
      return { data: null, error };
    }

    return { data: data as Friendship, error: null };
  } catch (err) {
    console.error('Error in sendFriendRequest:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Accept a friend request
 */
export async function acceptFriendRequest(friendshipId: string) {
  const { data, error } = await getClient()
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId)
    .select()
    .single();

  if (error) {
    console.error('Error accepting friend request:', error);
    return { data: null, error };
  }

  return { data: data as Friendship, error: null };
}

/**
 * Reject a friend request
 */
export async function rejectFriendRequest(friendshipId: string) {
  const { data, error } = await getClient()
    .from('friendships')
    .update({ status: 'rejected' })
    .eq('id', friendshipId)
    .select()
    .single();

  if (error) {
    console.error('Error rejecting friend request:', error);
    return { data: null, error };
  }

  return { data: data as Friendship, error: null };
}

/**
 * Get all accepted friends for the current user
 */
export async function getFriends() {
  try {
    const {
      data: { user },
    } = await getClient().auth.getUser();
    if (!user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    // Get friendships where user is either the requester or the recipient
    const { data, error } = await getClient()
      .from('friendships')
      .select(
        `
        id,
        user_id,
        friend_id,
        created_at,
        status
      `
      )
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error getting friends:', error);
      return { data: null, error };
    }

    // Get friend profiles
    const friendIds = data.map((f) => (f.user_id === user.id ? f.friend_id : f.user_id));

    if (friendIds.length === 0) {
      return { data: [], error: null };
    }

    const { data: profiles, error: profilesError } = await getClient()
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', friendIds);

    if (profilesError) {
      console.error('Error getting friend profiles:', profilesError);
      return { data: null, error: profilesError };
    }

    return { data: profiles as FriendProfile[], error: null };
  } catch (err) {
    console.error('Error in getFriends:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Get pending friend requests for the current user (where they are the recipient)
 */
export async function getPendingRequests() {
  try {
    const {
      data: { user },
    } = await getClient().auth.getUser();
    if (!user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    const { data, error } = await getClient()
      .from('friendships')
      .select(
        `
        id,
        user_id,
        created_at
      `
      )
      .eq('friend_id', user.id)
      .eq('status', 'pending');

    if (error) {
      console.error('Error getting pending requests:', error);
      return { data: null, error };
    }

    if (data.length === 0) {
      return { data: [], error: null };
    }

    // Get profiles of users who sent requests
    const userIds = data.map((r) => r.user_id);
    const { data: profiles, error: profilesError } = await getClient()
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error getting requester profiles:', profilesError);
      return { data: null, error: profilesError };
    }

    // Map to FriendRequest format
    const requests: FriendRequest[] = data.map((req) => {
      const profile = profiles.find((p) => p.id === req.user_id);
      return {
        id: req.id,
        from_user: {
          id: req.user_id,
          username: profile?.username || '',
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
        },
        created_at: req.created_at,
      };
    });

    return { data: requests, error: null };
  } catch (err) {
    console.error('Error in getPendingRequests:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Get stats for a list of friends
 */
export async function getFriendStats(friendIds: string[]) {
  if (friendIds.length === 0) {
    return { data: [], error: null };
  }

  const { data, error } = await getClient()
    .from('friend_stats')
    .select('*')
    .in('user_id', friendIds);

  if (error) {
    console.error('Error getting friend stats:', error);
    return { data: null, error };
  }

  return { data: data as FriendStats[], error: null };
}

/**
 * Remove a friend (delete the friendship)
 */
export async function removeFriend(friendshipId: string) {
  const { error } = await getClient().from('friendships').delete().eq('id', friendshipId);

  if (error) {
    console.error('Error removing friend:', error);
    return { error };
  }

  return { error: null };
}

/**
 * Get friendship ID between current user and a friend
 */
export async function getFriendshipId(friendId: string) {
  const {
    data: { user },
  } = await getClient().auth.getUser();
  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data, error } = await getClient()
    .from('friendships')
    .select('id')
    .or(
      `and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`
    )
    .eq('status', 'accepted')
    .single();

  if (error) {
    console.error('Error getting friendship ID:', error);
    return { data: null, error };
  }

  return { data: data.id, error: null };
}

/**
 * Block a user
 */
export async function blockUser(friendshipId: string) {
  const { data, error } = await getClient()
    .from('friendships')
    .update({ status: 'blocked' })
    .eq('id', friendshipId)
    .select()
    .single();

  if (error) {
    console.error('Error blocking user:', error);
    return { data: null, error };
  }

  return { data: data as Friendship, error: null };
}
