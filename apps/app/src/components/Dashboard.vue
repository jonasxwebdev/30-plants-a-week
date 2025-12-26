<template>
  <div class="space-y-8 pb-24">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-text">Tracker</h1>
        <p class="text-sm text-gray-500">{{ weekRange }}</p>
      </div>
      <div class="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-orange-600">
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
          class="text-gray-100"
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
          class="text-primary transition-all duration-1000 ease-out"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
        />
      </svg>

      <!-- Center Content -->
      <div class="text-center">
        <div class="text-5xl font-bold text-text">{{ uniqueCount }}</div>
        <div class="text-sm font-medium text-gray-500">von {{ goal }} Pflanzen</div>
        <div class="mt-2 text-xs font-medium text-primary">
          {{ plantsLeft > 0 ? `Noch ${plantsLeft}!` : 'Ziel erreicht! 🎉' }}
        </div>
      </div>
    </div>

    <!-- Plant List -->
    <div>
      <h2 class="mb-4 text-lg font-semibold text-text">Pflanzen dieser Woche</h2>

      <div v-if="isLoading" class="py-8 text-center text-gray-500">Laden...</div>

      <div
        v-else-if="plants.length === 0"
        class="flex flex-col items-center justify-center rounded-3xl bg-gray-50 py-12 text-center"
      >
        <div class="mb-4 text-4xl opacity-50">🥗</div>
        <h3 class="text-lg font-medium text-text">Schale leer?</h3>
        <p class="text-sm text-gray-500">Füge deine erste Pflanze hinzu!</p>
      </div>

      <div v-else class="space-y-2">
        <AnimatePresence>
          <motion.div
            v-for="(plant, index) in plants"
            :key="plant.id"
            class="group flex items-center justify-between rounded-xl bg-white p-3 shadow-sm border border-gray-100"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, scale: 0.95 }"
            :transition="{ delay: index * 0.05 }"
            :whileHover="{
              y: -2,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl">
                {{ plant.emoji || '🌱' }}
              </span>
              <div>
                <p class="text-sm font-medium text-text">{{ plant.name }}</p>
                <p class="text-[10px] text-gray-500">
                  {{ formatDate(plant?.logged_at || '') }}
                </p>
              </div>
            </div>

            <motion.button
              @click="openDeleteModal(plant)"
              class="p-2 text-gray-400 hover:text-red-500"
              :whileTap="{ scale: 0.9 }"
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
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <AnimatePresence>
      <motion.div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="cancelDelete"></div>

        <!-- Modal -->
        <motion.div
          class="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-xl"
          :initial="{ scale: 0.9, opacity: 0 }"
          :animate="{ scale: 1, opacity: 1 }"
          :exit="{ scale: 0.9, opacity: 0 }"
        >
          <div class="mb-6 text-center">
            <div
              class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl"
            >
              🗑️
            </div>
            <h3 class="mb-2 text-lg font-bold text-text">Pflanze entfernen?</h3>
            <p class="text-sm text-gray-500">
              Möchtest du "{{ plantToDelete?.name }}" wirklich von deiner Liste entfernen?
            </p>
          </div>

          <div class="flex gap-3">
            <button
              @click="cancelDelete"
              class="flex-1 rounded-xl bg-gray-50 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-100"
            >
              Abbrechen
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition-transform active:scale-95"
            >
              Entfernen
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { motion, AnimatePresence } from 'motion-v';
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
const showDeleteModal = ref(false);
const plantToDelete = ref<PlantWithDetails | null>(null);

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

const openDeleteModal = (plant: PlantWithDetails) => {
  plantToDelete.value = plant;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  plantToDelete.value = null;
};

const confirmDelete = async () => {
  if (!currentWeek.value || !plantToDelete.value) return;

  try {
    await removePlantFromWeek(supabase, currentWeek.value.id, plantToDelete.value.id);
    await loadData();
    cancelDelete();
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
