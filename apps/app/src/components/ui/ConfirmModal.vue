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
        :initial="{ opacity: 0, y: 100, scale: 0.9 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, y: 100, scale: 0.9 }"
        @click.stop
      >
        <!-- Icon -->
        <div class="flex justify-center mb-4">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center"
            :class="variant === 'danger' ? 'bg-red-100' : 'bg-orange-100'"
          >
            <span class="text-3xl">{{ variant === 'danger' ? '⚠️' : '❓' }}</span>
          </div>
        </div>

        <!-- Title -->
        <h2 class="text-xl font-bold text-center text-text mb-2">{{ title }}</h2>

        <!-- Message -->
        <p class="text-sm text-gray-600 text-center mb-6">{{ message }}</p>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="handleCancel"
            class="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            class="flex-1 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors"
            :class="
              variant === 'danger'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-orange-500 hover:bg-orange-600'
            "
          >
            {{ confirmText }}
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';

const props = withDefaults(
  defineProps<{
    show: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning';
    closeOnBackdrop?: boolean;
  }>(),
  {
    confirmText: 'Bestätigen',
    cancelText: 'Abbrechen',
    variant: 'warning',
    closeOnBackdrop: true,
  }
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  emit('cancel');
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    handleCancel();
  }
}
</script>
