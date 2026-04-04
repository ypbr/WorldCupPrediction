import { FINAL_SLOT, QF_SLOTS, R16_SLOTS, R32_SLOTS, SF_SLOTS } from '@/data/bracket.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
)

const SUBMITTED_HASH_KEY = 'wc2026_submitted_hash'

/**
 * Submits the current prediction to Supabase as an anonymous data point.
 * Silently skips if already submitted (deduplication via localStorage + DB unique constraint).
 * Fire-and-forget — does not throw.
 *
 * @param {import('@/stores/prediction.js').PredictionStore} store
 */
export async function submitPrediction(store) {
    try {
        const hash = store.getSharePayload()
        if (!hash) return

        // Skip if already submitted this exact prediction
        if (localStorage.getItem(SUBMITTED_HASH_KEY) === hash) return

        const picks = store.bracketPicks
        const r32Matchups = store.r32Matchups

        // Build flat list of { team_id, round } appearances
        const appearances = []

        // r32 — all 32 teams that reached the knockout stage
        for (const match of Object.values(r32Matchups)) {
            if (match.teamA) appearances.push({ team_id: match.teamA, round: 'r32' })
            if (match.teamB) appearances.push({ team_id: match.teamB, round: 'r32' })
        }

        // r16 — winners of R32
        for (const slot of R32_SLOTS) {
            const winner = picks[slot.id]
            if (winner) appearances.push({ team_id: winner, round: 'r16' })
        }

        // qf — winners of R16
        for (const slot of R16_SLOTS) {
            const winner = picks[slot.id]
            if (winner) appearances.push({ team_id: winner, round: 'qf' })
        }

        // sf — winners of QF
        for (const slot of QF_SLOTS) {
            const winner = picks[slot.id]
            if (winner) appearances.push({ team_id: winner, round: 'sf' })
        }

        // finalist — winners of SF
        for (const slot of SF_SLOTS) {
            const winner = picks[slot.id]
            if (winner) appearances.push({ team_id: winner, round: 'finalist' })
        }

        // champion
        const champion = picks[FINAL_SLOT.id]
        if (champion) appearances.push({ team_id: champion, round: 'champion' })

        if (appearances.length === 0) return

        // Generate UUID client-side to avoid needing SELECT on submissions
        const submissionId = crypto.randomUUID()

        // Insert submission row (unique constraint on hash handles duplicates silently)
        const { error: subError } = await supabase
            .from('submissions')
            .insert({ id: submissionId, hash })

        if (subError) {
            // 23505 = unique_violation — already submitted from another device/browser
            if (subError.code === '23505') {
                localStorage.setItem(SUBMITTED_HASH_KEY, hash)
                return
            }
            throw subError
        }

        // Batch insert team appearances
        const rows = appearances.map((a) => ({ ...a, submission_id: submissionId }))
        const { error: appError } = await supabase.from('team_appearances').insert(rows)
        if (appError) throw appError

        // Mark as submitted locally
        localStorage.setItem(SUBMITTED_HASH_KEY, hash)
    } catch (err) {
        // Non-blocking — stats failure must never break the user flow
        console.warn('[stats] submitPrediction failed:', err)
    }
}

/**
 * Fetches team appearance counts for a given round.
 * @param {'r32'|'r16'|'qf'|'sf'|'finalist'|'champion'} round
 * @returns {Promise<Array<{team_id: string, count: number}>>} sorted descending by count
 */
export async function fetchStats(round) {
    const { data, error } = await supabase
        .from('team_stats')
        .select('team_id, count')
        .eq('round', round)
        .order('count', { ascending: false })

    if (error) throw error
    return data ?? []
}

/**
 * Returns the total number of submitted predictions.
 * @returns {Promise<number>}
 */
export async function fetchTotalCount() {
    const { count, error } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count ?? 0
}
