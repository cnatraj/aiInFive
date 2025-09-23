<template>
  <section class="bg-brand-50 p-4 py-8 max-w-4xl mx-auto mt-6 rounded-lg">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex flex-col lg:flex-row items-start gap-12 items-center">
        <!-- Left side - Content -->
        <div class="lg:w-1/2">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-700 mb-6">
            Get Weekly AI Digest in your inbox
          </h2>
        </div>

        <!-- Right side - Form or Success Message -->
        <div class="lg:w-1/2">
          <!-- Success State -->
          <div v-if="!subscriptionComplete" class="text-center space-y-4">
            <div class="text-6xl mb-4"></div>
            <h3 class="text-2xl font-bold text-gray-700 mb-4">
              ✅ You are almost done!
            </h3>
            <p class="text-lg text-gray-600 leading-relaxed">
              Check your inbox and click the confirmation link we just sent.
            </p>
          </div>

          <!-- Form State -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-3">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email address"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <button
                type="submit"
                :disabled="loading"
                class="w-full px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? "Signing Up..." : "Sign Up" }}
              </button>
            </div>

            <div
              v-if="message"
              class="mt-4 p-3 rounded-md"
              :class="messageClass"
            >
              {{ message }}
            </div>

            <p class="text-sm text-gray-500 mt-4">
              🛡️ No Spam. Just one email a week.
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";

const email = ref("");
const loading = ref(false);
const message = ref("");
const success = ref(false);
const subscriptionComplete = ref(false);

const messageClass = computed(() => {
  return success.value
    ? "bg-green-100 text-green-800 border border-green-200"
    : "bg-red-100 text-red-800 border border-red-200";
});

const handleSubmit = async () => {
  if (!email.value.trim()) return;

  loading.value = true;
  message.value = "";

  try {
    // Call Supabase Edge Function to subscribe to newsletter
    const { data, error } = await supabase.functions.invoke(
      "subscribe-newsletter",
      {
        body: { email: email.value.trim() },
      }
    );

    if (error) {
      throw new Error(error.message || "Failed to subscribe");
    }

    if (!data.success) {
      throw new Error(data.message || "Subscription failed");
    }

    // Success - show confirmation message
    success.value = true;
    subscriptionComplete.value = true;
    email.value = "";
  } catch (error) {
    success.value = false;
    message.value = error.message || "Something went wrong. Please try again.";
    console.error("Newsletter subscription error:", error);
  } finally {
    loading.value = false;

    // Clear message after 5 seconds
    setTimeout(() => {
      message.value = "";
    }, 5000);
  }
};
</script>

<style scoped></style>
