<template>
  <div class="space-y-8 pb-24">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-text">Freunde</h1>
        <p class="text-sm text-gray-500">Vergleiche deinen Fortschritt</p>
      </div>
      <button
        @click="showAddFriend = true"
        class="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
      >
        + Hinzufügen
      </button>
    </div>

    <!-- Friend Requests -->
    <div v-if="pendingRequests.length > 0" class="space-y-3">
      <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Anfragen ({{ pendingRequests.length }})
      </h2>
      <AnimatePresence>
        <FriendRequestCard
          v-for="(request, index) in pendingRequests"
          :key="request.id"
          :from-user="request.from_user"
          :index="index"
          @accept="handleAcceptRequest(request.id)"
          @reject="handleRejectRequest(request.id)"
        />
      </AnimatePresence>
    </div>

    <!-- Friends List with Stats -->
    <div class="space-y-3">
      <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Meine Freunde {{ friendsWithStats.length > 0 ? `(${friendsWithStats.length})` : '' }}
      </h2>

      <LoadingSpinner v-if="isLoading" message="Laden..." />

      <EmptyState
        v-else-if="friendsWithStats.length === 0 && pendingRequests.length === 0"
        title="Noch keine Freunde"
        description="Füge Freunde hinzu, um eure Fortschritte zu vergleichen!"
      >
        <template #action>
          <button
            @click="showAddFriend = true"
            class="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Ersten Freund hinzufügen
          </button>
        </template>
      </EmptyState>

      <AnimatePresence v-else>
        <FriendStatsCard
          v-for="(friend, index) in friendsWithStats"
          :key="friend.user_id"
          :friend="friend"
          :index="index"
          @remove="handleRemoveFriend(friend.user_id)"
        />
      </AnimatePresence>
    </div>

    <!-- Add Friend Modal -->
    <Modal :show="showAddFriend" @close="closeAddFriendModal">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-text">Freund hinzufügen</h2>
        <button
          @click="closeAddFriendModal"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="relative mb-4">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Benutzername suchen..."
          class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-10 focus:border-primary focus:outline-none transition-colors"
          autofocus
        />
        <svg
          class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      <div class="space-y-2 max-h-80 overflow-y-auto">
        <p
          v-if="searchQuery && searchQuery.length < 2"
          class="text-center text-sm text-gray-500 py-4"
        >
          Mindestens 2 Zeichen eingeben...
        </p>

        <p v-else-if="isSearching" class="text-center text-sm text-gray-500 py-4">Suche...</p>

        <p
          v-else-if="searchQuery && searchResults.length === 0"
          class="text-center text-sm text-gray-500 py-4"
        >
          Keine Benutzer gefunden
        </p>

        <motion.div
          v-for="(user, index) in searchResults"
          :key="user.id"
          class="flex items-center justify-between rounded-xl border-2 border-gray-100 p-3 hover:border-primary/30 transition-colors"
          :initial="{ opacity: 0, x: -20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ delay: index * 0.05 }"
        >
          <div class="flex items-center gap-3">
            <UserAvatar
              :avatar-url="user.avatar_url"
              :username="user.username"
              :name="user.full_name"
              size="md"
            />
            <div>
              <p class="font-semibold text-text">@{{ user.username }}</p>
              <p class="text-xs text-gray-500">{{ user.full_name || 'Kein Name' }}</p>
            </div>
          </div>
          <motion.button
            @click="handleSendRequest(user.username)"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            :whileTap="{ scale: 0.95 }"
            :disabled="requestSent[user.id]"
          >
            {{ requestSent[user.id] ? '✓ Gesendet' : 'Anfragen' }}
          </motion.button>
        </motion.div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { motion, AnimatePresence } from 'motion-v';
import {
  getFriends,
  getPendingRequests,
  getFriendStats,
  searchUsersByUsername,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendshipId,
  removeFriend,
} from '../lib/friends';
import type { FriendProfile, FriendStats, FriendRequest } from '@repo/shared/types';
import LoadingSpinner from './ui/LoadingSpinner.vue';
import EmptyState from './ui/EmptyState.vue';
import FriendStatsCard from './ui/FriendStatsCard.vue';
import FriendRequestCard from './ui/FriendRequestCard.vue';
import Modal from './ui/Modal.vue';
import UserAvatar from './ui/UserAvatar.vue';

const friends = ref<FriendProfile[]>([]);
const friendsWithStats = ref<FriendStats[]>([]);
const pendingRequests = ref<FriendRequest[]>([]);
const isLoading = ref(true);
const showAddFriend = ref(false);
const searchQuery = ref('');
const searchResults = ref<FriendProfile[]>([]);
const isSearching = ref(false);
const requestSent = ref<Record<string, boolean>>({});

let searchTimeout: NodeJS.Timeout | null = null;

async function loadData() {
  isLoading.value = true;

  try {
    // Load friends
    const { data: friendsData } = await getFriends();
    friends.value = friendsData || [];

    // Load friend stats
    const friendIds = friends.value.map((f) => f.id);
    if (friendIds.length > 0) {
      const { data: statsData } = await getFriendStats(friendIds);
      friendsWithStats.value = statsData || [];
    } else {
      friendsWithStats.value = [];
    }

    // Load pending requests
    const { data: requestsData } = await getPendingRequests();
    pendingRequests.value = requestsData || [];
  } catch (error) {
    console.error('Error loading friends data:', error);
  } finally {
    isLoading.value = false;
  }
}

async function handleSearch() {
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  // Debounce search
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(async () => {
    isSearching.value = true;
    try {
      const { data } = await searchUsersByUsername(searchQuery.value);
      searchResults.value = data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  }, 300);
}

async function handleSendRequest(username: string) {
  const user = searchResults.value.find((u) => u.username === username);
  if (!user) return;

  const { error } = await sendFriendRequest(username);

  if (!error) {
    requestSent.value[user.id] = true;
    setTimeout(() => {
      closeAddFriendModal();
    }, 1000);
  } else {
    alert(error.message || 'Fehler beim Senden der Anfrage');
  }
}

async function handleAcceptRequest(requestId: string) {
  const { error } = await acceptFriendRequest(requestId);

  if (!error) {
    await loadData();
  } else {
    alert('Fehler beim Annehmen der Anfrage');
  }
}

async function handleRejectRequest(requestId: string) {
  const { error } = await rejectFriendRequest(requestId);

  if (!error) {
    await loadData();
  } else {
    alert('Fehler beim Ablehnen der Anfrage');
  }
}

async function handleRemoveFriend(friendId: string) {
  if (!confirm('Möchtest du diesen Freund wirklich entfernen?')) {
    return;
  }

  const { data: friendshipId } = await getFriendshipId(friendId);

  if (friendshipId) {
    const { error } = await removeFriend(friendshipId);

    if (!error) {
      await loadData();
    } else {
      alert('Fehler beim Entfernen des Freundes');
    }
  }
}

function closeAddFriendModal() {
  showAddFriend.value = false;
  searchQuery.value = '';
  searchResults.value = [];
  requestSent.value = {};
}

onMounted(() => {
  loadData();
});
</script>
