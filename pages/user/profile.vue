<template>
  <div>
    <div v-if="!isLoggedIn" class="bg-white p-6 rounded-lg shadow-sm text-center">
      <p class="text-gray-600 mb-4">您需要登录才能查看个人资料</p>
      <NuxtLink to="/auth/login" class="btn btn-primary">登录</NuxtLink>
    </div>
    
    <div v-else>
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- 个人资料头部 -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
          <div class="flex flex-col md:flex-row items-center">
            <div class="mb-4 md:mb-0 md:mr-8">
              <div class="relative group">
                <img 
                  :src="user.avatar || '/images/default-avatar.svg'" 
                  alt="用户头像" 
                  class="w-24 h-24 rounded-full border-4 border-white"
                >
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="text-white text-sm">更换头像</button>
                </div>
              </div>
            </div>
            
            <div class="text-center md:text-left text-white">
              <h1 class="text-2xl font-bold mb-2">{{ user.username }}</h1>
              <div class="flex flex-wrap justify-center md:justify-start items-center mb-2 gap-2">
                <span class="member-badge" :class="`member-badge--${user.level}`">
                  {{ getLevelName(user.level) }}
                </span>
                <span class="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded">
                  注册于 {{ formatDate(user.createdAt) }}
                </span>
              </div>
              <p v-if="user.bio" class="text-blue-100">{{ user.bio }}</p>
            </div>
          </div>
        </div>
        
        <!-- 内容部分 -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2">
              <!-- 用户统计信息 -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-gray-50 p-4 rounded-lg text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ userStats.topicCount }}</div>
                  <div class="text-gray-500 text-sm">发布话题</div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ userStats.replyCount }}</div>
                  <div class="text-gray-500 text-sm">回复数量</div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ userStats.likeCount }}</div>
                  <div class="text-gray-500 text-sm">获得点赞</div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ userStats.viewCount }}</div>
                  <div class="text-gray-500 text-sm">话题被浏览</div>
                </div>
              </div>
              
              <!-- 等级进度 -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4">会员等级进度</h3>
                <div class="bg-gray-100 h-4 rounded-full overflow-hidden mb-2">
                  <div class="bg-blue-600 h-full" :style="`width: ${levelProgress}%`"></div>
                </div>
                <div class="flex justify-between text-sm">
                  <div>
                    <span class="member-badge member-badge--{{ user.level }}">
                      {{ getLevelName(user.level) }}
                    </span>
                  </div>
                  <div class="text-gray-600">
                    距离 {{ getNextLevel(user.level) }} 还需：{{ getNextLevelRequirements(user.level) }}
                  </div>
                </div>
              </div>
              
              <!-- 我的话题 -->
              <div>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold">我的话题</h3>
                  <NuxtLink to="/user/topics" class="text-blue-600 hover:underline text-sm">查看全部</NuxtLink>
                </div>
                
                <div v-if="userTopics.length === 0" class="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                  您还没有发布话题
                </div>
                
                <div v-else class="space-y-4">
                  <div v-for="topic in userTopics" :key="topic.id" class="border-b border-gray-100 pb-4 last:border-0">
                    <NuxtLink :to="`/community/topics/${topic.id}`" class="block hover:text-blue-600 font-medium mb-1">
                      {{ topic.title }}
                    </NuxtLink>
                    <div class="flex justify-between text-sm text-gray-500">
                      <span>{{ formatDate(topic.createdAt) }}</span>
                      <div class="flex items-center">
                        <span class="flex items-center mr-3">
                          <span class="mr-1">👀</span> {{ topic.viewCount }}
                        </span>
                        <span class="flex items-center mr-3">
                          <span class="mr-1">👍</span> {{ topic.likeCount }}
                        </span>
                        <span class="flex items-center">
                          <span class="mr-1">💬</span> {{ topic.replyCount }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 侧边栏 -->
            <div>
              <!-- 个人资料卡片 -->
              <div class="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 class="text-lg font-semibold mb-4">个人资料</h3>
                
                <div class="space-y-4">
                  <div v-if="user.email">
                    <div class="text-gray-500 text-sm mb-1">邮箱</div>
                    <div>{{ user.email }}</div>
                  </div>
                  
                  <div v-if="user.location">
                    <div class="text-gray-500 text-sm mb-1">所在地</div>
                    <div>{{ user.location }}</div>
                  </div>
                  
                  <div v-if="user.website">
                    <div class="text-gray-500 text-sm mb-1">个人网站</div>
                    <div>
                      <a :href="user.website" target="_blank" class="text-blue-600 hover:underline">{{ user.website }}</a>
                    </div>
                  </div>
                  
                  <div v-if="user.github">
                    <div class="text-gray-500 text-sm mb-1">GitHub</div>
                    <div>
                      <a :href="`https://github.com/${user.github}`" target="_blank" class="text-blue-600 hover:underline">
                        {{ user.github }}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div class="mt-6">
                  <NuxtLink to="/user/settings" class="btn btn-outline w-full">编辑资料</NuxtLink>
                </div>
              </div>
              
              <!-- 社交链接 -->
              <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">分享我的主页</h3>
                
                <div class="flex justify-between">
                  <button class="p-2 bg-gray-200 rounded hover:bg-gray-300">
                    <span>微信</span>
                  </button>
                  <button class="p-2 bg-gray-200 rounded hover:bg-gray-300">
                    <span>微博</span>
                  </button>
                  <button class="p-2 bg-gray-200 rounded hover:bg-gray-300">
                    <span>QQ</span>
                  </button>
                  <button class="p-2 bg-gray-200 rounded hover:bg-gray-300">
                    <span>链接</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import dayjs from 'dayjs'

const userStore = useUserStore()

// 用户相关
const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.getUser || {})

