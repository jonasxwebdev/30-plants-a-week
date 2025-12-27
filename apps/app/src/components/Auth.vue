<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { motion, AnimatePresence } from 'motion-v';
import { authManager } from '../lib/authClient';

type View = 'login' | 'register' | 'onboarding';

const currentView = ref<View>('login');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

// Onboarding form data
const onboardingData = ref({
  full_name: '',
  weekly_goal: 30,
  week_start_day: 1, // 1 = Monday
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

// Check for URL parameters for error/success messages
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('error')) {
    error.value = urlParams.get('error');
  }
  if (urlParams.has('message')) {
    success.value = urlParams.get('message');
  }
});

async function handleLogin() {
  if (!email.value || !password.value) return;

  isLoading.value = true;
  error.value = null;
  success.value = null;

  try {
    await authManager.signInWithPassword(email.value, password.value);

    // Check if user needs onboarding
    const supabase = authManager.getSupabaseClient();
    const session = await authManager.getSession();

    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();

      // If no full_name, show onboarding
      if (!profile?.full_name) {
        currentView.value = 'onboarding';
        isLoading.value = false;
        return;
      }
    }

    // Otherwise redirect to dashboard
    window.location.href = '/';
  } catch (e: any) {
    error.value = e.message || 'Anmeldung fehlgeschlagen';
  } finally {
    isLoading.value = false;
  }
}

async function handleRegister() {
  if (!email.value || !password.value || !confirmPassword.value) return;

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwörter stimmen nicht überein';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Passwort muss mindestens 6 Zeichen lang sein';
    return;
  }

  isLoading.value = true;
  error.value = null;
  success.value = null;

  try {
    await authManager.signUp(email.value, password.value);

    // Show success message - user needs to verify email
    success.value =
      'Registrierung erfolgreich! Bitte überprüfe deine E-Mail, um dein Konto zu bestätigen.';

    // Switch to login view after a moment
    setTimeout(() => {
      switchView('login');
      success.value = 'E-Mail bestätigt? Jetzt anmelden!';
    }, 3000);
  } catch (e: any) {
    error.value = e.message || 'Registrierung fehlgeschlagen';
  } finally {
    isLoading.value = false;
  }
}

async function handleOnboarding() {
  if (!onboardingData.value.full_name) {
    error.value = 'Bitte gib deinen Namen ein';
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    // Update profile with onboarding data
    const session = await authManager.getSession();
    if (!session?.user) {
      throw new Error('Keine aktive Sitzung');
    }

    const supabase = authManager.getSupabaseClient();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: onboardingData.value.full_name,
        weekly_goal: onboardingData.value.weekly_goal,
        week_start_day: onboardingData.value.week_start_day,
        timezone: onboardingData.value.timezone,
      })
      .eq('id', session.user.id);

    if (updateError) throw updateError;

    // Redirect to dashboard
    window.location.href = '/';
  } catch (e: any) {
    error.value = e.message || 'Fehler beim Speichern';
  } finally {
    isLoading.value = false;
  }
}

function switchView(view: View) {
  currentView.value = view;
  error.value = null;
  success.value = null;
}
</script>

