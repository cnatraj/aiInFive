<template>
  <!-- Hero Banner Section -->
  <div
    class="relative w-full h-[70vh] max-h-[500px] md:max-h-none md:h-[70vh] overflow-hidden"
  >
    <!-- Current Background Image (bottom layer) -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat bg-blue-900"
      :style="currentImageStyle"
    ></div>

    <!-- Next Background Image (top layer - fades in) -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat bg-blue-900 transition-opacity duration-1000 ease-in nextImage"
      :class="{
        'opacity-100 visible': isTransitioning,
        'opacity-0 invisible': !isTransitioning
      }"
      :style="nextImageStyle"
    ></div>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/70"></div>

    <!-- Content Overlay -->
    <div class="relative z-20 flex items-center justify-center h-full">
      <div class="text-white px-4 max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-semibold mb-6">
          <div class="mb-2">Weekly AI Digest:</div>
          <div>{{ currentWeekText }}</div>
        </h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});

// Image cycling configuration
const CYCLING_INTERVAL = 4000; // 4 seconds
const TRANSITION_DURATION = 1000; // 1 second fade

// Cycling state
const currentImageIndex = ref(0);
const nextImageIndex = ref(1);
const isTransitioning = ref(false);
const cyclingTimer = ref(null);

// Current background image (bottom layer)
const currentImageStyle = computed(() => {
  if (props.images.length === 0) return {};
  const imageUrl = props.images[currentImageIndex.value % props.images.length];
  return {
    backgroundImage: `url('${imageUrl}')`,
  };
});

// Next background image (top layer)
const nextImageStyle = computed(() => {
  if (props.images.length === 0) return {};
  const imageUrl = props.images[nextImageIndex.value % props.images.length];
  return {
    backgroundImage: `url('${imageUrl}')`,
  };
});

// Start the cycling
const startCycling = () => {
  if (props.images.length <= 1) return;

  cyclingTimer.value = setInterval(() => {
    // Start crossfade - next image fades in over current
    isTransitioning.value = true;

    // After fade completes, make next image the current and prepare next
    setTimeout(() => {
      currentImageIndex.value = nextImageIndex.value;
      nextImageIndex.value =
        (currentImageIndex.value + 1) % props.images.length;
      isTransitioning.value = false; // Reset for next cycle
    }, TRANSITION_DURATION);
  }, CYCLING_INTERVAL);
};

// Stop cycling
const stopCycling = () => {
  if (cyclingTimer.value) {
    clearInterval(cyclingTimer.value);
    cyclingTimer.value = null;
  }
};

// Watch for images changes
watch(
  () => props.images,
  (newImages) => {
    stopCycling();
    if (newImages.length > 1) {
      currentImageIndex.value = 0;
      nextImageIndex.value = 1;
      isTransitioning.value = false;
      startCycling();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.images.length > 1) {
    startCycling();
  }
});

onUnmounted(() => {
  stopCycling();
});

// Calculate current week start date (Monday)
const getCurrentWeekStart = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Handle Sunday as day 0
  const mondayThisWeek = new Date(
    today.getTime() - daysToSubtract * 24 * 60 * 60 * 1000
  );
  return mondayThisWeek;
};

// Format date as "Week of Sep 14, 2025"
const currentWeekText = computed(() => {
  const weekStart = getCurrentWeekStart();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[weekStart.getMonth()];
  const day = weekStart.getDate();
  const year = weekStart.getFullYear();

  return `Week of ${month} ${day}, ${year}`;
});
</script>

<style scoped></style>
