<template>
  <footer class="bg-white py-12 border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🌿</span>
          <span class="font-serif font-bold text-text text-lg">30 Plants</span>
        </div>

        <div class="flex gap-8 text-sm text-text-muted">
          <a href="#" class="hover:text-primary transition-colors">Privacy</a>
          <a href="#" class="hover:text-primary transition-colors">Terms</a>
          <a href="#" class="hover:text-primary transition-colors">Contact</a>
        </div>

        <div class="text-sm text-text-muted">
          &copy; {{ new Date().getFullYear() }} 30 Plants a Week
        </div>
      </div>
    </div>
  </footer>
</template>
