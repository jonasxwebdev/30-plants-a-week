<template>
  <AnimatePresence>
    <motion.div
      v-if="show"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="handleBackdropClick"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
    >
      <motion.div
        class="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl"
        :class="modalClass"
        :initial="{ opacity: 0, y: 100, scale: 0.9 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, y: 100, scale: 0.9 }"
        @click.stop
      >
        <!-- Header -->
        <div v-if="title || $slots.header" class="flex items-center justify-between mb-4">
          <slot name="header">
            <h2 class="text-xl font-bold text-text">{{ title }}</h2>
          </slot>
          <button
            v-if="showClose"
            @click="close"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            aria-label="Close"
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

        <!-- Content -->
        <slot />
      </motion.div>
    </motion.div>
  </AnimatePresence>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';

const props = withDefaults(
  defineProps<{
    show: boolean;
    title?: string;
    showClose?: boolean;
    closeOnBackdrop?: boolean;
    modalClass?: string;
  }>(),
  {
    showClose: true,
    closeOnBackdrop: true,
  }
);

const emit = defineEmits<{
  close: [];
}>();

function close() {
  emit('close');
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    close();
  }
}
</script>
