<template>
  <img
    :src="`https://flagcdn.com/w${pixelWidth}/${iso2}.png`"
    :srcset="`https://flagcdn.com/w${pixelWidth * 2}/${iso2}.png 2x`"
    :width="pixelWidth"
    :alt="alt"
    class="rounded-sm object-cover inline-block shrink-0"
    loading="lazy"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  iso2: { type: String, required: true },
  alt: { type: String, default: "" },
  // size: 'sm' (20px), 'md' (28px), 'lg' (40px), 'xl' (64px)
  size: { type: String, default: "sm" },
});

const pixelWidth = computed(() => {
  const map = { sm: 20, md: 28, lg: 40, xl: 80 };
  return map[props.size] ?? 20;
});
</script>
