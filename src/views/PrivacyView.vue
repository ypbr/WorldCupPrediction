<template>
  <div class="min-h-screen bg-gray-950 text-white px-6 py-10 max-w-2xl mx-auto">

    <!-- Header -->
    <div class="mb-8">
      <button
        @click="$emit('back')"
        class="mb-6 text-sm text-gray-500 hover:text-gray-300 transition-colors touch-manipulation flex items-center gap-1.5"
      >
        ← Back
      </button>
      <h1 class="text-2xl font-black text-white mb-1">Privacy Policy</h1>
      <p class="text-xs text-gray-500">Last updated: April 8, 2026</p>
    </div>

    <div class="space-y-8 text-sm text-gray-300 leading-relaxed">

      <!-- Intro -->
      <p>
        World Cup 2026 Predictor ("the App") is operated by ypbr.dev. This Privacy Policy
        explains what information we collect, how we use it, and your choices regarding your data.
        By using the App, you agree to the practices described here.
      </p>

      <!-- 1 -->
      <section>
        <h2 class="text-base font-bold text-white mb-3">1. Information We Collect</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-gray-200 mb-1">Anonymous Session ID</h3>
            <p>
              When you first open the App, an anonymous session is created automatically via Supabase.
              This generates a random user ID that is not linked to any personal information.
              The session token is stored in your browser's local storage.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-200 mb-1">Prediction Data</h3>
            <p>
              When you complete your bracket, your team picks (e.g., which teams you selected
              to advance through each round) are submitted to our database, associated only
              with your anonymous session ID. No name, email, or device information is
              attached to this data.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-200 mb-1">Google Account (Optional)</h3>
            <p>
              You may optionally link your Google account to your prediction. If you choose to
              do so, we receive your Google account's email address and profile name from Google,
              which are stored alongside your prediction. This step is entirely optional
              and can be skipped.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-200 mb-1">Usage Analytics</h3>
            <p>
              We use Google Tag Manager and Google Analytics to collect anonymous usage data
              such as page views and interaction events. This data does not identify you personally.
            </p>
          </div>
        </div>
      </section>

      <!-- 2 -->
      <section>
        <h2 class="text-base font-bold text-white mb-3">2. How We Use Your Information</h2>
        <ul class="list-disc list-inside space-y-2 ml-1">
          <li>To display aggregated global prediction statistics (e.g., "Most predicted champion")</li>
          <li>To allow you to share your prediction via a URL</li>
          <li>To restore your saved prediction on return visits</li>
          <li>To improve the App through anonymous usage analytics</li>
        </ul>
        <p class="mt-3">
          We do not sell, rent, or share your data with third parties for marketing purposes.
        </p>
      </section>

      <!-- 3 -->
      <section>
        <h2 class="text-base font-bold text-white mb-3">3. Local Storage</h2>
        <p>
          Your prediction is saved locally in your browser's local storage under the key
          <code class="bg-gray-800 px-1.5 py-0.5 rounded text-xs text-gray-200">wc2026_prediction</code>.
          This data stays on your device and is not transmitted unless you complete and submit
          your bracket. You can clear this at any time by resetting your prediction or clearing
          your browser/app data.
        </p>
      </section>

      <!-- 4 -->
      <section>
        <h2 class="text-base font-bold text-white mb-3">4. Third-Party Services</h2>
        <div class="space-y-3">
          <div>
            <p><span class="font-semibold text-gray-200">Supabase</span> — Backend database and authentication provider. Anonymous sessions and prediction data are stored on Supabase infrastructure. See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">supabase.com/privacy</a>.</p>
          </div>
          <div>
            <p><span class="font-semibold text-gray-200">Google Sign-In</span> — Optional account linking via Google OAuth. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">policies.google.com/privacy</a>.</p>
          </div>
          <div>
            <p><span class="font-semibold text-gray-200">Google Analytics / Google Tag Manager</span> — Anonymous usage analytics. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">policies.google.com/privacy</a>.</p>
          </div>
          <div>
            <p><span class="font-semibold text-gray-200">Flag CDN (flagcdn.com)</span> — Country flag images are loaded from flagcdn.com. Your IP address may be logged by their servers as part of standard web requests.</p>
          </div>
        </div>
      </section>

      <!-- 5 -->
      <section>
        <h2 class="text-base font-bold text-white mb-3">5. Data Retention</h2>
        <p>
          Anonymous session data and prediction picks are retained for the duration of the
          World Cup 2026 period and may be deleted afterward. If you linked a Google
          account, you may request deletion of your data by contacting us at the address below.
        </p>
      </section>

      <!-- 6 -->
      <section>
        <h2 class="text-base font-bold text-white mb-3">6. Children's Privacy</h2>
        <p>
          The App is not directed at children under the age of 13. We do not knowingly collect
          personal information from children. If you believe a child has provided us with
          personal information, please contact us and we will delete it promptly.
        </p>
      </section>

      <!-- 7 -->
      <section>
        <h2 class="text-base font-bold text-white mb-3">7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, the "Last updated"
          date at the top will be revised. Continued use of the App after changes constitutes
          acceptance of the updated policy.
        </p>
      </section>

      <!-- 8 -->
      <section>
        <h2 class="text-base font-bold text-white mb-3">8. Contact</h2>
        <p>
          If you have questions about this Privacy Policy or want to request data deletion,
          contact us at: <a href="mailto:hello@ypbr.dev" class="text-blue-400 hover:underline">hello@ypbr.dev</a>
        </p>
      </section>

    </div>

    <!-- Bottom back button -->
    <button
      @click="$emit('back')"
      class="mt-12 mb-6 text-sm text-gray-600 hover:text-gray-400 transition-colors touch-manipulation"
    >
      ← Back to Home
    </button>

  </div>
</template>

<script setup>
defineEmits(['back'])
</script>
