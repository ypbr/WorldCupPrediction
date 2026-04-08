import { ref } from 'vue'
import { supabase } from './supabaseClient.js'

// Lazy-load Capacitor Browser plugin only when running as native app
let CapacitorBrowser = null
async function getBrowser() {
    if (CapacitorBrowser) return CapacitorBrowser
    if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
        const mod = await import('@capacitor/browser')
        CapacitorBrowser = mod.Browser
    }
    return CapacitorBrowser
}

/**
 * Reactive current user. Updated on auth state changes.
 * null = not yet initialized, undefined = signed out (shouldn't happen with anon auth)
 */
export const authUser = ref(null)

/**
 * Initialize auth session. Call once on app mount before loading predictions.
 * - If a session already exists (returning user), restores it.
 * - If no session, creates a new anonymous session automatically.
 * Anonymous sessions are persisted in localStorage by Supabase SDK.
 */
export async function initAuth() {
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
        authUser.value = session.user
    } else {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) {
            console.warn('[auth] signInAnonymously failed:', error)
        } else {
            authUser.value = data.user
        }
    }

    // Keep authUser in sync for the lifetime of the session
    supabase.auth.onAuthStateChange((_event, session) => {
        authUser.value = session?.user ?? null
    })
}

/**
 * Returns the current user or null.
 * @returns {import('@supabase/supabase-js').User | null}
 */
export function getCurrentUser() {
    return authUser.value
}

/**
 * Returns true if the current user is anonymous (not linked to an identity provider).
 */
export function isAnonymousUser() {
    const user = authUser.value
    if (!user) return false
    return user.is_anonymous === true
}

/**
 * Upgrades an anonymous user to a Google-authenticated user.
 * The user_id is preserved — their prediction remains intact.
 * - On Capacitor (Android): opens an in-app browser tab, handles deep link callback.
 * - On web: standard OAuth redirect.
 */
export async function linkGoogleAccount() {
    const redirectTo = getOAuthRedirectUrl()

    const { data, error } = await supabase.auth.linkIdentity({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
    })
    if (error) throw error

    const url = data?.url
    if (!url) return data

    const browser = await getBrowser()
    if (browser) {
        // Capacitor: open OAuth URL in system browser (handles custom scheme redirect)
        await browser.open({ url, presentationStyle: 'popover' })

        // Listen for the deep link callback which closes the browser
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                authUser.value = session.user
                await browser.close()
            }
        })
    } else {
        // Web: full page redirect
        window.location.href = url
    }

    return data
}

/**
 * Signs in with Google directly (for users who are not anonymous).
 * Not used in normal flow — provided as fallback.
 */
export async function signInWithGoogle() {
    const redirectTo = getOAuthRedirectUrl()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
    })
    if (error) throw error

    const url = data?.url
    if (!url) return data

    const browser = await getBrowser()
    if (browser) {
        await browser.open({ url, presentationStyle: 'popover' })
    } else {
        window.location.href = url
    }

    return data
}

/**
 * Returns the correct OAuth redirect URL.
 * - In Capacitor (Android): uses deep link scheme.
 * - In web browser: uses current origin.
 */
function getOAuthRedirectUrl() {
    // Capacitor injects window.Capacitor when running as native app
    if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
        return 'dev.ypbr.fifawc2026://auth/callback'
    }
    return window.location.origin
}
