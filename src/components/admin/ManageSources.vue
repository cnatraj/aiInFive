<template>
  <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Manage Sources
        </h2>
        <p class="text-gray-600">
          Create and organize your content sources
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
      >
        Add Source
      </button>
    </div>

    <!-- Create Source Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Create New Source
        </h3>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>

        <form @submit.prevent="createSource" class="space-y-4">
          <div>
            <label class="form-label">Name</label>
            <input
              v-model="newSource.name"
              type="text"
              required
              placeholder="Enter source name"
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">Website</label>
            <input
              v-model="newSource.website"
              type="url"
              placeholder="https://example.com"
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">RSS URL</label>
            <input
              v-model="newSource.rssUrl"
              type="url"
              placeholder="https://example.com/feed.xml"
              class="form-input"
            />
          </div>

          <div>
            <label class="flex items-center space-x-2">
              <input
                v-model="newSource.isActive"
                type="checkbox"
                class="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <span class="text-sm font-medium text-gray-700">Active</span>
            </label>
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
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
const showCreateModal = ref(false)
const loading = ref(false)
const error = ref(null)

const newSource = ref({
  name: "",
  website: "",
  rssUrl: "",
  isActive: true,
})

const createSource = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: insertError } = await supabase
      .from('sources')
      .insert([
        {
          name: newSource.value.name,
          website: newSource.value.website,
          rss_url: newSource.value.rssUrl,
          is_active: newSource.value.isActive,
          user_id: user.value.id
        }
      ])
      .select()

    if (insertError) throw insertError

    console.log('Source created successfully:', data)

    // Reset form
    newSource.value = {
      name: "",
      website: "",
      rssUrl: "",
      isActive: true,
    }

    showCreateModal.value = false
  } catch (err) {
    error.value = err.message
    console.error('Error creating source:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>