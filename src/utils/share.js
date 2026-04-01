/**
 * Encodes / decodes prediction state to/from a URL-safe compressed string.
 * Uses LZ-string for compression.
 */
import LZString from 'lz-string'

/**
 * Serialize prediction state to a URL query param value.
 * @param {Object} state - { groupRankings, thirdPlaceGroups, bracketPicks }
 * @returns {string} URL-safe encoded string
 */
export function encodeState(state) {
    const json = JSON.stringify(state)
    return LZString.compressToEncodedURIComponent(json)
}

/**
 * Deserialize state from a URL query param value.
 * @param {string} encoded
 * @returns {Object|null}
 */
export function decodeState(encoded) {
    try {
        const json = LZString.decompressFromEncodedURIComponent(encoded)
        if (!json) return null
        return JSON.parse(json)
    } catch {
        return null
    }
}

/**
 * Build a shareable URL with the given encoded state.
 * @param {string} encoded
 * @returns {string}
 */
export function buildShareUrl(encoded) {
    const url = new URL(window.location.href)
    url.search = ''
    url.hash = ''
    url.searchParams.set('p', encoded)
    return url.toString()
}
