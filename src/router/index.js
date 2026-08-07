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
          path: 'posts',
          name: 'admin-posts',
          component: () => import('@/views/admin/PostsView.vue')
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
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('@/views/admin/SettingsView.vue')
        },
        {
          path: 'about',
          name: 'admin-about',
          component: () => import('@/views/admin/AboutView.vue')
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
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/student/ProfileView.vue')
        },
        {
          path: 'attendance',
          name: 'attendance',
          component: () => import('@/views/student/AttendanceView.vue')
        },
        {
          path: 'fees',
          name: 'fees',
          component: () => import('@/views/student/FeesView.vue')
        },
        {
          path: 'posts',
          name: 'student-posts',
          component: () => import('@/views/student/PostsView.vue')
        },
        {
          path: 'calendar',
          name: 'calendar',
          component: () => import('@/views/student/CalendarView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/student/SettingsView.vue')
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/student/AboutView.vue')
        }
      ]
    },
    {
      path: '/sso-redirect',
      name: 'sso-redirect',
      component: () => import('@/views/auth/SSORedirectView.vue'),
      meta: { requiresAuth: true }
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

router.afterEach((to) => {
  const baseTitle = 'IC Student Portal'
  
  const customTitles = {
    'login': 'Login',
    'admin-dashboard': 'Admin Dashboard',
    'admin-students': 'Manage Students',
    'admin-events': 'Manage Events',
    'admin-posts': 'Manage Posts',
    'admin-attendance': 'Attendance Records',
    'admin-profile': 'Admin Profile',
    'admin-settings': 'Admin Settings',
    'admin-about': 'About Portal',
    'dashboard': 'Student Dashboard',
    'profile': 'My Profile',
    'attendance': 'My Attendance',
    'fees': 'My Fees & Obligations',
    'student-posts': 'Posts Feed',
    'calendar': 'Academic Calendar',
    'settings': 'Settings',
    'about': 'About Portal',
    'sso-redirect': 'SSO Verification'
  }
  
  const title = customTitles[to.name] || to.meta.title || ''
  
  if (title) {
    document.title = `${title} | ${baseTitle}`
  } else {
    document.title = baseTitle
  }
})

// Handle dynamic import failures caused by new deployments (stale chunk hash error)
router.onError((error) => {
  const isChunkLoadError =
    error.message?.includes('Failed to fetch dynamically imported module') ||
    error.message?.includes('Importing a module script failed') ||
    error.message?.includes('Expected a JavaScript-or-Wasm module script')

  if (isChunkLoadError) {
    const reloadKey = 'chunk_reload_timestamp'
    const lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10)
    const now = Date.now()

    // Prevent loop: only reload once per 10 seconds
    if (now - lastReload > 10000) {
      sessionStorage.setItem(reloadKey, now.toString())
      console.warn('🔄 Stale chunk detected, forcing cache-busting reload...')
      
      // Append cache buster to force browser & CDN to fetch fresh index.html
      const url = new URL(window.location.href)
      url.searchParams.set('_v', now.toString())
      window.location.href = url.toString()
    } else {
      console.error('❌ Chunk load error persists after reload:', error.message)
    }
  }
})

// Vite-native preload error handler — catches non-route dynamic imports (e.g. async components)
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  const reloadKey = 'chunk_reload_timestamp'
  const lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10)
  const now = Date.now()

  if (now - lastReload > 10000) {
    sessionStorage.setItem(reloadKey, now.toString())
    const url = new URL(window.location.href)
    url.searchParams.set('_v', now.toString())
    window.location.href = url.toString()
  }
})

export default router
