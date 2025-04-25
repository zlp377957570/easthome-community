<template>
  <div v-if="loading" class="py-10 text-center">
    <p class="text-gray-500">加载中...</p>
  </div>
  
  <div v-else-if="error" class="py-10 text-center">
    <p class="text-red-500">{{ error }}</p>
    <button @click="fetchData" class="mt-4 btn btn-primary">重试</button>
  </div>
  
  <div v-else-if="topic" class="space-y-6">
    <!-- 话题标题和信息 -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h1 class="text-2xl font-bold mb-4">{{ topic.title }}</h1>
      
      <div class="flex items-center text-sm text-gray-500 mb-6">
        <div class="flex items-center">
          <img :src="topic.author.avatar || '/images/default-avatar.png'" alt="用户头像" class="w-8 h-8 rounded-full mr-2" />
          <span class="font-medium mr-1">{{ topic.author.username }}</span>
          <span v-if="topic.author.level" class="member-badge" :class="`member-badge--${topic.author.level}`">
            {{ getLevelName(topic.author.level) }}
          </span>
        </div>
        
        <span class="mx-2">·</span>
        <span>{{ formatDate(topic.createdAt) }}</span>
        
        <span class="mx-2">·</span>
        <span>分类: {{ topic.category.name }}</span>
        
        <span class="mx-2">·</span>
        <span>浏览: {{ topic.views }}</span>
      </div>
      
      <div class="prose max-w-none" v-html="topic.content"></div>
      
      <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button class="flex items-center text-gray-500 hover:text-blue-600">
            <span class="mr-1">👍</span>
            <span>点赞 ({{ topic.likes }})</span>
          </button>
          
          <button class="flex items-center text-gray-500 hover:text-blue-600">
            <span class="mr-1">⭐</span>
            <span>收藏</span>
          </button>
          
          <button class="flex items-center text-gray-500 hover:text-blue-600">
            <span class="mr-1">🔗</span>
            <span>分享</span>
          </button>
        </div>
        
        <div v-if="isAuthor || isAdmin" class="flex items-center space-x-2">
          <button class="text-gray-500 hover:text-blue-600">编辑</button>
          <button class="text-gray-500 hover:text-red-600">删除</button>
        </div>
      </div>
    </div>
    
    <!-- 回帖区域 -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-xl font-bold mb-4">回帖 ({{ posts.length }})</h2>
      
      <div v-if="posts.length === 0" class="py-6 text-center text-gray-500">
        暂无回帖，快来发表第一条回帖吧！
      </div>
      
      <div v-else class="space-y-6">
        <div v-for="post in posts" :key="post.id" class="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
          <div class="flex">
            <div class="mr-4">
              <img :src="post.author.avatar || '/images/default-avatar.png'" alt="用户头像" class="w-10 h-10 rounded-full" />
            </div>
            
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <span class="font-medium mr-1">{{ post.author.username }}</span>
                  <span v-if="post.author.level" class="member-badge" :class="`member-badge--${post.author.level}`">
                    {{ getLevelName(post.author.level) }}
                  </span>
                </div>
                
                <span class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</span>
              </div>
              
              <div class="prose max-w-none" v-html="post.content"></div>
              
              <div class="mt-4 flex items-center space-x-4">
                <button class="text-sm text-gray-500 hover:text-blue-600">
                  👍 点赞 ({{ post.likes }})
                </button>
                
                <button class="text-sm text-gray-500 hover:text-blue-600">
                  💬 回复
                </button>
                
                <div v-if="post.author.id === userId || isAdmin" class="ml-auto flex items-center space-x-2">
                  <button class="text-sm text-gray-500 hover:text-blue-600">编辑</button>
                  <button class="text-sm text-gray-500 hover:text-red-600">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 发表回帖 -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-xl font-bold mb-4">发表回帖</h2>
      
      <div v-if="!isLoggedIn" class="bg-gray-50 p-4 rounded text-center">
        <p class="text-gray-600 mb-2">登录后才能发表回帖</p>
        <NuxtLink to="/auth/login" class="btn btn-primary">立即登录</NuxtLink>
      </div>
      
      <form v-else @submit.prevent="submitPost">
        <div class="mb-4">
          <!-- 这里可以集成富文本编辑器 -->
          <textarea
            v-model="newPost"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="分享你的见解和想法..."
            required
          ></textarea>
        </div>
        
        <div class="text-right">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="postLoading"
          >
            {{ postLoading ? '发表中...' : '发表回帖' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { useCommunityStore } from '~/stores/community'
import dayjs from 'dayjs'

const route = useRoute()
const userStore = useUserStore()
const communityStore = useCommunityStore()

// 获取话题ID
const topicId = computed(() => route.params.id)

// 状态变量
const loading = ref(true)
const error = ref(null)
const postLoading = ref(false)
const newPost = ref('')
const topic = computed(() => communityStore.getCurrentTopic)
const posts = computed(() => communityStore.getPosts)

// 用户状态
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userId = computed(() => userStore.getUser?.id)
const isAdmin = computed(() => userStore.getUser?.role === 'admin')
const isAuthor = computed(() => topic.value?.author?.id === userId.value)

// 会员等级名称
const levelNames = {
  'bronze': '铜牌会员',
  'silver': '银牌会员',
  'gold': '金牌会员',
  'platinum': '铂金会员',
  'diamond': '钻石会员'
}

// 获取等级名称
const getLevelName = (level) => {
  return levelNames[level] || level
}

// 格式化日期
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

// 获取话题和回帖数据
const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 获取话题详情
    await communityStore.fetchTopic(topicId.value)
    
    // 获取回帖列表
    await communityStore.fetchPosts(topicId.value)
  } catch (err) {
    error.value = '获取数据失败，请稍后再试'
    console.error('Failed to fetch topic data:', err)
  } finally {
    loading.value = false
  }
}

// 提交回帖
const submitPost = async () => {
  if (postLoading.value || !newPost.value.trim()) return
  
  postLoading.value = true
  
  try {
    const success = await communityStore.createPost(topicId.value, newPost.value)
    
    if (success) {
      // 清空输入
      newPost.value = ''
    } else {
      alert(communityStore.error || '发表回帖失败，请稍后再试')
    }
  } catch (err) {
    alert('发表回帖时发生错误，请稍后再试')
    console.error('Failed to submit post:', err)
  } finally {
    postLoading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})

// 设置页面标题
useHead({
  title: computed(() => topic.value ? `${topic.value.title} - EastHome社区` : 'EastHome社区')
})
</script> 