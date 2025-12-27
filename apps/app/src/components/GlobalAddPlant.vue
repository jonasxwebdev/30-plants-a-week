<template>
  <div>
    <!-- FAB -->
    <motion.button
      @click="openModal"
      class="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      :whileHover="{ scale: 1.05 }"
      :whileTap="{ scale: 0.95 }"
      aria-label="Add Plant"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </motion.button>

    <!-- Modal Overlay -->
    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click="closeModal"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.2 }"
      ></motion.div>
    </AnimatePresence>

    <!-- Modal Content -->
    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        class="fixed inset-x-0 bottom-0 z-50 h-[90vh] rounded-t-3xl bg-background p-6 shadow-xl flex flex-col"
        :initial="{ y: '100%' }"
        :animate="{ y: 0 }"
        :exit="{ y: '100%' }"
        :transition="{ type: 'spring', damping: 25, stiffness: 200 }"
      >
        <div class="mx-auto mb-6 h-1.5 w-12 rounded-full bg-gray-200 shrink-0"></div>

        <div class="flex items-center justify-between mb-6 shrink-0">
          <h2 class="text-xl font-bold text-text">Pflanze hinzufügen</h2>
          <button @click="closeModal" class="p-2 text-gray-500 hover:text-gray-700">
            Schließen
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative mb-6 shrink-0">
          <input
            ref="searchInput"
            v-model="searchQuery"
            @input="handleInput"
            @keydown.enter="handleEnter"
            @keydown.esc="closeModal"
            type="text"
            placeholder="Was hast du gegessen?"
            class="w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-text placeholder-gray-500 focus:ring-2 focus:ring-primary"
          />
          <div v-if="isLoading" class="absolute right-3 top-3 text-gray-400">
            <svg
              class="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <div
            v-else-if="searchQuery.length >= 2"
            class="absolute right-3 top-3 text-xs text-gray-400 dark:text-gray-500"
          >
            Enter drücken ↵
          </div>
        </div>

        <!-- Results List -->
        <div class="flex-1 overflow-y-auto -mx-6 px-6">
          <div v-if="results.length > 0" class="space-y-4">
            <div class="space-y-2">
              <motion.button
                v-for="(result, index) in results"
                :key="index"
                @click="selectPlant(result)"
                class="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                :initial="{ opacity: 0, x: -20 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="{ delay: index * 0.05 }"
                :whileHover="{ x: 4 }"
                :whileTap="{ scale: 0.98 }"
              >
                <span class="text-3xl">{{ result.plant.emoji || '🌱' }}</span>
                <div class="flex-1 min-w-0">
                  <p
                    class="font-medium text-text truncate group-hover:text-primary transition-colors"
                  >
                    {{ result.plant.name }}
                  </p>
                  <p v-if="result.match_type === 'alias'" class="text-xs text-gray-500">
                    auch bekannt als {{ result.match_text }}
                  </p>
                </div>
                <div
                  v-if="result.plant.category"
                  class="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600"
                >
                  {{ result.plant.category }}
                </div>
              </motion.button>
            </div>

            <!-- Show custom plant option if no exact match -->
            <motion.div
              v-if="!hasExactMatch && searchQuery.length >= 2"
              class="pt-2 border-t border-gray-200"
              :initial="{ opacity: 0, y: -10 }"
              :animate="{ opacity: 1, y: 0 }"
            >
              <p class="text-xs text-gray-500 mb-2 px-1">Nicht gefunden?</p>
              <motion.button
                @click="addCustomPlant"
                class="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors border-2 border-dashed border-primary/30"
                :whileHover="{ scale: 1.02 }"
                :whileTap="{ scale: 0.98 }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-primary"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                <span class="font-medium text-primary">
                  "{{ searchQuery }}" als eigene Pflanze hinzufügen
                </span>
              </motion.button>
            </motion.div>
          </div>

          <!-- Empty State / Suggestions -->
          <motion.div
            v-else-if="searchQuery.length < 2"
            class="space-y-6"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ duration: 0.3 }"
          >
            <div class="text-center py-4">
              <p class="text-sm text-gray-500">Tippe zum Suchen oder wähle einen Vorschlag</p>
            </div>

            <!-- Recommended Plants from Previous Weeks -->
            <div v-if="recommendedPlants.length > 0">
              <h3 class="mb-3 text-sm font-medium text-gray-500">Aus letzten Wochen</h3>
              <div class="flex flex-wrap gap-2">
                <motion.button
                  v-for="(plant, index) in recommendedPlants"
                  :key="plant.id"
                  @click="quickAddById(plant)"
                  class="rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-text hover:bg-green-100 transition-colors inline-flex items-center gap-1.5"
                  :initial="{ opacity: 0, scale: 0.8 }"
                  :animate="{ opacity: 1, scale: 1 }"
                  :transition="{ delay: index * 0.03 }"
                  :whileHover="{ scale: 1.05 }"
                  :whileTap="{ scale: 0.95 }"
                >
                  <span class="text-base">{{ plant.emoji || '🌱' }}</span>
                  <span class="truncate max-w-[120px]">{{ plant.name }}</span>
                </motion.button>
              </div>
            </div>

            <!-- User's Custom Plants -->
            <div v-if="userCustomPlants.length > 0">
              <h3 class="mb-3 text-sm font-medium text-gray-500">Deine Pflanzen</h3>
              <div class="flex flex-wrap gap-2">
                <motion.button
                  v-for="(plant, index) in userCustomPlants"
                  :key="plant.id"
                  @click="quickAddById(plant)"
                  class="rounded-full bg-primary/5 px-3 py-1.5 text-sm font-medium text-text hover:bg-primary/10 transition-colors inline-flex items-center gap-1.5"
                  :initial="{ opacity: 0, scale: 0.8 }"
                  :animate="{ opacity: 1, scale: 1 }"
                  :transition="{ delay: index * 0.03 }"
                  :whileHover="{ scale: 1.05 }"
                  :whileTap="{ scale: 0.95 }"
                >
                  <span class="text-base">{{ plant.emoji || '🌱' }}</span>
                  <span class="truncate max-w-[120px]">{{ plant.name }}</span>
                </motion.button>
              </div>
            </div>

            <div>
              <h3 class="mb-3 text-sm font-medium text-gray-500">Beliebte Pflanzen</h3>
              <div class="flex flex-wrap gap-2">
                <motion.button
                  @click="quickAdd('Apfel')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  :whileHover="{ scale: 1.05, backgroundColor: '#e5e7eb' }"
                  :whileTap="{ scale: 0.95 }"
                >
                  🍎 Apfel
                </motion.button>
                <motion.button
                  @click="quickAdd('Banane')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  :whileHover="{ scale: 1.05, backgroundColor: '#e5e7eb' }"
                  :whileTap="{ scale: 0.95 }"
                >
                  🍌 Banane
                </motion.button>
                <motion.button
                  @click="quickAdd('Spinat')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  :whileHover="{ scale: 1.05, backgroundColor: '#e5e7eb' }"
                  :whileTap="{ scale: 0.95 }"
                >
                  🥬 Spinat
                </motion.button>
                <motion.button
                  @click="quickAdd('Karotte')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  :whileHover="{ scale: 1.05, backgroundColor: '#e5e7eb' }"
                  :whileTap="{ scale: 0.95 }"
                >
                  🥕 Karotte
                </motion.button>
                <motion.button
                  @click="quickAdd('Brokkoli')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  :whileHover="{ scale: 1.05, backgroundColor: '#e5e7eb' }"
                  :whileTap="{ scale: 0.95 }"
                >
                  🥦 Brokkoli
                </motion.button>
                <motion.button
                  @click="quickAdd('Tomate')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  :whileHover="{ scale: 1.05, backgroundColor: '#e5e7eb' }"
                  :whileTap="{ scale: 0.95 }"
                >
                  🍅 Tomate
                </motion.button>
              </div>
            </div>
          </motion.div>

          <!-- No Results - Allow Custom Plant -->
          <motion.div
            v-else-if="searchQuery.length >= 2"
            class="py-8"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
          >
            <div class="text-center mb-4">
              <p class="text-gray-500 mb-2">Keine Treffer gefunden</p>
              <p class="text-sm text-gray-400">Trotzdem hinzufügen?</p>
            </div>
            <motion.button
              @click="addCustomPlant"
              class="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors border-2 border-dashed border-primary/30"
              :whileHover="{ scale: 1.02 }"
              :whileTap="{ scale: 0.98 }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-primary"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              <span class="font-medium text-primary">
                "{{ searchQuery }}" als eigene Pflanze hinzufügen
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>

    <!-- Toast Notification -->
    <Toast v-if="toast.show" :show="toast.show" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { motion, AnimatePresence } from 'motion-v';
