<template>
  <div
    v-if="post && post.headline"
    class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
  >
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h4 class="text-lg font-semibold text-gray-900 mb-2">
          {{ post.headline }}
        </h4>

        <!-- Image Section -->
        <PostImage
          :post="post"
          @post-updated="handlePostUpdate"
          @error="handleError"
        />

        <p class="text-gray-600 text-sm mb-3">
          {{ post.summary }}
        </p>
        <p class="text-gray-700 text-sm mb-3">
          <strong>Why it matters:</strong> {{ post.why_it_matters }}
        </p>
      </div>

      <div class="ml-4 flex flex-col items-end space-y-2">
        <!-- Action Buttons -->
        <div class="flex flex-col items-end space-y-2">
          <!-- Delete Button -->
          <button
            @click="deletePost"
            :disabled="loading"
            class="flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
            title="Delete post"
          >
            <svg
              class="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            Delete
          </button>

          <!-- Toggle Switch -->
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-600">Pending</span>
            <button
              @click="toggleStatus"
              :disabled="loading"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50"
              :class="
                post.status === 'published' ? 'bg-green-500' : 'bg-gray-300'
              "
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="
                  post.status === 'published'
                    ? 'translate-x-6'
                    : 'translate-x-1'
                "
              ></span>
            </button>
            <span class="text-xs text-gray-600">Published</span>
          </div>

          <!-- Loading indicator -->
          <div v-if="loading" class="text-xs text-gray-500">
            {{
              post.status === "published" ? "Unpublishing..." : "Publishing..."
            }}
          </div>

          <!-- Status Badge -->
          <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="getStatusClass(post.status)"
          >
            {{ post.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Metadata -->
    <div class="flex justify-between items-center text-sm text-gray-500">
      <!-- Status Change Timestamps -->
      <div
        v-if="post.published_at || post.archived_at"
        class="text-xs text-gray-500"
      >
        <span v-if="post.published_at" class="block">
          Published: {{ formatDate(post.published_at) }}
        </span>
        <span v-if="post.archived_at" class="block">
          Archived: {{ formatDate(post.archived_at) }}
        </span>
      </div>

      <div class="flex space-x-4">
        <span v-if="post && post.source_name">Source: {{ post.source_name }}</span>
        <span v-if="post && post.run_id">Batch: {{ post.run_id }}</span>
      </div>
      <span>{{ formatDate(post.created_at) }}</span>
    </div>

    <!-- Categories -->
    <div v-if="post && post.categories && post.categories.length > 0" class="mt-3">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="category in post.categories"
          :key="category.id"
          class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
        >
          {{ category.name }}
        </span>
      </div>
    </div>

    <!-- External Link -->
    <div v-if="post && post.url" class="mt-3">
      <a
        :href="post.url"
        target="_blank"
        class="text-brand-500 hover:text-brand-600 text-sm underline"
      >
        Read Original Article →
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import PostImage from "./PostImage.vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["post-updated", "post-deleted", "error"]);

const loading = ref(false);

const toggleStatus = async () => {
  const newStatus = props.post.status === "published" ? "pending" : "published";

  try {
    loading.value = true;

    const updateData = {
      status: newStatus,
    };

    // Add timestamp for published status
    if (newStatus === "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", props.post.id);

    if (updateError) throw updateError;

    // Emit success event to parent
    emit("post-updated", {
      postId: props.post.id,
      status: newStatus,
      ...updateData,
    });
  } catch (err) {
    console.error("Error updating post status:", err);
    emit("error", err.message);
  } finally {
    loading.value = false;
  }
};

const deletePost = async () => {
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return;
  }

  try {
    loading.value = true;

    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", props.post.id);

    if (deleteError) throw deleteError;

    // Emit success event to parent
    emit("post-deleted", {
      postId: props.post.id,
    });
  } catch (err) {
    console.error("Error deleting post:", err);
    emit("error", err.message);
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-orange-100 text-orange-800";
    case "selected":
      return "bg-blue-100 text-blue-800";
    case "published":
      return "bg-green-100 text-green-800";
    case "archived":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped></style>
