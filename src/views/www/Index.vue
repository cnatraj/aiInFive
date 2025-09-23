<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <TopNav />

    <!-- Hero Banner Section -->
    <HeroSection :images="heroImages" />

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12">
      <PublicPostsList :posts="posts" :loading="loading" :error="error" />
      <!-- Newsletter Signup -->
      <NewsletterSignup />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import TopNav from "@/components/home/navigation/TopNav.vue";
import HeroSection from "@/components/home/home/HeroSection.vue";
import PublicPostsList from "@/components/home/posts/PublicPostsList.vue";
import NewsletterSignup from "@/components/home/NewsletterSignup.vue";

// Index page - no authentication required

// Data state
const posts = ref([]);
const loading = ref(false);
const error = ref(null);

// Extract image URLs for hero cycling
const heroImages = computed(() =>
  posts.value.filter((post) => post.image_url).map((post) => post.image_url)
);

const fetchPublishedPosts = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Calculate current week number and year
    const now = new Date();
    const currentYear = now.getFullYear();

    // Calculate week number using same logic as PostsList
    const startOfYear = new Date(currentYear, 0, 1);
    const dayOfYear =
      Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    const currentWeekNumber = Math.ceil(dayOfYear / 7);

    console.log("Fetching published posts for:", {
      currentYear,
      currentWeekNumber,
    });

    // Query published posts for current week only (limit to 5)
    const { data, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .eq("year", currentYear)
      .eq("week_number", currentWeekNumber)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(5);

    if (fetchError) {
      console.error("Database fetch error:", fetchError);
      throw fetchError;
    }

    console.log(
      `Published posts for week ${currentWeekNumber} of ${currentYear}:`,
      data
    );
    posts.value = data || [];
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching published posts:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPublishedPosts();
});
</script>

<style scoped></style>
