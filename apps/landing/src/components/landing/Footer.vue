<template>
  <footer class="bg-white border-t border-neutral-200 py-8 sm:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-5 sm:gap-6">
        <!-- Brand -->
        <div class="flex items-center gap-2 sm:gap-3">
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20"
          >
            <span class="text-lg sm:text-xl">🌿</span>
          </div>
          <span class="font-serif text-xl sm:text-2xl font-normal text-neutral-900">30 Plants</span>
        </div>

        <!-- Links -->
        <div
          class="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-neutral-600"
        >
          <a href="/impressum" class="hover:text-primary-600 transition-colors">Impressum</a>
          <a href="/datenschutz" class="hover:text-primary-600 transition-colors">Datenschutz</a>
        </div>

        <!-- Attribution -->
        <div class="text-xs sm:text-sm text-neutral-600 text-center md:text-right">
          <p>Ein kleines Projekt von</p>
          <a
            href="https://jrxmedia.de"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Jonas Reidel
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