import { getBrowserClient } from '../lib/supabase';
import {
  searchPlants,
  addPlantToWeek,
  ensureCurrentWeek,
  checkExactPlantMatch,
  getUserCustomPlants,
  getRecommendedPlants,
} from '../lib/db';
import type { AutocompleteResult, Plant } from '@repo/shared';
import Toast from './ui/Toast.vue';

let supabase: any = null;
const isOpen = ref(false);
const searchQuery = ref('');
const results = ref<AutocompleteResult[]>([]);
const isLoading = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({
  show: false,
  message: '',
  type: 'success',
});
const hasExactMatch = ref(false);
const userCustomPlants = ref<Plant[]>([]);
const recommendedPlants = ref<Plant[]>([]);

let searchTimeout: ReturnType<typeof setTimeout>;

const openModal = async () => {
  isOpen.value = true;
  await Promise.all([loadUserCustomPlants(), loadRecommendedPlants()]);
  nextTick(() => {
    searchInput.value?.focus();
  });
};

const closeModal = () => {
  isOpen.value = false;
  searchQuery.value = '';
  results.value = [];
  hasExactMatch.value = false;
};

const handleInput = () => {
  clearTimeout(searchTimeout);
  if (searchQuery.value.length < 2) {
    results.value = [];
    hasExactMatch.value = false;
    return;
  }

  isLoading.value = true;
  searchTimeout = setTimeout(async () => {
    try {
      results.value = await searchPlants(supabase, searchQuery.value);
      hasExactMatch.value = await checkExactPlantMatch(supabase, searchQuery.value);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      isLoading.value = false;
    }
  }, 300);
};

