<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Manage Categories
          </h2>
          <p class="text-gray-600">
            Create and organize your content categories
          </p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
        >
          Add Category
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading && categories.length === 0" class="bg-white rounded-xl shadow-lg p-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading categories...</p>
    </div>

    <!-- Categories Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
      >
        <div class="flex items-start justify-between mb-4">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            :style="{ backgroundColor: category.color }"
          >
            {{ category.name.charAt(0).toUpperCase() }}
          </div>
          <button
            @click="deleteCategory(category.id)"
            :disabled="loading"
            class="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>

        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ category.name }}
        </h3>

        <p class="text-gray-600 text-sm mb-4">
          {{ category.description || 'No description' }}
        </p>

        <div class="flex items-center justify-between">
          <span
            class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
          >
            {{ category.item_count || 0 }} items
          </span>
          <span class="text-xs text-gray-500">
            Created {{ formatDate(category.created_at) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && categories.length === 0"
      class="bg-white rounded-xl shadow-lg p-12 text-center"
    >
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
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        ></path>
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        No categories yet
      </h3>
      <p class="text-gray-600 mb-6">
        Get started by creating your first category
      </p>
      <button
        @click="showCreateModal = true"
        class="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
      >
        Create Category
      </button>
    </div>

    <!-- Create Category Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Create New Category
        </h3>

        <form @submit.prevent="createCategory" class="space-y-4">
          <div>
            <label class="form-label">Category Name</label>
            <input
              v-model="newCategory.name"
              type="text"
              required
              placeholder="Enter category name"
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">Description</label>
            <textarea
              v-model="newCategory.description"
              placeholder="Enter category description"
              rows="3"
              class="form-input"
            ></textarea>
          </div>

          <div>
            <label class="form-label">Color</label>
            <div class="flex space-x-2">
              <button
                v-for="color in colorOptions"
                :key="color"
                type="button"
                @click="newCategory.color = color"
                class="w-8 h-8 rounded-full border-2 transition-all"
                :class="
                  newCategory.color === color
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-300'
                "
                :style="{ backgroundColor: color }"
              ></button>
            </div>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="showCreateModal = false"
              class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {{ loading ? 'Creating...' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
const showCreateModal = ref(false)
const categories = ref([])
const loading = ref(false)
const error = ref(null)

const newCategory = ref({
  name: "",
  description: "",
  color: "#3B82F6",
})

const colorOptions = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
]

const fetchCategories = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError

    categories.value = data || []
  } catch (err) {
    error.value = err.message
    console.error('Error fetching categories:', err)
  } finally {
    loading.value = false
  }
}

const createCategory = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: insertError } = await supabase
      .from('categories')
      .insert([
        {
          name: newCategory.value.name,
          description: newCategory.value.description,
          color: newCategory.value.color,
          user_id: user.value.id
        }
      ])
      .select()

    if (insertError) throw insertError

    // Add new category to local state
    if (data && data[0]) {
      categories.value.unshift(data[0])
    }

    // Reset form
    newCategory.value = {
      name: "",
      description: "",
      color: "#3B82F6",
    }

    showCreateModal.value = false
  } catch (err) {
    error.value = err.message
    console.error('Error creating category:', err)
  } finally {
    loading.value = false
  }
}

const deleteCategory = async (id) => {
  if (!confirm("Are you sure you want to delete this category?")) {
    return
  }

  try {
    loading.value = true
    error.value = null

    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    // Remove from local state
    categories.value = categories.value.filter((cat) => cat.id !== id)
  } catch (err) {
    error.value = err.message
    console.error('Error deleting category:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
</style>