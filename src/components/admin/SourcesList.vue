<template>
  <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl sm:text-2xl font-bold text-gray-900">
        Your Sources
      </h3>
      <button
        class="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
      >
        Add Source
      </button>
    </div>

    <!-- Empty State -->
    <div class="text-center py-12">
      <svg
        class="w-16 h-16 text-gray-300 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        ></path>
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        No sources yet
      </h3>
      <p class="text-gray-600 mb-6">
        Get started by adding your first source
      </p>
      <button
        class="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
      >
        Add Your First Source
      </button>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped></style>