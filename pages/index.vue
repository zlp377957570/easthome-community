<template>
  <div>
    <!-- 顶部横幅 -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 py-16 px-4 mb-8 rounded-lg shadow-lg">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl font-bold text-white mb-4">欢迎来到 EastHome 技术社区</h1>
        <p class="text-xl text-white/90 mb-8">分享技术心得，交流学习经验，共同成长</p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink to="/community" class="btn bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg">
            进入社区
          </NuxtLink>
          <NuxtLink to="/auth/register" v-if="!isLoggedIn" class="btn bg-transparent text-white border border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-lg">
            注册账号
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <!-- 社区特点 -->
    <div class="max-w-6xl mx-auto mb-16">
      <h2 class="text-3xl font-bold text-center mb-12">为什么加入我们的社区？</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <div class="inline-flex items-center justify-center bg-blue-100 p-3 rounded-full mb-4">
            <span class="text-3xl text-blue-600">💡</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">知识分享</h3>
          <p class="text-gray-600">与志同道合的开发者分享你的技术心得，获取实用的解决方案</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <div class="inline-flex items-center justify-center bg-green-100 p-3 rounded-full mb-4">
            <span class="text-3xl text-green-600">👥</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">交流互动</h3>
          <p class="text-gray-600">参与技术讨论，结交行业朋友，共同探讨技术难题和最佳实践</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm text-center">
          <div class="inline-flex items-center justify-center bg-yellow-100 p-3 rounded-full mb-4">
            <span class="text-3xl text-yellow-600">🚀</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">成长提升</h3>
          <p class="text-gray-600">通过持续参与和贡献，提升技术能力和影响力，获得更多机会</p>
        </div>
      </div>
    </div>
    
    <!-- 社区介绍 Banner -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md p-8 mb-8 text-white">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-4">欢迎来到 EastHome 社区</h1>
        <p class="text-lg mb-6">这里是技术爱好者的家园，分享知识，交流经验，共同成长。</p>
        <div class="flex flex-wrap gap-4">
          <NuxtLink to="/community" class="btn bg-white text-blue-700 hover:bg-gray-100">
            浏览话题
          </NuxtLink>
          <NuxtLink to="/community/topics/create" class="btn bg-blue-600 text-white border border-white hover:bg-blue-700">
            发布话题
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- 热门话题列表 -->
      <div class="md:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">热门话题</h2>
            <NuxtLink to="/community" class="text-blue-600 hover:underline">查看更多</NuxtLink>
          </div>
          
          <div v-if="loading" class="py-10 text-center">
            <p class="text-gray-500">加载中...</p>
          </div>
          
          <div v-else-if="error" class="py-10 text-center">
            <p class="text-red-500">{{ error }}</p>
            <button @click="fetchTopics" class="mt-4 btn btn-primary">重试</button>
          </div>
          
          <div v-else-if="topics.length === 0" class="py-10 text-center">
            <p class="text-gray-500">暂无话题，快来发布第一个话题吧！</p>
            <NuxtLink to="/community/topics/create" class="mt-4 btn btn-primary">
              发布话题
            </NuxtLink>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="topic in topics" :key="topic.id" class="topic-item">
              <NuxtLink :to="`/community/topics/${topic.id}`" class="topic-item__title hover:text-blue-600">
                {{ topic.title }}
              </NuxtLink>
              
              <p v-if="topic.summary" class="text-gray-600 text-sm mb-2 line-clamp-2">
                {{ topic.summary }}
              </p>
              
              <div class="topic-item__meta">
                <div class="flex items-center">
                  <img :src="topic.author.avatar || '/images/default-avatar.svg'" alt="用户头像" class="avatar" />
                  <span class="username">{{ topic.author.username }}</span>
                  <span v-if="topic.author.level" class="member-badge" :class="`member-badge--${topic.author.level}`">
                    {{ getLevelName(topic.author.level) }}
                  </span>
                </div>
                
                <div class="flex items-center text-sm text-gray-500 mt-2 md:mt-0">
                  <span>{{ formatDate(topic.createdAt) }}</span>
                  <span class="mx-2">·</span>
                  <span>{{ topic.category.name }}</span>
                  <span class="mx-2">·</span>
                  <span>{{ topic.viewCount }} 浏览</span>
                  <span class="mx-2">·</span>
                  <span>{{ topic.replyCount }} 回复</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 侧边栏 -->
      <div class="md:col-span-1 space-y-6">
        <!-- 社区统计 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold mb-4">社区统计</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">话题总数</span>
              <span class="font-medium">{{ communityStats.topicCount || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">用户总数</span>
              <span class="font-medium">{{ communityStats.userCount || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">今日新增话题</span>
              <span class="font-medium">{{ communityStats.todayTopics || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">今日新增用户</span>
              <span class="font-medium">{{ communityStats.todayUsers || 0 }}</span>
            </div>
          </div>
        </div>
        
        <!-- 活跃用户 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold mb-4">活跃用户</h3>
          
          <div v-if="activeUsers.length === 0" class="py-4 text-center text-gray-500">
            暂无数据
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="user in activeUsers" :key="user.id" class="flex items-center">
              <img :src="user.avatar || '/images/default-avatar.svg'" alt="用户头像" class="w-10 h-10 rounded-full mr-3" />
              <div>
                <div class="flex items-center">
                  <span class="font-medium mr-2">{{ user.username }}</span>
                  <span v-if="user.level" class="member-badge" :class="`member-badge--${user.level}`">
                    {{ getLevelName(user.level) }}
                  </span>
                </div>
                <p class="text-sm text-gray-500">发布了 {{ user.topicCount }} 个话题</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 社区分类 -->
    <div class="max-w-6xl mx-auto mb-16">
      <h2 class="text-2xl font-bold mb-6">社区分类</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="category in categories" 
          :key="category.id"
          :to="`/community/categories/${category.id}`"
          class="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <span class="text-2xl">{{ category.icon }}</span>
          </div>
          <div>
            <h3 class="font-medium text-gray-800">{{ category.name }}</h3>
            <p class="text-sm text-gray-500">{{ category.topicsCount }} 个话题</p>
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <!-- 会员等级介绍 -->
    <div class="max-w-6xl mx-auto mb-16">
      <h2 class="text-2xl font-bold mb-6">会员等级</h2>
      
      <div class="overflow-x-auto">
        <table class="w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="py-3 px-4 text-left">等级</th>
              <th class="py-3 px-4 text-left">称号</th>
              <th class="py-3 px-4 text-left">要求</th>
              <th class="py-3 px-4 text-left">权益</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="level in memberLevels" :key="level.id" class="border-t border-gray-100">
              <td class="py-3 px-4">
                <span class="member-badge" :class="`member-badge--${level.id}`">{{ level.name }}</span>
              </td>
              <td class="py-3 px-4">{{ level.title }}</td>
              <td class="py-3 px-4">{{ level.requirements }}</td>
              <td class="py-3 px-4">{{ level.benefits }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 加入社区 CTA -->
    <div class="bg-gradient-to-r from-green-500 to-teal-600 py-12 px-4 rounded-lg shadow-lg mb-16">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-white mb-4">准备好加入我们了吗？</h2>
        <p class="text-xl text-white/90 mb-8">今天就成为 EastHome 社区的一员，开启你的技术分享之旅</p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink to="/auth/register" v-if="!isLoggedIn" class="btn bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium text-lg">
            立即注册
          </NuxtLink>
          <NuxtLink to="/community" class="btn bg-transparent text-white border border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-lg">
            浏览社区
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { useCommunityStore } from '~/stores/community'
import dayjs from 'dayjs'

const userStore = useUserStore()
const communityStore = useCommunityStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 状态变量
const loading = ref(true)
const error = ref(null)
const topics = ref([])
const communityStats = ref({
  topicCount: 0,
  userCount: 0,
  todayTopics: 0,
  todayUsers: 0
})
const activeUsers = ref([])

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
  return dayjs(dateString).format('YYYY-MM-DD')
}

// 获取热门话题数据
const fetchTopics = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 示例数据，实际项目中应该调用API
    // 使用 communityStore 获取首页热门话题
    await communityStore.fetchTopics(null, 1)
    topics.value = communityStore.getTopics.slice(0, 5) // 只显示前5条
    
    // 获取社区统计数据
    fetchCommunityStats()
    
    // 获取活跃用户
    fetchActiveUsers()
  } catch (err) {
    error.value = '获取话题数据失败，请稍后再试'
    console.error('Failed to fetch topics:', err)
  } finally {
    loading.value = false
  }
}

// 获取社区统计数据
const fetchCommunityStats = async () => {
  // 这里应该调用API获取真实数据
  // 示例数据
  communityStats.value.topicCount = 1024
  communityStats.value.userCount = 512
  communityStats.value.todayTopics = 32
  communityStats.value.todayUsers = 16
}

// 获取活跃用户
const fetchActiveUsers = async () => {
  // 这里应该调用API获取真实数据
  // 示例数据
  activeUsers.value = [
    {
      id: 1,
      username: '技术大牛',
      level: 'diamond',
      avatar: null,
      topicCount: 86
    },
    {
      id: 2,
      username: '学习达人',
      level: 'platinum',
      avatar: null,
      topicCount: 65
    },
    {
      id: 3, 
      username: '编程爱好者',
      level: 'gold',
      avatar: null,
      topicCount: 42
    }
  ]
}

// 模拟社区分类数据
const categories = ref([
  { id: 1, name: '前端开发', icon: '🌐', topicsCount: 364 },
  { id: 2, name: '后端开发', icon: '⚙️', topicsCount: 295 },
  { id: 3, name: '移动开发', icon: '📱', topicsCount: 187 },
  { id: 4, name: '人工智能', icon: '🤖', topicsCount: 142 },
  { id: 5, name: '云计算', icon: '☁️', topicsCount: 103 },
  { id: 6, name: '数据库', icon: '💾', topicsCount: 98 },
  { id: 7, name: '区块链', icon: '🔗', topicsCount: 76 },
  { id: 8, name: '求职招聘', icon: '💼', topicsCount: 65 }
])

// 会员等级数据
const memberLevels = ref([
  { 
    id: 'bronze', 
    name: '铜牌会员', 
    title: '社区新人',
    requirements: '注册账号', 
    benefits: '发布话题、回复帖子' 
  },
  { 
    id: 'silver', 
    name: '银牌会员', 
    title: '活跃贡献者',
    requirements: '发布5个话题且获得10个点赞', 
    benefits: '发布话题、回复帖子、上传图片' 
  },
  { 
    id: 'gold', 
    name: '金牌会员', 
    title: '资深参与者',
    requirements: '发布15个话题且获得50个点赞', 
    benefits: '发布话题、回复帖子、上传图片、发布视频' 
  },
  { 
    id: 'platinum', 
    name: '铂金会员', 
    title: '社区专家',
    requirements: '发布30个话题且获得200个点赞', 
    benefits: '所有权限、内容优先展示' 
  },
  { 
    id: 'diamond', 
    name: '钻石会员', 
    title: '社区领袖',
    requirements: '发布50个话题且获得500个点赞', 
    benefits: '所有权限、内容置顶、参与社区管理' 
  }
])

// 初始化
onMounted(() => {
  // 检查用户是否已登录
  if (!isLoggedIn.value) {
    userStore.fetchCurrentUser()
  }
  fetchTopics()
})

// 设置页面标题
useHead({
  title: 'EastHome社区 - 技术交流的家园'
})
</script> 