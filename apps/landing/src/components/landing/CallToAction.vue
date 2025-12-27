<template>
  <section class="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
    <!-- Animated gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
      <div class="absolute inset-0 bg-grain opacity-10"></div>
      <div
        class="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"
      ></div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :viewport="{ once: true }"
        :transition="{ duration: 0.8 }"
      >
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 mb-6 sm:mb-8">
          <span
            class="inline-block py-1.5 px-4 sm:py-2 sm:px-5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold tracking-wide border border-white/30"
          >
            ✨ Werde Teil der Bewegung
          </span>
        </div>

        <!-- Heading -->
        <h2
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 sm:mb-6 leading-tight"
        >
          Bereit, deine Darmgesundheit zu verbessern?
        </h2>
        <p
          class="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Beginne heute, deine Pflanzenvielfalt zu tracken. Schließe dich tausenden an, die durch
          Vielfalt gesündere Gewohnheiten aufbauen.
        </p>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12"
        >
          <a
            :href="loginUrl"
            class="group w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-5 bg-white text-primary-600 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:bg-neutral-50 hover:-translate-y-1 hover:shadow-white/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Jetzt Starten
            <svg
              class="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
          <a
            href="#science"
            class="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-5 bg-transparent text-white border-2 border-white/40 backdrop-blur-sm rounded-full font-bold text-base sm:text-lg hover:bg-white/10 hover:border-white/60 hover:-translate-y-1 transition-all duration-300"
          >
            Die Wissenschaft Lernen
          </a>
        </div>

        <!-- Trust indicators -->
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80 text-sm"
        >
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
              />
            </svg>
            <span class="font-medium">Über 1.000 Aktive Nutzer</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="font-medium">100% Kostenlos</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="font-medium">Wissenschaftlich Fundiert</span>
          </div>
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

<style scoped>
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
