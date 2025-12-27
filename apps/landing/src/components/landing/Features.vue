<template>
  <section
    id="features"
    class="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
        <span
          class="inline-block text-primary-600 font-semibold text-sm tracking-wide uppercase mb-4"
        >
          Funktionen
        </span>
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-serif text-neutral-900 mb-4 sm:mb-6 leading-tight"
        >
          Alles was du brauchst, um dein Ziel zu erreichen
        </h2>
        <p class="text-base sm:text-lg lg:text-xl text-neutral-600 leading-relaxed">
          Einfache, leistungsstarke Tools, die dir helfen, deine Ernährungsvielfalt mühelos zu
          tracken, zu visualisieren und zu verbessern.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <motion.div
          v-for="(feature, index) in features"
          :key="index"
          class="group relative bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200 hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-2"
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :viewport="{ once: true }"
          :transition="{ delay: index * 0.1, duration: 0.6 }"
        >
          <!-- Gradient background on hover -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-accent-50/0 group-hover:from-primary-50/50 group-hover:to-accent-50/30 rounded-3xl transition-all duration-300"
          ></div>

          <div class="relative z-10">
            <!-- Icon -->
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl sm:text-3xl mb-5 sm:mb-6 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 group-hover:scale-110 transition-all duration-300"
            >
              {{ feature.icon }}
            </div>

            <!-- Content -->
            <h3
              class="text-lg sm:text-xl font-bold text-neutral-900 mb-2 sm:mb-3 group-hover:text-primary-700 transition-colors"
            >
              {{ feature.title }}
            </h3>
            <p class="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {{ feature.desc }}
            </p>

            <!-- Arrow indicator on hover -->
            <div
              class="mt-6 flex items-center text-primary-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <span>Mehr erfahren</span>
              <svg
                class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-16">
        <p class="text-neutral-600 mb-6">Bereit, deine Ernährung zu transformieren?</p>
        <a
          href="#"
          class="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
        >
          Alle Funktionen ansehen
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';

const features = [
  {
    icon: '📊',
    title: 'Wöchentlicher Fortschritt',
    desc: 'Trage deine täglichen Pflanzen mühelos ein. Die App zählt automatisch einzigartige Sorten und verfolgt deinen Fortschritt zum Wochenziel.',
  },
  {
    icon: '🔥',
    title: 'Streak-Aufbau',
    desc: 'Baue nachhaltige Gewohnheiten auf, indem du dein Ziel konsequent erreichst. Beobachte, wie dein Streak Woche für Woche wächst.',
  },
  {
    icon: '💡',
    title: 'Intelligente Vorschläge',
    desc: 'Bei 25 Pflanzen hängen geblieben? Erhalte personalisierte Empfehlungen für neue Pflanzensorten basierend auf deinen Essgewohnheiten.',
  },
  {
    icon: '🥗',
    title: 'Rezept-Inspiration',
    desc: 'Entdecke köstliche pflanzenbasierte Rezepte, die dir helfen, mehrere Pflanzenpunkte in einer einzigen Mahlzeit zu sammeln.',
  },
  {
    icon: '📈',
    title: 'Vielfalt-Analysen',
    desc: 'Visualisiere deine Aufnahme über Kategorien wie Hülsenfrüchte, Nüsse, Samen, Gemüse und Obst mit schönen Diagrammen.',
  },
  {
    icon: '👥',
    title: 'Community-Unterstützung',
    desc: 'Verbinde dich mit Freunden, teile deinen Fortschritt, feiert gemeinsam Erfolge und bleibt als Community motiviert.',
  },
];
</script>
