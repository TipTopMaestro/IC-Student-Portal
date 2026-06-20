import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStudentFees } from '@/services/feeService'

export const useFeeStore = defineStore('fees', () => {
  const fees = ref([])
  const lastFetched = ref(null)
  const loading = ref(false)

  const fetchFeesForStudent = async (force = false) => {
    const cacheValidDuration = 5 * 60 * 1000 // 5 minutes
    const isCacheExpired = !lastFetched.value || (Date.now() - lastFetched.value > cacheValidDuration)

    // Return cached value if not expired and not forced
    if (lastFetched.value && !isCacheExpired && !force) {
      return { success: true, data: fees.value }
    }

    loading.value = true
    try {
      const result = await getStudentFees(studentId)
      if (result.success) {
        fees.value = result.data
        lastFetched.value = Date.now()
      }
      return result
    } finally {
      loading.value = false
    }
  }

  // Call this when a submission occurs to force invalidate state
  const invalidate = () => {
    fees.value = []
    lastFetched.value = null
    console.log('🧹 Fees Pinia store cache invalidated')
  }

  return {
    fees,
    loading,
    fetchFeesForStudent,
    invalidate
  }
})
