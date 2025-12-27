<template>
  <div class="space-y-6 pb-24">
    <div>
      <h1 class="text-2xl font-bold text-text">Tagebuch</h1>
      <p class="text-sm text-gray-500">Deine wöchentlichen Erfolge</p>
    </div>

    <div v-if="isLoading" class="py-12 text-center text-gray-500">Verlauf wird geladen...</div>

    <div v-else-if="weeks.length === 0" class="py-12 text-center text-gray-500">
      Noch kein Verlauf. Starte diese Woche!
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="week in weeks"
        :key="week.id"
        class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all"
      >
        <button
          @click="toggleWeek(week.id)"
          class="flex w-full items-center justify-between p-4 text-left focus:outline-none"
        >
          <div>
            <p class="font-medium text-text">
              {{ formatWeekRange(week.week_start) }}
            </p>
            <p class="text-xs text-gray-500">
              {{ isCurrentWeek(week.week_start) ? 'Aktuelle Woche' : '' }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <div
              class="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold"
              :class="getScoreClass(week.unique_count, week.goal)"
            >
              <span>{{ week.unique_count }}</span>
              <span class="opacity-50">/</span>
              <span>{{ week.goal }}</span>
            </div>
            <svg
              class="h-5 w-5 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': expandedWeekId === week.id }"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </button>

        <!-- Expanded Details -->
        <AnimatePresence>
          <motion.div
            v-if="expandedWeekId === week.id"
            class="border-t border-gray-100 bg-gray-50 px-4 py-3 overflow-hidden"
            :initial="{ height: 0, opacity: 0 }"
            :animate="{ height: 'auto', opacity: 1 }"
            :exit="{ height: 0, opacity: 0 }"
            :transition="{ duration: 0.3, ease: 'easeInOut' }"
          >
            <div v-if="week.plants && week.plants.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="plant in week.plants"
                :key="plant.id"
                class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs text-gray-700 shadow-sm border border-gray-100"
              >
                {{ plant.emoji || '🌱' }} {{ plant.name }}
              </span>
            </div>
            <p v-else class="text-sm text-gray-500">Keine Pflanzen eingetragen.</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { motion, AnimatePresence } from 'motion-v';
import { getBrowserClient } from '../lib/supabase';
import { getRecentWeeks } from '../lib/db';
import { formatWeekRange, isCurrentWeek } from '@repo/shared';
import type { WeekWithPlants } from '@repo/shared';
import type { SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;
const weeks = ref<WeekWithPlants[]>([]);
const isLoading = ref(true);
const expandedWeekId = ref<string | null>(null);

const loadHistory = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch last 12 weeks
    weeks.value = await getRecentWeeks(supabase, session.user.id, 12);
  } catch (error) {
    console.error('Error loading history:', error);
  } finally {
    isLoading.value = false;
  }
};

const toggleWeek = (id: string) => {
  expandedWeekId.value = expandedWeekId.value === id ? null : id;
};

const getScoreClass = (count: number, goal: number) => {
  if (count >= goal) {
    return 'bg-primary/10 text-primary';
  } else if (count >= goal * 0.5) {
    return 'bg-yellow-100 text-yellow-700';
  } else {
    return 'bg-gray-100 text-gray-700';
  }
};

onMounted(() => {
  supabase = getBrowserClient();
  loadHistory();
});
</script>
