<template>
  <section class="py-20 bg-primary relative overflow-hidden">
    <div class="absolute inset-0 bg-grain opacity-10"></div>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <motion.div
        :initial="{ opacity: 0, scale: 0.95 }"
        :whileInView="{ opacity: 1, scale: 1 }"
        :viewport="{ once: true }"
        :transition="{ duration: 0.5 }"
      >
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
          Ready to hit 30?
        </h2>
        <p class="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Join thousands of others building a healthier gut through dietary diversity. It's free to
          get started.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            :href="loginUrl"
            class="w-full sm:w-auto px-8 py-4 bg-white text-primary rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300"
          >
            Start Your Journey
          </a>
          <a
            href="#science"
            class="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
          >
            Learn the Science
          </a>
        </div>
      </motion.div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';
import { getLoginUrl } from '../../lib/config';

const loginUrl = getLoginUrl();
</script>
