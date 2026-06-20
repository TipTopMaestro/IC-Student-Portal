import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listAttendanceRecords } from '@/services/eventService'

export const useAttendanceStore = defineStore('attendance', () => {
  const records = ref([])
  const lastFetched = ref(null)
  const loading = ref(false)

  const fetchAttendance = async (params = {}, force = false) => {
    const cacheValidDuration = 2 * 60 * 1000 // 2 minutes (attendance updates more frequently)
    const isCacheExpired = !lastFetched.value || (Date.now() - lastFetched.value > cacheValidDuration)

    const isDefaultRequest = Object.keys(params).length === 0
    if (isDefaultRequest && records.value.length > 0 && !isCacheExpired && !force) {
      return { success: true, data: records.value }
    }

    loading.value = true
    try {
      const result = await listAttendanceRecords(params)
      if (result.success) {
        if (isDefaultRequest) {
          records.value = result.data.data || result.data
          lastFetched.value = Date.now()
        }
      }
      return result
    } finally {
      loading.value = false
    }
  }

  const invalidate = () => {
    records.value = []
    lastFetched.value = null
    console.log('🧹 Attendance store invalidated')
  }

  return {
    records,
    loading,
    fetchAttendance,
    invalidate
  }
})
