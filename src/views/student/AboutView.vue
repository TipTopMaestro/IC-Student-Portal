<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div>
      <h1 class="font-pixel text-2xl sm:text-3xl text-gray-900 lowercase tracking-tight">about</h1>
      <p class="text-sm text-gray-500 mt-0.5">Institute of Computing · DNSC Student Portal System Overview</p>
    </div>

    <!-- 01 — system overview -->
    <div class="space-y-3">
      <div class="px-1">
        <span class="font-pixel text-sm text-gray-400 lowercase">01 — system overview</span>
      </div>

      <!-- Bento Grid Top Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Hero Card (2 cols) -->
        <div class="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col justify-between gap-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div class="space-y-2.5">
            <span class="font-mono text-[10px] font-semibold text-ic-primary uppercase tracking-wider">Unified Workspace</span>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Your digital academic companion.</h2>
            <p class="text-xs text-gray-600 leading-relaxed font-sans max-w-xl">
              The IC Student Portal consolidates official institutional bulletins, RFID attendance event check-ins, departmental clearance dues, and campus services integration into a single high-performance interface.
            </p>
          </div>
          
          <div class="flex flex-wrap items-center gap-3 pt-3 text-[11px] font-mono text-gray-400 border-t border-gray-100 uppercase tracking-wider">
            <span class="text-gray-700 font-semibold">Build 1.0.0</span>
            <span>·</span>
            <span>DNSC Main Campus</span>
            <span>·</span>
            <span class="text-emerald-700 font-medium">Production</span>
          </div>
        </div>

        <!-- Quick Specs Card (1 col) -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div>
            <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-4 pb-2 border-b border-gray-100">Portal Parameters</span>
            <div class="space-y-3 font-mono text-xs">
              <div class="flex justify-between items-center py-1 border-b border-gray-100">
                <span class="text-gray-400 uppercase text-[10px] tracking-wider">Term</span>
                <span class="text-gray-900 font-semibold">2026 - 2027</span>
              </div>
              <div class="flex justify-between items-center py-1 border-b border-gray-100">
                <span class="text-gray-400 uppercase text-[10px] tracking-wider">Audience</span>
                <span class="text-gray-900 font-semibold">IC Students</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-400 uppercase text-[10px] tracking-wider">Availability</span>
                <span class="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 24/7 SSO
                </span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2.5 mt-5 pt-3.5 border-t border-gray-100">
            <img src="/icsa_logo.png" alt="ICSA" class="h-6 w-6 object-contain" />
            <span class="font-mono text-[10px] font-bold text-ic-primary uppercase tracking-wider">IC Student Portal</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 02 — core utilities -->
    <div class="space-y-3">
      <div class="px-1">
        <span class="font-pixel text-sm text-gray-400 lowercase">02 — core utilities</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Academic Records -->
        <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-1.5">
          <h4 class="text-sm font-semibold text-gray-900">Academic Records</h4>
          <p class="text-xs text-gray-600 leading-relaxed">
            Review enrolled program courses, class schedules, and check final reports.
          </p>
        </div>

        <!-- Attendance Tracker -->
        <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-1.5">
          <h4 class="text-sm font-semibold text-gray-900">Attendance Tracker</h4>
          <p class="text-xs text-gray-600 leading-relaxed">
            Check physical attendance check-ins and school event logs from campus RFID scanners.
          </p>
        </div>

        <!-- Dues & Fee Logs -->
        <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-1.5">
          <h4 class="text-sm font-semibold text-gray-900">Dues & Fee Logs</h4>
          <p class="text-xs text-gray-600 leading-relaxed">
            Monitor laboratory costs, local organization dues, and clearance items.
          </p>
        </div>

        <!-- Institute Bulletins -->
        <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-1.5">
          <h4 class="text-sm font-semibold text-gray-900">Institute Bulletins</h4>
          <p class="text-xs text-gray-600 leading-relaxed">
            Read administrative posts, events calendar, and academic feed.
          </p>
        </div>
      </div>
    </div>

    <!-- 03 — codex developers & support -->
    <div class="space-y-3">
      <div class="px-1">
        <span class="font-pixel text-sm text-gray-400 lowercase">03 — codex team & support</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Developers Card (2 cols) -->
        <div class="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-4">
          <div class="border-b border-gray-100 pb-2 flex items-center justify-between">
            <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider">CODEX Developers Team</span>
            <span class="font-mono text-[10px] font-semibold text-ic-primary uppercase tracking-wider">DNSC IC</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="text-sm font-semibold text-gray-900">Froyd Carbajosa</p>
              <p class="font-mono text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">BSIT - 3C</p>
            </div>
            <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <p class="text-sm font-semibold text-gray-900">Monch Quines</p>
              <p class="font-mono text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">BSIT - 2B</p>
            </div>
          </div>
        </div>

        <!-- Support Card (1 col) -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <span class="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider block pb-2 border-b border-gray-100">Get Help</span>
            <div class="space-y-3 text-xs">
              <div>
                <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider">IC-LSG</p>
                <a href="mailto:icsa.helpdesk@dnsc.edu.ph" class="font-mono text-xs text-ic-secondary hover:text-ic-primary transition-colors font-medium break-all">
                  icsa@dnsc.edu.ph
                </a>
              </div>
              <div class="pt-2 border-t border-gray-100">
                <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider">Devs</p>
                <a href="mailto:osa@dnsc.edu.ph" class="font-mono text-xs text-ic-secondary hover:text-ic-primary transition-colors font-medium">
                  froydcarbajosa14@gmail.com
                  quinesmonch@gmail.com

                </a>
              </div>
            </div>
          </div>

          <div class="font-mono text-[10px] text-gray-400 pt-3 border-t border-gray-100 uppercase tracking-wider">
            Office: IC Building, DNSC Main
          </div>
        </div>
      </div>
    </div>

    <!-- Minimalist Footer -->
    <div class="pt-6 border-t border-gray-100 text-center">
      <p class="font-mono text-[10px] text-gray-400 uppercase tracking-wider">
        &copy; {{ currentYear }} Institute of Computing · Davao del Norte State College
      </p>
    </div>
  </div>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
