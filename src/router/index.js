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
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: () => import('@/views/layouts/StudentLayout.vue'),
      meta: { requiresAuth: true },
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
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
