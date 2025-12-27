<template>
  <section
    class="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex items-center"
  >
    <!-- Animated Background -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50"></div>
      <div
        class="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
      ></div>
      <div
        class="absolute top-1/3 -right-1/4 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute -bottom-1/4 left-1/2 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-4xl mx-auto">
        <motion.div
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
        >
          <div class="inline-flex items-center gap-2 mb-6 sm:mb-8">
            <span
              class="inline-block py-1.5 px-3 sm:py-2 sm:px-4 rounded-full bg-primary-100 text-primary-700 text-xs sm:text-sm font-semibold tracking-wide border border-primary-200"
            >
              🌱 Wissenschaftlich Fundiert
            </span>
          </div>
          <h1
            class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-neutral-900 mb-4 sm:mb-6 leading-[1.15] sm:leading-[1.1] tracking-tight"
          >
            Iss
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700"
              >30 verschiedene Pflanzen</span
            >
            jede Woche
          </h1>
          <p
            class="text-base sm:text-xl md:text-2xl text-neutral-600 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto font-light"
          >
            Verbessere deine Darmgesundheit durch pflanzliche Vielfalt. Verfolge deinen Fortschritt,
            entwickle nachhaltige Gewohnheiten und entdecke die Wissenschaft hinter
            Pflanzenvielfalt.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              :href="loginUrl"
              class="group w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-semibold text-base sm:text-lg shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Jetzt Kostenlos Starten
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
              class="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-5 bg-white text-neutral-700 border-2 border-neutral-200 rounded-full font-semibold text-base sm:text-lg hover:border-primary-300 hover:bg-neutral-50 hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              Die Wissenschaft Entdecken
            </a>
          </div>

          <!-- Social Proof -->
          <div
            class="mt-10 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-neutral-600"
          >
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white"
                ></div>
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 border-2 border-white"
                ></div>
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 border-2 border-white"
                ></div>
              </div>
              <span class="font-medium">Über 1.000 aktive Nutzer</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <span class="font-medium">Wissenschaftlich Belegt</span>
            </div>
          </div>
        </motion.div>
      </div>
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

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
