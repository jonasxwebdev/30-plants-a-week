/**
 * Friends API Functions
 * Handles friend requests, friendships, and stats comparison
 */

import type { FriendProfile, FriendRequest, FriendStats, Friendship } from '@repo/shared';

import { getBrowserClient } from './supabase';

// Create a browser client instance
let supabase: any = null;

function getClient() {
  if (!supabase) {
    supabase = getBrowserClient();
  }
  return supabase;
}

/**
 * Search for users by username with friendship status
 */
export async function searchUsersByUsername(query: string) {
  // Get current user
  const {
    data: { user },
  } = await getClient().auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const queryBuilder = getClient()
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .ilike('username', `%${query}%`)
    .not('username', 'is', null)
    .limit(10);

  // Exclude current user from results
  queryBuilder.neq('id', user.id);

  const { data: profiles, error } = await queryBuilder;

  if (error) {
    console.error('Error searching users:', error);
    return { data: null, error };
  }

  if (!profiles || profiles.length === 0) {
    return { data: [], error: null };
  }

  // Get friendship status for each user (checking both directions)
  const userIds = profiles.map((p: any) => p.id);
  const { data: friendships } = await getClient()
    .from('friendships')
    .select('user_id, friend_id, status')
    .or(
      `and(user_id.eq.${user.id},friend_id.in.(${userIds.join(',')})),and(friend_id.eq.${user.id},user_id.in.(${userIds.join(',')}))`
    );

  // Add friendship status to profiles
  const profilesWithStatus = profiles.map((profile: any) => {
    const friendship = friendships?.find(
      (f: any) =>
        (f.user_id === user.id && f.friend_id === profile.id) ||
        (f.friend_id === user.id && f.user_id === profile.id)
    );

    return {
      ...profile,
      friendshipStatus: friendship?.status || null,
      isRequester: friendship?.user_id === user.id,
    };
  });

  return { data: profilesWithStatus, error: null };
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

    // Check if friendship already exists in either direction
    const { data: existing } = await getClient()
      .from('friendships')
      .select('id, status, user_id, friend_id')
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${friend.id}),and(user_id.eq.${friend.id},friend_id.eq.${user.id})`
      )
      .maybeSingle();

    if (existing) {
      // Determine who is the requester
      const isCurrentUserRequester = existing.user_id === user.id;
      const statusMessage =
        existing.status === 'pending'
          ? isCurrentUserRequester
            ? 'You already sent a friend request to this user'
            : 'This user already sent you a friend request'
          : `Friendship already ${existing.status}`;

      return {
        data: null,
        error: new Error(statusMessage),
      };
    }

    // Create friendship request
    // The database trigger will prevent duplicates
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
      // Handle duplicate friendship error from trigger
      if (error.message?.includes('friendship already exists')) {
        return { data: null, error: new Error('Friendship already exists') };
      }
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
    const friendIds = data.map((f: any) => (f.user_id === user.id ? f.friend_id : f.user_id));

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

    console.log('Current user ID:', user.id);

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

    console.log('Pending friendships found (where I am friend_id):', data);

    if (data.length === 0) {
      return { data: [], error: null };
    }

    // Get profiles of users who sent requests
    const userIds = data.map((r: any) => r.user_id);
    const { data: profiles, error: profilesError } = await getClient()
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error getting requester profiles:', profilesError);
      return { data: null, error: profilesError };
    }

    console.log('Profiles found:', profiles);

    // Map to FriendRequest format
    const requests: FriendRequest[] = data.map((req: any) => {
      const profile = profiles.find((p: any) => p.id === req.user_id);
      return {
        id: req.id,
        from_user: {
          id: req.user_id,
          username: profile?.username || 'unknown',
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
        },
        created_at: req.created_at,
      };
    });

    console.log('Mapped requests:', requests);

    return { data: requests, error: null };
  } catch (err) {
    console.error('Error in getPendingRequests:', err);
    return { data: null, error: err as Error };
  }
}

/**
 * Get sent friend requests that are still pending (where current user is the sender)
 */
export async function getSentRequests() {
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
        friend_id,
        created_at
      `
      )
      .eq('user_id', user.id)
      .eq('status', 'pending');

    if (error) {
      console.error('Error getting sent requests:', error);
      return { data: null, error };
    }

    console.log('Sent pending requests:', data);

    if (!data || data.length === 0) {
      return { data: [], error: null };
    }

    // Get profiles of users to whom requests were sent
    const friendIds = data.map((r: any) => r.friend_id);
    const { data: profiles, error: profilesError } = await getClient()
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', friendIds);

    if (profilesError) {
      console.error('Error getting recipient profiles:', profilesError);
      return { data: null, error: profilesError };
    }

    console.log('Profiles found:', profiles);

    // Map to FriendRequest format
    const requests: FriendRequest[] = data.map((req: any) => {
      const profile = profiles?.find((p: any) => p.id === req.friend_id);
      return {
        id: req.id,
        from_user: {
          id: req.friend_id,
          username: profile?.username || 'unknown',
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
        },
        created_at: req.created_at,
      };
    });

    return { data: requests, error: null };
  } catch (err) {
    console.error('Error in getSentRequests:', err);
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
 * Cancel a sent friend request (delete the pending request)
 */
export async function cancelSentRequest(requestId: string) {
  const { error } = await getClient().from('friendships').delete().eq('id', requestId);

  if (error) {
    console.error('Error canceling request:', error);
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

  // Check in both directions
  const { data, error } = await getClient()
    .from('friendships')
    .select('id')
    .or(
      `and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`
    )
    .eq('status', 'accepted')
    .maybeSingle();

  if (error) {
    console.error('Error getting friendship ID:', error);
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error: new Error('Friendship not found') };
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
