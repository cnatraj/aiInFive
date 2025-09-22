<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Navigation -->
    <LeftNav />

    <!-- Main Content Area -->
    <div class="flex-1 ml-64">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-6 lg:px-8">
          <div class="flex justify-between items-center py-4 sm:py-6">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Posts</h1>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="px-6 lg:px-8 py-6 sm:py-8">
        <div class="space-y-6 sm:space-y-8">
          <!-- Status Filter Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="statusCard in statusCards"
              :key="statusCard.status"
              @click="setFilter(statusCard.status)"
              class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              :class="
                currentFilter === statusCard.status
                  ? 'ring-2 ring-brand-500'
                  : ''
              "
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-3">
                {{ statusCard.title }}
              </h3>
              <div
                class="text-3xl sm:text-4xl font-bold mb-2"
                :class="statusCard.colorClass"
              >
                {{ statusCard.count }}
              </div>
              <p class="text-gray-600 text-sm">{{ statusCard.description }}</p>
            </div>
          </div>

          <!-- Posts List -->
          <PostsList
            :current-filter="currentFilter"
            @update-filter="setFilter"
            @post-updated="handlePostUpdate"
            @posts-loaded="handlePostsLoaded"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import LeftNav from "@/components/admin/navigation/LeftNav.vue";
import PostsList from "@/components/admin/posts/PostsList.vue";

const { initializeAuth } = useAuth();

const posts = ref([]);
const currentFilter = ref("all");

const statusCards = computed(() => [
  {
    status: "pending",
    title: "Pending",
    count: posts.value.filter((p) => p.status === "pending").length,
    description: "Awaiting review",
    colorClass: "text-orange-600",
  },
  {
    status: "selected",
    title: "Selected",
    count: posts.value.filter((p) => p.status === "selected").length,
    description: "Chosen for publishing",
    colorClass: "text-blue-600",
  },
  {
    status: "published",
    title: "Published",
    count: posts.value.filter((p) => p.status === "published").length,
    description: "Live posts",
    colorClass: "text-green-600",
  },
  {
    status: "archived",
    title: "Archived",
    count: posts.value.filter((p) => p.status === "archived").length,
    description: "Not selected",
    colorClass: "text-gray-600",
  },
]);

const setFilter = (status) => {
  currentFilter.value = status;
};

const handlePostsLoaded = (loadedPosts) => {
  posts.value = loadedPosts;
};

const handlePostUpdate = (updateData) => {
  // Update local state when a post is updated
  const post = posts.value.find((p) => p.id === updateData.postId);
  if (post) {
    post.status = updateData.status;
    // Update timestamps if provided
    if (updateData.published_at) {
      post.published_at = updateData.published_at;
    }
    if (updateData.archived_at) {
      post.archived_at = updateData.archived_at;
    }
  }
};

onMounted(() => {
  initializeAuth();
});
</script>

<style scoped></style>
