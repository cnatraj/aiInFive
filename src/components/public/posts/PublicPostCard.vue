<template>
  <div class="group">
    <!-- Number -->
    <div class="mb-6">
      <span class="text-6xl font-bold text-gray-700 border-b-4 border-brand-500">
        {{ index + 1 }}
      </span>
    </div>

    <!-- Content -->
    <div>
      <!-- Title -->
      <h3 class="text-2xl font-bold text-gray-700 mb-3">
        {{ post.headline }}
      </h3>

      <!-- Image -->
      <div v-if="post.image_url" class="mb-4">
        <img
          :src="post.image_url"
          :alt="post.headline"
          class="w-full h-64 object-cover rounded-lg shadow-md"
          @error="handleImageError"
          @load="handleImageLoad"
        />
      </div>

      <!-- Summary -->
      <p class="text-gray-600 mb-4 leading-relaxed">
        {{ post.summary }}
      </p>

      <!-- Why it matters -->
      <div v-if="post.why_it_matters" class="mb-4">
        <p class="text-gray-700">
          <span class="font-medium text-gray-900">Why it matters:</span>
          {{ post.why_it_matters }}
        </p>
      </div>

      <!-- Footer with external link -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-100">
        <!-- Published date -->
        <span class="text-sm text-gray-500">
          {{ formatDate(post.created_at) }}
        </span>

        <!-- Read more link -->
        <a
          v-if="post.url"
          :href="post.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center text-brand-500 hover:text-brand-600 text-sm font-medium transition-colors"
        >
          Read Full Article
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

// Debug logging to see what data we're receiving
onMounted(() => {
  console.log("PublicPostCard - Post data:", props.post);
  console.log("PublicPostCard - Image URL:", props.post.image_url);
  console.log("PublicPostCard - Has image_url?", !!props.post.image_url);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const handleImageLoad = () => {
  console.log("✅ Image loaded successfully:", props.post.image_url);
};

const handleImageError = (event) => {
  console.error("❌ Failed to load image:", props.post.image_url);
  console.error("Error event:", event);
  // Hide the image container if the image fails to load
  event.target.parentElement.style.display = "none";
};
</script>