<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">发布新话题</h1>
    
    <div v-if="!isLoggedIn" class="bg-white p-6 rounded-lg shadow-sm text-center">
      <p class="text-gray-600 mb-4">您需要登录才能发布话题</p>
      <NuxtLink to="/auth/login" class="btn btn-primary">登录</NuxtLink>
    </div>
    
    <div v-else class="bg-white p-6 rounded-lg shadow-sm">
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group mb-4">
          <label for="title" class="block text-gray-700 mb-2 font-medium">标题</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="话题标题，简明扼要"
            required
          />
        </div>
        
        <div class="form-group mb-4">
          <label for="category" class="block text-gray-700 mb-2 font-medium">分类</label>
          <select
            id="category"
            v-model="formData.categoryId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>选择分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group mb-4">
          <label for="summary" class="block text-gray-700 mb-2 font-medium">摘要</label>
          <textarea
            id="summary"
            v-model="formData.summary"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="话题简短介绍，会显示在列表中"
            maxlength="200"
          ></textarea>
          <p class="text-sm text-gray-500 mt-1">{{ formData.summary.length }}/200</p>
        </div>
        
        <div class="form-group mb-6">
          <label for="content" class="block text-gray-700 mb-2 font-medium">内容</label>
          <div class="border border-gray-300 rounded-md mb-2">
            <!-- 这里可以集成富文本编辑器，现在先用 textarea -->
            <textarea
              id="content"
              v-model="formData.content"
              rows="12"
              class="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="详细的话题内容..."
              required
            ></textarea>
          </div>
          <p class="text-sm text-gray-500">
            支持 Markdown 格式，可以插入代码、图片等
          </p>
        </div>
        
        <div class="form-group mb-6">
          <label for="tags" class="block text-gray-700 mb-2 font-medium">标签</label>
          <input
            id="tags"
            v-model="formData.tags"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入标签，使用逗号分隔"
          />
          <p class="text-sm text-gray-500 mt-1">标签之间用逗号分隔，如：JavaScript, Vue, Nuxt</p>
        </div>
        
        <div class="flex items-center mb-6">
          <input
            id="isOriginal"
            type="checkbox"
            v-model="formData.isOriginal"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label for="isOriginal" class="ml-2 block text-gray-700">
            我声明这是原创内容
          </label>
        </div>
        
        <div class="flex justify-between">
          <button 
            type="button" 
            @click="router.back()"
            class="btn btn-outline"
          >
            取消
          </button>
          
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? '发布中...' : '发布话题' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { useCommunityStore } from '~/stores/community'

const router = useRouter()
const userStore = useUserStore()
const communityStore = useCommunityStore()

// 用户状态
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 表单数据
const formData = reactive({
  title: '',
  categoryId: '',
  summary: '',
  content: '',
  tags: '',
  isOriginal: true
})

// 状态变量
const loading = ref(false)
const error = ref('')
const categories = ref([])

// 获取分类数据
const fetchCategories = async () => {
  try {
    await communityStore.fetchCategories()
    categories.value = communityStore.getCategories
  } catch (err) {
    error.value = '获取分类数据失败，请刷新页面重试'
    console.error('Failed to fetch categories:', err)
  }
}

// 验证表单
const validateForm = () => {
  if (!formData.title.trim()) {
    error.value = '请输入话题标题'
    return false
  }
  
  if (!formData.categoryId) {
    error.value = '请选择话题分类'
    return false
  }
  
  if (!formData.content.trim()) {
    error.value = '请输入话题内容'
    return false
  }
  
  return true
}

// 处理提交
const handleSubmit = async () => {
  if (loading.value) return
  
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    // 准备标签数据
    const tagsList = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    
    // 构建话题数据
    const topicData = {
      title: formData.title,
      categoryId: formData.categoryId,
      summary: formData.summary,
      content: formData.content,
      tags: tagsList,
      isOriginal: formData.isOriginal
    }
    
    // 创建话题
    const newTopic = await communityStore.createTopic(topicData)
    
    if (newTopic) {
      // 创建成功，跳转到新话题页面
      router.push(`/community/topics/${newTopic.id}`)
    } else {
      error.value = communityStore.error || '发布话题失败，请稍后再试'
    }
  } catch (err) {
    error.value = '发布过程中发生错误，请稍后再试'
    console.error('Failed to create topic:', err)
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  // 如果未登录，引导到登录页
  if (!isLoggedIn.value) {
    // 留在当前页面，显示登录提示
  }
  
  // 获取分类数据
  fetchCategories()
})

// 页面标题
useHead({
  title: '发布新话题 - EastHome社区'
})
</script> 