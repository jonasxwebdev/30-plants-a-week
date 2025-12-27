<template>
  <div class="flex flex-col items-center justify-center" :class="containerClass">
    <div
      class="inline-block animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"
      :class="sizeClass"
    ></div>
    <p v-if="message" class="mt-4 text-sm text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    containerClass?: string;
  }>(),
  {
    size: 'md',
    containerClass: 'py-12',
  }
);

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-5 w-5';
    case 'lg':
      return 'h-12 w-12';
    default:
      return 'h-8 w-8';
  }
});
</script>
