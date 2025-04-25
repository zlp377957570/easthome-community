<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">社区话题</h1>
      
      <div class="flex space-x-2">
        <NuxtLink v-if="isLoggedIn" to="/community/topics/create" class="btn btn-primary">
          发布话题
        </NuxtLink>
        <NuxtLink v-else to="/auth/login" class="btn btn-primary">
          登录发布
        </NuxtLink>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- 左侧分类和过滤器 -->
      <div class="md:col-span-1 space-y-6">
        <!-- 分类列表 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="py-3 px-4 bg-gray-50 border-b border-gray-100">
            <h3 class="font-medium">话题分类</h3>
          </div>
          
          <div class="p-2">
            <button 
              @click="selectedCategory = null; fetchTopics()"
              class="w-full text-left py-2 px-3 rounded-md"
              :class="selectedCategory === null ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'"
            >
              全部话题
            </button>
            
            <button 
              v-for="category in categories" 
              :key="category.id"
              @click="selectedCategory = category.id; fetchTopics()"
              class="w-full text-left py-2 px-3 rounded-md"
              :class="selectedCategory === category.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'"
            >
              {{ category.name }}
              <span class="text-gray-400 text-sm ml-1">({{ category.count }})</span>
            </button>
          </div>
        </div>
        
        <!-- 排序选项 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="py-3 px-4 bg-gray-50 border-b border-gray-100">
            <h3 class="font-medium">排序方式</h3>
          </div>
          
          <div class="p-2">
            <button 
              v-for="(option, key) in sortOptions" 
              :key="key"
              @click="sortBy = key; fetchTopics()"
              class="w-full text-left py-2 px-3 rounded-md"
              :class="sortBy === key ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'"
            >
              {{ option }}
            </button>
          </div>
        </div>
        
        <!-- 标签云 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="py-3 px-4 bg-gray-50 border-b border-gray-100">
            <h3 class="font-medium">热门标签</h3>
          </div>
          
          <div class="p-4">
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="tag in popularTags" 
                :key="tag.id"
                @click="toggleTag(tag.name)"
                class="px-3 py-1 text-sm rounded-full"
                :class="selectedTags.includes(tag.name) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ tag.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧话题列表 -->
      <div class="md:col-span-3">
        <!-- 筛选标签显示 -->
        <div v-if="selectedTags.length > 0" class="bg-gray-50 rounded-lg p-3 mb-4 flex flex-wrap items-center gap-2">
          <span class="text-sm text-gray-500">已选标签:</span>
          <div 
            v-for="tag in selectedTags" 
            :key="tag"
            class="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
          >
            {{ tag }}
            <button @click="toggleTag(tag)" class="ml-1 text-blue-500 hover:text-blue-700">×</button>
          </div>
          <button @click="selectedTags = []" class="ml-auto text-sm text-gray-500 hover:text-gray-700">
            清除全部
          </button>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-10 text-center">
          <p class="text-gray-500">加载中...</p>
        </div>
        
        <!-- 加载出错 -->
        <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-10 text-center">
          <p class="text-red-500 mb-4">{{ error }}</p>
          <button @click="fetchTopics()" class="btn btn-primary">重试</button>
        </div>
        
        <!-- 无话题提示 -->
        <div v-else-if="topics.length === 0" class="bg-white rounded-lg shadow-sm p-10 text-center">
          <p class="text-gray-500 mb-4">暂无符合条件的话题</p>
          <NuxtLink to="/community/topics/create" class="btn btn-primary">
            发布第一个话题
          </NuxtLink>
        </div>
        
        <!-- 话题列表 -->
        <div v-else class="space-y-4">
          <div v-for="topic in topics" :key="topic.id" class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-start">
              <!-- 用户头像 -->
              <div class="mr-4 hidden sm:block">
                <img :src="topic.author.avatar || '/images/default-avatar.svg'" alt="用户头像" class="w-12 h-12 rounded-full" />
              </div>
              
              <!-- 话题内容 -->
              <div class="flex-1">
                <NuxtLink :to="`/community/topics/${topic.id}`" class="text-xl font-bold hover:text-blue-600 mb-2 block">
                  {{ topic.title }}
                </NuxtLink>
                
                <p v-if="topic.summary" class="text-gray-600 mb-3">{{ topic.summary }}</p>
                
                <div class="flex flex-wrap gap-2 mb-3">
                  <span v-for="tag in topic.tags" :key="tag" 
                    class="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 cursor-pointer"
                    @click="toggleTag(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <div class="flex flex-wrap items-center text-sm text-gray-500">
                  <div class="flex items-center mr-4">
                    <span class="sm:hidden mr-2">
                      <img :src="topic.author.avatar || '/images/default-avatar.svg'" alt="用户头像" class="w-5 h-5 rounded-full" />
                    </span>
                    <span class="mr-1">{{ topic.author.username }}</span>
                    <span v-if="topic.author.level" class="member-badge" :class="`member-badge--${topic.author.level}`">
                      {{ getLevelName(topic.author.level) }}
                    </span>
                  </div>
                  
                  <span class="mr-4">{{ formatDate(topic.createdAt) }}</span>
                  
                  <span class="mr-4">
                    <span class="mr-1">👁️</span>
                    {{ topic.viewCount }} 浏览
                  </span>
                  
                  <span class="mr-4">
                    <span class="mr-1">👍</span>
                    {{ topic.likeCount }} 点赞
                  </span>
                  
                  <span>
                    <span class="mr-1">💬</span>
                    {{ topic.replyCount }} 回复
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多按钮 -->
        <div v-if="hasMore" class="mt-6 text-center">
          <button 
            @click="loadMore()" 
            class="btn btn-outline" 
            :disabled="loadingMore"
          >
            {{ loadingMore ? '加载中...' : '加载更多' }}
          </button>
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

