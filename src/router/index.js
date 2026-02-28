import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/admin',
      component: () => import('@/views/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue')
        },
        {
          path: 'students',
          name: 'admin-students',
          component: () => import('@/views/admin/StudentsView.vue')
        },
        {
          path: 'events',
          name: 'admin-events',
          component: () => import('@/views/admin/EventsView.vue')
        },
        {
          path: 'announcements',
          name: 'admin-announcements',
          component: () => import('@/views/admin/AnnouncementsView.vue')
        },
        {
          path: 'attendance',
          name: 'admin-attendance',
          component: () => import('@/views/admin/AttendanceView.vue')
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('@/views/admin/ProfileView.vue')
        }
      ]
    },
    {
      path: '/',
      component: () => import('@/views/layouts/StudentLayout.vue'),
      meta: { requiresAuth: true, role: 'student' },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/student/DashboardView.vue')
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/student/ProfileView.vue')
        },
        {
          path: '/attendance',
          name: 'attendance',
          component: () => import('@/views/student/AttendanceView.vue')
        },
        {
          path: '/fees',
          name: 'fees',
          component: () => import('@/views/student/FeesView.vue')
        },
        {
          path: '/submissions',
          name: 'submissions',
          component: () => import('@/views/student/SubmissionsView.vue')
        },
        {
          path: '/announcements',
          name: 'announcements',
          component: () => import('@/views/student/AnnouncementsView.vue')
        },
        {
          path: '/calendar',
          name: 'calendar',
          component: () => import('@/views/student/CalendarView.vue')
        },
        {
          path: '/external-systems',
          name: 'external-systems',
          component: () => import('@/views/student/ExternalSystemsView.vue')
        }
      ]
    },
    // Catch-all: redirect unknown paths based on auth state
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.initialize()
  }
  
  console.log('🔀 Router Guard:', { 
    to: to.path, 
    from: from.path, 
    isAuthenticated: authStore.isAuthenticated, 
    isAdmin: authStore.isAdmin,
    requiresAuth: to.meta.requiresAuth,
    role: to.meta.role
  })
  
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('🔀 Not authenticated, redirecting to /login')
      next('/login')
    } else if (to.meta.role === 'admin' && !authStore.isAdmin) {
      console.log('🔀 Not admin, redirecting to /')
      next('/')
    } else if (to.meta.role === 'student' && authStore.isAdmin) {
      console.log('🔀 Is admin, redirecting to /admin')
      next('/admin')
    } else {
      console.log('🔀 Allowing navigation')
      next()
    }
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      console.log('🔀 Authenticated admin on guest page, redirecting to /admin')
      next('/admin')
    } else {
      console.log('🔀 Authenticated student on guest page, redirecting to /')
      next('/')
    }
  } else {
    console.log('🔀 No guard conditions, allowing navigation')
    next()
  }
})

export default router
