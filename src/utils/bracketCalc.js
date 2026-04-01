/**
 * Computes the resolved team IDs for every R32 match slot,
 * given the user's group rankings and 3rd-place slot assignments.
 *
 * @param {Object} groupRankings - { A: ['MEX','RSA','KOR','CZE'], B: [...], ... }
 * @param {Object} thirdPlaceAssignment - { M74: 'C', M77: 'D', ... } (matchId → group)
 * @returns {Object} - { M73: { teamA: 'MEX', teamB: 'CAN' }, ... }
 */
import { FINAL_SLOT, QF_SLOTS, R16_SLOTS, R32_SLOTS, SF_SLOTS } from '@/data/bracket.js'

export function computeR32Matchups(groupRankings, thirdPlaceAssignment) {
    const result = {}

    for (const slot of R32_SLOTS) {
        const teamA = resolveSlot(slot.slotA, groupRankings, thirdPlaceAssignment, slot.id)
        const teamB = resolveSlot(slot.slotB, groupRankings, thirdPlaceAssignment, slot.id)
        result[slot.id] = { teamA, teamB }
    }

    return result
}

/**
 * Resolves a slot string to a team ID.
 * @param {string} slot - e.g. "1A", "2B", "3ABCDF"
 * @param {Object} groupRankings
 * @param {Object} thirdPlaceAssignment
 * @param {string} matchId - needed to look up 3rd-place slot
 */
function resolveSlot(slot, groupRankings, thirdPlaceAssignment, matchId) {
    if (slot.startsWith('1')) {
        const group = slot[1]
        return groupRankings[group]?.[0] ?? null
    }
    if (slot.startsWith('2')) {
        const group = slot[1]
        return groupRankings[group]?.[1] ?? null
    }
    if (slot.startsWith('3')) {
        // This match's 3rd-place team comes from the assigned group
        const group = thirdPlaceAssignment?.[matchId] ?? null
        if (!group) return null
        return groupRankings[group]?.[2] ?? null
    }
    return null
}

/**
 * Get all match IDs in order across all rounds
 */
export function getAllMatchIds() {
    return [
        ...R32_SLOTS.map(m => m.id),
        ...R16_SLOTS.map(m => m.id),
        ...QF_SLOTS.map(m => m.id),
        ...SF_SLOTS.map(m => m.id),
        FINAL_SLOT.id,
    ]
}

/**
 * Given bracketPicks (matchId → winning teamId) and R32 matchups,
 * compute the teams for each subsequent round match.
 * Returns a full map of matchId → { teamA, teamB }
 */
export function computeFullBracket(r32Matchups, bracketPicks) {
    const matchTeams = { ...r32Matchups }

    const allRoundSlots = [...R16_SLOTS, ...QF_SLOTS, ...SF_SLOTS, FINAL_SLOT]

    for (const slot of allRoundSlots) {
        const teamA = bracketPicks[slot.matchA] ?? null
        const teamB = bracketPicks[slot.matchB] ?? null
        matchTeams[slot.id] = { teamA, teamB }
    }

    return matchTeams
}
