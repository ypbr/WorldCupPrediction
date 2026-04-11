<template>
  <div class="min-h-screen bg-gray-950 pb-24">
    <!-- Header -->
    <div
      class="sticky top-0 z-20 bg-gray-950/95 backdrop-blur border-b border-white/10 px-4 py-3"
    >
      <div class="max-w-3xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-white">3rd Place Selection</h1>
          <p class="text-xs text-gray-400">
            Pick 8 of 12 third-place teams that advance to the knockout stage
          </p>
        </div>
        <span
          class="text-sm font-semibold"
          :class="selected.length === 8 ? 'text-green-400' : 'text-yellow-400'"
        >
          {{ selected.length }}/8
        </span>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 py-5 space-y-4">
      <!-- Info card -->
      <div
        class="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-200"
      >
        <p class="font-semibold mb-1">📋 How it works</p>
        <p>
          In World Cup 2026, the top 2 teams from each of the 12 groups automatically
          qualify for the Round of 32. The best 8 third-place teams also
          advance. Select the 8 groups whose 3rd-place team you think will
          qualify.
        </p>
      </div>

      <!-- Auto-select button -->
      <button
        @click="autoSelect"
        class="w-full bg-white/10 hover:bg-white/15 text-gray-300 text-sm font-medium py-2.5 rounded-xl transition-colors touch-manipulation"
      >
        🎲 Auto-select (pick all 12 – I don't mind)
      </button>

      <!-- Groups grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          v-for="group in GROUPS"
          :key="group"
          @click="toggleGroup(group)"
          :disabled="!isSelected(group) && selected.length >= 8"
          class="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-150 touch-manipulation active:scale-[0.96]"
          :class="groupBtnClass(group)"
        >
          <!-- Group letter -->
          <span
            class="text-2xl font-black"
            :class="isSelected(group) ? 'text-white' : 'text-gray-500'"
          >
            Group {{ group }}
          </span>

          <!-- 3rd place team preview -->
          <div v-if="getThirdPlace(group)" class="flex items-center gap-1.5">
            <FlagImg
              :iso2="getThirdPlace(group).iso2"
              :alt="getThirdPlace(group).name"
              size="sm"
            />
            <span
              class="text-xs font-medium"
              :class="isSelected(group) ? 'text-gray-200' : 'text-gray-500'"
            >
              {{ getThirdPlace(group).name }}
            </span>
          </div>
          <div v-else class="text-xs text-gray-600">Not ranked yet</div>

          <!-- Checkmark -->
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs"
            :class="
              isSelected(group)
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-600'
            "
          >
            <svg
              v-if="isSelected(group)"
              class="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- Sticky nav -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur border-t border-white/10 p-4 z-20"
    >
      <div class="max-w-3xl mx-auto flex gap-3">
        <button
          @click="$emit('back')"
          class="flex-none bg-white/10 hover:bg-white/15 text-white py-4 px-5 rounded-2xl font-semibold transition-colors touch-manipulation"
        >
          ←
        </button>
        <button
          @click="confirm"
          :disabled="selected.length !== 8"
          class="flex-1 py-4 rounded-2xl font-bold text-base transition-all duration-200 touch-manipulation"
          :class="
            selected.length === 8
              ? 'bg-wc-blue text-white hover:bg-blue-600 active:bg-blue-700 shadow-lg shadow-blue-900/40'
              : 'bg-white/10 text-gray-500 cursor-not-allowed'
          "
        >
          <span v-if="selected.length === 8">Continue to Bracket →</span>
          <span v-else>Select {{ 8 - selected.length }} more</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import FlagImg from "@/components/FlagImg.vue";
import { GROUPS, getGroupTeams } from "@/data/teams.js";
import { usePredictionStore } from "@/stores/prediction.js";
import { ref } from "vue";

const emit = defineEmits(["next", "back"]);
const store = usePredictionStore();

const selected = ref([...store.thirdPlaceGroups]);

function isSelected(group) {
  return selected.value.includes(group);
}

function getThirdPlace(group) {
  const ranking = store.groupRankings[group];
  if (!ranking || ranking.length < 3) return null;
  const teamId = ranking[2];
  return getGroupTeams(group).find((t) => t.id === teamId) ?? null;
}

function groupBtnClass(group) {
  const sel = isSelected(group);
  const disabled = !sel && selected.value.length >= 8;
  if (disabled)
    return "bg-white/5 border-white/5 opacity-40 cursor-not-allowed";
  if (sel) return "bg-green-900/40 border-green-500/60 hover:bg-green-900/50";
  return "bg-white/5 border-white/10 hover:bg-white/10";
}

function toggleGroup(group) {
  if (isSelected(group)) {
    selected.value = selected.value.filter((g) => g !== group);
  } else if (selected.value.length < 8) {
    selected.value.push(group);
  }
}

function autoSelect() {
  // Select first 8 groups alphabetically if not enough
  if (selected.value.length === 8) {
    selected.value = [];
    return;
  }
  selected.value = [...GROUPS].slice(0, 8);
}

function confirm() {
  store.setThirdPlaceGroups(selected.value);
  emit("next");
}
</script>
