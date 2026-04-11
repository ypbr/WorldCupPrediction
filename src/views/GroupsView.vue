<template>
  <div class="min-h-screen bg-gray-950 pb-24">
    <!-- Header -->
    <div
      class="sticky top-0 z-20 bg-gray-950/95 backdrop-blur border-b border-white/10 px-4 py-3"
    >
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-white">Group Stage</h1>
          <p class="text-xs text-gray-400">
            Rank each group 1st–4th by tapping teams in order
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="text-sm font-semibold"
            :class="store.allGroupsDone ? 'text-green-400' : 'text-gray-400'"
          >
            {{ store.groupsCompleted }}/12
          </span>
          <div class="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-green-400 rounded-full transition-all duration-300"
              :style="{ width: `${(store.groupsCompleted / 12) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Groups grid -->
    <div class="max-w-5xl mx-auto px-4 py-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <GroupCard v-for="group in GROUPS" :key="group" :group="group" />
      </div>
    </div>

    <!-- Sticky continue button -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur border-t border-white/10 p-4 z-20"
    >
      <div class="max-w-5xl mx-auto">
        <button
          @click="$emit('next')"
          :disabled="!store.allGroupsDone"
          class="w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 touch-manipulation"
          :class="
            store.allGroupsDone
              ? 'bg-wc-blue text-white hover:bg-blue-600 active:bg-blue-700 shadow-lg shadow-blue-900/40'
              : 'bg-white/10 text-gray-500 cursor-not-allowed'
          "
        >
          <span v-if="store.allGroupsDone"
            >Continue to 3rd Place Selection →</span
          >
          <span v-else
            >Complete all groups to continue ({{
              store.groupsCompleted
            }}/12)</span
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import GroupCard from "@/components/GroupCard.vue";
import { GROUPS } from "@/data/teams.js";
import { usePredictionStore } from "@/stores/prediction.js";

defineEmits(["next"]);
const store = usePredictionStore();
</script>
