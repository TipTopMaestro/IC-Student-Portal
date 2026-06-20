import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listInstituteEvents } from '@/services/eventService'

export const useEventStore = defineStore('events', () => {
  const events = ref([])
  const lastFetched = ref(null)
  const loading = ref(false)

  const fetchEvents = async (params = {}, force = false) => {
    const cacheValidDuration = 5 * 60 * 1000 // 5 minutes
    const isCacheExpired = !lastFetched.value || (Date.now() - lastFetched.value > cacheValidDuration)

    const isDefaultRequest = Object.keys(params).length === 0
    if (isDefaultRequest && events.value.length > 0 && !isCacheExpired && !force) {
      return { success: true, data: events.value }
    }

    loading.value = true
    try {
      const result = await listInstituteEvents(params)
      if (result.success) {
        if (isDefaultRequest) {
          events.value = result.data.data || result.data
          lastFetched.value = Date.now()
        }
      }
      return result
    } finally {
      loading.value = false
    }
  }

  const invalidate = () => {
    events.value = []
    lastFetched.value = null
    console.log('🧹 Events store invalidated')
  }

  return {
    events,
    loading,
    fetchEvents,
    invalidate
  }
})
