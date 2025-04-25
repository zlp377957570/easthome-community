<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center mb-6">注册账号</h1>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <form @submit.prevent="handleRegister">
      <div class="form-group mb-4">
        <label for="username" class="block text-gray-700 mb-2">用户名</label>
        <input
          id="username"
          v-model="formData.username"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p class="text-sm text-gray-500 mt-1">用户名将在社区中公开显示</p>
      </div>
      
      <div class="form-group mb-4">
        <label for="email" class="block text-gray-700 mb-2">电子邮箱</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="form-group mb-4">
        <label for="password" class="block text-gray-700 mb-2">密码</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p class="text-sm text-gray-500 mt-1">密码至少包含8个字符</p>
      </div>
      
      <div class="form-group mb-6">
        <label for="confirmPassword" class="block text-gray-700 mb-2">确认密码</label>
        <input
          id="confirmPassword"
          v-model="formData.confirmPassword"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="flex items-center mb-6">
        <input
          id="terms"
          type="checkbox"
          v-model="formData.acceptTerms"
          class="h-4 w-4 text-blue-600 border-gray-300 rounded"
          required
        />
        <label for="terms" class="ml-2 block text-gray-700">
          我同意
          <NuxtLink to="/terms" class="text-blue-600 hover:underline">服务条款</NuxtLink>
          和
          <NuxtLink to="/privacy" class="text-blue-600 hover:underline">隐私政策</NuxtLink>
        </label>
      </div>
      
      <div class="mb-6">
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          :disabled="loading"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </div>
      
      <div class="text-center">
        <p class="text-gray-600">
          已有账号?
          <NuxtLink to="/auth/login" class="text-blue-600 hover:underline">登录</NuxtLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '~/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const loading = ref(false)
const error = ref('')

const validateForm = () => {
  if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
    error.value = '请填写所有必填字段'
    return false
  }
  
  if (formData.password.length < 8) {
    error.value = '密码至少需要8个字符'
    return false
  }
  
  if (formData.password !== formData.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return false
  }
  
  if (!formData.acceptTerms) {
    error.value = '请同意服务条款和隐私政策'
    return false
  }
  
  return true
}

const handleRegister = async () => {
  if (loading.value) return
  
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password
    }
    
    const success = await userStore.register(userData)
    
    if (success) {
      // 注册成功，跳转到首页
      router.push('/')
    } else {
      error.value = userStore.error || '注册失败，请稍后再试'
    }
  } catch (err) {
    error.value = '注册过程中发生错误，请稍后再试'
    console.error('Register error:', err)
  } finally {
    loading.value = false
  }
}

// 页面标题
useHead({
  title: '注册 - EastHome社区'
})
</script> 