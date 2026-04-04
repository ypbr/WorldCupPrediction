<template>
  <component
    :is="currentView"
    :hasSavedState="hasSavedState"
    v-bind="currentProps"
    @start="goToStep('groups')"
    @resume="resume"
    @next="nextStep"
    @back="handleBack"
    @reset="goToStep('home')"
    @home="goToStep('home')"
    @make-own="makeOwnPrediction"
    @stats="goToStats"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { usePredictionStore } from "@/stores/prediction.js";
import HomeView from "@/views/HomeView.vue";
import GroupsView from "@/views/GroupsView.vue";
import ThirdPlaceView from "@/views/ThirdPlaceView.vue";
import BracketView from "@/views/BracketView.vue";
import SummaryView from "@/views/SummaryView.vue";
import StatsView from "@/views/StatsView.vue";
import { decodeState } from "@/utils/share.js";

const store = usePredictionStore();
const step = ref("home");
const statsReturnStep = ref("home");
const hasSavedState = ref(false);
const isShared = ref(false);

const steps = ["home", "groups", "third", "bracket", "summary"];

const viewMap = {
  home: HomeView,
  groups: GroupsView,
  third: ThirdPlaceView,
  bracket: BracketView,
  summary: SummaryView,
  stats: StatsView,
};

const currentView = computed(() => viewMap[step.value]);
const currentProps = computed(() => {
  if (step.value === "summary") return { isShared: isShared.value };
  if (step.value === "home") return { hasSavedState: hasSavedState.value };
  return {};
});

function goToStep(s) {
  step.value = s;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextStep() {
  const idx = steps.indexOf(step.value);
  if (idx < steps.length - 1) goToStep(steps[idx + 1]);
}

function prevStep() {
  const idx = steps.indexOf(step.value);
  if (idx > 0) goToStep(steps[idx - 1]);
}

function handleBack() {
  if (step.value === "stats") {
    goToStep(statsReturnStep.value);
  } else {
    prevStep();
  }
}

function goToStats() {
  statsReturnStep.value = step.value;
  goToStep("stats");
}

function resume() {
  // Skip to the furthest reasonable step based on saved state
  if (store.champion) {
    goToStep("summary");
  } else if (store.thirdPlaceDone) {
    goToStep("bracket");
  } else if (store.allGroupsDone) {
    goToStep("third");
  } else {
    goToStep("groups");
  }
}

function makeOwnPrediction() {
  store.resetAll();
  isShared.value = false;
  goToStep("home");
}

onMounted(() => {
  // Check URL for shared prediction
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("p");
  if (encoded) {
    const ok = store.loadFromEncoded(encoded);
    if (ok) {
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
      isShared.value = true;
      resume();
      return;
    }
  }

  // Load from local storage
  const loaded = store.loadFromStorage();
  hasSavedState.value = loaded && store.groupsCompleted > 0;
});
</script>
