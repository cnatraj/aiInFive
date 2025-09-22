<template>
  <nav
    class="fixed left-0 top-0 h-full w-64 bg-white shadow-theme-lg border-r border-gray-200 z-10"
  >
    <div class="flex flex-col h-full">
      <!-- Logo/Brand Section -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">Dashboard</h2>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 py-6">
        <nav class="space-y-2 px-4">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50"
            :class="
              isActive(item.path)
                ? 'bg-brand-50 text-brand-500 border-r-2 border-brand-500'
                : 'text-gray-700 hover:text-gray-900'
            "
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="item.icon"
              ></path>
            </svg>
            {{ item.name }}
            <span
              v-if="item.badge"
              class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </nav>
      </div>

      <!-- User Section -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center space-x-3 mb-4">
          <div
            class="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center"
          >
            <span class="text-white font-medium text-sm">{{
              userInitials
            }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ username }}
            </p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
        </div>

        <button
          @click="logout"
          class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const route = useRoute();
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

const menuItems = ref([
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z",
  },
  {
    name: "Posts",
    path: "/posts",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    name: "Categories",
    path: "/categories",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    name: "Sources",
    path: "/sources",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    name: "Projects",
    path: "/projects",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  {
    name: "Messages",
    path: "/messages",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    badge: "8",
  },
  {
    name: "Reports",
    path: "/reports",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
]);

const userInitials = computed(() => {
  return username.value
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
});

const isActive = (path) => {
  return route.path === path;
};

const logout = async () => {
  const { error } = await signOut();
  if (!error) {
    router.push("/login");
  }
};

onMounted(() => {
  initializeAuth();
});
</script>

<style scoped></style>