const handleEnter = async () => {
  if (isLoading.value) return;

  // If we have results, select the first one
  if (results.value.length > 0) {
    await selectPlant(results.value[0]);
  }
  // If no results and query is long enough, create custom plant
  else if (searchQuery.value.length >= 2) {
    await addCustomPlant();
  }
};

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const selectPlant = async (result: AutocompleteResult) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      showToast('Bitte zuerst anmelden', 'error');
      return;
    }

    const week = await ensureCurrentWeek(supabase, session.user.id);
    const response = await addPlantToWeek(supabase, week.id, { plant_id: result.plant.id });

    if (!response.success) {
      showToast(response.error || 'Pflanze konnte nicht hinzugefügt werden', 'error');
      return;
    }

    showToast(`${result.plant.name} hinzugefügt!`, 'success');
    window.dispatchEvent(new CustomEvent('plant-added'));
    closeModal();
  } catch (error) {
    console.error('Add error:', error);
    showToast('Pflanze konnte nicht hinzugefügt werden', 'error');
  }
};

const quickAdd = async (name: string) => {
  searchQuery.value = name;

  // Clear previous timeout and search immediately
  clearTimeout(searchTimeout);
  isLoading.value = true;

  try {
    results.value = await searchPlants(supabase, name);

    // If we have results, select the first one
    if (results.value.length > 0) {
      await selectPlant(results.value[0]);
    } else {
      // If no results, trigger the input handler to show the custom plant option
      isLoading.value = false;
    }
  } catch (error) {
    console.error('Quick add error:', error);
    isLoading.value = false;
  }
};

