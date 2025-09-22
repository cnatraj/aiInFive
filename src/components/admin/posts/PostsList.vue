<template>
  <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl sm:text-2xl font-bold text-gray-900">
        {{
          currentFilter === "all"
            ? "All Posts"
            : `${
                currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)
              } Posts`
        }}
      </h3>
      <div class="flex space-x-2">
        <button
          @click="setFilter('all')"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="
            currentFilter === 'all'
              ? 'bg-brand-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
        >
          All
        </button>
        <button
          @click="setFilter('pending')"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="
            currentFilter === 'pending'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
        >
          Pending
        </button>
        <button
          @click="setFilter('published')"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="
            currentFilter === 'published'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
        >
          Published
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"
      ></div>
      <p class="text-gray-600">Loading posts...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {{ error }}
    </div>

    <!-- Posts Grid -->
    <div v-else-if="filteredPosts.length > 0" class="space-y-4">
      <PostCard
        v-for="post in filteredPosts"
        v-if="filteredPosts"
        :key="post.id"
        :post="post"
        @post-updated="handlePostUpdate"
        @post-deleted="handlePostDelete"
        @error="handleError"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
      <p class="text-gray-600">
        Posts will appear here once imported from make.com
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import PostCard from "./PostCard.vue";

const props = defineProps({
  currentFilter: {
    type: String,
    default: "all",
  },
});

const emit = defineEmits([
  "update-filter",
  "post-updated",
  "error",
  "posts-loaded",
]);

// Local state for data management
const posts = ref([]);
const loading = ref(false);
const error = ref(null);

const filteredPosts = computed(() => {
  console.log(
    "filteredPosts computed - filter:",
    props.currentFilter,
    "posts:",
    posts.value
  );

  if (!posts.value || !Array.isArray(posts.value)) {
    console.log("No posts or not array");
    return [];
  }

  if (props.currentFilter === "all") {
    console.log("filteredPosts-ALL", posts.value.length, "posts");
    return posts.value;
  }

  const filtered = posts.value.filter(
    (post) => post && post.status === props.currentFilter
  );
  console.log(
    "filteredPosts-FILTERED",
    filtered.length,
    "posts for status:",
    props.currentFilter
  );
  return filtered;
});

const setFilter = (status) => {
  emit("update-filter", status);
};

const handlePostUpdate = (updateData) => {
  emit("post-updated", updateData);
};

const handlePostDelete = (deleteData) => {
  // Remove the deleted post from local state
  const index = posts.value.findIndex(p => p.id === deleteData.postId);
  if (index !== -1) {
    posts.value.splice(index, 1);
    // Emit updated posts to parent for status cards
    emit("posts-loaded", posts.value);
  }
};

const handleError = (errorMessage) => {
  emit("error", errorMessage);
};

const fetchPosts = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Calculate current week number and year using local time
    const now = new Date();
    const currentYear = now.getFullYear();

    // Calculate week number using same logic as PostgreSQL EXTRACT(WEEK FROM date)
    // This matches the database's week calculation
    const startOfYear = new Date(currentYear, 0, 1);
    const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    const currentWeekNumber = Math.ceil(dayOfYear / 7);

    console.log('Fetching posts for:', { currentYear, currentWeekNumber });

    // Query posts for current week only
    const { data, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .eq("year", currentYear)
      .eq("week_number", currentWeekNumber)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Database fetch error:", fetchError);
      throw fetchError;
    }

    console.log(`Posts for week ${currentWeekNumber} of ${currentYear}:`, data);
    console.log("Number of posts found for current week:", data ? data.length : 0);

    // Use the raw data without transformation
    posts.value = data || [];

    // Emit posts to parent for status cards
    emit("posts-loaded", posts.value);
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching posts:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped></style>
