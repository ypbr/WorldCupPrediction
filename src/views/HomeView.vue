<template>
  <div class="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-16 text-center">

    <!-- Logo / Title -->
    <div class="mb-8">
      <p class="text-5xl mb-4">⚽</p>
      <h1 class="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
        FIFA 2026<br/>
        <span class="text-fifa-gold">World Cup</span>
      </h1>
      <p class="text-xl font-semibold text-white mt-1">Predictor</p>
    </div>

    <!-- Tagline -->
    <p class="text-gray-400 text-base max-w-xs mb-10 leading-relaxed">
      Pick your group standings, simulate the knockout bracket, and predict the champion.
      Then share with friends!
    </p>

    <!-- Stats row -->
    <div class="flex gap-6 mb-10 text-center">
      <div>
        <p class="text-2xl font-black text-white">48</p>
        <p class="text-xs text-gray-500 mt-0.5">Teams</p>
      </div>
      <div class="w-px bg-white/10" />
      <div>
        <p class="text-2xl font-black text-white">12</p>
        <p class="text-xs text-gray-500 mt-0.5">Groups</p>
      </div>
      <div class="w-px bg-white/10" />
      <div>
        <p class="text-2xl font-black text-white">104</p>
        <p class="text-xs text-gray-500 mt-0.5">Matches</p>
      </div>
    </div>

    <!-- Steps -->
    <div class="w-full max-w-xs mb-10 space-y-3 text-left">
      <div v-for="(step, i) in steps" :key="i" class="flex items-start gap-3">
        <div class="shrink-0 w-7 h-7 rounded-full bg-fifa-blue/30 border border-fifa-blue/50 flex items-center justify-center text-xs font-bold text-blue-300">
          {{ i + 1 }}
        </div>
        <div>
          <p class="text-sm font-semibold text-white">{{ step.title }}</p>
          <p class="text-xs text-gray-500">{{ step.desc }}</p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <button
      @click="$emit('start')"
      class="w-full max-w-xs bg-fifa-blue hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-lg py-5 rounded-2xl shadow-lg shadow-blue-900/40 transition-all duration-150 touch-manipulation active:scale-[0.98]"
    >
      Start Predicting →
    </button>

    <!-- Resume option -->
    <button
      v-if="hasSavedState"
      @click="$emit('resume')"
      class="mt-4 text-sm text-gray-500 hover:text-gray-300 transition-colors touch-manipulation"
    >
      Continue saved prediction
    </button>

    <!-- Stats link -->
    <button
      @click="$emit('stats')"
      class="mt-3 text-sm text-gray-600 hover:text-gray-400 transition-colors touch-manipulation flex items-center gap-1.5"
    >
      <span>📊</span> View Global Statistics
    </button>

    <p class="mt-8 text-xs text-gray-700">USA · Canada · Mexico · June–July 2026</p>

    <button
      @click="$emit('privacy')"
      class="mt-2 text-xs text-gray-700 hover:text-gray-500 transition-colors touch-manipulation"
    >
      Privacy Policy
    </button>
  </div>
</template>

<script setup>
defineProps({
  hasSavedState: { type: Boolean, default: false },
})
defineEmits(['start', 'resume', 'stats', 'privacy'])

const steps = [
  { title: 'Rank all 12 groups', desc: 'Tap teams in order of finish (1st to 4th)' },
  { title: 'Pick 3rd-place qualifiers', desc: 'Choose 8 of 12 groups to send their 3rd-place team through' },
  { title: 'Simulate the bracket', desc: 'Pick winners from the Round of 32 all the way to the Final' },
  { title: 'Share your prediction', desc: 'Get a link to challenge family and friends' },
]
</script>
