<template>
  <div
    class="bg-gray-900 rounded-xl border overflow-hidden transition-all"
    :class="[
      isComplete ? 'border-white/20' : 'border-white/10',
      compact ? 'text-xs' : 'text-sm',
    ]"
  >
    <!-- Match label (round + match number) -->
    <div
      v-if="!compact && matchLabel"
      class="text-[10px] text-gray-600 font-medium px-2 pt-1.5 text-center"
    >
      {{ matchLabel }}
    </div>

    <!-- Team A -->
    <button
      @click="pick(teamA)"
      :disabled="!teamA || !teamB || readonly"
      class="w-full flex items-center gap-2 px-3 py-2.5 transition-all duration-150 touch-manipulation"
      :class="teamRowClass(teamA, pickedTeam)"
    >
      <FlagImg
        v-if="teamA"
        :iso2="teamA.iso2"
        :alt="teamA.name"
        size="sm"
        class="w-6 h-auto"
      />
      <span v-else class="w-6 text-center text-gray-500">?</span>
      <span
        class="flex-1 text-left font-medium truncate leading-tight"
        :class="compact ? 'text-xs' : 'text-sm'"
      >
        {{ teamA?.name ?? (slotLabelA || "TBD") }}
      </span>
      <svg
        v-if="pickedTeam?.id === teamA?.id"
        class="w-3.5 h-3.5 shrink-0 text-green-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        />
      </svg>
    </button>

    <!-- Divider -->
    <div class="border-t border-white/5 mx-2" />

    <!-- Team B -->
    <button
      @click="pick(teamB)"
      :disabled="!teamA || !teamB || readonly"
      class="w-full flex items-center gap-2 px-3 py-2.5 transition-all duration-150 touch-manipulation"
      :class="teamRowClass(teamB, pickedTeam)"
    >
      <FlagImg
        v-if="teamB"
        :iso2="teamB.iso2"
        :alt="teamB.name"
        size="sm"
        class="w-6 h-auto"
      />
      <span v-else class="w-6 text-center text-gray-500">?</span>
      <span
        class="flex-1 text-left font-medium truncate leading-tight"
        :class="compact ? 'text-xs' : 'text-sm'"
      >
        {{ teamB?.name ?? (slotLabelB || "TBD") }}
      </span>
      <svg
        v-if="pickedTeam?.id === teamB?.id"
        class="w-3.5 h-3.5 shrink-0 text-green-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { usePredictionStore } from "@/stores/prediction.js";
import { getTeamById } from "@/data/teams.js";
import FlagImg from "@/components/FlagImg.vue";

const props = defineProps({
  matchId: { type: String, required: true },
  compact: { type: Boolean, default: false },
  matchLabel: { type: String, default: "" },
  readonly: { type: Boolean, default: false },
  // slot labels for when teams are TBD
  slotLabelA: { type: String, default: "" },
  slotLabelB: { type: String, default: "" },
});

const store = usePredictionStore();

const matchTeams = computed(
  () => store.fullBracket[props.matchId] ?? { teamA: null, teamB: null },
);

const teamA = computed(() =>
  matchTeams.value.teamA ? getTeamById(matchTeams.value.teamA) : null,
);
const teamB = computed(() =>
  matchTeams.value.teamB ? getTeamById(matchTeams.value.teamB) : null,
);
const pickedTeam = computed(() => {
  const id = store.bracketPicks[props.matchId];
  return id ? getTeamById(id) : null;
});
const isComplete = computed(() => !!pickedTeam.value);

function pick(team) {
  if (!team || !teamA.value || !teamB.value || props.readonly) return;
  store.pickWinner(props.matchId, team.id);
}

function teamRowClass(team, picked) {
  if (!teamA.value || !teamB.value) return "opacity-40 cursor-not-allowed";
  if (!picked) return "hover:bg-white/10 cursor-pointer";
  if (picked?.id === team?.id)
    return "bg-green-900/30 cursor-pointer hover:bg-green-900/40";
  return "opacity-40 cursor-pointer hover:opacity-60";
}
</script>
