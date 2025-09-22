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
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
              Categories
            </h1>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="px-6 lg:px-8 py-6 sm:py-8">
        <ManageCategories />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import LeftNav from "@/components/admin/navigation/LeftNav.vue";
import ManageCategories from "@/components/admin/ManageCategories.vue";

const { initializeAuth } = useAuth();

onMounted(() => {
  initializeAuth();
});
</script>

<style scoped></style>
