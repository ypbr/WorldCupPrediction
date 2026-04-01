<template>
  <div class="card p-4">
    <!-- Group header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-bold tracking-wide">
        <span class="text-fifa-gold">Group {{ group }}</span>
      </h3>
      <span
        v-if="isComplete"
        class="text-xs text-green-400 font-medium flex items-center gap-1"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        Done
      </span>
      <span v-else class="text-xs text-gray-500 font-medium">Tap to rank</span>
    </div>

    <!-- Team list -->
    <div class="space-y-2">
      <button
        v-for="(team, idx) in orderedTeams"
        :key="team.id"
        @click="toggleTeam(team)"
        class="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-150 touch-manipulation select-none active:scale-[0.98]"
        :class="teamBtnClass(team)"
      >
        <!-- Rank badge -->
        <div class="rank-badge shrink-0" :class="rankBadgeClass(team)">
          {{ getRank(team) ?? "·" }}
        </div>

        <!-- Flag + name -->
        <FlagImg
          :iso2="team.iso2"
          :alt="team.name"
          size="sm"
          class="w-6 h-auto"
        />
        <span class="text-sm font-medium flex-1 text-left">{{
          team.name
        }}</span>

        <!-- Ranked indicator -->
        <span
          v-if="getRank(team)"
          class="text-xs font-semibold"
          :class="rankLabelClass(team)"
        >
          {{ rankLabel(team) }}
        </span>
      </button>
    </div>

    <!-- Reset button -->
    <button
      v-if="isComplete || ranking.length > 0"
      @click="resetGroup"
      class="mt-3 w-full text-xs text-gray-500 hover:text-gray-300 py-1 transition-colors touch-manipulation"
    >
      Reset group
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { usePredictionStore } from "@/stores/prediction.js";
import { getGroupTeams } from "@/data/teams.js";
import FlagImg from "@/components/FlagImg.vue";

const props = defineProps({
  group: { type: String, required: true },
});

const store = usePredictionStore();

const teams = getGroupTeams(props.group);
const ranking = computed(() => store.groupRankings[props.group] ?? []);
const isComplete = computed(() => ranking.value.length === 4);

// Teams ordered: ranked first (in rank order), unranked after
const orderedTeams = computed(() => {
  const ranked = ranking.value
    .map((id) => teams.find((t) => t.id === id))
    .filter(Boolean);
  const unranked = teams.filter((t) => !ranking.value.includes(t.id));
  return [...ranked, ...unranked];
});

function getRank(team) {
  const idx = ranking.value.indexOf(team.id);
  return idx === -1 ? null : idx + 1;
}

function rankLabel(team) {
  const r = getRank(team);
  if (!r) return "";
  if (r === 1) return "1st";
  if (r === 2) return "2nd";
  if (r === 3) return "3rd";
  return `${r}th`;
}

function teamBtnClass(team) {
  const rank = getRank(team);
  if (!rank) return "bg-white/5 hover:bg-white/10 border border-white/10";
  if (rank === 1)
    return "bg-yellow-500/20 border border-yellow-500/50 hover:bg-yellow-500/30";
  if (rank === 2)
    return "bg-gray-400/20 border border-gray-400/40 hover:bg-gray-400/30";
  if (rank === 3)
    return "bg-orange-800/20 border border-orange-800/40 hover:bg-orange-800/30";
  return "bg-red-900/20 border border-red-900/40 hover:bg-red-900/30";
}

function rankBadgeClass(team) {
  const rank = getRank(team);
  if (!rank) return "bg-white/10 text-gray-500";
  if (rank === 1) return "bg-yellow-500 text-gray-900";
  if (rank === 2) return "bg-gray-400 text-gray-900";
  if (rank === 3) return "bg-orange-700 text-white";
  return "bg-red-900 text-gray-300";
}

function rankLabelClass(team) {
  const rank = getRank(team);
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-orange-500";
  return "text-gray-600";
}

function toggleTeam(team) {
  const current = [...ranking.value];
  const idx = current.indexOf(team.id);

  if (idx === -1) {
    // Add at next position
    if (current.length < 4) {
      current.push(team.id);
      store.setGroupRanking(props.group, current);
    }
  } else {
    // Remove from ranking; also remove all that came after (re-pick required)
    current.splice(idx, 1);
    store.setGroupRanking(props.group, current);
  }
}

function resetGroup() {
  store.setGroupRanking(props.group, []);
}
</script>
