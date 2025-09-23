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
              Dashboard
            </h1>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="px-6 lg:px-8 py-6 sm:py-8">
        <div class="space-y-6 sm:space-y-8">
          <!-- Welcome Card -->
          <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <h2
              class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4"
            >
              Welcome, {{ username }}!
            </h2>
            <p class="text-gray-600 text-sm sm:text-base lg:text-lg">
              You have successfully logged into the dashboard.
            </p>
          </div>

          <!-- Stats Grid -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <div
              class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Projects</h3>
              <div class="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                12
              </div>
              <p class="text-gray-600 text-sm">Active projects</p>
            </div>

            <div
              class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Tasks</h3>
              <div class="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                45
              </div>
              <p class="text-gray-600 text-sm">Pending tasks</p>
            </div>

            <div
              class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Messages</h3>
              <div class="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                8
              </div>
              <p class="text-gray-600 text-sm">Unread messages</p>
            </div>

            <div
              class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Reports</h3>
              <div class="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
                3
              </div>
              <p class="text-gray-600 text-sm">This month</p>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h3
              class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6"
            >
              Recent Activity
            </h3>
            <div class="space-y-3 sm:space-y-4">
              <div
                class="flex items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div
                  class="w-2 h-2 bg-blue-500 rounded-full mr-3 sm:mr-4"
                ></div>
                <span class="text-gray-700 text-sm sm:text-base"
                  >Completed project review</span
                >
              </div>
              <div
                class="flex items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div
                  class="w-2 h-2 bg-green-500 rounded-full mr-3 sm:mr-4"
                ></div>
                <span class="text-gray-700 text-sm sm:text-base"
                  >Updated user profile</span
                >
              </div>
              <div
                class="flex items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div
                  class="w-2 h-2 bg-purple-500 rounded-full mr-3 sm:mr-4"
                ></div>
                <span class="text-gray-700 text-sm sm:text-base"
                  >Sent weekly report</span
                >
              </div>
              <div
                class="flex items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div
                  class="w-2 h-2 bg-orange-500 rounded-full mr-3 sm:mr-4"
                ></div>
                <span class="text-gray-700 text-sm sm:text-base"
                  >Created new task</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Categories Management -->
        <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900">
              Quick Categories
            </h3>
            <router-link
              to="/categories"
              class="text-brand-500 hover:text-brand-600 text-sm font-medium"
            >
              View All →
            </router-link>
          </div>
          <ManageCategories />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import LeftNav from "@/components/admin/navigation/LeftNav.vue";
import ManageCategories from "@/components/admin/ManageCategories.vue";

const router = useRouter();
const { user, signOut, initializeAuth } = useAuth();

const username = computed(() => {
  if (user.value?.user_metadata?.full_name) {
    return user.value.user_metadata.full_name;
  }
  if (user.value?.email) {
    return user.value.email.split('@')[0];
  }
  return 'User';
});

onMounted(() => {
  initializeAuth();
});

const logout = async () => {
  const { error } = await signOut();
  if (!error) {
    router.push("/login");
  }
};
</script>

<style scoped></style>
