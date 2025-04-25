<template>
  <div class="min-h-screen flex flex-col">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto py-4 px-4 flex justify-between items-center">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-blue-600 flex items-center">
            <img src="/images/logo.svg" alt="EastHome社区" class="h-8 mr-2" />
            EastHome社区
          </NuxtLink>
          
          <nav class="hidden md:flex ml-8">
            <NuxtLink to="/" class="mx-2 px-3 py-2 rounded-md hover:bg-gray-100">首页</NuxtLink>
            <NuxtLink to="/community" class="mx-2 px-3 py-2 rounded-md hover:bg-gray-100">社区</NuxtLink>
            <NuxtLink to="/community/categories" class="mx-2 px-3 py-2 rounded-md hover:bg-gray-100">话题分类</NuxtLink>
          </nav>
        </div>
        
        <div class="flex items-center">
          <div v-if="isLoggedIn" class="flex items-center">
            <div class="relative group">
              <button class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
                <img :src="user?.avatar || '/images/default-avatar.png'" class="w-8 h-8 rounded-full" alt="用户头像" />
                <span>{{ user?.username }}</span>
                <span v-if="user?.level" class="member-badge" :class="`member-badge--${user.level}`">{{ getLevelName(user.level) }}</span>
              </button>
              
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <NuxtLink to="/user/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">个人资料</NuxtLink>
                <NuxtLink to="/user/topics" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">我的话题</NuxtLink>
                <NuxtLink to="/user/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">设置</NuxtLink>
                <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">退出登录</button>
              </div>
            </div>
          </div>
          
          <div v-else class="flex items-center">
            <NuxtLink to="/auth/login" class="btn btn-outline mx-2">登录</NuxtLink>
            <NuxtLink to="/auth/register" class="btn btn-primary mx-2">注册</NuxtLink>
          </div>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区 -->
    <main class="flex-grow container mx-auto py-6 px-4">
      <slot />
    </main>
    
    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between">
          <div class="mb-4 md:mb-0">
            <h3 class="text-lg font-semibold mb-2">EastHome社区</h3>
            <p class="text-gray-400">技术交流，知识分享的专业社区</p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <h4 class="text-md font-semibold mb-2">关于我们</h4>
              <ul class="space-y-1">
                <li><NuxtLink to="/about" class="text-gray-400 hover:text-white">关于EastHome</NuxtLink></li>
                <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white">联系我们</NuxtLink></li>
                <li><NuxtLink to="/join" class="text-gray-400 hover:text-white">加入我们</NuxtLink></li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-md font-semibold mb-2">帮助中心</h4>
              <ul class="space-y-1">
                <li><NuxtLink to="/faq" class="text-gray-400 hover:text-white">常见问题</NuxtLink></li>
                <li><NuxtLink to="/community-rules" class="text-gray-400 hover:text-white">社区规则</NuxtLink></li>
                <li><NuxtLink to="/feedback" class="text-gray-400 hover:text-white">意见反馈</NuxtLink></li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-md font-semibold mb-2">社交媒体</h4>
              <ul class="space-y-1">
                <li><a href="#" class="text-gray-400 hover:text-white">微博</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">微信公众号</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white">知乎</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="mt-8 pt-4 border-t border-gray-700 text-gray-400 text-sm text-center">
          <p>&copy; {{ new Date().getFullYear() }} EastHome社区 版权所有</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.getUser)

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

// 登出
const logout = async () => {
  await userStore.logout()
  navigateTo('/auth/login')
}

onMounted(async () => {
  // 页面加载时检查用户是否已登录
  await userStore.fetchCurrentUser()
})
</script> 