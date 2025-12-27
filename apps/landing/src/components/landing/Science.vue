<template>
  <section id="science" class="py-20 bg-white relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          :initial="{ opacity: 0, x: -20 }"
          :whileInView="{ opacity: 1, x: 0 }"
          :viewport="{ once: true }"
          :transition="{ duration: 0.6 }"
        >
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-text mb-6">Why 30 Plants?</h2>
          <p class="text-lg text-text-muted mb-8 leading-relaxed">
            Research suggests that people who eat at least 30 different types of plants per week
            have more diverse gut microbiomes than those who eat 10 or fewer.
          </p>

          <ul class="space-y-6">
            <li v-for="(point, index) in points" :key="index" class="flex gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-secondary font-bold"
              >
                {{ index + 1 }}
              </div>
              <div>
                <h3 class="font-bold text-text mb-1">{{ point.title }}</h3>
                <p class="text-text-muted">{{ point.desc }}</p>
              </div>
            </li>
          </ul>

          <div class="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p class="text-xs text-gray-500 italic">
              Note: This is for educational purposes and tracking dietary variety, not medical
              advice.
            </p>
          </div>
        </motion.div>

        <motion.div
          class="relative"
          :initial="{ opacity: 0, scale: 0.9 }"
          :whileInView="{ opacity: 1, scale: 1 }"
          :viewport="{ once: true }"
          :transition="{ duration: 0.6, delay: 0.2 }"
        >
          <div
            class="aspect-square rounded-3xl bg-gradient-to-br from-green-50 to-orange-50 p-8 flex items-center justify-center relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-grain opacity-20"></div>
            <div class="grid grid-cols-2 gap-4 w-full max-w-md">
              <div
                class="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center text-center transform translate-y-8"
              >
                <span class="text-4xl mb-2">🥦</span>
                <span class="font-bold text-text">Fiber</span>
                <span class="text-xs text-gray-500">Fuel for gut bacteria</span>
              </div>
              <div
                class="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center text-center"
              >
                <span class="text-4xl mb-2">🫐</span>
                <span class="font-bold text-text">Polyphenols</span>
                <span class="text-xs text-gray-500">Antioxidant power</span>
              </div>
              <div
                class="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center text-center"
              >
                <span class="text-4xl mb-2">🥜</span>
                <span class="font-bold text-text">Diversity</span>
                <span class="text-xs text-gray-500">Resilient microbiome</span>
              </div>
              <div
                class="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center text-center transform translate-y-8"
              >
                <span class="text-4xl mb-2">🥑</span>
                <span class="font-bold text-text">Health</span>
                <span class="text-xs text-gray-500">Overall wellbeing</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';

const points = [
  {
    title: 'Diverse Fiber Sources',
    desc: 'Different plants contain different types of fiber and prebiotics that feed different gut bacteria.',
  },
  {
    title: 'Polyphenol Variety',
    desc: 'Colorful plants provide a wide range of antioxidants and protective compounds.',
  },
  {
    title: 'Diversity Over Perfection',
    desc: 'Focus on adding new foods rather than restricting what you eat.',
  },
];
</script>
