<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn">
    <!-- Header -->
    <div class="pb-2">
      <div class="inline-flex items-center gap-2 text-xs font-bold text-ic-secondary tracking-wider uppercase">
        <span>Institute of Computing</span>
        <span class="text-gray-300">•</span>
        <span>DNSC Admin Console</span>
      </div>
      <h1 class="text-2xl font-semibold text-gray-900 mt-1">About the Portal</h1>
    </div>

    <!-- Bento Grid Container -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Box 1: Hero Block (Spans 2 columns on desktop) -->
      <div class="md:col-span-2 bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 hover:border-ic-primary hover:shadow-lg hover:shadow-ic-primary/5 transition-all duration-300">
        <div class="space-y-3">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-ic-primary text-white text-xs font-semibold rounded-full shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Central Console Active
          </div>
          <h2 class="text-xl font-semibold text-gray-900">IC Administration Hub</h2>
          <p class="text-sm text-gray-600 leading-relaxed max-w-xl">
            The central management console for administrative personnel. Streamlining student profiles, RFID check-in events, fee logs, posts, and portal settings.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center gap-3 pt-3 text-xs text-gray-500 border-t border-gray-100">
          <span class="font-bold text-gray-700">Version 1.0.0</span>
          <span class="text-gray-300">&bull;</span>
          <span class="font-semibold text-gray-600">DNSC Campus Administrator Node</span>
        </div>
      </div>

      <!-- Box 2: Gateway Diagnostics (Spans 1 column) -->
      <div class="bg-white border border-gray-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-ic-primary hover:shadow-lg hover:shadow-ic-primary/5 transition-all duration-300">
        <div>
          <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Diagnostics</h3>
          <div class="space-y-3 text-xs">
            <div class="flex justify-between items-center py-2.5 border-b border-gray-100">
              <span class="text-gray-600 font-semibold text-xs">API Gateway</span>
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
              </span>
            </div>
            <div class="flex justify-between items-center py-2.5 border-b border-gray-100">
              <span class="text-gray-600 font-semibold text-xs">Database Status</span>
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected
              </span>
            </div>
            <div class="flex justify-between items-center py-2.5 border-b border-gray-100">
              <span class="text-gray-600 font-semibold text-xs">SSO Provider</span>
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Ready
              </span>
            </div>
            <div class="flex justify-between items-center py-2.5">
              <span class="text-gray-600 font-semibold text-xs">Active Mode</span>
              <span class="bg-emerald-50 text-emerald-700 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Live Production
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-2.5 mt-4 pt-4 border-t border-gray-100">
          <img src="/icsa_logo.png" alt="ICSA Logo" class="h-6 w-6 object-contain" />
          <span class="text-[10px] text-ic-primary font-bold uppercase tracking-wider">IC Admin Console</span>
        </div>
      </div>

      <!-- Box 3: Tech Infrastructure (Spans 2 columns, height of 2 rows) -->
      <div class="md:col-span-2 bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 space-y-6 hover:border-ic-primary hover:shadow-lg hover:shadow-ic-primary/5 transition-all duration-300">
        <div>
          <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100 pb-2">System Infrastructure</h3>
          <p class="text-xs text-gray-600 mt-1">Core frameworks powering front-end and back-end integration</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Vue 3 -->
          <div class="space-y-1.5">
            <h4 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-ic-primary rounded-md">Vue 3</span>
            </h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              Declarative view logic with setup compiler directives for lightning-fast client interfaces.
            </p>
          </div>

          <!-- Vite 7 -->
          <div class="space-y-1.5">
            <h4 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-ic-secondary rounded-md">Vite 7</span>
            </h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              Automated package compiling, fast module reloading, and tree-shaking assets bundle output.
            </p>
          </div>

          <!-- Tailwind 4 -->
          <div class="space-y-1.5">
            <h4 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-ic-secondary rounded-md">Tailwind 4</span>
            </h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              Custom token structures defining structural grids, components, and primary branding colors.
            </p>
          </div>

          <!-- Django -->
          <div class="space-y-1.5">
            <h4 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-ic-primary rounded-md">Django Gateway</span>
            </h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              Secure Python routing handlers managing user permissions, attendance triggers, and DB storage.
            </p>
          </div>
        </div>
      </div>

      <!-- Box 4: Details Registry (Spans 1 column) -->
      <div class="bg-white border border-gray-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-ic-primary hover:shadow-lg hover:shadow-ic-primary/5 transition-all duration-300">
        <div class="space-y-4">
          <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100 pb-2">Details Registry</h3>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-gray-600 font-semibold">Developer</span>
              <span class="text-gray-900 font-bold">Institute of Computing</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-gray-600 font-semibold">College</span>
              <span class="text-gray-900 font-bold">DNSC</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600 font-semibold">Distribution</span>
              <span class="text-gray-900 font-bold">Internal Use Only</span>
            </div>
          </div>
        </div>

        <div class="text-[10px] text-gray-500 font-semibold pt-4 border-t border-gray-50">
          Distribution Level: Academic Council
        </div>
      </div>

      <!-- Box 5: Console Mission (Spans 1 column on row 3) -->
      <div class="bg-white border border-gray-200/80 rounded-3xl p-6 hover:border-ic-primary hover:shadow-lg hover:shadow-ic-primary/5 transition-all duration-300">
        <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Our Mission</h3>
        <p class="text-xs text-gray-600 leading-relaxed">
          Providing computing administrators with real-time dashboards to coordinate grades, RFID scanner attendances, local clearances, and student bulletins safely.
        </p>
      </div>

      <!-- Box 6: Developers (Spans 2 columns on desktop) -->
      <div class="md:col-span-2 bg-white border border-gray-200/80 rounded-3xl p-6 hover:border-ic-primary hover:shadow-lg hover:shadow-ic-primary/5 transition-all duration-300 flex flex-col justify-between">
        <div>
          <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Developers</h3>
          <div class="grid grid-cols-2 gap-4 mt-2">
            <p class="text-sm text-gray-600">Froyd Carbajosa</p>
            <p class="text-sm text-gray-600">Monch Walter Quines</p>
            <p class="text-sm text-gray-600">Arl Christopher Suaybaguio</p>
            <p class="text-sm text-gray-600">Rafael Villar</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Minimalist Footer -->
    <div class="pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
      <p>&copy; {{ currentYear }} Institute of Computing, Davao del Norte State College. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>

