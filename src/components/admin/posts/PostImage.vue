<template>
  <div class="mb-3">
    <!-- Show image if image_url exists -->
    <div v-if="post.image_url && !editingImage" class="relative">
      <button
        @click="startEditingImage"
        class="absolute top-2 left-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 shadow-sm transition-all"
        title="Edit image"
      >
        <svg
          class="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          ></path>
        </svg>
      </button>
      <img
        :src="post.image_url"
        :alt="post.headline"
        class="w-full max-w-md h-48 object-cover rounded-lg shadow-sm"
        @error="handleImageError"
      />
    </div>

    <!-- Show input if no image_url or editing -->
    <div v-else class="space-y-2">
      <input
        v-model="newImageUrl"
        type="url"
        placeholder="Enter image URL..."
        class="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />

      <button
        @click="saveImageUrl"
        :disabled="!newImageUrl || savingImage"
        class="mx-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ savingImage ? "Saving..." : "Save" }}
      </button>
      <button
        v-if="editingImage"
        @click="cancelEditingImage"
        class="mx-2 px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-400 transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "@/lib/supabase";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["post-updated", "error"]);

// Image management state
const editingImage = ref(false);
const newImageUrl = ref("");
const savingImage = ref(false);

// Image management functions
const startEditingImage = () => {
  editingImage.value = true;
  newImageUrl.value = props.post.image_url || "";
};

const cancelEditingImage = () => {
  editingImage.value = false;
  newImageUrl.value = "";
};

const handleImageError = () => {
  console.warn("Failed to load image:", props.post.image_url);
};

const saveImageUrl = async () => {
  if (!newImageUrl.value.trim()) return;

  try {
    savingImage.value = true;

    const { error: updateError } = await supabase
      .from("posts")
      .update({ image_url: newImageUrl.value.trim() })
      .eq("id", props.post.id);

    if (updateError) throw updateError;

    // Update local post data
    props.post.image_url = newImageUrl.value.trim();

    // Reset editing state
    editingImage.value = false;
    newImageUrl.value = "";

    // Emit success event to parent
    emit("post-updated", {
      postId: props.post.id,
      image_url: props.post.image_url,
    });
  } catch (err) {
    console.error("Error updating image URL:", err);
    emit("error", err.message);
  } finally {
    savingImage.value = false;
  }
};
</script>
