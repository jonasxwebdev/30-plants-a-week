<template>
  <motion.nav
    class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-100"
    :initial="{ y: -100 }"
    :animate="{ y: 0 }"
    :transition="{ duration: 0.5 }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <a href="#" class="text-xl font-serif font-bold text-primary flex items-center gap-2">
            <span class="text-2xl">🌿</span>
            30 Plants
          </a>
        </div>
        <div class="hidden md:flex items-center space-x-8">
          <a
            href="#science"
            class="text-text hover:text-primary transition-colors text-sm font-medium"
            >Science</a
          >
          <a
            href="#features"
            class="text-text hover:text-primary transition-colors text-sm font-medium"
            >Features</a
          >
          <a
            :href="loginUrl"
            class="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Open App
          </a>
        </div>
        <div class="md:hidden flex items-center">
          <a :href="loginUrl" class="text-primary font-medium text-sm"> Open App </a>
        </div>
      </div>
    </div>
  </motion.nav>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';
import { getLoginUrl } from '../../lib/config';

const loginUrl = getLoginUrl();
</script>
