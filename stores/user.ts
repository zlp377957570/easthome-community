import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),
  
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    userLevel: (state) => state.user?.level || 'guest'
  },
  
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      
      try {
        // 这里应该连接到真实的API接口
        const response = await axios.post('/api/auth/login', { 
          username, 
          password 
        })
        
        if (response.data.success) {
          this.user = response.data.user
          this.token = response.data.token
          this.isAuthenticated = true
          
          // 存储token到本地存储
          localStorage.setItem('auth_token', this.token)
          return true
        } else {
          this.error = response.data.message || '登录失败'
          return false
        }
      } catch (error) {
        this.error = error.response?.data?.message || '登录时发生错误'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/auth/register', userData)
        
        if (response.data.success) {
          this.user = response.data.user
          this.token = response.data.token
          this.isAuthenticated = true
          
          // 存储token到本地存储
          localStorage.setItem('auth_token', this.token)
          return true
        } else {
          this.error = response.data.message || '注册失败'
          return false
        }
      } catch (error) {
        this.error = error.response?.data?.message || '注册时发生错误'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      // 可以添加调用登出API的逻辑
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      // 清除本地存储
      localStorage.removeItem('auth_token')
    },
    
    async fetchCurrentUser() {
      if (!localStorage.getItem('auth_token')) {
        return false
      }
      
      this.loading = true
      
      try {
        const response = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.data.success) {
          this.user = response.data.user
          this.isAuthenticated = true
          this.token = localStorage.getItem('auth_token')
          return true
        } else {
          this.logout()
          return false
        }
      } catch (error) {
        this.logout()
        return false
      } finally {
        this.loading = false
      }
    }
  }
}) 