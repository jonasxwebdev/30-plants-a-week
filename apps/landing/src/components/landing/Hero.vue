<template>
  <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-3xl mx-auto">
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
        >
          <span
            class="inline-block py-1 px-3 rounded-full bg-orange-100 text-secondary text-xs font-bold tracking-wide uppercase mb-6"
          >
            Simple Nutrition Goal
          </span>
          <h1
            class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-6 leading-tight"
          >
            Eat <span class="text-primary">30 different plants</span> a week.
          </h1>
          <p class="text-lg sm:text-xl text-text-muted mb-10 leading-relaxed">
            A simple weekly goal to build variety—track your plants, discover gaps, and stay
            consistent for a healthier gut.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              :href="loginUrl"
              class="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
            >
              Start Tracking
            </a>
            <a
              href="#science"
              class="w-full sm:w-auto px-8 py-4 bg-white text-text border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-primary/30 hover:bg-gray-50 transition-all duration-300"
            >
              Learn the Science
            </a>
          </div>
        </motion.div>
      </div>
    </div>

    <!-- Decorative background elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div
        class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-100/50 rounded-full blur-3xl opacity-60"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-3xl opacity-60"
      ></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';
import { getLoginUrl } from '../../lib/config';

const loginUrl = getLoginUrl();
</script>
