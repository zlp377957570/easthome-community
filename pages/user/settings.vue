<template>
  <div>
    <div v-if="!isLoggedIn" class="bg-white p-6 rounded-lg shadow-sm text-center">
      <p class="text-gray-600 mb-4">您需要登录才能修改设置</p>
      <NuxtLink to="/auth/login" class="btn btn-primary">登录</NuxtLink>
    </div>
    
    <div v-else>
      <h1 class="text-2xl font-bold mb-6">账号设置</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- 侧边栏导航 -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="py-3 px-4 bg-gray-50 border-b border-gray-100">
              <h3 class="font-medium">设置选项</h3>
            </div>
            <div class="p-2">
              <button 
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="activeTab = tab.id"
                class="w-full text-left py-2 px-3 rounded-md text-gray-700"
                :class="activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'"
              >
                {{ tab.name }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 主要内容区 -->
        <div class="md:col-span-3">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <!-- 个人资料 -->
            <div v-if="activeTab === 'profile'">
              <h2 class="text-xl font-bold mb-6">个人资料</h2>
              
              <div v-if="message.text" class="mb-6 p-4 rounded-md" :class="message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ message.text }}
              </div>
              
              <form @submit.prevent="saveProfile">
                <div class="form-group mb-4">
                  <label for="username" class="block text-gray-700 mb-2 font-medium">用户名</label>
                  <input
                    id="username"
                    v-model="profileForm.username"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                  <p class="text-sm text-gray-500 mt-1">用户名创建后不可修改</p>
                </div>
                
                <div class="form-group mb-4">
                  <label for="email" class="block text-gray-700 mb-2 font-medium">邮箱</label>
                  <input
                    id="email"
                    v-model="profileForm.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div class="form-group mb-4">
                  <label for="bio" class="block text-gray-700 mb-2 font-medium">个人简介</label>
                  <textarea
                    id="bio"
                    v-model="profileForm.bio"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="介绍一下自己吧..."
                  ></textarea>
                </div>
                
                <div class="form-group mb-4">
                  <label for="location" class="block text-gray-700 mb-2 font-medium">所在地</label>
                  <input
                    id="location"
                    v-model="profileForm.location"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：北京"
                  />
                </div>
                
                <div class="form-group mb-4">
                  <label for="website" class="block text-gray-700 mb-2 font-medium">个人网站</label>
                  <input
                    id="website"
                    v-model="profileForm.website"
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://"
                  />
                </div>
                
                <div class="form-group mb-6">
                  <label for="github" class="block text-gray-700 mb-2 font-medium">GitHub 用户名</label>
                  <input
                    id="github"
                    v-model="profileForm.github"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="您的 GitHub 用户名"
                  />
                </div>
                
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="saving"
                  >
                    {{ saving ? '保存中...' : '保存修改' }}
                  </button>
                </div>
              </form>
            </div>
            
            <!-- 修改密码 -->
            <div v-else-if="activeTab === 'password'">
              <h2 class="text-xl font-bold mb-6">修改密码</h2>
              
              <div v-if="message.text" class="mb-6 p-4 rounded-md" :class="message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ message.text }}
              </div>
              
              <form @submit.prevent="changePassword">
                <div class="form-group mb-4">
                  <label for="currentPassword" class="block text-gray-700 mb-2 font-medium">当前密码</label>
                  <input
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div class="form-group mb-4">
                  <label for="newPassword" class="block text-gray-700 mb-2 font-medium">新密码</label>
                  <input
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p class="text-sm text-gray-500 mt-1">密码长度至少8位，建议包含字母、数字和特殊字符</p>
                </div>
                
                <div class="form-group mb-6">
                  <label for="confirmPassword" class="block text-gray-700 mb-2 font-medium">确认新密码</label>
                  <input
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="saving"
                  >
                    {{ saving ? '修改中...' : '修改密码' }}
                  </button>
                </div>
              </form>
            </div>
            
            <!-- 头像设置 -->
            <div v-else-if="activeTab === 'avatar'">
              <h2 class="text-xl font-bold mb-6">头像设置</h2>
              
              <div v-if="message.text" class="mb-6 p-4 rounded-md" :class="message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ message.text }}
              </div>
              
              <div class="flex flex-col items-center justify-center mb-6">
                <div class="relative mb-4">
                  <img
                    :src="previewAvatar || user.avatar || '/images/default-avatar.svg'"
                    alt="用户头像"
                    class="w-32 h-32 rounded-full border-4 border-gray-200"
                  />
                </div>
                
                <div class="flex space-x-4">
                  <label class="btn btn-outline cursor-pointer">
                    选择图片
                    <input type="file" class="hidden" accept="image/*" @change="handleAvatarChange" />
                  </label>
                  
                  <button v-if="previewAvatar" @click="previewAvatar = null" class="btn btn-outline text-red-600 border-red-600 hover:bg-red-50">
                    取消
                  </button>
                </div>
              </div>
              
              <div class="mb-4 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                <ul class="list-disc list-inside space-y-1">
                  <li>支持 JPG、PNG、GIF 格式，文件大小不超过 2MB</li>
                  <li>请上传清晰的正面照片，避免使用含有不良信息的图片</li>
                  <li>头像会自动裁剪为正方形</li>
                </ul>
              </div>
              
              <div v-if="previewAvatar" class="flex justify-end">
                <button
                  @click="uploadAvatar"
                  class="btn btn-primary"
                  :disabled="saving"
                >
                  {{ saving ? '上传中...' : '保存头像' }}
                </button>
              </div>
            </div>
            
            <!-- 通知设置 -->
            <div v-else-if="activeTab === 'notifications'">
              <h2 class="text-xl font-bold mb-6">通知设置</h2>
              
              <div v-if="message.text" class="mb-6 p-4 rounded-md" :class="message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ message.text }}
              </div>
              
              <form @submit.prevent="saveNotifications">
                <div class="space-y-4 mb-6">
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="notify_replies"
                        v-model="notificationForm.notifyReplies"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3">
                      <label for="notify_replies" class="font-medium text-gray-700">回复通知</label>
                      <p class="text-gray-500 text-sm">当有人回复我的话题时通知我</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="notify_mentions"
                        v-model="notificationForm.notifyMentions"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3">
                      <label for="notify_mentions" class="font-medium text-gray-700">提及通知</label>
                      <p class="text-gray-500 text-sm">当有人在话题中@我时通知我</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="notify_likes"
                        v-model="notificationForm.notifyLikes"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3">
                      <label for="notify_likes" class="font-medium text-gray-700">点赞通知</label>
                      <p class="text-gray-500 text-sm">当有人点赞我的话题或回复时通知我</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="notify_system"
                        v-model="notificationForm.notifySystem"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div class="ml-3">
                      <label for="notify_system" class="font-medium text-gray-700">系统通知</label>
                      <p class="text-gray-500 text-sm">接收系统公告和活动通知</p>
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="saving"
                  >
                    {{ saving ? '保存中...' : '保存设置' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

// 用户相关
const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.getUser || {})

// 标签页
const tabs = [
  { id: 'profile', name: '个人资料' },
  { id: 'password', name: '修改密码' },
  { id: 'avatar', name: '头像设置' },
  { id: 'notifications', name: '通知设置' }
]
const activeTab = ref('profile')

// 表单数据
const profileForm = reactive({
  username: '',
  email: '',
  bio: '',
  location: '',
  website: '',
  github: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notificationForm = reactive({
  notifyReplies: true,
  notifyMentions: true,
  notifyLikes: true,
  notifySystem: true
})

// 头像预览
const previewAvatar = ref(null)

// 状态
const saving = ref(false)
const message = reactive({
  text: '',
  type: ''
})

// 初始化表单数据
const initFormData = () => {
  if (user.value) {
    profileForm.username = user.value.username || ''
    profileForm.email = user.value.email || ''
    profileForm.bio = user.value.bio || ''
    profileForm.location = user.value.location || ''
    profileForm.website = user.value.website || ''
    profileForm.github = user.value.github || ''
    
    // 通知设置
    if (user.value.notifications) {
      notificationForm.notifyReplies = user.value.notifications.notifyReplies !== false
      notificationForm.notifyMentions = user.value.notifications.notifyMentions !== false
      notificationForm.notifyLikes = user.value.notifications.notifyLikes !== false
      notificationForm.notifySystem = user.value.notifications.notifySystem !== false
    }
  }
}

// 保存个人资料
const saveProfile = async () => {
  if (saving.value) return
  
  saving.value = true
  message.text = ''
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里假设成功，实际项目应该调用API
    message.text = '个人资料已更新'
    message.type = 'success'
    
    // 更新本地用户数据
    // 实际项目中应该在API请求成功后更新
  } catch (err) {
    message.text = '更新个人资料失败，请稍后再试'
    message.type = 'error'
    console.error('Failed to save profile:', err)
  } finally {
    saving.value = false
  }
}

// 修改密码
const changePassword = async () => {
  if (saving.value) return
  
  // 表单验证
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.text = '两次输入的密码不一致'
    message.type = 'error'
    return
  }
  
  if (passwordForm.newPassword.length < 8) {
    message.text = '新密码至少需要8个字符'
    message.type = 'error'
    return
  }
  
  saving.value = true
  message.text = ''
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里假设成功，实际项目应该调用API
    message.text = '密码已成功修改'
    message.type = 'success'
    
    // 清空表单
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (err) {
    message.text = '修改密码失败，请确认当前密码是否正确'
    message.type = 'error'
    console.error('Failed to change password:', err)
  } finally {
    saving.value = false
  }
}

// 处理头像上传
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 检查文件类型
  if (!file.type.match(/image\/(jpeg|png|gif)/)) {
    message.text = '请上传 JPG、PNG 或 GIF 格式的图片'
    message.type = 'error'
    return
  }
  
  // 检查文件大小
  if (file.size > 2 * 1024 * 1024) {
    message.text = '图片大小不能超过 2MB'
    message.type = 'error'
    return
  }
  
  // 创建预览
  const reader = new FileReader()
  reader.onload = (e) => {
    previewAvatar.value = e.target.result
  }
  reader.readAsDataURL(file)
  
  message.text = ''
}

// 上传头像
const uploadAvatar = async () => {
  if (saving.value || !previewAvatar.value) return
  
  saving.value = true
  message.text = ''
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 这里假设成功，实际项目应该调用API
    message.text = '头像已成功更新'
    message.type = 'success'
    
    // 更新本地用户数据
    // 实际项目中应该在API请求成功后更新
    previewAvatar.value = null
  } catch (err) {
    message.text = '上传头像失败，请稍后再试'
    message.type = 'error'
    console.error('Failed to upload avatar:', err)
  } finally {
    saving.value = false
  }
}

// 保存通知设置
const saveNotifications = async () => {
  if (saving.value) return
  
  saving.value = true
  message.text = ''
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 这里假设成功，实际项目应该调用API
    message.text = '通知设置已保存'
    message.type = 'success'
    
    // 更新本地用户数据
    // 实际项目中应该在API请求成功后更新
  } catch (err) {
    message.text = '保存通知设置失败，请稍后再试'
    message.type = 'error'
    console.error('Failed to save notification settings:', err)
  } finally {
    saving.value = false
  }
}

// 监听标签页变化，清除消息
watch(activeTab, () => {
  message.text = ''
})

// 页面加载时获取数据
onMounted(async () => {
  if (!isLoggedIn.value) {
    await userStore.fetchCurrentUser()
  }
  
  initFormData()
})

// 设置页面标题
useHead({
  title: '账号设置 - EastHome社区'
})
</script> 