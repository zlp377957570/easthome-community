<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center mb-6">登录</h1>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <form @submit.prevent="handleLogin">
      <div class="form-group mb-4">
        <label for="username" class="block text-gray-700 mb-2">用户名</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="form-group mb-6">
        <label for="password" class="block text-gray-700 mb-2">密码</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <input
            id="remember"
            type="checkbox"
            v-model="remember"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label for="remember" class="ml-2 block text-gray-700">记住我</label>
        </div>
        
        <div>
          <NuxtLink to="/auth/forgot-password" class="text-blue-600 hover:underline">
            忘记密码?
          </NuxtLink>
        </div>
      </div>
      
      <div class="mb-6">
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>
      
      <div class="text-center">
        <p class="text-gray-600">
          还没有账号?
          <NuxtLink to="/auth/register" class="text-blue-600 hover:underline">注册</NuxtLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '~/stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (loading.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const success = await userStore.login(username.value, password.value)
    
    if (success) {
      // 登录成功，跳转到首页或之前的页面
      router.push('/')
    } else {
      error.value = userStore.error || '用户名或密码错误'
    }
  } catch (err) {
    error.value = '登录过程中发生错误，请稍后再试'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

// 页面标题
useHead({
  title: '登录 - EastHome社区'
})
</script> 