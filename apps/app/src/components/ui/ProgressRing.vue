<template>
  <div
    class="relative mx-auto flex items-center justify-center"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <!-- Background Circle -->
    <svg class="absolute inset-0 h-full w-full -rotate-90 transform">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        fill="none"
        class="text-gray-100"
      />
      <!-- Progress Circle -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        fill="none"
        stroke-linecap="round"
        class="text-primary transition-all duration-1000 ease-out"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>

    <!-- Center Content -->
    <div class="text-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    value: number;
    max: number;
    size?: number;
    strokeWidth?: number;
  }>(),
  {
    size: 256,
    strokeWidth: 24,
  }
);

const radius = computed(() => props.size / 2 - props.strokeWidth / 2 - 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const percentage = computed(() => Math.min(100, (props.value / props.max) * 100));
const dashOffset = computed(() => circumference.value * (1 - percentage.value / 100));
</script>
