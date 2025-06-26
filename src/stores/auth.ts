import { defineStore } from 'pinia'
import type { Admin } from '@/types/adminInterface'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

export const useAuthenticationStore = defineStore('auth', () => {
  const admin = ref<Admin>({
    username: '',
    password: '',
  })

  function handleLogin() {
    localStorage.setItem(
      'admin',
      JSON.stringify({
        username: admin.value.username,
        password: admin.value.password,
      }),
    )
    localStorage.setItem('token', '12341234')

    admin.value.username = ''
    admin.value.password = ''
  }
  const isAuthenticated = computed(() => {
    try {
      const token = localStorage.getItem('token')
      const savedAdmin = localStorage.getItem('admin')
      return !!(token && savedAdmin)
    } catch (error) {
      console.log(error)
      return false
    }
  })

  function logout() {
    localStorage.removeItem('admin')
    localStorage.removeItem('token')
    ElMessage('Logout successful')
    window.location.href = '/login'
  }

  return { admin, handleLogin, isAuthenticated, logout }
})
