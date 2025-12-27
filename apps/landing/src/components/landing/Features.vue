<template>
  <section id="features" class="py-20 bg-background relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-text mb-4">
          Everything you need to hit 30
        </h2>
        <p class="text-lg text-text-muted">
          Simple tools to help you track, visualize, and improve your dietary diversity.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <motion.div
          v-for="(feature, index) in features"
          :key="index"
          class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          :initial="{ opacity: 0, y: 20 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :viewport="{ once: true }"
          :transition="{ delay: index * 0.1, duration: 0.5 }"
        >
          <div
            class="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl mb-6"
          >
            {{ feature.icon }}
          </div>
          <h3 class="text-xl font-bold text-text mb-3">{{ feature.title }}</h3>
          <p class="text-text-muted leading-relaxed">{{ feature.desc }}</p>
        </motion.div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';

const features = [
  {
    icon: '📊',
    title: 'Weekly Tracker',
    desc: 'Easily log the plants you eat. The app automatically counts unique varieties towards your weekly goal.',
  },
  {
    icon: '🔥',
    title: 'Streak Tracking',
    desc: 'Build a habit by hitting your goal consistently. Watch your streak grow week after week.',
  },
  {
    icon: '💡',
    title: 'Smart Suggestions',
    desc: "Stuck at 25? Get intelligent suggestions for new plants to try based on what you haven't eaten yet.",
  },
  {
    icon: '🥗',
    title: 'Recipe Ideas',
    desc: 'Discover plant-forward recipes that pack multiple plant points into a single meal.',
  },
  {
    icon: '📈',
    title: 'Diversity Insights',
    desc: 'Visualize your intake across categories like legumes, nuts, seeds, vegetables, and fruits.',
  },
  {
    icon: '👥',
    title: 'Social Motivation',
    desc: 'Connect with friends, share your progress, and stay motivated together.',
  },
];
</script>
