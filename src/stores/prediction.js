import { FINAL_SLOT, QF_SLOTS, R16_SLOTS, SF_SLOTS } from '@/data/bracket.js'
import { GROUPS } from '@/data/teams.js'
import { computeFullBracket, computeR32Matchups } from '@/utils/bracketCalc.js'
import { decodeState, encodeState } from '@/utils/share.js'
import { assignThirdPlaceSlots } from '@/utils/thirdPlace.js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'wc2026_prediction'

export const usePredictionStore = defineStore('prediction', () => {
    // ── State ──────────────────────────────────────────────────────────────────
    // { A: ['MEX', 'RSA', 'KOR', 'CZE'], B: [...], ... }
    // Empty array means no ranking set yet for that group
    const groupRankings = ref(Object.fromEntries(GROUPS.map(g => [g, []])))

    // Which 8 group letters have their 3rd-place team advancing
    const thirdPlaceGroups = ref([])

    // bracketPicks: matchId → winning teamId
    const bracketPicks = ref({})

    // ── Computed states ────────────────────────────────────────────────────────

    const groupsCompleted = computed(() =>
        GROUPS.filter(g => groupRankings.value[g]?.length === 4).length
    )

    const allGroupsDone = computed(() => groupsCompleted.value === 12)

    const thirdPlaceDone = computed(() => thirdPlaceGroups.value.length === 8)

    // Computed 3rd place slot assignments
    const thirdPlaceAssignment = computed(() =>
        thirdPlaceDone.value
            ? assignThirdPlaceSlots(thirdPlaceGroups.value)
            : {}
    )

    // Computed R32 matchups from group rankings
    const r32Matchups = computed(() =>
        allGroupsDone.value && thirdPlaceDone.value
            ? computeR32Matchups(groupRankings.value, thirdPlaceAssignment.value)
            : {}
    )

    // Full bracket with all rounds populated
    const fullBracket = computed(() =>
        computeFullBracket(r32Matchups.value, bracketPicks.value)
    )

    // Champion = winner of Final
    const champion = computed(() => bracketPicks.value[FINAL_SLOT.id] ?? null)

    // How many picks have been made in knockout
    const knockoutPicksCount = computed(() => Object.keys(bracketPicks.value).length)

    const totalKnockoutMatches = 31 // 16+8+4+2+1

    // ── Actions ────────────────────────────────────────────────────────────────

    function setGroupRanking(group, orderedTeamIds) {
        groupRankings.value[group] = orderedTeamIds
        // If group rankings change, clear downstream picks that are now invalid
        invalidateKnockoutPicks()
        persist()
    }

    function setThirdPlaceGroups(groups) {
        thirdPlaceGroups.value = groups
        invalidateKnockoutPicks()
        persist()
    }

    function pickWinner(matchId, teamId) {
        bracketPicks.value[matchId] = teamId
        // Invalidate all picks downstream of this match
        invalidateDownstream(matchId)
        persist()
    }

    function invalidateKnockoutPicks() {
        bracketPicks.value = {}
    }

    /**
     * Removes picks for any match whose input includes matchId as a source.
     * Also removes transitive downstream picks.
     */
    function invalidateDownstream(matchId) {
        const allSlots = [...R16_SLOTS, ...QF_SLOTS, ...SF_SLOTS, FINAL_SLOT]
        for (const slot of allSlots) {
            if (slot.matchA === matchId || slot.matchB === matchId) {
                if (bracketPicks.value[slot.id]) {
                    delete bracketPicks.value[slot.id]
                    invalidateDownstream(slot.id)
                }
            }
        }
    }

    function resetAll() {
        groupRankings.value = Object.fromEntries(GROUPS.map(g => [g, []]))
        thirdPlaceGroups.value = []
        bracketPicks.value = {}
        persist()
    }

    // ── Persistence ────────────────────────────────────────────────────────────

    function persist() {
        const state = {
            groupRankings: groupRankings.value,
            thirdPlaceGroups: thirdPlaceGroups.value,
            bracketPicks: bracketPicks.value,
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        } catch { }
    }

    function loadFromStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return false
            const state = JSON.parse(raw)
            if (state.groupRankings) groupRankings.value = state.groupRankings
            if (state.thirdPlaceGroups) thirdPlaceGroups.value = state.thirdPlaceGroups
            if (state.bracketPicks) bracketPicks.value = state.bracketPicks
            return true
        } catch {
            return false
        }
    }

    function getSharePayload() {
        return encodeState({
            groupRankings: groupRankings.value,
            thirdPlaceGroups: thirdPlaceGroups.value,
            bracketPicks: bracketPicks.value,
        })
    }

    function loadFromEncoded(encoded) {
        const state = decodeState(encoded)
        if (!state) return false
        if (state.groupRankings) groupRankings.value = state.groupRankings
        if (state.thirdPlaceGroups) thirdPlaceGroups.value = state.thirdPlaceGroups
        if (state.bracketPicks) bracketPicks.value = state.bracketPicks
        persist()
        return true
    }

    return {
        // state
        groupRankings,
        thirdPlaceGroups,
        bracketPicks,
        // computed
        groupsCompleted,
        allGroupsDone,
        thirdPlaceDone,
        thirdPlaceAssignment,
        r32Matchups,
        fullBracket,
        champion,
        knockoutPicksCount,
        totalKnockoutMatches,
        // actions
        setGroupRanking,
        setThirdPlaceGroups,
        pickWinner,
        resetAll,
        loadFromStorage,
        getSharePayload,
        loadFromEncoded,
    }
})
