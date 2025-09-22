import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const user = ref(null)
const loading = ref(true)

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value)

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      user.value = data.user
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Sign up with email and password
  const signUp = async (email, password, options = {}) => {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      loading.value = true
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      user.value = null
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      loading.value = false
    }
  }

  // Get current session
  const getCurrentUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) throw error

      user.value = session?.user ?? null
      return session?.user ?? null
    } catch (error) {
      console.error('Error getting current user:', error)
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  // Initialize auth state
  const initializeAuth = () => {
    // Get initial session
    getCurrentUser()

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user ?? null
      loading.value = false

      // Handle auth events
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user)
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out')
      }
    })
  }

  return {
    // State
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    isAuthenticated,

    // Methods
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    getCurrentUser,
    initializeAuth
  }
}