// 会员等级相关信息
const levelNames = {
  'bronze': '铜牌会员',
  'silver': '银牌会员',
  'gold': '金牌会员',
  'platinum': '铂金会员',
  'diamond': '钻石会员'
}

// 等级进度计算，模拟数据
const levelProgress = computed(() => {
  // 不同等级的完成度，实际项目中应根据用户数据动态计算
  const progress = {
    'bronze': 30,  // 铜牌完成了30%迈向银牌
    'silver': 45,  // 银牌完成了45%迈向金牌
    'gold': 60,    // 金牌完成了60%迈向铂金
    'platinum': 75 // 铂金完成了75%迈向钻石
  }
  
  return progress[user.value?.level] || 0
})

// 用户统计数据
const userStats = ref({
  topicCount: 15,
  replyCount: 48,
  likeCount: 126,
  viewCount: 2345
})

// 用户话题，假数据
const userTopics = ref([
  {
    id: 1,
    title: '如何在Nuxt 3中实现SSR与客户端混合渲染',
    createdAt: '2023-10-15',
    viewCount: 328,
    likeCount: 42,
    replyCount: 12
  },
  {
    id: 2,
    title: 'Pinia的使用技巧与最佳实践',
    createdAt: '2023-09-22',
    viewCount: 216,
    likeCount: 36,
    replyCount: 8
  },
  {
    id: 3,
    title: '使用TailwindCSS打造高效的响应式UI',
    createdAt: '2023-08-07',
    viewCount: 175,
    likeCount: 28,
    replyCount: 6
  }
])

// 格式化日期
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD')
}

// 获取等级名称
const getLevelName = (level) => {
  return levelNames[level] || level
}

// 获取下一个等级
const getNextLevel = (currentLevel) => {
  const levels = ['bronze', 'silver', 'gold', 'platinum', 'diamond']
  const currentIndex = levels.indexOf(currentLevel)
  
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return '最高等级'
  }
  
  return getLevelName(levels[currentIndex + 1])
}

// 获取下一等级要求
const getNextLevelRequirements = (currentLevel) => {
  const requirements = {
    'bronze': '发布5个话题且获得10个点赞',
    'silver': '发布15个话题且获得50个点赞',
    'gold': '发布30个话题且获得200个点赞',
    'platinum': '发布50个话题且获得500个点赞'
  }
  
  return requirements[currentLevel] || '已达到最高等级'
}

// 页面加载时获取数据
onMounted(async () => {
  if (!isLoggedIn.value) {
    await userStore.fetchCurrentUser()
  }
})

// 设置页面标题
useHead({
  title: '个人资料 - EastHome社区'
})
</script> 