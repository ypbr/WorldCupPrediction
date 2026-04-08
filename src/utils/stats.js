import { FINAL_SLOT, QF_SLOTS, R16_SLOTS, R32_SLOTS, SF_SLOTS } from '@/data/bracket.js'
import { getCurrentUser } from './auth.js'
import { supabase } from './supabaseClient.js'

/**
 * Submits or updates the current prediction in Supabase.
 * Each user has exactly one submission (keyed by user_id).
 * If the user already has a submission, team appearances are replaced and hash is updated.
 * Fire-and-forget — does not throw. Returns 'saved' | 'updated' | 'skipped' | 'error'.
 *
 * @param {import('@/stores/prediction.js').PredictionStore} store
 * @returns {Promise<'saved'|'updated'|'skipped'|'error'>}
 */
export async function submitPrediction(store) {
    try {
        const user = getCurrentUser()
        if (!user) return 'skipped'

        const hash = store.getSharePayload()
        if (!hash) return 'skipped'

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

        if (appearances.length === 0) return 'skipped'

        // Check if user already has a submission
        const { data: existing, error: selectError } = await supabase
            .from('submissions')
            .select('id, hash')
            .eq('user_id', user.id)
            .maybeSingle()

        if (selectError) throw selectError

        let submissionId
        let action

        if (existing) {
            // Same prediction — nothing to update
            if (existing.hash === hash) return 'skipped'

            submissionId = existing.id
            action = 'updated'

            // Replace team appearances for this submission
            const { error: deleteError } = await supabase
                .from('team_appearances')
                .delete()
                .eq('submission_id', submissionId)
            if (deleteError) throw deleteError

            const { error: updateError } = await supabase
                .from('submissions')
                .update({ hash })
                .eq('id', submissionId)
            if (updateError) throw updateError
        } else {
            submissionId = crypto.randomUUID()
            action = 'saved'

            const { error: insertError } = await supabase
                .from('submissions')
                .insert({ id: submissionId, hash, user_id: user.id })
            if (insertError) throw insertError
        }

        // Batch insert new team appearances
        const rows = appearances.map((a) => ({ ...a, submission_id: submissionId }))
        const { error: appError } = await supabase.from('team_appearances').insert(rows)
        if (appError) throw appError

        return action
    } catch (err) {
        // Non-blocking — stats failure must never break the user flow
        console.warn('[stats] submitPrediction failed:', err)
        return 'error'
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
