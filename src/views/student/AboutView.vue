<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn">
    <!-- Header -->
    <div class="pb-2">
      <div class="inline-flex items-center gap-2 text-xs font-bold text-ic-secondary tracking-wider uppercase">
        <span>Institute of Computing</span>
        <span class="text-gray-300">•</span>
        <span>Student Portal</span>
      </div>
      <h1 class="text-2xl font-semibold text-gray-900 mt-1">About the Portal</h1>
    </div>

    <!-- Bento Grid Container -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Box 1: Hero Block (Spans 2 columns on desktop) -->
      <div class="md:col-span-2 bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 hover:border-ic-primary hover:shadow-lg hover:shadow-ic-primary/5 transition-all duration-300">
        <div class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-900">Welcome to your digital companion.</h2>
          <p class="text-sm text-gray-600 leading-relaxed max-w-xl">
            This student workspace is designed to consolidate your academic resources, attendance records, organization fees, and official institute bulletins into a single, unified digital hub.
          </p>
        </div>
        
        <div class="flex flex-wrap items-center gap-3 pt-3 text-xs text-gray-500 border-t border-gray-100">
          <span class="font-bold text-gray-700">Version 1.0.0</span>
          <span class="text-gray-300">&bull;</span>
          <span class="font-semibold text-gray-600">DNSC Main Campus Network</span>
        </div>
      </div>

      <!-- Box 2: Quick Info / Guidelines (Spans 1 column) -->
      <div class="bg-white border border-gray-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-ic-primary hover:shadow-lg hover:shadow-ic-primary/5 transition-all duration-300">
        <div>
          <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Portal Info</h3>
          <div class="space-y-3 text-xs">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-600 font-semibold">Academic Year</span>
              <span class="text-gray-900 font-bold">2026 - 2027</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-600 font-semibold">Distribution</span>
              <span class="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-ic-primary">IC DNSC Students</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600 font-semibold">Service Hours</span>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 24/7 Access
              </span>
            </div>
          </div>
        </div>
        
        <!-- Vibrant color logo detail -->
        <div class="flex items-center gap-2.5 mt-4 pt-4 border-t border-gray-100">
          <img src="/icsa_logo.png" alt="ICSA Logo" class="h-6 w-6 object-contain" />
          <span class="text-[10px] text-ic-primary font-bold uppercase tracking-wider">ICSA Student Portal</span>
        </div>
      </div>

      <!-- Box 3: Core Features (Spans 2 columns, height of 2 rows) -->
      <div class="md:col-span-2 bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 space-y-6 hover:border-ic-primary hover:shadow-lg hover:shadow-ic-primary/5 transition-all duration-300">
        <div>
          <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100 pb-2">Core Workspace Utilities</h3>
          <p class="text-xs text-gray-600 mt-1">Features tailored explicitly for your academic journey</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Academic Records -->
          <div class="space-y-1.5">
            <h4 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-ic-primary rounded-md">Academic Records</span>
            </h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              Review enrolled program courses, class schedules, and check final reports.
            </p>
          </div>

          <!-- Attendance Tracker -->
          <div class="space-y-1.5">
            <h4 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-ic-secondary rounded-md">Attendance Tracker</span>
            </h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              Check physical attendance check-ins and school event logs from campus RFID scanners.
            </p>
          </div>

          <!-- Clearance & Dues -->
          <div class="space-y-1.5">
            <h4 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-ic-secondary rounded-md">Dues & Fee Logs</span>
            </h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              Monitor laboratory costs, local organization dues, and clearance items.
            </p>
          </div>

          <!-- Bulletins & Feed -->
          <div class="space-y-1.5">
            <h4 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-ic-primary rounded-md">Institute Bulletins</span>
            </h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              Read administrative announcements, events calendar, and academic posts.
            </p>
          </div>
        </div>
      </div>

      <!-- Box 4: Student Support / Contacts (Spans 1 column) -->
      <div class="bg-white border border-gray-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-ic-primary hover:shadow-lg hover:shadow-ic-primary/5 transition-all duration-300">
        <div class="space-y-4">
          <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100 pb-2">Support Desks</h3>
          <div class="space-y-3.5 text-xs">
            <div class="space-y-0.5">
              <p class="text-gray-600 font-semibold">Student Council Helpdesk</p>
              <a href="mailto:icsa.helpdesk@dnsc.edu.ph" class="text-ic-secondary hover:text-ic-primary hover:underline font-bold">icsa.helpdesk@dnsc.edu.ph</a>
            </div>
            <div class="space-y-0.5">
              <p class="text-gray-600 font-semibold">Office of Student Affairs</p>
              <a href="mailto:osa@dnsc.edu.ph" class="text-ic-secondary hover:text-ic-primary hover:underline font-bold">osa@dnsc.edu.ph</a>
            </div>
          </div>
        </div>

        <div class="text-[10px] text-gray-500 font-semibold pt-4 border-t border-gray-50">
          Council office location: IC Building
        </div>
      </div>

      <!-- Box 5: Mission Statement (Spans 1 column on row 3) -->
      <div class="bg-white border border-gray-200/80 rounded-3xl p-6 hover:border-ic-primary hover:shadow-lg hover:shadow-ic-primary/5 transition-all duration-300">
        <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Our Mission</h3>
        <p class="text-xs text-gray-600 leading-relaxed">
          To provide a seamless, highly structured channel between computing students and academic administrators, empowering student involvement and records visibility.
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
