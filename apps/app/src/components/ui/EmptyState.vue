<template>
  <div
    class="flex flex-col items-center justify-center rounded-3xl bg-gray-50 py-12 text-center"
    :class="containerClass"
  >
    <div class="mb-4 text-4xl opacity-50" v-if="icon || $slots.icon">
      <slot name="icon">{{ icon }}</slot>
    </div>
    <h3 class="text-lg font-medium text-text mb-2" v-if="title || $slots.title">
      <slot name="title">{{ title }}</slot>
    </h3>
    <p
      class="text-sm text-gray-500 mb-6"
      :class="descriptionClass"
      v-if="description || $slots.description"
    >
      <slot name="description">{{ description }}</slot>
    </p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    title?: string;
    description?: string;
    containerClass?: string;
    descriptionClass?: string;
  }>(),
  {
    containerClass: '',
    descriptionClass: 'max-w-xs',
  }
);
</script>
