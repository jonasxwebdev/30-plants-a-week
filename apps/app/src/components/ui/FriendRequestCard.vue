<template>
  <motion.div
    class="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-100"
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ delay: index * 0.05 }"
  >
    <div class="flex items-center gap-3">
      <UserAvatar
        :avatar-url="fromUser.avatar_url"
        :username="fromUser.username"
        :name="fromUser.full_name"
        size="md"
      />
      <div>
        <p class="font-semibold text-text">@{{ fromUser.username }}</p>
        <p class="text-xs text-gray-500">{{ fromUser.full_name || 'Kein Name' }}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <motion.button
        @click="$emit('accept')"
        class="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
        :whileTap="{ scale: 0.9 }"
        aria-label="Annehmen"
      >
        ✓
      </motion.button>
      <motion.button
        @click="$emit('reject')"
        class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        :whileTap="{ scale: 0.9 }"
        aria-label="Ablehnen"
      >
        ✕
      </motion.button>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';
import UserAvatar from './UserAvatar.vue';

defineProps<{
  fromUser: {
    username: string;
    full_name?: string | null;
    avatar_url?: string | null;
  };
  index?: number;
}>();

defineEmits<{
  accept: [];
  reject: [];
}>();
</script>