const quickAddById = async (plant: Plant) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      showToast('Bitte zuerst anmelden', 'error');
      return;
    }

    const week = await ensureCurrentWeek(supabase, session.user.id);
    const response = await addPlantToWeek(supabase, week.id, { plant_id: plant.id });

    if (!response.success) {
      showToast(response.error || 'Pflanze konnte nicht hinzugefügt werden', 'error');
      return;
    }

    showToast(`${plant.name} hinzugefügt!`, 'success');
    window.dispatchEvent(new CustomEvent('plant-added'));
    closeModal();
  } catch (error) {
    console.error('Quick add by ID error:', error);
    showToast('Pflanze konnte nicht hinzugefügt werden', 'error');
  }
};

const addCustomPlant = async () => {
  if (!searchQuery.value.trim()) return;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      showToast('Bitte zuerst anmelden', 'error');
      return;
    }

    // Normalize the plant name
    const plantName = searchQuery.value.trim();
    const normalizedName = plantName.toLowerCase();

    // First, create the plant in the plants table with user_id for custom plants
    const { data: newPlant, error: plantError } = await supabase
      .from('plants')
      .insert({
        name: plantName,
        normalized_name: normalizedName,
        emoji: '🌱', // Default emoji
        category: 'custom',
        user_id: session.user.id, // Mark as user's custom plant
      })
      .select()
      .single();

    if (plantError) {
      // If plant already exists, try to find it
      if (plantError.code === '23505') {
        const { data: existingPlant, error: findError } = await supabase
          .from('plants')
          .select('*')
          .eq('normalized_name', normalizedName)
          .single();

        if (findError || !existingPlant) {
          showToast('Pflanze existiert bereits, konnte aber nicht gefunden werden', 'error');
          return;
        }

        // Use the existing plant
        const week = await ensureCurrentWeek(supabase, session.user.id);
        const response = await addPlantToWeek(supabase, week.id, { plant_id: existingPlant.id });

        if (!response.success) {
          showToast(response.error || 'Pflanze konnte nicht hinzugefügt werden', 'error');
          return;
        }

        showToast(`${existingPlant.name} hinzugefügt!`, 'success');
        window.dispatchEvent(new CustomEvent('plant-added'));
        closeModal();
        return;
      }

      throw plantError;
    }

    // Now add the plant to this week
    const week = await ensureCurrentWeek(supabase, session.user.id);
    const response = await addPlantToWeek(supabase, week.id, { plant_id: newPlant.id });

    if (!response.success) {
      showToast(response.error || 'Pflanze konnte nicht hinzugefügt werden', 'error');
      return;
    }

    showToast(`${newPlant.name} hinzugefügt!`, 'success');
    window.dispatchEvent(new CustomEvent('plant-added'));
    await Promise.all([loadUserCustomPlants(), loadRecommendedPlants()]); // Refresh lists
    closeModal();
  } catch (error) {
    console.error('Add custom plant error:', error);
    showToast('Pflanze konnte nicht hinzugefügt werden', 'error');
  }
};

const loadUserCustomPlants = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    userCustomPlants.value = await getUserCustomPlants(supabase, session.user.id, 9);
  } catch (error) {
    console.error('Fehler beim Laden der benutzerdefinierten Pflanzen:', error);
  }
};

const loadRecommendedPlants = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    recommendedPlants.value = await getRecommendedPlants(supabase, session.user.id, 15);
  } catch (error) {
    console.error('Fehler beim Laden der empfohlenen Pflanzen:', error);
  }
};

onMounted(() => {
  supabase = getBrowserClient();
});
</script>
