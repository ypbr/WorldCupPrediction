<template>
  <!-- Off-screen element captured by html2canvas. Fixed 360×640 (9:16). -->
  <div
    ref="cardEl"
    class="instagram-story-card"
  >
    <!-- Background gradient -->
    <div class="ig-bg" />

    <!-- Top branding -->
    <div class="ig-top">
      <div class="ig-trophy">🏆</div>
      <div class="ig-title">FIFA 2026 World Cup</div>
      <div class="ig-subtitle">My Prediction</div>
    </div>

    <!-- Champion -->
    <div class="ig-champion-section">
      <div class="ig-champion-label">WORLD CHAMPION</div>
      <div class="ig-champion-flag-wrap">
        <img
          v-if="championTeam"
          :src="`https://flagcdn.com/w160/${championTeam.iso2}.png`"
          :alt="championTeam.name"
          class="ig-champion-flag"
          crossorigin="anonymous"
        />
      </div>
      <div class="ig-champion-name">{{ championTeam?.name }}</div>
    </div>

    <!-- Finalists -->
    <div v-if="finalists.length" class="ig-round-section">
      <div class="ig-round-label">🏅 FINALISTS</div>
      <div class="ig-teams-row">
        <div
          v-for="teamId in finalists"
          :key="teamId"
          class="ig-team-chip"
        >
          <img
            v-if="getTeam(teamId)"
            :src="`https://flagcdn.com/w40/${getTeam(teamId).iso2}.png`"
            :alt="getTeam(teamId).name"
            class="ig-chip-flag"
            crossorigin="anonymous"
          />
          <span class="ig-chip-name">{{ getTeam(teamId)?.name }}</span>
        </div>
      </div>
    </div>

    <!-- Semifinalists -->
    <div v-if="semifinalists.length" class="ig-round-section">
      <div class="ig-round-label">⚽ SEMIFINALISTS</div>
      <div class="ig-teams-row ig-teams-wrap">
        <div
          v-for="teamId in semifinalists"
          :key="teamId"
          class="ig-team-chip"
        >
          <img
            v-if="getTeam(teamId)"
            :src="`https://flagcdn.com/w40/${getTeam(teamId).iso2}.png`"
            :alt="getTeam(teamId).name"
            class="ig-chip-flag"
            crossorigin="anonymous"
          />
          <span class="ig-chip-name">{{ getTeam(teamId)?.name }}</span>
        </div>
      </div>
    </div>

    <!-- App link -->
    <div class="ig-footer">
      <span class="ig-footer-url">fifawc2026.ypbr.dev</span>
    </div>
  </div>
</template>

<script setup>
import { getTeamById } from "@/data/teams.js";
import { computed } from "vue";

const props = defineProps({
  champion: { type: String, default: null },
  finalists: { type: Array, default: () => [] },
  semifinalists: { type: Array, default: () => [] },
});

const championTeam = computed(() =>
  props.champion ? getTeamById(props.champion) : null,
);

function getTeam(id) {
  return id ? getTeamById(id) : null;
}
</script>

<style scoped>
.instagram-story-card {
  position: fixed;
  left: -9999px;
  top: 0;
  width: 360px;
  height: 640px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #0f172a;
}

.ig-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, #1e3a5f 0%, #0f172a 60%),
    linear-gradient(160deg, #0f172a 0%, #1a1a2e 100%);
  z-index: 0;
}

/* ── Top ─────────────────────────────────────────────── */
.ig-top {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 36px;
  gap: 0;
}

.ig-trophy {
  font-size: 40px;
  line-height: 1;
  margin-bottom: 10px;
}

.ig-title {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #f59e0b;
}

.ig-subtitle {
  font-size: 11px;
  color: #94a3b8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── Champion ────────────────────────────────────────── */
.ig-champion-section {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  gap: 8px;
}

.ig-champion-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f59e0b;
}

.ig-champion-flag-wrap {
  width: 100px;
  height: 67px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #f59e0b44;
  box-shadow: 0 0 24px #f59e0b33;
}

.ig-champion-flag {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ig-champion-name {
  font-size: 28px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.02em;
}

/* ── Round sections ──────────────────────────────────── */
.ig-round-section {
  position: relative;
  z-index: 1;
  width: 320px;
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 10px 14px;
}

.ig-round-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 8px;
}

.ig-teams-row {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.ig-teams-wrap {
  flex-wrap: wrap;
}

.ig-team-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px 8px;
  line-height: 1;
}

.ig-chip-flag {
  width: 20px;
  height: 14px;
  border-radius: 2px;
  display: block;
  object-fit: cover;
  flex-shrink: 0;
  vertical-align: middle;
}

.ig-chip-name {
  font-size: 11px;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  line-height: 1;
}

/* ── Footer ──────────────────────────────────────────── */
.ig-footer {
  position: absolute;
  bottom: 20px;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ig-footer-url {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  letter-spacing: 0.04em;
}
</style>
