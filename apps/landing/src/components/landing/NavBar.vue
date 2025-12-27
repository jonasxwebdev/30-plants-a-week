<template>
  <motion.nav
    class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 shadow-sm"
    :initial="{ y: -100 }"
    :animate="{ y: 0 }"
    :transition="{ duration: 0.6, ease: 'easeOut' }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 sm:h-20">
        <div class="flex items-center">
          <a href="#" class="flex items-center gap-2 sm:gap-3 group">
            <div
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow duration-300"
            >
              <span class="text-lg sm:text-xl">🌿</span>
            </div>
            <span class="font-serif text-xl sm:text-2xl font-normal text-neutral-900"
              >30 Plants</span
            >
          </a>
        </div>
        <div class="hidden md:flex items-center space-x-10">
          <a
            href="#science"
            class="text-neutral-600 hover:text-primary-600 transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-500 hover:after:w-full after:transition-all after:duration-300"
            >Die Wissenschaft</a
          >
          <a
            href="#features"
            class="text-neutral-600 hover:text-primary-600 transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-500 hover:after:w-full after:transition-all after:duration-300"
            >Funktionen</a
          >
          <a
            :href="loginUrl"
            class="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5"
          >
            Jetzt Starten
          </a>
        </div>
        <div class="md:hidden flex items-center">
          <a
            :href="loginUrl"
            class="text-primary-600 font-semibold text-xs sm:text-sm bg-primary-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-primary-100 transition-colors whitespace-nowrap"
          >
            Starten
          </a>
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
