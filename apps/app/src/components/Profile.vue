<template>
  <div class="space-y-6 pb-24">
    <div>
      <h1 class="text-2xl font-bold text-text">Profil</h1>
      <p class="text-sm text-gray-500">Verwalte dein Konto</p>
    </div>

    <div v-if="isLoading" class="py-12 text-center text-gray-500">Profil wird geladen...</div>

    <div v-else class="space-y-6">
      <!-- Username -->
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold text-text">Benutzername</h2>

        <div v-if="!isEditingUsername" class="space-y-4">
          <div class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <div>
              <p class="text-sm text-gray-500">Dein Benutzername</p>
              <p class="text-lg font-semibold text-text">
                @{{ currentUsername || 'Nicht gesetzt' }}
              </p>
            </div>
            <motion.button
              @click="startEditingUsername"
              class="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
              :whileHover="{ scale: 1.05 }"
              :whileTap="{ scale: 0.95 }"
            >
              Ändern
            </motion.button>
          </div>
          <p class="text-xs text-gray-500">
            Dein Benutzername wird verwendet, um Freunde hinzuzufügen
          </p>
        </div>

        <div v-else class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Neuer Benutzername </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
              <input
                ref="usernameInput"
                v-model="newUsername"
                @input="validateUsername"
                type="text"
                placeholder="benutzername"
                class="w-full rounded-xl border-2 pl-8 pr-10 py-3 focus:outline-none transition-colors"
                :class="
                  usernameError
                    ? 'border-red-300 focus:border-red-500'
                    : isUsernameValid
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-gray-200 focus:border-primary'
                "
                maxlength="30"
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  v-if="isCheckingUsername"
                  class="animate-spin h-5 w-5 text-gray-400"
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
                <svg
                  v-else-if="isUsernameValid"
                  class="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <svg
                  v-else-if="usernameError"
                  class="h-5 w-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
            </div>
            <p v-if="usernameError" class="mt-2 text-xs text-red-600">{{ usernameError }}</p>
            <p v-else-if="isUsernameValid" class="mt-2 text-xs text-green-600">
              ✓ Benutzername verfügbar
            </p>
            <p v-else class="mt-2 text-xs text-gray-500">
              3-30 Zeichen, nur Buchstaben, Zahlen, _ und -
            </p>
          </div>

          <div class="flex gap-3">
            <motion.button
              @click="cancelEditingUsername"
              class="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              :whileTap="{ scale: 0.95 }"
            >
              Abbrechen
            </motion.button>
            <motion.button
              @click="saveUsername"
              :disabled="!isUsernameValid || isSavingUsername"
              class="flex-1 rounded-xl px-4 py-3 font-medium text-white transition-all shadow-lg"
              :class="
                isUsernameValid && !isSavingUsername
                  ? 'bg-primary hover:bg-primary/90 shadow-primary/30'
                  : 'bg-gray-300 cursor-not-allowed'
              "
              :whileTap="isUsernameValid && !isSavingUsername ? { scale: 0.95 } : {}"
            >
              {{ isSavingUsername ? 'Speichern...' : 'Speichern' }}
            </motion.button>
          </div>
        </div>
      </div>

      <!-- Weekly Goal -->
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold text-text">Wöchentliches Ziel</h2>

        <div class="space-y-6">
          <div>
            <div class="mb-2 flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Pflanzen pro Woche</label>
              <span class="text-2xl font-bold text-primary">{{ goal }}</span>
            </div>
            <input
              type="range"
              v-model.number="goal"
              min="1"
              max="100"
              class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary"
            />
            <p class="mt-2 text-xs text-gray-500">
              Empfohlen: 30 Pflanzen pro Woche für optimale Darmgesundheit.
            </p>
          </div>

          <div class="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
            <input
              type="checkbox"
              v-model="applyToCurrentWeek"
              id="apply-current"
              class="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label for="apply-current" class="flex-1 cursor-pointer">
              <span class="block text-sm font-medium text-slate-900"
                >Auf aktuelle Woche anwenden</span
              >
              <span class="block text-xs text-slate-500">
                Ändere dein Ziel für diese Woche sofort.
              </span>
            </label>
          </div>

          <motion.button
            @click="saveGoal"
            :disabled="isSaving"
            class="w-full rounded-xl bg-primary px-4 py-3 font-medium text-white transition-all hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/30"
            :whileHover="{ y: -2 }"
            :whileTap="{ scale: 0.95 }"
          >
            {{ isSaving ? 'Speichern...' : 'Ziel speichern' }}
          </motion.button>
        </div>
      </div>

      <!-- Data Management -->
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold text-text">Daten</h2>
        <motion.button
          @click="exportData"
          class="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-left transition-all hover:bg-gray-100"
          :whileHover="{ y: -2 }"
          :whileTap="{ scale: 0.95 }"
        >
          <span class="font-medium text-text">Meine Daten exportieren</span>
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
            class="text-gray-400"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </motion.button>
      </div>

      <!-- Account -->
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold text-text">Konto</h2>
        <motion.button
          @click="handleSignOut"
          class="w-full rounded-xl border border-red-100 bg-red-50 px-4 py-3 font-medium text-red-600 transition-all hover:bg-red-100"
          :whileHover="{ y: -2 }"
          :whileTap="{ scale: 0.95 }"
        >
          Abmelden
        </motion.button>
      </div>
    </div>

    <!-- Toast -->
    <Toast v-if="toast.show" :message="toast.message" :type="toast.type as 'success' | 'error'" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { motion } from 'motion-v';
