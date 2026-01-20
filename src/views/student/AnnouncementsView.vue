<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Announcements</h1>
      <p class="text-gray-600 mt-1">Stay updated with the latest news and announcements from IC</p>
    </div>

    <!-- Filters and Search -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Announcements</label>
          <input v-model="searchQuery" type="text" placeholder="Search by title or content..." class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select v-model="filterCategory" class="input-field">
            <option value="">All Categories</option>
            <option value="academic">Academic</option>
            <option value="event">Event</option>
            <option value="administrative">Administrative</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Announcements List -->
    <div class="space-y-4">
      <div v-for="announcement in filteredAnnouncements" :key="announcement.id" class="card hover:shadow-md transition-shadow">
        <div class="flex items-start space-x-4">
          <!-- Icon -->
          <div 
            :class="{
              'bg-purple-100': announcement.category === 'academic',
              'bg-blue-100': announcement.category === 'event',
              'bg-green-100': announcement.category === 'administrative',
              'bg-gray-100': announcement.category === 'general'
            }"
            class="h-12 w-12 rounded-lg flex items-center justify-center shrink-0">
            <svg v-if="announcement.category === 'academic'" class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            <svg v-else-if="announcement.category === 'event'" class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <svg v-else-if="announcement.category === 'administrative'" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg v-else class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ announcement.title }}</h3>
                  <span 
                    :class="{
                      'badge bg-purple-100 text-purple-800': announcement.category === 'academic',
                      'badge bg-blue-100 text-blue-800': announcement.category === 'event',
                      'badge bg-green-100 text-green-800': announcement.category === 'administrative',
                      'badge bg-gray-100 text-gray-800': announcement.category === 'general'
                    }"
                    class="text-xs capitalize">
                    {{ announcement.category }}
                  </span>
                  <span v-if="announcement.isPinned" class="badge bg-red-100 text-red-800 text-xs">
                    <svg class="w-3 h-3 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78-.03 1.632.548 2.138.29.25.617.41.96.477L5 18a1 1 0 11-2 0v-2.58a4.024 4.024 0 01-1.509-.815A4.987 4.987 0 010 10.274V9a1 1 0 112 0v1.274a3.006 3.006 0 002.167 2.818l.833-2.592A1 1 0 016 10a1 1 0 011 1z" />
                    </svg>
                    Pinned
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">{{ announcement.excerpt }}</p>
                <div class="flex items-center space-x-4 text-xs text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ announcement.author }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(announcement.date) }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ announcement.readTime }} min read
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Full Content (Expandable) -->
            <div v-if="announcement.expanded" class="mt-4 pt-4 border-t border-gray-200">
              <div class="prose prose-sm max-w-none text-gray-700" v-html="announcement.content"></div>
              
              <!-- Attachments -->
              <div v-if="announcement.attachments && announcement.attachments.length" class="mt-4">
                <p class="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                <div class="space-y-2">
                  <a v-for="attachment in announcement.attachments" :key="attachment.id"
                    href="#" 
                    class="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:border-IC-primary hover:bg-purple-50 transition-colors">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span class="text-sm text-gray-700">{{ attachment.name }}</span>
                    <span class="text-xs text-gray-500">({{ attachment.size }})</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Read More Button -->
            <button 
              @click="announcement.expanded = !announcement.expanded" 
              class="mt-3 text-IC-primary hover:text-primary-900 text-sm font-medium flex items-center">
              {{ announcement.expanded ? 'Show Less' : 'Read More' }}
              <svg 
                :class="{ 'rotate-180': announcement.expanded }"
                class="w-4 h-4 ml-1 transform transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredAnnouncements.length === 0" class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
      <p class="text-gray-600">Try adjusting your search or filter criteria</p>
    </div>

    <!-- Load More -->
    <div v-if="filteredAnnouncements.length > 0" class="text-center">
      <button class="btn-secondary">
        Load More Announcements
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterCategory = ref('')

