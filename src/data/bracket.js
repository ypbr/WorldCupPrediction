/**
 * World Cup 2026 – Knockout bracket structure
 *
 * Round of 32 (R32): 16 matches (M73–M88)
 * Round of 16 (R16): 8 matches (M89–M96)
 * Quarterfinals (QF): 4 matches (M97–M100)
 * Semifinals (SF): 2 matches (M101–M102)
 * Final: 1 match (M103)
 *
 * Slot notation:
 *   "1A" = Group A winner
 *   "2B" = Group B runner-up
 *   "3ABCDF" = best 3rd-place team from among groups A,B,C,D,F
 *
 * Source: 2026 official regulations + Wikipedia bracket
 */

// Round of 32 matchups - pre-determined bracket
// Each entry: { id, slotA, slotB }
// slotA/slotB: "1X", "2X" or "3XXXXX" (groups that can fill that slot)
export const R32_SLOTS = [
    // Match 73
    { id: 'M73', slotA: '1A', slotB: '2B' },
    // Match 74
    { id: 'M74', slotA: '1E', slotB: '3ABCDF' },
    // Match 75
    { id: 'M75', slotA: '1F', slotB: '2C' },
    // Match 76 – Group C winner vs best 3rd from groups B/G/H/K/L
    { id: 'M76', slotA: '1C', slotB: '3BGHKL' },
    // Match 77
    { id: 'M77', slotA: '1I', slotB: '3CDFGH' },
    // Match 78
    { id: 'M78', slotA: '2E', slotB: '2I' },
    // Match 79
    { id: 'M79', slotA: '1G', slotB: '3AEHIJ' },
    // Match 80
    { id: 'M80', slotA: '1L', slotB: '3EHIJK' },
    // Match 81
    { id: 'M81', slotA: '1D', slotB: '3BEFIJ' },
    // Match 82 – RU-vs-RU: runners-up of groups A and F
    { id: 'M82', slotA: '2A', slotB: '2F' },
    // Match 83
    { id: 'M83', slotA: '2K', slotB: '2L' },
    // Match 84
    { id: 'M84', slotA: '1H', slotB: '2J' },
    // Match 85
    { id: 'M85', slotA: '1B', slotB: '3EFGIJ' },
    // Match 86
    { id: 'M86', slotA: '1J', slotB: '2H' },
    // Match 87
    { id: 'M87', slotA: '1K', slotB: '3DEIJL' },
    // Match 88 – RU-vs-RU: runners-up of groups D and G
    { id: 'M88', slotA: '2D', slotB: '2G' },
]

// Round of 16 – which R32 match winners face each other
export const R16_SLOTS = [
    { id: 'M89', matchA: 'M74', matchB: 'M77' },
    { id: 'M90', matchA: 'M73', matchB: 'M75' },
    { id: 'M91', matchA: 'M76', matchB: 'M78' },
    { id: 'M92', matchA: 'M79', matchB: 'M80' },
    { id: 'M93', matchA: 'M83', matchB: 'M84' },
    { id: 'M94', matchA: 'M81', matchB: 'M82' },
    { id: 'M95', matchA: 'M86', matchB: 'M88' },
    { id: 'M96', matchA: 'M85', matchB: 'M87' },
]

// Quarterfinals
export const QF_SLOTS = [
    { id: 'M97', matchA: 'M89', matchB: 'M90' },
    { id: 'M98', matchA: 'M93', matchB: 'M94' },
    { id: 'M99', matchA: 'M91', matchB: 'M92' },
    { id: 'M100', matchA: 'M95', matchB: 'M96' },
]

// Semifinals
export const SF_SLOTS = [
    { id: 'M101', matchA: 'M97', matchB: 'M98' },
    { id: 'M102', matchA: 'M99', matchB: 'M100' },
]

// Final
export const FINAL_SLOT = { id: 'M103', matchA: 'M101', matchB: 'M102' }

// Third-place match
export const THIRD_PLACE_SLOT = { id: 'M103B', matchA: 'M101', matchB: 'M102', isThirdPlace: true }

// All rounds in order
export const ROUNDS = [
    { id: 'r32', name: 'Round of 32', matches: R32_SLOTS },
    { id: 'r16', name: 'Round of 16', matches: R16_SLOTS },
    { id: 'qf', name: 'Quarterfinals', matches: QF_SLOTS },
    { id: 'sf', name: 'Semifinals', matches: SF_SLOTS },
    { id: 'final', name: 'Final', matches: [FINAL_SLOT] },
]

/**
 * 3rd place slot assignment lookup table.
 * When 8 specific groups produce 3rd-place qualifiers, they map to these R32 slots.
 * 495-combination table, simplified to the slot constraints above.
 * Key = sorted string of 8 qualifying groups (e.g., "ABCDEFGH")
 * For simplicity in the UI we let the user pick 8 of 12, then assign
 * them to bracket slots greedily (best 3rd-place → highest-priority slot).
 *
 * Slot priority order for 3rd place assignment:
 */
export const THIRD_PLACE_SLOTS_PRIORITY = ['M74', 'M76', 'M77', 'M79', 'M80', 'M81', 'M85', 'M87']

// For each R32 third-place slot, which groups are valid sources
export const THIRD_PLACE_SLOT_GROUPS = {
    M74: ['A', 'B', 'C', 'D', 'F'],
    M76: ['B', 'G', 'H', 'K', 'L'],
    M77: ['C', 'D', 'F', 'G', 'H'],
    M79: ['A', 'E', 'H', 'I', 'J'],
    M80: ['E', 'H', 'I', 'J', 'K'],
    M81: ['B', 'E', 'F', 'I', 'J'],
    M85: ['E', 'F', 'G', 'I', 'J'],
    M87: ['D', 'E', 'I', 'J', 'L'],
}
