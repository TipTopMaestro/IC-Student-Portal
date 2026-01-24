<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-light mb-1">Students</h1>
        <p class="text-sm text-[#8e8e8e]">{{ students.length }} students registered</p>
      </div>
      <button 
        @click="showAddStudentModal = true"
        class="px-4 py-2 bg-ic-primary text-white text-sm font-semibold rounded-lg hover:bg-ic-secondary transition-colors"
      >
        Add Student
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="flex items-center gap-3 mb-6">
      <div class="flex-1 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search students..."
          class="w-full h-9 pl-4 pr-10 text-sm bg-[#efefef] rounded-lg border-0 focus:outline-none focus:ring-0 placeholder:text-[#8e8e8e]"
        />
        <svg class="w-4 h-4 absolute right-3 top-2.5 text-[#8e8e8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <select v-model="filterYear" class="h-9 px-4 text-sm bg-[#efefef] border-0 rounded-lg focus:outline-none focus:ring-0">
        <option value="">All Years</option>
        <option value="1">1st Year</option>
        <option value="2">2nd Year</option>
        <option value="3">3rd Year</option>
        <option value="4">4th Year</option>
      </select>

      <select v-model="filterCourse" class="h-9 px-4 text-sm bg-[#efefef] border-0 rounded-lg focus:outline-none focus:ring-0">
        <option value="">All Courses</option>
        <option value="BSCS">BS Computer Science</option>
        <option value="BSIT">BS Information Technology</option>
        <option value="BSCE">BS Computer Engineering</option>
      </select>
    </div>

    <!-- Students Table -->
    <div class="border border-[#dbdbdb] rounded-lg overflow-hidden">
      <!-- Table Header -->
      <div class="bg-[#fafafa] border-b border-[#dbdbdb]">
        <div class="grid grid-cols-12 gap-4 px-6 py-3">
          <div class="col-span-3 text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Student</div>
          <div class="col-span-2 text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">ID Number</div>
          <div class="col-span-2 text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Course</div>
          <div class="col-span-1 text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Year</div>
          <div class="col-span-2 text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide">Email</div>
          <div class="col-span-2 text-xs font-semibold text-[#8e8e8e] uppercase tracking-wide text-right">Actions</div>
        </div>
      </div>

      <!-- Table Body -->
      <div class="divide-y divide-[#efefef]">
        <div 
          v-for="student in filteredStudents" 
          :key="student.id"
          class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-[#fafafa] transition-colors"
        >
          <!-- Student Info -->
          <div class="col-span-3 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#efefef] flex items-center justify-center text-sm font-medium shrink-0">
              {{ student.initials }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium truncate">{{ student.name }}</p>
              <p class="text-xs text-[#8e8e8e] truncate">{{ student.studentId }}</p>
            </div>
          </div>

          <!-- ID Number -->
          <div class="col-span-2 flex items-center">
            <p class="text-sm">{{ student.studentId }}</p>
          </div>

          <!-- Course -->
          <div class="col-span-2 flex items-center">
            <p class="text-sm">{{ student.course }}</p>
          </div>

          <!-- Year -->
          <div class="col-span-1 flex items-center">
            <p class="text-sm">{{ student.year }}</p>
          </div>

          <!-- Email -->
          <div class="col-span-2 flex items-center">
            <p class="text-sm text-[#8e8e8e] truncate">{{ student.email }}</p>
          </div>

          <!-- Actions -->
          <div class="col-span-2 flex items-center justify-end gap-2">
            <button 
              @click="viewStudent(student)"
              class="p-2 hover:bg-[#efefef] rounded-lg transition-colors" 
              title="View"
            >
              <svg class="w-4 h-4 text-[#262626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button 
              @click="editStudent(student)"
              class="p-2 hover:bg-[#efefef] rounded-lg transition-colors" 
              title="Edit"
            >
              <svg class="w-4 h-4 text-[#262626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              @click="deleteStudent(student)"
              class="p-2 hover:bg-[#efefef] rounded-lg transition-colors" 
              title="Delete"
            >
              <svg class="w-4 h-4 text-[#ed4956]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredStudents.length === 0" class="py-12 text-center">
        <svg class="w-12 h-12 mx-auto text-[#dbdbdb] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-sm text-[#8e8e8e]">No students found</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-6">
      <p class="text-sm text-[#8e8e8e]">
        Showing {{ Math.min((currentPage - 1) * perPage + 1, filteredStudents.length) }} 
        to {{ Math.min(currentPage * perPage, filteredStudents.length) }} 
        of {{ filteredStudents.length }} students
      </p>
      <div class="flex items-center gap-2">
        <button 
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 text-sm font-medium border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button 
          @click="currentPage++"
          :disabled="currentPage * perPage >= filteredStudents.length"
          class="px-3 py-1.5 text-sm font-medium border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Add Student Modal -->
    <div 
      v-if="showAddStudentModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showAddStudentModal = false"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Add New Student</h2>
          <button @click="showAddStudentModal = false" class="p-1 hover:bg-[#fafafa] rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleAddStudent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#262626] mb-2">Full Name</label>
            <input 
              v-model="newStudent.name"
              type="text" 
              required
              class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              placeholder="Juan Dela Cruz"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#262626] mb-2">Student ID</label>
            <input 
              v-model="newStudent.studentId"
              type="text" 
              required
              class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              placeholder="2024-00001"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#262626] mb-2">Email</label>
            <input 
              v-model="newStudent.email"
              type="email" 
              required
              class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              placeholder="student@dnsc.edu.ph"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#262626] mb-2">Course</label>
              <select 
                v-model="newStudent.course"
                required
                class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              >
                <option value="">Select Course</option>
                <option value="BSCS">BSCS</option>
                <option value="BSIT">BSIT</option>
                <option value="BSCE">BSCE</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#262626] mb-2">Year</label>
              <select 
                v-model="newStudent.year"
                required
                class="w-full px-4 py-2 text-sm border border-[#dbdbdb] rounded-lg focus:outline-none focus:border-ic-primary"
              >
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button"
              @click="showAddStudentModal = false"
              class="flex-1 px-4 py-2 text-sm font-medium border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2 text-sm font-semibold bg-ic-primary text-white rounded-lg hover:bg-ic-secondary transition-colors"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Student Modal -->
    <div 
      v-if="selectedStudent && showViewModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showViewModal = false"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Student Details</h2>
          <button @click="showViewModal = false" class="p-1 hover:bg-[#fafafa] rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="flex items-center gap-4 pb-4 border-b border-[#efefef]">
            <div class="w-16 h-16 rounded-full bg-[#efefef] flex items-center justify-center text-xl font-medium">
              {{ selectedStudent.initials }}
            </div>
            <div>
              <h3 class="font-semibold">{{ selectedStudent.name }}</h3>
              <p class="text-sm text-[#8e8e8e]">{{ selectedStudent.studentId }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <p class="text-xs text-[#8e8e8e] mb-1">Email</p>
              <p class="text-sm">{{ selectedStudent.email }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-[#8e8e8e] mb-1">Course</p>
                <p class="text-sm">{{ selectedStudent.course }}</p>
              </div>
              <div>
                <p class="text-xs text-[#8e8e8e] mb-1">Year Level</p>
                <p class="text-sm">{{ selectedStudent.year }}</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          @click="showViewModal = false"
          class="w-full mt-6 px-4 py-2 text-sm font-medium border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="selectedStudent && showDeleteModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-xl max-w-sm w-full p-6">
        <h2 class="text-xl font-semibold mb-4">Delete Student?</h2>
        <p class="text-sm text-[#8e8e8e] mb-6">
          Are you sure you want to delete <span class="font-medium text-[#262626]">{{ selectedStudent.name }}</span>? This action cannot be undone.
        </p>

        <div class="flex gap-3">
          <button 
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 text-sm font-medium border border-[#dbdbdb] rounded-lg hover:bg-[#fafafa] transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete"
            class="flex-1 px-4 py-2 text-sm font-semibold bg-[#ed4956] text-white rounded-lg hover:bg-[#d32f2f] transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterYear = ref('')
const filterCourse = ref('')
const currentPage = ref(1)
const perPage = ref(10)

const showAddStudentModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)
const selectedStudent = ref(null)

const newStudent = ref({
  name: '',
  studentId: '',
  email: '',
  course: '',
  year: ''
})

const handleAddStudent = () => {
  // Add logic here to save student
  console.log('Adding student:', newStudent.value)
  showAddStudentModal.value = false
  // Reset form
  newStudent.value = {
    name: '',
    studentId: '',
    email: '',
    course: '',
    year: ''
  }
}

const viewStudent = (student) => {
  selectedStudent.value = student
  showViewModal.value = true
}

const editStudent = (student) => {
  selectedStudent.value = student
  // You can open edit modal here
  console.log('Edit student:', student)
}

const deleteStudent = (student) => {
  selectedStudent.value = student
  showDeleteModal.value = true
}

const confirmDelete = () => {
  // Add delete logic here
  console.log('Deleting student:', selectedStudent.value)
  showDeleteModal.value = false
  selectedStudent.value = null
}

// Mock data - replace with API call
const students = ref([
  {
    id: 1,
    name: 'Juan Dela Cruz',
    initials: 'JD',
    studentId: '2021-00001',
    course: 'BSCS',
    year: '4th',
    email: 'juan.delacruz@student.dnsc.edu.ph'
  },
  {
    id: 2,
    name: 'Maria Santos',
    initials: 'MS',
    studentId: '2021-00002',
    course: 'BSIT',
    year: '3rd',
    email: 'maria.santos@student.dnsc.edu.ph'
  },
  {
    id: 3,
    name: 'Pedro Reyes',
    initials: 'PR',
    studentId: '2021-00003',
    course: 'BSCE',
    year: '2nd',
    email: 'pedro.reyes@student.dnsc.edu.ph'
  },
  {
    id: 4,
    name: 'Ana Garcia',
    initials: 'AG',
    studentId: '2022-00001',
    course: 'BSCS',
    year: '3rd',
    email: 'ana.garcia@student.dnsc.edu.ph'
  },
  {
    id: 5,
    name: 'Jose Mendoza',
    initials: 'JM',
    studentId: '2022-00002',
    course: 'BSIT',
    year: '2nd',
    email: 'jose.mendoza@student.dnsc.edu.ph'
  },
  {
    id: 6,
    name: 'Sofia Torres',
    initials: 'ST',
    studentId: '2022-00003',
    course: 'BSCE',
    year: '1st',
    email: 'sofia.torres@student.dnsc.edu.ph'
  },
  {
    id: 7,
    name: 'Miguel Ramos',
    initials: 'MR',
    studentId: '2023-00001',
    course: 'BSCS',
    year: '2nd',
    email: 'miguel.ramos@student.dnsc.edu.ph'
  },
  {
    id: 8,
    name: 'Isabel Cruz',
    initials: 'IC',
    studentId: '2023-00002',
    course: 'BSIT',
    year: '1st',
    email: 'isabel.cruz@student.dnsc.edu.ph'
  }
])

const filteredStudents = computed(() => {
  let filtered = students.value

  if (searchQuery.value) {
    filtered = filtered.filter(student => 
      student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterYear.value) {
    filtered = filtered.filter(student => student.year.startsWith(filterYear.value))
  }

  if (filterCourse.value) {
    filtered = filtered.filter(student => student.course === filterCourse.value)
  }

  return filtered
})
</script>
