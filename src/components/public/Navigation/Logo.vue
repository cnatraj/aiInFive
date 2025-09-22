<template>
  <!-- Logo/Brand -->
  <div class="flex items-center">
    <router-link to="/" class="flex items-center space-x-2">
      <img :src="logoSrc" alt="Weekly AI Digest" class="h-8 w-8" />
      <span class="text-xl font-bold text-gray-900">Weekly AI Digest</span>
    </router-link>
  </div>
</template>

<script setup>
import logoSrc from '@/assets/images/logo.svg'
</script>
