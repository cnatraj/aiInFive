<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
        <div class="mb-5 sm:mb-8">
          <h1
            class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
          >
            Sign In
          </h1>
        </div>

        <!-- Google Login Button -->
        <div class="mb-6">
          <button
            type="button"
            @click="handleGoogleLogin"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 text-sm font-medium text-gray-700"
          >
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <!-- Divider -->
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-6">
          <div>
            <label for="email" class="form-label"> Email </label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="Enter your email"
              class="form-input"
            />
          </div>

          <div>
            <label for="password" class="form-label"> Password </label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              placeholder="Enter your password"
              class="form-input"
            />
          </div>

          <div
            v-if="error"
            class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center text-sm"
          >
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-lg text-center">
          <p class="text-sm font-semibold text-gray-700 mb-2">
            Authentication:
          </p>
          <p class="text-xs sm:text-sm text-gray-600">
            Sign up for an account or use Google OAuth to get started
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { signIn, signInWithGoogle, loading } = useAuth();

const email = ref("");
const password = ref("");
const error = ref("");

const handleLogin = async () => {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "Please fill in all fields";
    return;
  }

  const { data, error: authError } = await signIn(email.value, password.value);

  if (authError) {
    error.value = authError.message;
  } else if (data.user) {
    router.push("/dashboard");
  }
};

const handleGoogleLogin = async () => {
  error.value = "";

  const { error: authError } = await signInWithGoogle();

  if (authError) {
    error.value = authError.message;
  }
  // Note: For OAuth, the redirect happens automatically
  // The user will be redirected back to /dashboard after successful authentication
};
</script>

<style scoped></style>
