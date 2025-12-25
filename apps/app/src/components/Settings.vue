<template>
  <div class="space-y-6 pb-24">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Einstellungen</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400">Passe deine Erfahrung an</p>
    </div>

    <div v-if="isLoading" class="py-12 text-center text-slate-500">
      Einstellungen werden geladen...
    </div>

    <div v-else class="space-y-6">
      <!-- Weekly Goal -->
      <div
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Wöchentliches Ziel
        </h2>

        <div class="space-y-6">
          <div>
            <div class="mb-2 flex items-center justify-between">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300"
                >Pflanzen pro Woche</label
              >
              <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{
                goal
              }}</span>
            </div>
            <input
              type="range"
              v-model.number="goal"
              min="1"
              max="100"
              class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary-600 dark:bg-slate-700"
            />
            <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Empfohlen: 30 Pflanzen pro Woche für optimale Darmgesundheit.
            </p>
          </div>

          <div class="flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
            <input
              type="checkbox"
              v-model="applyToCurrentWeek"
              id="apply-current"
              class="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700"
            />
            <label for="apply-current" class="flex-1 cursor-pointer">
              <span class="block text-sm font-medium text-slate-900 dark:text-white"
                >Auf aktuelle Woche anwenden</span
              >
              <span class="block text-xs text-slate-500 dark:text-slate-400">
                Ändere dein Ziel für diese Woche sofort.
              </span>
            </label>
          </div>

          <button
            @click="saveGoal"
            :disabled="isSaving"
            class="w-full rounded-xl bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            {{ isSaving ? 'Speichern...' : 'Ziel speichern' }}
          </button>
        </div>
      </div>

      <!-- Data Management -->
      <div
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Daten</h2>
        <button
          @click="exportData"
          class="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          <span class="font-medium text-slate-900 dark:text-white">Meine Daten exportieren</span>
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
            class="text-slate-400"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>

      <!-- Account -->
      <div
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Konto</h2>
        <button
          @click="handleSignOut"
          class="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          Abmelden
        </button>
      </div>
    </div>

    <!-- Toast -->
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
import { ref, onMounted } from 'vue';
import { createBrowserClient } from '../lib/supabase';
import { getProfile, updateProfile, ensureCurrentWeek, updateWeekGoal } from '../lib/db';
import { authManager } from '../lib/authClient';

let supabase: any = null;
const isLoading = ref(true);
const isSaving = ref(false);
const goal = ref(30);
const applyToCurrentWeek = ref(false);
const toast = ref({ show: false, message: '', type: 'success' });

const loadSettings = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const profile = await getProfile(supabase, session.user.id);
    if (profile) {
      goal.value = profile.weekly_goal || 30;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  } finally {
    isLoading.value = false;
  }
};

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const saveGoal = async () => {
  isSaving.value = true;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    // Update profile default
    await updateProfile(supabase, session.user.id, { weekly_goal: goal.value });

    // Update current week if requested
    if (applyToCurrentWeek.value) {
      const week = await ensureCurrentWeek(supabase, session.user.id);
      await updateWeekGoal(supabase, week.id, goal.value);
    }

    showToast('Goal updated successfully!');
  } catch (error) {
    console.error('Error saving goal:', error);
    showToast('Failed to save goal', 'error');
  } finally {
    isSaving.value = false;
  }
};

const exportData = () => {
  showToast('Export feature coming soon!');
};

const handleSignOut = async () => {
  try {
    await authManager.signOut();
    window.location.href = '/signin';
  } catch (error) {
    console.error('Sign out error:', error);
  }
};

onMounted(() => {
  supabase = createBrowserClient();
  loadSettings();
});
</script>
