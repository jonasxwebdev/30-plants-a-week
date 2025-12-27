<template>
  <div>
    <AnimatePresence>
      <motion.div
        v-if="showSetup"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
      >
        <motion.div
          class="w-full max-w-md mx-4 rounded-3xl bg-white p-8 shadow-2xl"
          :initial="{ opacity: 0, scale: 0.9, y: 20 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.9, y: 20 }"
        >
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="mb-4 text-5xl">👋</div>
            <h2 class="text-2xl font-bold text-text mb-2">Willkommen!</h2>
            <p class="text-sm text-gray-600">
              Bitte wähle einen einzigartigen Benutzernamen, um fortzufahren
            </p>
          </div>

          <!-- Form -->
          <div class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                Benutzername
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                <input
                  id="username"
                  ref="usernameInput"
                  v-model="username"
                  @input="validateUsername"
                  @keydown.enter="handleSubmit"
                  type="text"
                  placeholder="benutzername"
                  class="w-full rounded-xl border-2 pl-8 pr-4 py-3 focus:outline-none transition-colors"
                  :class="
                    usernameError
                      ? 'border-red-300 focus:border-red-500'
                      : isUsernameValid
                        ? 'border-green-300 focus:border-green-500'
                        : 'border-gray-200 focus:border-primary'
                  "
                  maxlength="30"
                  autocomplete="off"
                />
                <!-- Validation Icons -->
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
              <!-- Error/Help Text -->
              <p v-if="usernameError" class="mt-2 text-xs text-red-600">
                {{ usernameError }}
              </p>
              <p v-else-if="isUsernameValid" class="mt-2 text-xs text-green-600">
                ✓ Benutzername verfügbar
              </p>
              <p v-else class="mt-2 text-xs text-gray-500">
                Nur Buchstaben, Zahlen, Unterstriche und Bindestriche (3-30 Zeichen)
              </p>
            </div>

            <!-- Submit Button -->
            <motion.button
              @click="handleSubmit"
              :disabled="!isUsernameValid || isSaving"
              class="w-full rounded-xl py-3 font-semibold text-white transition-all"
              :class="
                isUsernameValid && !isSaving
                  ? 'bg-primary hover:bg-primary/90'
                  : 'bg-gray-300 cursor-not-allowed'
              "
              :whileTap="isUsernameValid && !isSaving ? { scale: 0.98 } : {}"
            >
              <span v-if="isSaving" class="flex items-center justify-center gap-2">
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
                Wird gespeichert...
              </span>
              <span v-else>Benutzername bestätigen</span>
            </motion.button>
          </div>

          <!-- Info Box -->
          <div class="mt-6 rounded-xl bg-blue-50 p-4">
            <div class="flex gap-3">
              <div class="flex-1">
                <p class="text-xs text-gray-700">
                  Dein Benutzername wird benötigt, um Freunde hinzuzufügen und deine Fortschritte zu
                  teilen.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { motion, AnimatePresence } from 'motion-v';
import { createBrowserClient } from '../lib/supabase';
import { getProfile, updateProfile } from '../lib/db';

let supabase: any = null;
const showSetup = ref(false);
const username = ref('');
const usernameError = ref('');
const isUsernameValid = ref(false);
const isCheckingUsername = ref(false);
const isSaving = ref(false);
const usernameInput = ref<HTMLInputElement | null>(null);

let validationTimeout: NodeJS.Timeout | null = null;

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;

async function checkIfUsernameNeeded() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const profile = await getProfile(supabase, session.user.id);

    // Show setup if username is null, undefined, or empty string
    if (!profile.username || profile.username.trim() === '') {
      showSetup.value = true;
      await nextTick();
      usernameInput.value?.focus();
    }
  } catch (error) {
    console.error('Error checking username:', error);
  }
}

async function validateUsername() {
  const value = username.value.trim();

  // Clear previous validation
  isUsernameValid.value = false;
  usernameError.value = '';

  // Clear previous timeout
  if (validationTimeout) {
    clearTimeout(validationTimeout);
  }

  // Basic validation
  if (value.length === 0) {
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

  // Check if username is available (with debounce)
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
        usernameError.value = '';
      }
    } catch (error) {
      console.error('Error checking username:', error);
      usernameError.value = 'Fehler beim Überprüfen des Benutzernamens';
    } finally {
      isCheckingUsername.value = false;
    }
  }, 500);
}

async function handleSubmit() {
  if (!isUsernameValid.value || isSaving.value) return;

  isSaving.value = true;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    // Save username to profile
    await updateProfile(supabase, session.user.id, {
      username: username.value.trim(),
    });

    // Close the setup modal
    showSetup.value = false;

    // Emit event to notify other components
    window.dispatchEvent(new CustomEvent('username-set'));
  } catch (error) {
    console.error('Error saving username:', error);
    usernameError.value = 'Fehler beim Speichern des Benutzernamens';
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  supabase = createBrowserClient();
  checkIfUsernameNeeded();

  // Re-check when user signs in
  window.addEventListener('username-check', checkIfUsernameNeeded);
});
</script>
