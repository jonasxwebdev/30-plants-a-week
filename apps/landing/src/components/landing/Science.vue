<template>
  <section id="science" class="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
    <!-- Subtle background pattern -->
    <div class="absolute inset-0 opacity-[0.03]">
      <div class="absolute inset-0 bg-grain"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <motion.div
          :initial="{ opacity: 0, x: -30 }"
          :whileInView="{ opacity: 1, x: 0 }"
          :viewport="{ once: true }"
          :transition="{ duration: 0.7, ease: 'easeOut' }"
        >
          <div class="mb-6">
            <span
              class="inline-block text-primary-600 font-semibold text-sm tracking-wide uppercase mb-4"
            >
              Die Wissenschaft
            </span>
            <h2
              class="text-3xl sm:text-4xl lg:text-5xl font-serif text-neutral-900 mb-4 sm:mb-6 leading-tight"
            >
              Warum 30 Verschiedene Pflanzen?
            </h2>
            <p class="text-base sm:text-lg lg:text-xl text-neutral-600 leading-relaxed">
              Forschung des American Gut Project zeigt, dass Menschen, die mindestens
              <strong class="text-neutral-900">30 verschiedene Pflanzen pro Woche</strong>
              essen, ein deutlich vielfältigeres Darmmikrobiom haben als jene, die 10 oder weniger
              essen.
            </p>
          </div>

          <div class="space-y-5 sm:space-y-6 mt-8 sm:mt-10">
            <div v-for="(point, index) in points" :key="index" class="group">
              <motion.div
                class="flex gap-5"
                :initial="{ opacity: 0, x: -20 }"
                :whileInView="{ opacity: 1, x: 0 }"
                :viewport="{ once: true }"
                :transition="{ duration: 0.5, delay: index * 0.1 }"
              >
                <div
                  class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold text-base sm:text-lg shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300"
                >
                  {{ point.icon }}
                </div>
                <div>
                  <h3 class="font-semibold text-neutral-900 mb-1.5 sm:mb-2 text-base sm:text-lg">
                    {{ point.title }}
                  </h3>
                  <p class="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    {{ point.desc }}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <div
            class="mt-8 sm:mt-10 p-4 sm:p-5 bg-amber-50 rounded-xl sm:rounded-2xl border border-amber-200"
          >
            <div class="flex gap-2 sm:gap-3">
              <span class="text-xl sm:text-2xl">💡</span>
              <p class="text-xs sm:text-sm text-amber-900 leading-relaxed">
                <strong>Wichtig:</strong> Diese App dient zu Bildungszwecken und zum Tracking der
                Ernährungsvielfalt. Konsultiere bei gesundheitlichen Fragen immer medizinisches
                Fachpersonal.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          class="relative hidden lg:block"
          :initial="{ opacity: 0, scale: 0.95 }"
          :whileInView="{ opacity: 1, scale: 1 }"
          :viewport="{ once: true }"
          :transition="{ duration: 0.7, delay: 0.2 }"
        >
          <div class="relative">
            <!-- Main visual card -->
            <div
              class="aspect-square rounded-3xl bg-gradient-to-br from-primary-100 via-primary-50 to-accent-100 p-8 flex items-center justify-center relative overflow-hidden shadow-2xl"
            >
              <div class="absolute inset-0 bg-grain opacity-20"></div>

              <!-- Grid of benefit cards -->
              <div class="grid grid-cols-2 gap-4 w-full max-w-md relative z-10">
                <div
                  v-for="(benefit, index) in benefits"
                  :key="index"
                  class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 hover:shadow-xl transition-all duration-300"
                  :class="index % 2 === 0 ? 'transform translate-y-4' : ''"
                >
                  <span class="text-5xl mb-3">{{ benefit.emoji }}</span>
                  <span class="font-bold text-neutral-900 text-sm mb-1">{{ benefit.title }}</span>
                  <span class="text-xs text-neutral-500">{{ benefit.subtitle }}</span>
                </div>
              </div>

              <!-- Decorative elements -->
              <div
                class="absolute top-4 right-4 w-20 h-20 bg-primary-200 rounded-full opacity-20 blur-2xl"
              ></div>
              <div
                class="absolute bottom-4 left-4 w-24 h-24 bg-accent-200 rounded-full opacity-20 blur-2xl"
              ></div>
            </div>

            <!-- Floating stat badge -->
            <div
              class="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border-2 border-primary-100"
            >
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600">30+</div>
                <div class="text-xs text-neutral-600 font-medium">Pflanzensorten</div>
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
    icon: '🌾',
    title: 'Vielfältige Ballaststoffquellen',
    desc: 'Verschiedene Pflanzen enthalten einzigartige Ballaststoffe und Präbiotika, die unterschiedliche nützliche Darmbakterien ernähren.',
  },
  {
    icon: '🎨',
    title: 'Polyphenol-Vielfalt',
    desc: 'Farbenfrohe Pflanzen liefern ein breites Spektrum an Antioxidantien und schützenden Verbindungen für die Gesundheit.',
  },
  {
    icon: '✨',
    title: 'Vielfalt statt Perfektion',
    desc: 'Fokus auf Abwechslung statt Einschränkung – kleine Ergänzungen haben große Wirkung.',
  },
];

const benefits = [
  { emoji: '🥦', title: 'Ballaststoffe', subtitle: 'Ernährt Bakterien' },
  { emoji: '🫐', title: 'Antioxidantien', subtitle: 'Schützt Zellen' },
  { emoji: '🥜', title: 'Mikrobiom', subtitle: 'Vielfalt aufbauen' },
  { emoji: '🥑', title: 'Gesundheit', subtitle: 'Ganzheitlich' },
];
</script>
