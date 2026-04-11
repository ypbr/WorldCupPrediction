<template>
  <div class="min-h-screen bg-gray-950 pb-24">
    <!-- Header -->
    <div
      class="sticky top-0 z-20 bg-gray-950/95 backdrop-blur border-b border-white/10 px-4 py-3"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-white">Knockout Bracket</h1>
          <p class="text-xs text-gray-400">Pick the winner of each match</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-400">
            {{ store.knockoutPicksCount }}/{{ store.totalKnockoutMatches }}
          </span>
          <button
            @click="$emit('back')"
            class="text-xs bg-white/10 hover:bg-white/15 text-gray-300 px-3 py-1.5 rounded-lg transition-colors touch-manipulation"
          >
            ← Back
          </button>
        </div>
      </div>

      <!-- Round tabs on mobile -->
      <div
        class="max-w-7xl mx-auto mt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1"
      >
        <button
          v-for="round in rounds"
          :key="round.id"
          @click="activeRound = round.id"
          class="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors touch-manipulation"
          :class="
            activeRound === round.id
              ? 'bg-wc-blue text-white'
              : 'bg-white/10 text-gray-400 hover:bg-white/15'
          "
        >
          {{ round.shortName }}
        </button>
      </div>
    </div>

    <!-- Desktop: all rounds side by side | Mobile: one round at a time -->
    <div class="max-w-7xl mx-auto px-4 py-4">
      <!-- Mobile: single round view -->
      <div class="lg:hidden">
        <template
          v-for="round in rounds"
          :key="round.id"
        >
          <div v-if="activeRound === round.id">
            <h2 class="text-lg font-bold text-white mb-4">{{ round.name }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MatchCard
                v-for="match in round.matches"
                :key="match.id"
                :matchId="match.id"
                :matchLabel="match.id"
              />
            </div>
          </div>
        </template>
      </div>

      <!-- Desktop: horizontal bracket (scrollable) -->
      <div class="hidden lg:flex gap-6 overflow-x-auto pb-4">
        <div
          v-for="round in rounds"
          :key="round.id"
          class="shrink-0"
          :style="columnStyle(round)"
        >
          <h2
            class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 text-center"
          >
            {{ round.name }}
          </h2>
          <div class="flex flex-col gap-4" :class="roundGapClass(round)">
            <template v-if="round.id === 'final'">
              <!-- Champion display above final -->
              <div
                v-if="store.champion"
                class="text-center text-yellow-400 text-xs font-bold mb-1"
              >
                🏆 Champion
              </div>
              <MatchCard
                v-for="match in round.matches"
                :key="match.id"
                :matchId="match.id"
                :matchLabel="match.id"
              />
            </template>
            <template v-else>
              <MatchCard
                v-for="match in round.matches"
                :key="match.id"
                :matchId="match.id"
                :matchLabel="match.id"
              />
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: fixed bottom round navigation (lg:hidden, z-40 so it sits above champion banner) -->
    <div class="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-gray-950/95 backdrop-blur border-t border-white/10 px-4 py-3">
      <div class="flex gap-3">
        <button
          v-if="activeRound !== 'r32'"
          @click="prevRound"
          class="flex-none bg-white/10 hover:bg-white/15 text-white py-3.5 px-5 rounded-2xl font-semibold transition-colors touch-manipulation"
        >
          ←
        </button>
        <button
          v-if="activeRound !== 'final'"
          @click="currentRoundDone && nextRound()"
          :disabled="!currentRoundDone"
          class="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all touch-manipulation"
          :class="
            currentRoundDone
              ? 'bg-wc-blue hover:bg-blue-600 text-white'
              : 'bg-white/10 text-gray-500 cursor-not-allowed'
          "
        >
          Next: {{ nextRoundName(activeRound) }} →
        </button>
        <button
          v-if="activeRound === 'final'"
          @click="$emit('next')"
          :disabled="!store.champion"
          class="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all touch-manipulation"
          :class="
            store.champion
              ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-900/40'
              : 'bg-white/10 text-gray-500 cursor-not-allowed'
          "
        >
          <span v-if="store.champion">🏆 See my prediction →</span>
          <span v-else>Pick a Final winner to continue</span>
        </button>
      </div>
    </div>

    <!-- Sticky bottom: champion banner when final picked (desktop only) -->
    <Transition name="slide-up">
      <div
        v-if="store.champion"
        class="hidden lg:block fixed bottom-0 left-0 right-0 z-30 bg-yellow-500 text-gray-900 px-4 py-3"
      >
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏆</span>
            <div>
              <p class="text-xs font-medium opacity-70">
                Your predicted champion
              </p>
              <p
                class="font-bold text-base leading-tight flex items-center gap-1.5"
              >
                <FlagImg
                  v-if="championTeam"
                  :iso2="championTeam.iso2"
                  :alt="championTeam.name"
                  size="sm"
                />
                {{ championTeam?.name }}
              </p>
            </div>
          </div>
          <button
            @click="$emit('next')"
            class="bg-gray-900 text-yellow-400 font-bold text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors touch-manipulation"
          >
            Share →
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import FlagImg from "@/components/FlagImg.vue";
import MatchCard from "@/components/MatchCard.vue";
import {
    FINAL_SLOT,
    QF_SLOTS,
    R16_SLOTS,
    R32_SLOTS,
    SF_SLOTS,
} from "@/data/bracket.js";
import { getTeamById } from "@/data/teams.js";
import { usePredictionStore } from "@/stores/prediction.js";
import { computed, ref } from "vue";

defineEmits(["next", "back"]);
const store = usePredictionStore();

const rounds = [
  { id: "r32", name: "Round of 32", shortName: "R32", matches: R32_SLOTS },
  { id: "r16", name: "Round of 16", shortName: "R16", matches: R16_SLOTS },
  { id: "qf", name: "Quarterfinals", shortName: "QF", matches: QF_SLOTS },
  { id: "sf", name: "Semifinals", shortName: "SF", matches: SF_SLOTS },
  { id: "final", name: "Final", shortName: "Final", matches: [FINAL_SLOT] },
];

const activeRound = ref("r32");

const activeRoundMatches = computed(
  () => rounds.find((r) => r.id === activeRound.value)?.matches ?? [],
);

const currentRoundDone = computed(() =>
  activeRoundMatches.value.every((m) => store.bracketPicks[m.id]),
);

const championTeam = computed(() =>
  store.champion ? getTeamById(store.champion) : null,
);

function columnStyle(round) {
  const widths = {
    r32: "200px",
    r16: "200px",
    qf: "200px",
    sf: "200px",
    final: "200px",
  };
  return { width: widths[round.id] ?? "200px" };
}

function roundGapClass(round) {
  // Matches in later rounds need more vertical spacing for bracket alignment
  const gaps = {
    r32: "gap-2",
    r16: "gap-16",
    qf: "gap-2",
    sf: "gap-2",
    final: "",
  };
  return gaps[round.id] ?? "gap-4";
}

function nextRound() {
  const ids = rounds.map((r) => r.id);
  const idx = ids.indexOf(activeRound.value);
  if (idx < ids.length - 1) activeRound.value = ids[idx + 1];
}

function prevRound() {
  const ids = rounds.map((r) => r.id);
  const idx = ids.indexOf(activeRound.value);
  if (idx > 0) activeRound.value = ids[idx - 1];
}

function nextRoundName(currentId) {
  const ids = rounds.map((r) => r.id);
  const names = rounds.map((r) => r.name);
  const idx = ids.indexOf(currentId);
  return names[idx + 1] ?? "";
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
