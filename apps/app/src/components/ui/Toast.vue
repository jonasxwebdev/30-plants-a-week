<template>
  <AnimatePresence>
    <motion.div
      v-if="show"
      class="fixed top-4 left-4 right-4 z-50 flex items-center gap-3 rounded-xl p-4 shadow-lg"
      :class="type === 'success' ? 'bg-primary text-text' : 'bg-red-50 text-red-900'"
      :initial="{ opacity: 0, y: -20 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -20 }"
    >
      <span class="text-xl">{{ type === 'success' ? '🎉' : '⚠️' }}</span>
      <p class="font-medium">{{ message }}</p>
    </motion.div>
  </AnimatePresence>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';

defineProps<{
  show: boolean;
  message: string;
  type?: 'success' | 'error';
}>();
</script>
