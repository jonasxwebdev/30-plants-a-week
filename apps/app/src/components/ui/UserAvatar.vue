<template>
  <img
    v-if="avatarUrl"
    :src="avatarUrl"
    :class="sizeClass"
    class="rounded-full object-cover border-2 border-gray-100"
    :alt="name || 'User avatar'"
  />
  <div
    v-else
    :class="[
      sizeClass,
      'flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold',
    ]"
  >
    {{ fallback }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  avatarUrl?: string | null;
  name?: string | null;
  username?: string | null;
  size?: 'sm' | 'md' | 'lg';
}>();

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-10 w-10 text-sm';
    case 'lg':
      return 'h-14 w-14 text-xl';
    default:
      return 'h-12 w-12 text-lg';
  }
});

const fallback = computed(() => {
  if (props.username) {
    return props.username.charAt(0).toUpperCase();
  }
  if (props.name) {
    return props.name.charAt(0).toUpperCase();
  }
  return '?';
});
</script>