<template>
  <div
    class="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <span class="text-2xl">🌿</span>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-text">30 plants a week</h2>
      <p class="mt-2 text-center text-sm text-gray-600">Tracke deine Darmvielfalt</p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md mx-2">
      <div
        class="bg-white py-8 px-4 shadow-lg rounded-2xl sm:rounded-3xl sm:px-10 border border-gray-100"
      >
        <!-- Error/Success Messages -->
        <div v-if="error" class="mb-4 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
          {{ error }}
        </div>
        <div v-if="success" class="mb-4 p-4 rounded-xl bg-primary/10 text-primary text-sm">
          {{ success }}
        </div>

        <AnimatePresence mode="wait">
          <!-- Login View -->
          <motion.div
            v-if="currentView === 'login'"
            key="login"
            :initial="{ opacity: 0, x: -20 }"
            :animate="{ opacity: 1, x: 0 }"
            :exit="{ opacity: 0, x: 20 }"
            :transition="{ duration: 0.2 }"
          >
            <h3 class="text-lg font-semibold text-text mb-6">Anmelden</h3>

            <form @submit.prevent="handleLogin" class="space-y-4">
              <div>
                <label for="email-login" class="block text-sm font-medium text-gray-700 mb-1">
                  E-Mail-Adresse
                </label>
                <input
                  id="email-login"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-white text-text"
                  placeholder="du@beispiel.de"
                />
              </div>

              <div>
                <label for="password-login" class="block text-sm font-medium text-gray-700 mb-1">
                  Passwort
                </label>
                <input
                  id="password-login"
                  v-model="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-white text-text"
                />
              </div>

              <motion.button
                type="submit"
                :disabled="isLoading"
                class="w-full flex justify-center rounded-xl bg-primary py-2.5 px-4 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :whileHover="{ scale: 1.02 }"
                :whileTap="{ scale: 0.98 }"
              >
                <span v-if="isLoading">Anmeldung läuft...</span>
                <span v-else>Anmelden</span>
              </motion.button>
            </form>

            <div class="mt-6 text-center">
              <button
                @click="switchView('register')"
                class="text-sm font-medium text-primary hover:text-primary/80"
              >
                Noch kein Konto? Jetzt registrieren
              </button>
            </div>
          </motion.div>

          <!-- Register View -->
          <motion.div
            v-else-if="currentView === 'register'"
            key="register"
            :initial="{ opacity: 0, x: 20 }"
            :animate="{ opacity: 1, x: 0 }"
            :exit="{ opacity: 0, x: -20 }"
            :transition="{ duration: 0.2 }"
          >
            <h3 class="text-lg font-semibold text-text mb-6">Registrieren</h3>

            <form @submit.prevent="handleRegister" class="space-y-4">
              <div>
                <label for="email-register" class="block text-sm font-medium text-gray-700 mb-1">
                  E-Mail-Adresse
                </label>
                <input
                  id="email-register"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-white text-text"
                  placeholder="du@beispiel.de"
                />
              </div>

              <div>
                <label for="password-register" class="block text-sm font-medium text-gray-700 mb-1">
                  Passwort
                </label>
                <input
                  id="password-register"
                  v-model="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-white text-text"
                />
              </div>

              <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">
                  Passwort bestätigen
                </label>
                <input
                  id="confirm-password"
                  v-model="confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-white text-text"
                />
              </div>

              <motion.button
                type="submit"
                :disabled="isLoading"
                class="w-full flex justify-center rounded-xl bg-primary py-2.5 px-4 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :whileHover="{ scale: 1.02 }"
                :whileTap="{ scale: 0.98 }"
              >
                <span v-if="isLoading">Registrierung läuft...</span>
                <span v-else>Konto erstellen</span>
              </motion.button>
            </form>

            <div class="mt-6 text-center">
              <button
                @click="switchView('login')"
                class="text-sm font-medium text-primary hover:text-primary/80"
              >
                Schon registriert? Jetzt anmelden
              </button>
            </div>
          </motion.div>

          <!-- Onboarding View -->
          <motion.div
            v-else-if="currentView === 'onboarding'"
            key="onboarding"
            :initial="{ opacity: 0, scale: 0.95 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 1.05 }"
            :transition="{ duration: 0.3 }"
          >
            <h3 class="text-lg font-semibold text-text mb-2">Fast geschafft! 🎉</h3>
            <p class="text-sm text-gray-600 mb-6">
              Noch ein paar Informationen, dann kann es losgehen.
            </p>

            <form @submit.prevent="handleOnboarding" class="space-y-4">
              <div>
                <label for="full-name" class="block text-sm font-medium text-gray-700 mb-1">
                  Wie heißt du?
                </label>
                <input
                  id="full-name"
                  v-model="onboardingData.full_name"
                  type="text"
                  required
                  class="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-white text-text"
                  placeholder="Dein Name"
                />
              </div>

              <div>
                <label for="weekly-goal" class="block text-sm font-medium text-gray-700 mb-1">
                  Wöchentliches Ziel
                </label>
                <select
                  id="weekly-goal"
                  v-model="onboardingData.weekly_goal"
                  class="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-white text-text"
                >
                  <option :value="20">20 Pflanzen pro Woche</option>
                  <option :value="25">25 Pflanzen pro Woche</option>
                  <option :value="30">30 Pflanzen pro Woche (empfohlen)</option>
                  <option :value="35">35 Pflanzen pro Woche</option>
                  <option :value="40">40 Pflanzen pro Woche</option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  Experten empfehlen 30 verschiedene Pflanzen pro Woche für optimale Darmgesundheit
                </p>
              </div>

              <div>
                <label for="week-start" class="block text-sm font-medium text-gray-700 mb-1">
                  Wochenbeginn
                </label>
                <select
                  id="week-start"
                  v-model="onboardingData.week_start_day"
                  class="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-white text-text"
                >
                  <option :value="0">Sonntag</option>
                  <option :value="1">Montag</option>
                  <option :value="2">Dienstag</option>
                  <option :value="3">Mittwoch</option>
                  <option :value="4">Donnerstag</option>
                  <option :value="5">Freitag</option>
                  <option :value="6">Samstag</option>
                </select>
              </div>

              <motion.button
                type="submit"
                :disabled="isLoading"
                class="w-full flex justify-center rounded-xl bg-primary py-2.5 px-4 text-sm font-medium text-white shadow-lg shadow-primary/30 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :whileHover="{ scale: 1.02 }"
                :whileTap="{ scale: 0.98 }"
              >
                <span v-if="isLoading">Wird gespeichert...</span>
                <span v-else>Los geht's! 🌿</span>
              </motion.button>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
</template>