import { createBrowserClient } from '../lib/supabase';
import { getProfile, updateProfile, ensureCurrentWeek, updateWeekGoal } from '../lib/db';
import { authManager } from '../lib/authClient';
import Toast from './ui/Toast.vue';

let supabase: any = null;
const isLoading = ref(true);
const isSaving = ref(false);
const goal = ref(30);
const applyToCurrentWeek = ref(false);
const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({
  show: false,
  message: '',
  type: 'success',
});

// Username editing
const currentUsername = ref('');
const isEditingUsername = ref(false);
const newUsername = ref('');
const usernameError = ref('');
const isUsernameValid = ref(false);
const isCheckingUsername = ref(false);
const isSavingUsername = ref(false);
const usernameInput = ref<HTMLInputElement | null>(null);

let validationTimeout: NodeJS.Timeout | null = null;

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;

const loadSettings = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const profile = await getProfile(supabase, session.user.id);
    if (profile) {
      goal.value = profile.weekly_goal || 30;
      currentUsername.value = profile.username || '';
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

const startEditingUsername = () => {
  isEditingUsername.value = true;
  newUsername.value = currentUsername.value;
  nextTick(() => {
    usernameInput.value?.focus();
  });
};

const cancelEditingUsername = () => {
  isEditingUsername.value = false;
  newUsername.value = '';
  usernameError.value = '';
  isUsernameValid.value = false;
};

const validateUsername = async () => {
  const value = newUsername.value.trim();

  isUsernameValid.value = false;
  usernameError.value = '';

  if (validationTimeout) {
    clearTimeout(validationTimeout);
  }

  if (value.length === 0) {
    return;
  }

  // If unchanged, mark as valid
  if (value === currentUsername.value) {
    isUsernameValid.value = true;
    return;
  }

  if (value.length < MIN_LENGTH) {
    usernameError.value = `Mindestens ${MIN_LENGTH} Zeichen erforderlich`;
    return;
  }

  if (value.length > MAX_LENGTH) {
    usernameError.value = `Maximal ${MAX_LENGTH} Zeichen erlaubt`;
    return;
  }

  if (!USERNAME_REGEX.test(value)) {
    usernameError.value = 'Nur Buchstaben, Zahlen, _ und - erlaubt';
    return;
  }

  isCheckingUsername.value = true;

  validationTimeout = setTimeout(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', value)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        usernameError.value = 'Dieser Benutzername ist bereits vergeben';
        isUsernameValid.value = false;
      } else {
        isUsernameValid.value = true;
      }
    } catch (error) {
      console.error('Error checking username:', error);
      usernameError.value = 'Fehler beim Überprüfen';
    } finally {
      isCheckingUsername.value = false;
    }
  }, 500);
};

const saveUsername = async () => {
  if (!isUsernameValid.value || isSavingUsername.value) return;

  isSavingUsername.value = true;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    await updateProfile(supabase, session.user.id, {
      username: newUsername.value.trim(),
    });

    currentUsername.value = newUsername.value.trim();
    isEditingUsername.value = false;
    showToast('Benutzername erfolgreich geändert!');

    // Emit event to notify other components
    window.dispatchEvent(new CustomEvent('username-updated'));
  } catch (error) {
    console.error('Error saving username:', error);
    showToast('Fehler beim Speichern', 'error');
  } finally {
    isSavingUsername.value = false;
  }
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

    showToast('Ziel erfolgreich aktualisiert!');
  } catch (error) {
    console.error('Error saving goal:', error);
    showToast('Fehler beim Speichern', 'error');
  } finally {
    isSaving.value = false;
  }
};

const exportData = () => {
  showToast('Export-Funktion kommt bald!');
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
