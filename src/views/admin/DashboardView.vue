<template>
  <div>
    <!-- Stats Grid -->
    <div class="mb-12">
      <div class="grid grid-cols-4 gap-8">
        <div class="text-center">
          <div class="text-[28px] font-light mb-1">{{ stats.totalStudents.toLocaleString() }}</div>
          <div class="text-sm text-[#8e8e8e]">students</div>
        </div>
        <div class="text-center">
          <div class="text-[28px] font-light mb-1">{{ stats.activeEvents }}</div>
          <div class="text-sm text-[#8e8e8e]">events</div>
        </div>
        <div class="text-center">
          <div class="text-[28px] font-light mb-1">{{ stats.announcements }}</div>
          <div class="text-sm text-[#8e8e8e]">announcements</div>
        </div>
        <div class="text-center">
          <div class="text-[28px] font-light mb-1">{{ attendanceRate }}%</div>
          <div class="text-sm text-[#8e8e8e]">attendance</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-12 flex gap-3">
      <router-link 
        to="/admin/students" 
        class="flex-1 py-2 text-center bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors"
      >
        Add Student
      </router-link>
      <router-link 
        to="/admin/events" 
        class="flex-1 py-2 text-center border border-ic-primary text-ic-primary text-sm font-semibold rounded-lg hover:bg-purple-50 transition-colors"
      >
        Create Event
      </router-link>
      <router-link 
        to="/admin/announcements" 
        class="flex-1 py-2 text-center border border-ic-primary text-ic-primary text-sm font-semibold rounded-lg hover:bg-purple-50 transition-colors"
      >
        New Post
      </router-link>
    </div>

    <!-- Weekly Attendance -->
    <div class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-base font-semibold">Weekly Attendance</h2>
        <button class="text-sm text-ic-primary font-semibold hover:text-ic-secondary">View All</button>
      </div>

      <div class="space-y-4">
        <div v-for="day in attendanceTrend" :key="day.label" class="flex items-center gap-4">
          <div class="w-12 text-sm text-[#8e8e8e] font-light">{{ day.label }}</div>
          <div class="flex-1 h-1.5 bg-[#efefef] rounded-full overflow-hidden">
            <div 
              class="h-full bg-[#262626] rounded-full"
              :style="{ width: day.percentage + '%' }"
            ></div>
          </div>
          <div class="w-20 text-sm text-right font-light">{{ day.value.toLocaleString() }}</div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div>
      <h2 class="text-base font-semibold mb-6">Recent Activity</h2>
      
      <div class="space-y-0">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id" 
          class="py-4 border-b border-[#efefef] last:border-b-0"
        >
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-[#fafafa] flex items-center justify-center shrink-0">
              <component :is="activity.icon" class="w-4 h-4 text-[#262626]" />
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <p class="text-sm leading-4.5">
                <span class="font-semibold">{{ activity.user }}</span>
                <span class="font-light"> {{ activity.action }}</span>
              </p>
              <p class="text-xs text-[#8e8e8e] mt-1 font-light">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <button class="text-sm text-ic-primary font-semibold hover:text-ic-secondary">
          Show More
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const stats = ref({
  totalStudents: 1248,
  activeStudents: 1102,
  activeEvents: 12,
  announcements: 28,
  attendanceRecords: 892
})

const attendanceRate = computed(() => {
  return Math.round((stats.value.activeStudents / stats.value.totalStudents) * 100)
})

const attendanceTrend = ref([
  { label: 'Mon', value: 1150, percentage: 92 },
  { label: 'Tue', value: 1180, percentage: 95 },
  { label: 'Wed', value: 1095, percentage: 88 },
  { label: 'Thu', value: 1220, percentage: 98 },
  { label: 'Fri', value: 1050, percentage: 84 },
  { label: 'Sat', value: 890, percentage: 71 },
  { label: 'Sun', value: 0, percentage: 0 }
])

// Simple icons
const UserIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
])

const CalendarIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
])

const BellIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' })
])

const CheckIcon = (props) => h('svg', { class: props.class, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
])

const recentActivities = ref([
  {
    id: 1,
    user: 'Juan Dela Cruz',
    action: 'registered as a new student',
    time: '5 minutes ago',
    icon: UserIcon
  },
  {
    id: 2,
    user: 'System',
    action: 'updated Career Fair event details',
    time: '1 hour ago',
    icon: CalendarIcon
  },
  {
    id: 3,
    user: 'Admin',
    action: 'posted a new announcement about orientation',
    time: '3 hours ago',
    icon: BellIcon
  },
  {
    id: 4,
    user: 'System',
    action: 'processed attendance records for CS Department',
    time: '5 hours ago',
    icon: CheckIcon
  },
  {
    id: 5,
    user: 'Maria Santos',
    action: 'registered as a new student',
    time: '6 hours ago',
    icon: UserIcon
  },
  {
    id: 6,
    user: 'System',
    action: 'sent weekly report to all administrators',
    time: '8 hours ago',
    icon: BellIcon
  }
])
</script>
