/**
 * Determines which groups' 3rd-place teams qualify and assigns them to R32 slots.
 * Uses a greedy matching approach: tries to assign each 3rd-place team
 * to a compatible R32 slot based on THIRD_PLACE_SLOT_GROUPS constraints.
 *
 * @param {string[]} selectedGroups - Array of 8 group letters (e.g., ['A','B','C','D','E','F','G','H'])
 * @returns {Object} mapping of matchId → group letter (e.g., { M74: 'A', M77: 'C', ... })
 */
import { THIRD_PLACE_SLOTS_PRIORITY, THIRD_PLACE_SLOT_GROUPS } from '@/data/bracket.js'

export function assignThirdPlaceSlots(selectedGroups) {
    const assignment = {}    // matchId → group letter
    const usedGroups = new Set()
    const usedSlots = new Set()

    // Try each slot in priority order
    for (const slotId of THIRD_PLACE_SLOTS_PRIORITY) {
        const validGroups = THIRD_PLACE_SLOT_GROUPS[slotId]
        // Find first selected group that fits this slot and isn't used yet
        const match = selectedGroups.find(g => validGroups.includes(g) && !usedGroups.has(g))
        if (match) {
            assignment[slotId] = match
            usedGroups.add(match)
            usedSlots.add(slotId)
        }
    }

    // Assign any remaining selected groups to unmatched slots
    for (const slotId of THIRD_PLACE_SLOTS_PRIORITY) {
        if (!usedSlots.has(slotId)) {
            const remaining = selectedGroups.find(g => !usedGroups.has(g))
            if (remaining) {
                assignment[slotId] = remaining
                usedGroups.add(remaining)
                usedSlots.add(slotId)
            }
        }
    }

    return assignment
}