// 用户状态
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 分类和话题数据
const categories = ref([
  { id: 1, name: '前端开发', count: 128 },
  { id: 2, name: '后端开发', count: 97 },
  { id: 3, name: '移动开发', count: 64 },
  { id: 4, name: '人工智能', count: 42 },
  { id: 5, name: '运维与架构', count: 38 },
  { id: 6, name: '产品设计', count: 25 },
  { id: 7, name: '求职招聘', count: 16 }
])

// 排序选项
const sortOptions = {
  'latest': '最新发布',
  'popular': '最多浏览',
  'replies': '最多回复',
  'likes': '最多点赞',
}

// 热门标签
const popularTags = ref([
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'Vue' },
  { id: 3, name: 'React' },
  { id: 4, name: 'Node.js' },
  { id: 5, name: 'Python' },
  { id: 6, name: 'Java' },
  { id: 7, name: 'Go' },
  { id: 8, name: 'Docker' },
  { id: 9, name: 'AI' },
  { id: 10, name: 'CSS' },
  { id: 11, name: '面试' },
  { id: 12, name: '算法' }
])

// 筛选和排序条件
const selectedCategory = ref(null)
const selectedTags = ref([])
const sortBy = ref('latest')
const currentPage = ref(1)

// 状态变量
const loading = ref(false)
const loadingMore = ref(false)
const error = ref(null)
const topics = ref([])
const hasMore = ref(true)

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

// 切换选中的标签
const toggleTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
  
  // 重新获取话题
  currentPage.value = 1
  fetchTopics()
}

// 获取话题列表
const fetchTopics = async () => {
  loading.value = true
  error.value = null
  currentPage.value = 1
  
  try {
    // 这里应该调用API获取真实数据
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟数据
    topics.value = generateTopics()
    hasMore.value = topics.value.length >= 10
  } catch (err) {
    error.value = '获取话题列表失败，请稍后再试'
    console.error('Failed to fetch topics:', err)
  } finally {
    loading.value = false
  }
}

// 加载更多话题
const loadMore = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  currentPage.value += 1
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟数据
    const moreTopics = generateTopics()
    topics.value = [...topics.value, ...moreTopics]
    
    // 模拟没有更多数据的情况
    if (currentPage.value >= 3) {
      hasMore.value = false
    }
  } catch (err) {
    error.value = '加载更多话题失败，请稍后再试'
    console.error('Failed to load more topics:', err)
  } finally {
    loadingMore.value = false
  }
}

