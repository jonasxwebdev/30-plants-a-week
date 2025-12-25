<template>
  <div class="space-y-6 pb-24">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Tagebuch</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400">Deine wöchentlichen Erfolge</p>
    </div>

    <div v-if="isLoading" class="py-12 text-center text-slate-500">Verlauf wird geladen...</div>

    <div v-else-if="weeks.length === 0" class="py-12 text-center text-slate-500">
      Noch kein Verlauf. Starte diese Woche!
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="week in weeks"
        :key="week.id"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all dark:border-slate-700 dark:bg-slate-800"
      >
        <button
          @click="toggleWeek(week.id)"
          class="flex w-full items-center justify-between p-4 text-left focus:outline-none"
        >
          <div>
            <p class="font-medium text-slate-900 dark:text-white">
              {{ formatWeekRange(week.week_start) }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ isCurrentWeek(week.week_start) ? 'Aktuelle Woche' : '' }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <div
              class="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold"
              :class="getScoreClass(week.plant_count, week.goal)"
            >
              <span>{{ week.plant_count }}</span>
              <span class="opacity-50">/</span>
              <span>{{ week.goal }}</span>
            </div>
            <svg
              class="h-5 w-5 text-slate-400 transition-transform duration-200"
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
        <div
          v-if="expandedWeekId === week.id"
          class="border-t border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <div v-if="week.plants && week.plants.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="plant in week.plants"
              :key="plant.id"
              class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs text-slate-700 shadow-sm dark:bg-slate-700 dark:text-slate-200"
            >
              {{ plant.emoji || '🌱' }} {{ plant.name }}
            </span>
          </div>
          <p v-else class="text-sm text-slate-500">Keine Pflanzen eingetragen.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createBrowserClient } from '../lib/supabase';
import { getRecentWeeks } from '../lib/db';
import { formatWeekRange, isCurrentWeek } from '@30-plants/shared/utils';
import type { WeekWithPlants } from '@30-plants/shared/types';

let supabase: any = null;
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
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
  } else if (count >= goal * 0.5) {
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  } else {
    return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
  }
};

onMounted(() => {
  supabase = createBrowserClient();
  loadHistory();
});
</script>
