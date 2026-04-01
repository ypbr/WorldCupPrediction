<template>
  <div
    class="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12"
  >
    <!-- Trophy animation -->
    <div class="text-8xl mb-4 animate-bounce-slow">🏆</div>

    <h1 class="text-3xl font-black text-white mb-1 text-center">
      Your Prediction
    </h1>

    <p class="text-gray-400 text-sm mb-8 text-center">FIFA 2026 World Cup</p>

    <!-- Champion card -->
    <div
      class="card px-8 py-6 text-center mb-8 bg-gradient-to-br from-yellow-900/40 to-gray-900 border-yellow-500/40 w-full max-w-sm"
    >
      <div
        class="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3"
      >
        🏆 World Champion
      </div>
      <FlagImg
        v-if="championTeam"
        :iso2="championTeam.iso2"
        :alt="championTeam.name"
        size="xl"
        class="mx-auto mb-3 w-20 h-auto rounded"
      />
      <p class="text-2xl font-black text-white">{{ championTeam?.name }}</p>
    </div>

    <!-- Bracket summary -->
    <div class="w-full max-w-sm space-y-3 mb-8">
      <div
        v-for="round in summaryRounds"
        :key="round.label"
        class="bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3"
      >
        <p class="text-xs text-gray-500 font-medium mb-2">{{ round.label }}</p>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="teamId in round.teams"
            :key="teamId"
            class="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1"
          >
            <FlagImg
              v-if="getTeam(teamId)"
              :iso2="getTeam(teamId).iso2"
              :alt="getTeam(teamId).name"
              size="sm"
            />
            <span class="text-xs font-medium text-gray-300">{{
              getTeam(teamId)?.name
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Share section (only when viewing own prediction) -->
    <div v-if="!isShared" class="w-full max-w-sm space-y-3">
      <p class="text-center text-sm text-gray-400 font-medium">
        Share your prediction
      </p>

      <!-- Copy link -->
      <button
        @click="copyLink"
        class="w-full btn-primary flex items-center justify-center gap-2 py-4 rounded-2xl"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        {{ copied ? "✓ Copied!" : "Copy Prediction Link" }}
      </button>

      <!-- WhatsApp -->
      <button
        @click="shareWhatsApp"
        class="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors touch-manipulation"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
          />
          <path
            d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.851L0 24l6.335-1.508A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.031-1.384l-.361-.213-3.736.889.928-3.64-.234-.375A9.785 9.785 0 012.182 12C2.182 6.577 6.577 2.182 12 2.182S21.818 6.577 21.818 12 17.423 21.818 12 21.818z"
          />
        </svg>
        Share via WhatsApp
      </button>

      <!-- Twitter/X -->
      <button
        @click="shareTwitter"
        class="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors touch-manipulation"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
        Share on X (Twitter)
      </button>
    </div>

    <!-- Make own prediction CTA (only when viewing a shared prediction) -->
    <div v-if="isShared" class="w-full max-w-sm mt-4 space-y-3">
      <p class="text-center text-sm text-gray-400">
        This is someone else's prediction.
      </p>
      <button
        @click="$emit('make-own')"
        class="w-full btn-primary py-4 rounded-2xl text-base font-bold"
      >
        🏆 Make Your Own Prediction
      </button>
    </div>

    <!-- Restart + back (only when viewing own prediction) (only when viewing own prediction) -->
    <div v-if="!isShared" class="w-full max-w-sm mt-6 flex gap-3">
      <button
        @click="$emit('back')"
        class="flex-none btn-ghost px-5 py-3 rounded-2xl"
      >
        ← Edit
      </button>
      <button
        @click="confirmReset"
        class="flex-1 btn-ghost py-3 rounded-2xl text-red-400 hover:text-red-300"
      >
        Start Over
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePredictionStore } from "@/stores/prediction.js";
import { getTeamById } from "@/data/teams.js";
import { buildShareUrl } from "@/utils/share.js";
import { R16_SLOTS, QF_SLOTS, SF_SLOTS } from "@/data/bracket.js";
import FlagImg from "@/components/FlagImg.vue";

const emit = defineEmits(["back", "reset", "make-own"]);
const props = defineProps({
  isShared: { type: Boolean, default: false },
});
const store = usePredictionStore();
const copied = ref(false);

const championTeam = computed(() =>
  store.champion ? getTeamById(store.champion) : null,
);

function getTeam(id) {
  return id ? getTeamById(id) : null;
}

// Build summary: which teams made it to each late round
const summaryRounds = computed(() => {
  const picks = store.bracketPicks;

  const sf = SF_SLOTS.flatMap((m) => {
    const mData = store.fullBracket[m.id];
    return [mData?.teamA, mData?.teamB].filter(Boolean);
  });
  const qf = QF_SLOTS.flatMap((m) => {
    const mData = store.fullBracket[m.id];
    return [mData?.teamA, mData?.teamB].filter(Boolean);
  });
  const r16 = R16_SLOTS.flatMap((m) => {
    const mData = store.fullBracket[m.id];
    return [mData?.teamA, mData?.teamB].filter(Boolean);
  });

  // Semifinalists are teams that reached SF (not necessarily won QF in picks)
  // Show winners of QF (SF participants)
  const qfWinners = QF_SLOTS.map((m) => picks[m.id]).filter(Boolean);
  const sfWinners = SF_SLOTS.map((m) => picks[m.id]).filter(Boolean);

  return [
    ...(qfWinners.length
      ? [{ label: "🔶 Semifinalists", teams: qfWinners }]
      : []),
    ...(sfWinners.length ? [{ label: "🏅 Finalists", teams: sfWinners }] : []),
  ];
});

function getShareUrl() {
  const encoded = store.getSharePayload();
  return buildShareUrl(encoded);
}

async function copyLink() {
  const url = getShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2500);
  } catch {
    prompt("Copy this link:", url);
  }
}

function shareWhatsApp() {
  const url = getShareUrl();
  const text = encodeURIComponent(
    `My FIFA 2026 World Cup prediction 🏆 ${championTeam.value?.name}! Check it out: ${url}`,
  );
  window.open(`https://wa.me/?text=${text}`, "_blank");
}

function shareTwitter() {
  const url = getShareUrl();
  const text = encodeURIComponent(
    `My #FIFA2026 World Cup prediction: 🏆 ${championTeam.value?.name}! Make yours:`,
  );
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
    "_blank",
  );
}

function confirmReset() {
  if (
    confirm(
      "Are you sure you want to start over? All predictions will be lost.",
    )
  ) {
    store.resetAll();
    emit("reset");
  }
}
</script>

<style scoped>
@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
