import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/www/Index.vue'
import LoginPage from '@/views/Auth/LoginPage.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import Posts from '@/views/admin/Posts.vue'
import Categories from '@/views/admin/Categories.vue'
import Sources from '@/views/admin/Sources.vue'
import { supabase } from '@/lib/supabase'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts',
    name: 'Posts',
    component: Posts,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
    meta: { requiresAuth: true }
  },
  {
    path: '/sources',
    name: 'Sources',
    component: Sources,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const isAuthenticated = !!session?.user

    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login')
    } else if (to.path === '/login' && isAuthenticated) {
      next('/dashboard')
    } else {
      next()
    }
  } catch (error) {
    console.error('Router auth check failed:', error)
    // If there's an error checking auth, redirect to login for protected routes
    if (to.meta.requiresAuth) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router