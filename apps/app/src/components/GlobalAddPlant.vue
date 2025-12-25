<template>
  <div>
    <!-- FAB -->
    <button
      @click="openModal"
      class="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
    </button>

    <!-- Modal Overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click="closeModal"
      ></div>
    </Transition>

    <!-- Modal Content -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="isOpen"
        class="fixed inset-x-0 bottom-0 z-50 h-[90vh] rounded-t-2xl bg-white p-6 shadow-xl dark:bg-gray-800 flex flex-col"
      >
        <div
          class="mx-auto mb-6 h-1.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"
        ></div>

        <div class="flex items-center justify-between mb-6 shrink-0">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Pflanze hinzufügen</h2>
          <button
            @click="closeModal"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
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
            class="w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
          <div v-if="results.length > 0" class="space-y-2">
            <button
              v-for="(result, index) in results"
              :key="index"
              @click="selectPlant(result)"
              class="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group"
            >
              <span class="text-3xl">{{ result.plant.emoji || '🌱' }}</span>
              <div class="flex-1 min-w-0">
                <p
                  class="font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                >
                  {{ result.plant.name }}
                </p>
                <p
                  v-if="result.match_type === 'alias'"
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  auch bekannt als {{ result.match_text }}
                </p>
              </div>
              <div
                v-if="result.plant.category"
                class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
              >
                {{ result.plant.category }}
              </div>
            </button>
          </div>

          <!-- Empty State / Suggestions -->
          <div v-else-if="searchQuery.length < 2" class="space-y-6">
            <div class="text-center py-4">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Tippe zum Suchen oder wähle einen Vorschlag
              </p>
            </div>
            <div>
              <h3 class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Beliebte Pflanzen
              </h3>
              <div class="flex flex-wrap gap-2">
                <button
                  @click="quickAdd('Apfel')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🍎 Apfel
                </button>
                <button
                  @click="quickAdd('Banane')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🍌 Banane
                </button>
                <button
                  @click="quickAdd('Spinat')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🥬 Spinat
                </button>
                <button
                  @click="quickAdd('Karotte')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🥕 Karotte
                </button>
                <button
                  @click="quickAdd('Brokkoli')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🥦 Brokkoli
                </button>
                <button
                  @click="quickAdd('Tomate')"
                  class="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🍅 Tomate
                </button>
              </div>
            </div>
          </div>

          <!-- No Results - Allow Custom Plant -->
          <div v-else-if="searchQuery.length >= 2" class="py-8">
            <div class="text-center mb-4">
              <p class="text-gray-500 dark:text-gray-400 mb-2">Keine Treffer gefunden</p>
              <p class="text-sm text-gray-400 dark:text-gray-500">Trotzdem hinzufügen?</p>
            </div>
            <button
              @click="addCustomPlant"
              class="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 transition-colors border-2 border-dashed border-primary-300 dark:border-primary-700"
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
                class="text-primary-600 dark:text-primary-400"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              <span class="font-medium text-primary-700 dark:text-primary-300">
                "{{ searchQuery }}" als eigene Pflanze hinzufügen
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-20 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-20 opacity-0"
    >
      <div
        v-if="toast.show"
        class="fixed bottom-24 left-4 right-4 z-50 flex items-center gap-3 rounded-xl p-4 shadow-lg"
        :class="
          toast.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-900/90 dark:text-emerald-100'
            : 'bg-red-50 text-red-900 dark:bg-red-900/90 dark:text-red-100'
        "
      >
        <span class="text-xl">{{ toast.type === 'success' ? '🎉' : '⚠️' }}</span>
        <p class="font-medium">{{ toast.message }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { createBrowserClient } from '../lib/supabase';
import { searchPlants, addPlantToWeek, ensureCurrentWeek } from '../lib/db';
import type { AutocompleteResult } from '@30-plants/shared/types';

let supabase: any = null;
const isOpen = ref(false);
const searchQuery = ref('');
const results = ref<AutocompleteResult[]>([]);
const isLoading = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const toast = ref({ show: false, message: '', type: 'success' });

let searchTimeout: ReturnType<typeof setTimeout>;

const openModal = () => {
  isOpen.value = true;
  nextTick(() => {
    searchInput.value?.focus();
  });
};

const closeModal = () => {
  isOpen.value = false;
  searchQuery.value = '';
  results.value = [];
};

const handleInput = () => {
  clearTimeout(searchTimeout);
  if (searchQuery.value.length < 2) {
    results.value = [];
    return;
  }

  isLoading.value = true;
  searchTimeout = setTimeout(async () => {
    try {
      results.value = await searchPlants(supabase, searchQuery.value);
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
      showToast('Please sign in first', 'error');
      return;
    }

    const week = await ensureCurrentWeek(supabase, session.user.id);
    const response = await addPlantToWeek(supabase, week.id, { plant_id: result.plant.id });

    if (!response.success) {
      showToast(response.error || 'Failed to add plant', 'error');
      return;
    }

    showToast(`Added ${result.plant.name}!`, 'success');
    window.dispatchEvent(new CustomEvent('plant-added'));
    closeModal();
  } catch (error) {
    console.error('Add error:', error);
    showToast('Failed to add plant', 'error');
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

const addCustomPlant = async () => {
  if (!searchQuery.value.trim()) return;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      showToast('Please sign in first', 'error');
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
          showToast('Plant already exists but could not be found', 'error');
          return;
        }

        // Use the existing plant
        const week = await ensureCurrentWeek(supabase, session.user.id);
        const response = await addPlantToWeek(supabase, week.id, { plant_id: existingPlant.id });

        if (!response.success) {
          showToast(response.error || 'Failed to add plant', 'error');
          return;
        }

        showToast(`Added ${existingPlant.name}!`, 'success');
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
      showToast(response.error || 'Failed to add plant', 'error');
      return;
    }

    showToast(`Added ${newPlant.name}!`, 'success');
    window.dispatchEvent(new CustomEvent('plant-added'));
    closeModal();
  } catch (error) {
    console.error('Add custom plant error:', error);
    showToast('Failed to add custom plant', 'error');
  }
};

onMounted(() => {
  supabase = createBrowserClient();
});
</script>
