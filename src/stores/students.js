import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listStudents } from '@/services/studentService'

export const useStudentStore = defineStore('students', () => {
  const students = ref([])
  const lastFetched = ref(null)
  const loading = ref(false)

  const fetchStudents = async (params = {}, force = false) => {
    const cacheValidDuration = 5 * 60 * 1000 // 5 minutes
    const isCacheExpired = !lastFetched.value || (Date.now() - lastFetched.value > cacheValidDuration)

    // Only return cached list if not expired, not forced, and no custom search/filter params are passed
    const isDefaultRequest = Object.keys(params).length === 0
    if (isDefaultRequest && students.value.length > 0 && !isCacheExpired && !force) {
      return { success: true, data: students.value }
    }

    loading.value = true
    try {
      const result = await listStudents(params)
      if (result.success) {
        // Cache default queries
        if (isDefaultRequest) {
          students.value = result.data.data || result.data
          lastFetched.value = Date.now()
        }
      }
      return result
    } finally {
      loading.value = false
    }
  }

  const invalidate = () => {
    students.value = []
    lastFetched.value = null
    console.log('🧹 Students Pinia store cache invalidated')
  }

  return {
    students,
    loading,
    fetchStudents,
    invalidate
  }
})