// 生成模拟数据
const generateTopics = () => {
  const mockedTopics = [
    {
      id: 1,
      title: 'Vue 3 和 React 18 性能对比分析',
      summary: '本文深入分析了Vue 3和React 18在不同场景下的性能表现，包括渲染速度、内存占用、打包体积等方面的对比数据。',
      tags: ['JavaScript', 'Vue', 'React', '前端'],
      createdAt: '2023-04-15',
      author: { 
        username: '前端大神', 
        avatar: null,
        level: 'gold'
      },
      category: { id: 1, name: '前端开发' },
      viewCount: 1245,
      likeCount: 145,
      replyCount: 32
    },
    {
      id: 2,
      title: 'NodeJS 微服务架构设计与实践',
      summary: '分享了一个大型应用中的NodeJS微服务架构实践，包括服务拆分、通信方式、鉴权、监控等方面的经验与教训。',
      tags: ['Node.js', '微服务', '架构', '后端'],
      createdAt: '2023-04-12',
      author: { 
        username: '后端工程师', 
        avatar: null,
        level: 'diamond'
      },
      category: { id: 2, name: '后端开发' },
      viewCount: 982,
      likeCount: 108,
      replyCount: 27
    },
    {
      id: 3,
      title: '使用TensorFlow.js实现前端人脸识别',
      summary: '本文介绍了如何在浏览器中使用TensorFlow.js实现人脸识别功能，不依赖后端API，提高应用安全性与隐私保护。',
      tags: ['JavaScript', 'AI', 'TensorFlow', '前端'],
      createdAt: '2023-04-10',
      author: { 
        username: 'AI研究员', 
        avatar: null,
        level: 'platinum'
      },
      category: { id: 4, name: '人工智能' },
      viewCount: 876,
      likeCount: 89,
      replyCount: 18
    },
    {
      id: 4,
      title: 'CSS Grid布局实战：响应式仪表盘设计',
      summary: '深入浅出讲解如何使用CSS Grid布局技术，结合Flexbox实现复杂的响应式仪表盘界面，适应各种屏幕尺寸。',
      tags: ['CSS', 'HTML', '响应式设计', '前端'],
      createdAt: '2023-04-08',
      author: { 
        username: 'UI设计师', 
        avatar: null,
        level: 'silver'
      },
      category: { id: 1, name: '前端开发' },
      viewCount: 764,
      likeCount: 76,
      replyCount: 24
    },
    {
      id: 5,
      title: 'Go语言实现高并发Web服务器的技巧',
      summary: '本文分享了使用Go语言构建高性能、高并发Web服务的经验，包括协程管理、内存优化和性能调优等方面的实用技巧。',
      tags: ['Go', '后端', '并发', '性能优化'],
      createdAt: '2023-04-05',
      author: { 
        username: '并发专家', 
        avatar: null,
        level: 'gold'
      },
      category: { id: 2, name: '后端开发' },
      viewCount: 698,
      likeCount: 65,
      replyCount: 21
    },
    {
      id: 6,
      title: 'Flutter vs React Native：2023年最新对比',
      summary: '对比了Flutter和React Native在开发效率、性能表现、生态系统等方面的差异，并结合实际项目经验给出选型建议。',
      tags: ['Flutter', 'React Native', '移动开发', '跨平台'],
      createdAt: '2023-04-03',
      author: { 
        username: '移动开发者', 
        avatar: null,
        level: 'bronze'
      },
      category: { id: 3, name: '移动开发' },
      viewCount: 642,
      likeCount: 58,
      replyCount: 19
    },
    {
      id: 7,
      title: 'Kubernetes在生产环境中的最佳实践',
      summary: '基于多年的实战经验，分享K8s集群在生产环境中的配置优化、资源管理、监控告警和故障处理等方面的最佳实践。',
      tags: ['Kubernetes', 'Docker', '云原生', '运维'],
      createdAt: '2023-04-01',
      author: { 
        username: '云原生专家', 
        avatar: null,
        level: 'diamond'
      },
      category: { id: 5, name: '运维与架构' },
      viewCount: 589,
      likeCount: 52,
      replyCount: 17
    },
    {
      id: 8,
      title: '2023年前端面试题总结与解析',
      summary: '整理了今年各大互联网公司前端面试的高频问题，并提供了详细的解答和相关知识点的深入分析。',
      tags: ['面试', '前端', 'JavaScript', '求职'],
      createdAt: '2023-03-28',
      author: { 
        username: '技术面试官', 
        avatar: null,
        level: 'platinum'
      },
      category: { id: 7, name: '求职招聘' },
      viewCount: 1876,
      likeCount: 215,
      replyCount: 42
    },
    {
      id: 9,
      title: 'Python与数据科学：从入门到实践',
      summary: '系统介绍了Python在数据分析、可视化和机器学习方面的应用，包含丰富的示例代码和实战项目。',
      tags: ['Python', '数据科学', '机器学习', 'AI'],
      createdAt: '2023-03-25',
      author: { 
        username: '数据科学家', 
        avatar: null,
        level: 'gold'
      },
      category: { id: 4, name: '人工智能' },
      viewCount: 523,
      likeCount: 48,
      replyCount: 16
    },
    {
      id: 10,
      title: '用户体验设计中的心理学原理',
      summary: '探讨了产品设计中常用的心理学原理，如启发式评估、易用性设计等，以及如何将这些原理应用到实际项目中。',
      tags: ['产品设计', 'UX', '用户体验', '心理学'],
      createdAt: '2023-03-22',
      author: { 
        username: 'UX设计师', 
        avatar: null,
        level: 'silver'
      },
      category: { id: 6, name: '产品设计' },
      viewCount: 467,
      likeCount: 43,
      replyCount: 15
    }
  ]
  
  // 根据选中的分类进行筛选
  let filteredTopics = [...mockedTopics]
  
  if (selectedCategory.value) {
    filteredTopics = filteredTopics.filter(topic => topic.category.id === selectedCategory.value)
  }
  
  // 根据选中的标签进行筛选
  if (selectedTags.value.length > 0) {
    filteredTopics = filteredTopics.filter(topic => 
      selectedTags.value.some(tag => topic.tags.includes(tag))
    )
  }
  
  // 根据排序方式进行排序
  switch (sortBy.value) {
    case 'popular':
      filteredTopics.sort((a, b) => b.viewCount - a.viewCount)
      break
    case 'replies':
      filteredTopics.sort((a, b) => b.replyCount - a.replyCount)
      break
    case 'likes':
      filteredTopics.sort((a, b) => b.likeCount - a.likeCount)
      break
    case 'latest':
    default:
      // 已经按日期排序，无需额外处理
      break
  }
  
  return filteredTopics
}

// 页面加载时获取数据
onMounted(async () => {
  // 获取分类列表
  try {
    await communityStore.fetchCategories()
    // 如果成功，使用实际分类数据
    // categories.value = communityStore.getCategories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    // 使用默认分类数据
  }
  
  // 获取话题列表
  fetchTopics()
})

// 设置页面标题
useHead({
  title: '社区话题 - EastHome社区'
})
</script> 