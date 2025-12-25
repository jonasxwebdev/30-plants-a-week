<template>
  <div class="space-y-8 pb-24">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Tracker</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ weekRange }}</p>
      </div>
      <div
        class="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
      >
        <span class="text-lg">🔥</span>
        <span class="font-bold">{{ streak }}</span>
      </div>
    </div>

    <!-- Hero Ring -->
    <div class="relative mx-auto flex h-64 w-64 items-center justify-center">
      <!-- Background Circle -->
      <svg class="absolute inset-0 h-full w-full -rotate-90 transform">
        <circle
          cx="128"
          cy="128"
          r="110"
          stroke="currentColor"
          stroke-width="24"
          fill="none"
          class="text-slate-100 dark:text-slate-800"
        />
        <!-- Progress Circle -->
        <circle
          cx="128"
          cy="128"
          r="110"
          stroke="currentColor"
          stroke-width="24"
          fill="none"
          stroke-linecap="round"
          class="text-primary-600 transition-all duration-1000 ease-out dark:text-primary-500"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
        />
      </svg>

      <!-- Center Content -->
      <div class="text-center">
        <div class="text-5xl font-bold text-slate-900 dark:text-white">{{ uniqueCount }}</div>
        <div class="text-sm font-medium text-slate-500 dark:text-slate-400">
          von {{ goal }} Pflanzen
        </div>
        <div class="mt-2 text-xs font-medium text-primary-600 dark:text-primary-400">
          {{ plantsLeft > 0 ? `Noch ${plantsLeft}!` : 'Ziel erreicht! 🎉' }}
        </div>
      </div>
    </div>

    <!-- Plant List -->
    <div>
      <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        Pflanzen dieser Woche
      </h2>

      <div v-if="isLoading" class="py-8 text-center text-slate-500">Laden...</div>

      <div
        v-else-if="plants.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl bg-slate-50 py-12 text-center dark:bg-slate-800/50"
      >
        <div class="mb-4 text-4xl opacity-50">🥗</div>
        <h3 class="text-lg font-medium text-slate-900 dark:text-white">Schale leer?</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">Füge deine erste Pflanze hinzu!</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="plant in plants"
          :key="plant.id"
          class="group flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
        >
          <div class="flex items-center gap-4">
            <span class="text-2xl">{{ plant.emoji || '🌱' }}</span>
            <div>
              <p class="font-medium text-slate-900 dark:text-white">{{ plant.name }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ formatDate(plant.logged_at) }}
              </p>
            </div>
          </div>

          <button
            @click="removePlant(plant.id)"
            class="opacity-0 transition-opacity group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 focus:opacity-100"
            aria-label="Pflanze entfernen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { createBrowserClient } from '../lib/supabase';
import {
  ensureCurrentWeek,
  listWeekPlants,
  removePlantFromWeek,
  getRecentWeeks,
  calculateStreak,
} from '../lib/db';
import { calculatePlantsLeft, formatWeekRange } from '@30-plants/shared/utils';
import type { PlantWithDetails, Week } from '@30-plants/shared/types';

let supabase: any = null;
const plants = ref<PlantWithDetails[]>([]);
const currentWeek = ref<Week | null>(null);
const streak = ref(0);
const isLoading = ref(true);

// Ring calculations
const radius = 110;
const circumference = 2 * Math.PI * radius;

const uniqueCount = computed(() => plants.value.length);
const goal = computed(() => currentWeek.value?.goal || 30);
const plantsLeft = computed(() => calculatePlantsLeft(uniqueCount.value, goal.value));
const weekRange = computed(() =>
  currentWeek.value ? formatWeekRange(currentWeek.value.week_start) : ''
);

const dashOffset = computed(() => {
  const progress = Math.min(uniqueCount.value / goal.value, 1);
  return circumference - progress * circumference;
});

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
};

const loadData = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const userId = session.user.id;
    currentWeek.value = await ensureCurrentWeek(supabase, userId);
    plants.value = await listWeekPlants(supabase, currentWeek.value.id);

    const recentWeeks = await getRecentWeeks(supabase, userId, 52);
    streak.value = calculateStreak(recentWeeks);
  } catch (error) {
    console.error('Error loading dashboard:', error);
  } finally {
    isLoading.value = false;
  }
};

const removePlant = async (plantId: string) => {
  if (!currentWeek.value || !confirm('Remove this plant?')) return;

  try {
    await removePlantFromWeek(supabase, currentWeek.value.id, plantId);
    await loadData();
  } catch (error) {
    console.error('Error removing plant:', error);
  }
};

onMounted(() => {
  supabase = createBrowserClient();
  loadData();
  window.addEventListener('plant-added', loadData);
});

onUnmounted(() => {
  window.removeEventListener('plant-added', loadData);
});
</script>
