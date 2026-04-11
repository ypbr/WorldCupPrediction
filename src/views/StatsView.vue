<template>
  <div class="min-h-screen bg-gray-950 flex flex-col items-center px-4 py-10">
    <!-- Header -->
    <div class="w-full max-w-lg mb-6 flex items-center gap-3">
      <button
        @click="$emit('back')"
        class="btn-ghost px-4 py-2 rounded-xl text-sm"
      >
        ← Back
      </button>
      <div class="flex-1 text-center">
        <h1 class="text-xl font-black text-white">Global Statistics</h1>
        <p class="text-xs text-gray-500 mt-0.5">
          Based on
          <span class="text-gray-300 font-semibold">{{ totalCount }}</span>
          prediction{{ totalCount !== 1 ? 's' : '' }}
        </p>
      </div>
      <!-- spacer to balance the back button -->
      <button
        @click="$emit('home')"
        class="btn-ghost px-4 py-2 rounded-xl text-sm"
      >
        🏠 Home
      </button>
    </div>

    <!-- Round tabs -->
    <div class="w-full max-w-lg mb-6">
      <div class="flex flex-wrap gap-2 px-1">
        <button
          v-for="tab in tabs"
          :key="tab.round"
          @click="activeRound = tab.round"
          :class="[
            'flex-1 min-w-0 px-2 py-2 rounded-xl text-xs font-bold text-center transition-colors touch-manipulation',
            activeRound === tab.round
              ? 'bg-wc-blue text-white'
              : 'bg-white/10 text-gray-400 hover:bg-white/20',
          ]"
        >
          {{ tab.emoji }} {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="w-full max-w-lg">
      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div
          v-for="n in 8"
          :key="n"
          class="h-14 rounded-xl bg-white/5 animate-pulse"
        />
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="text-center text-gray-500 py-12"
      >
        <p class="text-3xl mb-3">⚠️</p>
        <p class="text-sm">Could not load stats.</p>
        <button @click="loadStats" class="mt-4 text-xs text-wc-blue underline">Retry</button>
      </div>

      <!-- Empty -->
      <div
        v-else-if="rows.length === 0"
        class="text-center text-gray-500 py-12"
      >
        <p class="text-3xl mb-3">📊</p>
        <p class="text-sm">No data yet for this round.</p>
      </div>

      <!-- Rows -->
      <div v-else class="space-y-2">
        <div
          v-for="(row, i) in rows"
          :key="row.team_id"
          class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
        >
          <!-- Rank -->
          <span class="w-5 text-xs text-gray-500 font-bold text-center shrink-0">
            {{ i + 1 }}
          </span>

          <!-- Flag -->
          <FlagImg
            v-if="getTeam(row.team_id)"
            :iso2="getTeam(row.team_id).iso2"
            :alt="getTeam(row.team_id).name"
            size="sm"
            class="shrink-0"
          />

          <!-- Name + bar -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white truncate">
              {{ getTeam(row.team_id)?.name ?? row.team_id }}
            </p>
            <div class="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                class="h-full rounded-full bg-wc-blue transition-all duration-500"
                :style="{ width: pct(row.count) + '%' }"
              />
            </div>
          </div>

          <!-- Count + pct -->
          <div class="text-right shrink-0">
            <p class="text-sm font-bold text-white">{{ row.count }}</p>
            <p class="text-xs text-gray-500">{{ pct(row.count) }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FlagImg from '@/components/FlagImg.vue'
import { getTeamById } from '@/data/teams.js'
import { fetchStats, fetchTotalCount } from '@/utils/stats.js'
import { onMounted, ref, watch } from 'vue'

defineEmits(['back', 'home'])

const tabs = [
  { round: 'champion', label: 'Champion', emoji: '🏆' },
  { round: 'finalist', label: 'Finalists', emoji: '🥈' },
  { round: 'sf', label: 'Semi Finals', emoji: '🏅' },
  { round: 'qf', label: 'Quarter Finals', emoji: '🔶' },
  { round: 'r16', label: 'Round 16', emoji: '🔵' },
  { round: 'r32', label: 'Round 32', emoji: '⚪' },
]

const activeRound = ref('champion')
const rows = ref([])
const totalCount = ref(0)
const loading = ref(false)
const error = ref(false)

function getTeam(id) {
  return id ? getTeamById(id) : null
}

function pct(count) {
  if (!totalCount.value) return 0
  return Math.round((count / totalCount.value) * 100)
}

async function loadStats() {
  loading.value = true
  error.value = false
  try {
    rows.value = await fetchStats(activeRound.value)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

watch(activeRound, loadStats)

onMounted(async () => {
  // Load total count and first tab in parallel
  const [, total] = await Promise.allSettled([loadStats(), fetchTotalCount()])
  if (total.status === 'fulfilled') totalCount.value = total.value
})
</script>
