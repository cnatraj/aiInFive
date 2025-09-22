<template>
  <div class="max-w-4xl mx-auto">
    <!-- Section Header -->
    <div class="mb-8">
      <p class="text-gray-600 max-w-2xl">
        Every week, we bring you the most important AI news and insights,
        summarized in plain English.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="props.loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"
      ></div>
      <p class="text-gray-600">Loading this week's updates...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="props.error"
      class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center"
    >
      <p>Unable to load posts at this time. Please try again later.</p>
    </div>

    <!-- Posts Numbered List -->
    <div v-else-if="props.posts.length > 0" class="space-y-8">
      <PublicPostCard
        v-for="(post, index) in props.posts"
        :key="post.id"
        :post="post"
        :index="index"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div
        class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
      <p class="text-gray-600">
        Check back soon for this week's AI updates and insights.
      </p>
    </div>
  </div>
</template>

<script setup>
import PublicPostCard from "./PublicPostCard.vue";

const props = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});
</script>

<style scoped></style>