const announcements = ref([
  {
    id: 1,
    title: 'Enrollment Period Extended Until January 20, 2024',
    excerpt: 'The administration has decided to extend the enrollment period for the second semester to accommodate more students.',
    content: '<p>The administration has decided to extend the enrollment period for the second semester to accommodate more students who have not yet enrolled. The new deadline is now <strong>January 20, 2024</strong>.</p><p>All students are encouraged to complete their enrollment within this period to avoid penalties. For questions, please contact the Registrar\'s Office.</p>',
    category: 'academic',
    author: 'Registrar\'s Office',
    date: '2024-01-12',
    readTime: 2,
    isPinned: true,
    expanded: false,
    attachments: [
      { id: 1, name: 'Enrollment_Guidelines_2024.pdf', size: '1.2 MB' }
    ]
  },
  {
    id: 2,
    title: 'Academic Calendar for Second Semester 2024',
    excerpt: 'The official academic calendar for the second semester has been published. Please review important dates.',
    content: '<p>The official academic calendar for the second semester AY 2024-2025 has been released.</p><p>Key dates include:</p><ul><li>Classes Begin: January 15, 2024</li><li>Midterm Exams: March 1-8, 2024</li><li>Final Exams: May 1-10, 2024</li><li>Semester End: May 15, 2024</li></ul>',
    category: 'academic',
    author: 'Academic Affairs',
    date: '2024-01-10',
    readTime: 3,
    isPinned: true,
    expanded: false,
    attachments: [
      { id: 1, name: 'Academic_Calendar_2024.pdf', size: '850 KB' }
    ]
  },
  {
    id: 3,
    title: 'IT Summit 2024: Register Now!',
    excerpt: 'Join us for the biggest technology event of the year. Learn from industry experts and network with professionals.',
    content: '<p>The IT Department is proud to present the <strong>IT Summit 2024</strong>, featuring industry leaders, workshops, and networking opportunities.</p><p><strong>Date:</strong> February 15-16, 2024<br><strong>Venue:</strong> IC Auditorium<br><strong>Registration:</strong> Free for IC students</p><p>Topics include AI, Cybersecurity, Web Development, and more!</p>',
    category: 'event',
    author: 'IT Department',
    date: '2024-01-09',
    readTime: 2,
    isPinned: false,
    expanded: false
  },
  {
    id: 4,
    title: 'New Library Operating Hours',
    excerpt: 'The library will be extending its operating hours starting next week to better serve students.',
    content: '<p>To better serve our students, the IC Library will be extending its operating hours starting January 15, 2024.</p><p><strong>New Schedule:</strong></p><ul><li>Monday - Friday: 7:00 AM - 9:00 PM</li><li>Saturday: 8:00 AM - 5:00 PM</li><li>Sunday: Closed</li></ul>',
    category: 'administrative',
    author: 'Library Services',
    date: '2024-01-08',
    readTime: 1,
    isPinned: false,
    expanded: false
  },
  {
    id: 5,
    title: 'Scholarship Applications Now Open',
    excerpt: 'Various scholarship programs are now accepting applications for the second semester.',
    content: '<p>The Scholarship Office is now accepting applications for the following programs:</p><ul><li>Academic Excellence Scholarship</li><li>Financial Assistance Program</li><li>Sports and Arts Scholarship</li><li>Indigenous Peoples Scholarship</li></ul><p><strong>Deadline:</strong> January 31, 2024</p>',
    category: 'administrative',
    author: 'Scholarship Office',
    date: '2024-01-07',
    readTime: 2,
    isPinned: false,
    expanded: false,
    attachments: [
      { id: 1, name: 'Scholarship_Application_Form.pdf', size: '650 KB' },
      { id: 2, name: 'Scholarship_Guidelines.pdf', size: '980 KB' }
    ]
  },
  {
    id: 6,
    title: 'Campus WiFi Maintenance Schedule',
    excerpt: 'Scheduled network maintenance will affect campus WiFi connectivity this weekend.',
    content: '<p>The IT Services will conduct scheduled maintenance on the campus network infrastructure.</p><p><strong>Date:</strong> January 13-14, 2024<br><strong>Time:</strong> 10:00 PM - 6:00 AM</p><p>WiFi services may be intermittent during this period. We apologize for any inconvenience.</p>',
    category: 'general',
    author: 'IT Services',
    date: '2024-01-05',
    readTime: 1,
    isPinned: false,
    expanded: false
  },
])

const filteredAnnouncements = computed(() => {
  return announcements.value.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          announcement.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !filterCategory.value || announcement.category === filterCategory.value
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    // Sort pinned first
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    // Then by date
    return new Date(b.date) - new Date(a.date)
  })
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
