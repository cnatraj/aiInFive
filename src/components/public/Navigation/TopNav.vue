<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <Logo />
        <!-- Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <!-- <router-link
              to="/"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-gray-900': $route.path === '/' }"
            >
              Home
            </router-link> -->
            <!-- <router-link
              to="/login"
              class="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Login
            </router-link> -->
          </div>
        </div>

        <!-- Mobile menu button -->
        <!-- <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div> -->
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
        <router-link
          to="/"
          @click="mobileMenuOpen = false"
          class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          :class="{ 'text-gray-900': $route.path === '/' }"
        >
          Home
        </router-link>
        <router-link
          to="/login"
          @click="mobileMenuOpen = false"
          class="bg-brand-500 hover:bg-brand-600 text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Login
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import Logo from "./Logo.vue";

const mobileMenuOpen = ref(false);
</script>

<style scoped></style>
