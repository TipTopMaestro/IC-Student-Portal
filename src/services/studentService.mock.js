import { API_CONFIG } from '@/config/api'

// A deeply nested mock school/institute structure as per the new schema
const mockInstitute = {
  id: 1,
  school: {
    id: 1,
    school_name: "Imperial College",
    short_name: "IC",
    logo: "/path/to/school-logo.png",
    location: "City Center",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  institute_name: "Institute of Computer Studies",
  logo: "/path/to/institute-logo.png",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// A detailed mock student as per the new schema
const mockStudent = {
  id: 1,
  program: {
    id: 1,
    institute: mockInstitute,
    name: "Bachelor of Science in Information Technology",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  s_studentID: "2024-0001",
  s_fname: "Juan",
  s_lname: "Dela Cruz",
  s_set: "A",
  s_lvl: 3,
  s_status: "enrolled",
  user: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Sample fee data matching the new detailed and paginated schema
const MOCK_FEES_PAGE_1 = {
  count: 3,
  next: null,
  previous: null,
  results: [
    // 1. Unpaid Fee
    {
      id: 1,
      student: mockStudent,
      category: {
        id: 1,
        institute: mockInstitute,
        category_name: 'Uniform',
        description: 'Official Department Shirt (Unisex)',
        collection_fee: "50.00",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: 1,
      },
      total_amount: "450.00",
      balance: "450.00",
      status: 'unpaid',
      due_date: '2024-08-30T12:00:00Z',
      remarks: 'Initial fee for the academic year.',
      academic_year: '2024-2025',
      semester: '1st Semester',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: 1,
      gen_fee_batch: 1,
      issued_by: 1,
    },
    // 2. Paid Fee
    {
      id: 2,
      student: mockStudent,
      category: {
        id: 2,
        institute: mockInstitute,
        category_name: 'Organization',
        description: 'IT Club Membership Fee',
        collection_fee: "0.00",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: 1,
      },
      total_amount: "300.00",
      balance: "0.00",
      status: 'paid',
      due_date: '2024-08-15T12:00:00Z',
      remarks: 'Paid via GCash on 2024-08-10.',
      academic_year: '2024-2025',
      semester: '1st Semester',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: 1,
      gen_fee_batch: 1,
      issued_by: 1,
    },
    // 3. Pending Fee
    {
      id: 3,
      student: mockStudent,
      category: {
        id: 3,
        institute: mockInstitute,
        category_name: 'Events',
        description: 'Registration for Annual Tech Summit',
        collection_fee: "0.00",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: 1,
      },
      total_amount: "250.00",
      balance: "250.00",
      status: 'pending',
      due_date: '2024-09-20T12:00:00Z',
      remarks: 'Payment receipt uploaded, awaiting verification.',
      academic_year: '2024-2025',
      semester: '1st Semester',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: 1,
      gen_fee_batch: 1,
      issued_by: 1,
    }
  ]
};

export const studentServiceMock = {
  /**
   * Mock function to get student fees, simulating the new paginated API schema.
   */
  getStudentFees: ({ userId, url } = {}) => { // Accept object with userId or url
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url) {
          console.log(`🎭 [MOCK] Fetched student fees from URL: ${url}`);
        } else {
          console.log(`🎭 [MOCK] Fetched student fees for userId: ${userId}`);
        }
        resolve({ data: MOCK_FEES_PAGE_1 });
      }, API_CONFIG.MOCK_DELAY);
    });
  },
}
