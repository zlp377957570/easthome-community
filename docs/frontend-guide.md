# EastHome社区前端开发指南

## 目录

- [1. 项目概述](#1-项目概述)
- [2. 技术栈](#2-技术栈)
- [3. 项目结构](#3-项目结构)
- [4. 开发流程](#4-开发流程)
- [5. 页面组件说明](#5-页面组件说明)
- [6. 状态管理](#6-状态管理)
- [7. API接口](#7-api接口)
- [8. 样式开发](#8-样式开发)
- [9. 部署流程](#9-部署流程)

## 1. 项目概述

EastHome社区是一个面向开发者的交流平台，提供话题发布、回复、用户管理等功能。前端基于Nuxt 3构建，采用现代化的开发工具和技术栈，提供流畅的用户体验和响应式设计。

### 核心功能

- 用户认证与授权
- 用户资料管理
- 社区话题发布与管理
- 话题回复系统
- 点赞与收藏
- 会员等级系统
- 通知系统

## 2. 技术栈

- **框架**: [Nuxt 3](https://nuxt.com/) (Vue 3 + Vite)
- **UI框架**: [TailwindCSS](https://tailwindcss.com/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **路由**: Nuxt内置路由
- **HTTP客户端**: [Nuxt Fetch](https://nuxt.com/docs/api/composables/use-fetch) + [Axios](https://axios-http.com/)
- **表单验证**: [Vee-Validate](https://vee-validate.logaretm.com/v4/)
- **富文本编辑器**: [TipTap](https://tiptap.dev/)
- **图表**: [Chart.js](https://www.chartjs.org/) + [Vue-Chartjs](https://vue-chartjs.org/)
- **日期处理**: [Day.js](https://day.js.org/)
- **国际化**: [Nuxt I18n](https://i18n.nuxtjs.org/)

## 3. 项目结构

```
easthome-community/
├── assets/              # 静态资源(图片、字体等)
├── components/          # 可复用组件
│   ├── common/          # 通用组件
│   ├── layout/          # 布局组件
│   ├── auth/            # 认证相关组件
│   ├── user/            # 用户相关组件
│   ├── community/       # 社区相关组件
│   └── ui/              # UI组件
├── composables/         # 可复用的Composition API
├── layouts/             # 布局模板
├── middleware/          # 路由中间件
├── pages/               # 页面组件(基于文件的路由)
│   ├── index.vue        # 首页
│   ├── login.vue        # 登录页
│   ├── register.vue     # 注册页
│   ├── community/       # 社区相关页面
│   └── user/            # 用户相关页面
├── plugins/             # 全局插件
├── public/              # 公共静态资源
├── server/              # 服务端相关代码(API路由、中间件等)
├── stores/              # Pinia状态管理
├── utils/               # 工具函数
├── app.vue              # 应用入口组件
├── nuxt.config.ts       # Nuxt配置文件
├── tailwind.config.js   # Tailwind配置文件
└── tsconfig.json        # TypeScript配置
```

## 4. 开发流程

### 4.1 环境要求

- Node.js >= 18.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 4.2 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 运行ESLint检查
npm run lint

# 运行TypeScript类型检查
npm run typecheck
```

### 4.3 Git工作流

1. **分支命名规范**:
   - 功能分支: `feature/功能名称`
   - Bug修复: `fix/问题描述`
   - 重构: `refactor/内容`
   - 文档: `docs/内容`

2. **提交信息规范**:
   - feat: 新功能
   - fix: 修复bug
   - docs: 文档变更
   - style: 样式变更(不影响代码逻辑)
   - refactor: 重构
   - perf: 性能优化
   - test: 测试相关
   - chore: 构建过程或辅助工具变更

### 4.4 代码规范

项目使用ESLint和Prettier进行代码格式化和规范检查，请确保在提交代码前运行检查:

```bash
npm run lint
```

## 5. 页面组件说明

### 5.1 首页 (`pages/index.vue`)

首页展示热门话题、社区统计数据和活跃用户，是用户了解社区动态的入口。

**主要组件**:
- `<HotTopics>`: 展示热门话题列表
- `<CommunityStats>`: 展示社区统计数据
- `<ActiveUsers>`: 展示活跃用户列表

### 5.2 社区话题列表 (`pages/community/index.vue`)

展示所有社区话题，支持分类、标签筛选和多种排序方式。

**主要组件**:
- `<TopicFilters>`: 话题筛选器
- `<TopicList>`: 话题列表
- `<CategorySidebar>`: 分类侧边栏
- `<TagCloud>`: 标签云

### 5.3 话题详情 (`pages/community/topics/[id].vue`)

展示话题详情和回复列表，支持发表回复和点赞功能。

**主要组件**:
- `<TopicDetail>`: 话题详情
- `<PostList>`: 回复列表
- `<PostForm>`: 回复表单

### 5.4 用户资料 (`pages/user/profile.vue`)

展示用户基本信息、发布的话题和回复。

**主要组件**:
- `<UserInfo>`: 用户基本信息
- `<UserStats>`: 用户统计数据
- `<UserTopics>`: 用户发布的话题
- `<UserPosts>`: 用户的回复

### 5.5 用户设置 (`pages/user/settings.vue`)

用户设置页，包括个人资料、账户、密码和通知设置。

**主要组件**:
- `<ProfileSettings>`: 个人资料设置
- `<AccountSettings>`: 账户设置
- `<PasswordSettings>`: 密码设置
- `<NotificationSettings>`: 通知设置

## 6. 状态管理

项目使用Pinia进行状态管理，主要包含以下几个Store:

### 6.1 用户认证 (`stores/auth.ts`)

管理用户登录状态、权限和令牌。

**主要状态**:
- `isAuthenticated`: 用户是否已认证
- `user`: 当前用户信息
- `token`: JWT令牌

**主要操作**:
- `login`: 用户登录
- `register`: 用户注册
- `logout`: 退出登录
- `fetchCurrentUser`: 获取当前用户信息

### 6.2 社区 (`stores/community.ts`)

管理社区话题、分类和标签。

**主要状态**:
- `topics`: 话题列表
- `categories`: 分类列表
- `tags`: 标签列表

**主要操作**:
- `fetchTopics`: 获取话题列表
- `fetchCategories`: 获取分类列表
- `fetchTags`: 获取标签列表
- `createTopic`: 创建话题
- `updateTopic`: 更新话题

### 6.3 用户 (`stores/user.ts`)

管理用户相关数据。

**主要状态**:
- `profile`: 用户资料
- `statistics`: 用户统计数据
- `favorites`: 收藏的话题

**主要操作**:
- `fetchProfile`: 获取用户资料
- `updateProfile`: 更新用户资料
- `fetchStatistics`: 获取用户统计数据
- `fetchFavorites`: 获取收藏的话题

## 7. API接口

API接口文档请参考 [API接口文档](./api.md)。

### 7.1 API调用示例

```typescript
// 使用Nuxt内置的useFetch
const { data, error } = await useFetch('/api/community/topics', {
  method: 'GET',
  params: {
    page: 1,
    perPage: 20,
    categoryId: 1
  }
})

// 使用自定义useAPI composable
const { data, error, loading } = await useAPI('/community/topics', {
  method: 'GET',
  params: {
    page: 1,
    perPage: 20
  }
})

// 使用Pinia store中的action
const communityStore = useCommunityStore()
await communityStore.fetchTopics({
  page: 1,
  perPage: 20,
  categoryId: 1
})
```

## 8. 样式开发

### 8.1 TailwindCSS

项目使用TailwindCSS进行样式开发，支持响应式设计和暗黑模式。

**配置文件**: `tailwind.config.js`

```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ...其他主题色阶
          900: '#0c4a6e',
        },
        secondary: {
          // ...次级主题色
        }
      },
      // ...其他自定义配置
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

### 8.2 SCSS变量

对于需要复用的变量，在`assets/scss/variables.scss`中定义:

```scss
// 主题色
$primary-color: #3b82f6;
$secondary-color: #6b7280;
$success-color: #10b981;
$warning-color: #f59e0b;
$danger-color: #ef4444;

// 字体
$font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;

// 断点
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

### 8.3 组件样式

组件样式应遵循以下原则:

1. 优先使用Tailwind类名
2. 对于复杂组件，使用`<style lang="scss" scoped>`
3. 保持一致的命名规范和层级结构

## 9. 部署流程

### 9.1 构建步骤

```bash
# 安装依赖
npm ci

# 构建生产版本
npm run build

# 生成静态文件(如果使用SSG)
npm run generate
```

### 9.2 部署到服务器

1. **服务器要求**:
   - Node.js >= 18.0.0
   - PM2或其他进程管理器

2. **部署命令**:
```bash
# 上传构建产物到服务器
scp -r .output user@server:/path/to/deployment

# 使用PM2启动
pm2 start npm --name "easthome-community" -- start
```

### 9.3 使用Docker部署

项目根目录包含`Dockerfile`和`docker-compose.yml`文件，可以使用Docker部署:

```bash
# 构建镜像
docker build -t easthome-community .

# 启动容器
docker-compose up -d
```

---

## 开发规范和建议

1. **组件开发**:
   - 保持组件的单一职责
   - 使用TypeScript定义props和emits
   - 使用Composition API进行组件逻辑开发

2. **性能优化**:
   - 使用`defineAsyncComponent`懒加载大型组件
   - 使用`v-memo`优化列表渲染
   - 合理使用`keepAlive`缓存组件

3. **可访问性**:
   - 确保所有交互元素都可通过键盘访问
   - 为图片提供alt文本
   - 使用语义化HTML标签

4. **错误处理**:
   - 使用全局错误处理器捕获未处理的异常
   - 为API请求添加适当的错误处理逻辑
   - 提供用户友好的错误提示 