<template>
  <motion.div
    class="rounded-xl bg-white p-5 shadow-sm border border-gray-100"
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :exit="{ opacity: 0, scale: 0.95 }"
    :transition="{ delay: index * 0.05 }"
  >
    <!-- Friend Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <UserAvatar
          :avatar-url="friend.avatar_url"
          :username="friend.username"
          :name="friend.full_name"
          size="lg"
        />
        <div>
          <p class="font-bold text-text">{{ friend.full_name || 'Anonym' }}</p>
          <p class="text-xs text-gray-500">@{{ friend.username }}</p>
        </div>
      </div>

      <motion.button
        @click="$emit('remove')"
        class="p-2 text-gray-400 hover:text-red-500 transition-colors"
        :whileTap="{ scale: 0.9 }"
        aria-label="Freund entfernen"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </motion.button>
    </div>

    <!-- Stats Comparison Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- Current Week -->
      <div class="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-3 text-center">
        <p class="text-[10px] font-medium text-gray-600 uppercase tracking-wide mb-1">
          Diese Woche
        </p>
        <p class="text-2xl font-bold text-primary mb-0.5">{{ friend.current_week_count }}</p>
        <p class="text-xs text-gray-500">von {{ friend.current_week_goal }}</p>
        <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div
            class="bg-primary h-1.5 rounded-full transition-all duration-500"
            :style="{
              width: `${Math.min(100, (friend.current_week_count / friend.current_week_goal) * 100)}%`,
            }"
          ></div>
        </div>
      </div>

      <!-- Streak -->
      <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 text-center">
        <p class="text-[10px] font-medium text-gray-600 uppercase tracking-wide mb-1">Streak</p>
        <div class="flex items-center justify-center gap-1">
          <span class="text-2xl">🔥</span>
          <p class="text-2xl font-bold text-orange-600">{{ friend.current_streak }}</p>
        </div>
        <p class="text-xs text-gray-500 mt-0.5">
          {{ friend.current_streak === 1 ? 'Woche' : 'Wochen' }}
        </p>
      </div>

      <!-- Total Plants -->
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center">
        <p class="text-[10px] font-medium text-gray-600 uppercase tracking-wide mb-1">Gesamt</p>
        <p class="text-2xl font-bold text-green-600 mb-0.5">{{ friend.total_plants_logged }}</p>
        <p class="text-xs text-gray-500">Pflanzen</p>
        <p class="text-[10px] text-gray-400 mt-1">{{ friend.completed_weeks }} Wochen ✓</p>
      </div>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';
import UserAvatar from './UserAvatar.vue';
import type { FriendStats } from '@repo/shared/types';

defineProps<{
  friend: FriendStats;
  index?: number;
}>();

defineEmits<{
  remove: [];
}>();
</script>
