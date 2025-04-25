# EastHome社区API接口文档

本文档详细列出了EastHome社区前端所需的所有API接口。

## 目录

- [1. 用户认证](#1-用户认证)
- [2. 用户管理](#2-用户管理)
- [3. 社区话题](#3-社区话题)
- [4. 回帖管理](#4-回帖管理)
- [5. 点赞和收藏](#5-点赞和收藏)
- [6. 统计数据](#6-统计数据)

## 基础信息

- **基础URL**: `/api`
- **认证方式**: Bearer Token
- **响应格式**: JSON

所有需要认证的接口，需要在请求头中添加：
```
Authorization: Bearer ${token}
```

响应格式统一为：
```json
{
  "success": true/false,
  "data": {}, // 请求成功时返回的数据
  "message": "", // 请求失败时的错误信息
  "code": 200 // 状态码
}
```

## 1. 用户认证

### 1.1 用户注册

- **URL**: `/auth/register`
- **方法**: POST
- **认证**: 不需要

**请求参数**:

```json
{
  "username": "用户名",
  "email": "电子邮箱",
  "password": "密码"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "用户ID",
      "username": "用户名",
      "email": "电子邮箱",
      "level": "bronze", // 初始会员等级
      "createdAt": "2023-01-01T00:00:00Z"
    },
    "token": "JWT令牌"
  }
}
```

### 1.2 用户登录

- **URL**: `/auth/login`
- **方法**: POST
- **认证**: 不需要

**请求参数**:

```json
{
  "username": "用户名",
  "password": "密码",
  "remember": true // 是否记住登录状态
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "用户ID",
      "username": "用户名",
      "email": "电子邮箱",
      "avatar": "头像URL",
      "bio": "个人简介",
      "level": "会员等级",
      "createdAt": "注册时间"
    },
    "token": "JWT令牌"
  }
}
```

### 1.3 退出登录

- **URL**: `/auth/logout`
- **方法**: POST
- **认证**: 需要

**请求参数**: 无

**响应**:

```json
{
  "success": true,
  "message": "退出成功"
}
```

### 1.4 忘记密码

- **URL**: `/auth/forgot-password`
- **方法**: POST
- **认证**: 不需要

**请求参数**:

```json
{
  "email": "电子邮箱"
}
```

**响应**:

```json
{
  "success": true,
  "message": "重置密码链接已发送到您的邮箱"
}
```

### 1.5 重置密码

- **URL**: `/auth/reset-password`
- **方法**: POST
- **认证**: 不需要

**请求参数**:

```json
{
  "token": "重置密码令牌",
  "password": "新密码",
  "confirmPassword": "确认新密码"
}
```

**响应**:

```json
{
  "success": true,
  "message": "密码重置成功"
}
```

## 2. 用户管理

### 2.1 获取当前用户信息

- **URL**: `/user/me`
- **方法**: GET
- **认证**: 需要

**响应**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "用户ID",
      "username": "用户名",
      "email": "电子邮箱",
      "avatar": "头像URL",
      "bio": "个人简介",
      "level": "会员等级",
      "location": "所在地",
      "website": "个人网站",
      "github": "GitHub用户名",
      "createdAt": "注册时间",
      "notifications": {
        "notifyReplies": true,
        "notifyMentions": true,
        "notifyLikes": true,
        "notifySystem": true
      }
    }
  }
}
```

### 2.2 更新用户资料

- **URL**: `/user/profile`
- **方法**: PUT
- **认证**: 需要

**请求参数**:

```json
{
  "email": "电子邮箱",
  "bio": "个人简介",
  "location": "所在地",
  "website": "个人网站",
  "github": "GitHub用户名"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "用户ID",
      "username": "用户名",
      "email": "电子邮箱",
      "bio": "个人简介",
      "location": "所在地",
      "website": "个人网站",
      "github": "GitHub用户名"
    }
  }
}
```

### 2.3 修改密码

- **URL**: `/user/change-password`
- **方法**: PUT
- **认证**: 需要

**请求参数**:

```json
{
  "currentPassword": "当前密码",
  "newPassword": "新密码",
  "confirmPassword": "确认新密码"
}
```

**响应**:

```json
{
  "success": true,
  "message": "密码修改成功"
}
```

### 2.4 上传头像

- **URL**: `/user/avatar`
- **方法**: POST
- **认证**: 需要
- **内容类型**: multipart/form-data

**请求参数**:

```
avatar: [文件]
```

**响应**:

```json
{
  "success": true,
  "data": {
    "avatar": "头像URL"
  }
}
```

### 2.5 更新通知设置

- **URL**: `/user/notifications`
- **方法**: PUT
- **认证**: 需要

**请求参数**:

```json
{
  "notifyReplies": true, // 回复通知
  "notifyMentions": true, // 提及通知
  "notifyLikes": true, // 点赞通知
  "notifySystem": true // 系统通知
}
```

**响应**:

```json
{
  "success": true,
  "message": "通知设置已更新"
}
```

### 2.6 获取用户统计数据

- **URL**: `/user/stats`
- **方法**: GET
- **认证**: 需要

**响应**:

```json
{
  "success": true,
  "data": {
    "topicCount": 15, // 发布话题数
    "replyCount": 48, // 回复数
    "likeCount": 126, // 获得点赞数
    "viewCount": 2345, // 话题被浏览总数
    "levelProgress": 75 // 当前等级完成度(百分比)
  }
}
```

### 2.7 获取用户等级信息

- **URL**: `/user/level`
- **方法**: GET
- **认证**: 需要

**响应**:

```json
{
  "success": true,
  "data": {
    "currentLevel": "silver", // 当前等级
    "nextLevel": "gold", // 下一等级
    "progress": 45, // 升级进度(百分比)
    "requirements": {
      "topics": {
        "required": 15,
        "current": 8
      },
      "likes": {
        "required": 50,
        "current": 26
      }
    }
  }
}
```

## 3. 社区话题

### 3.1 获取话题分类

- **URL**: `/community/categories`
- **方法**: GET
- **认证**: 不需要

**响应**:

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "前端开发",
        "count": 128
      },
      {
        "id": 2,
        "name": "后端开发",
        "count": 97
      },
      // 更多分类...
    ]
  }
}
```

### 3.2 获取话题列表

- **URL**: `/community/topics`
- **方法**: GET
- **认证**: 不需要

**查询参数**:

- `page`: 页码，默认值1
- `perPage`: 每页数量，默认值20
- `categoryId`: 分类ID，可选
- `tags`: 标签，多个用逗号分隔，可选
- `sortBy`: 排序方式，可选值：latest(最新)、popular(最多浏览)、replies(最多回复)、likes(最多点赞)

**响应**:

```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": 1,
        "title": "话题标题",
        "summary": "话题摘要",
        "tags": ["JavaScript", "Vue", "前端"],
        "createdAt": "2023-04-15T12:00:00Z",
        "author": {
          "id": 1,
          "username": "作者用户名",
          "avatar": "头像URL",
          "level": "gold"
        },
        "category": {
          "id": 1,
          "name": "前端开发"
        },
        "viewCount": 1245,
        "likeCount": 145,
        "replyCount": 32
      },
      // 更多话题...
    ],
    "total": 1024, // 总话题数
    "page": 1,
    "perPage": 20,
    "totalPages": 52
  }
}
```

### 3.3 获取特定分类下的话题

- **URL**: `/community/categories/:categoryId/topics`
- **方法**: GET
- **认证**: 不需要

**查询参数**:

- `page`: 页码，默认值1
- `perPage`: 每页数量，默认值20
- `sortBy`: 排序方式，同3.2

**响应**: 同3.2

### 3.4 获取话题详情

- **URL**: `/community/topics/:id`
- **方法**: GET
- **认证**: 不需要

**响应**:

```json
{
  "success": true,
  "data": {
    "topic": {
      "id": 1,
      "title": "话题标题",
      "content": "话题内容，支持HTML",
      "summary": "话题摘要",
      "tags": ["JavaScript", "Vue", "前端"],
      "createdAt": "2023-04-15T12:00:00Z",
      "updatedAt": "2023-04-15T12:00:00Z",
      "author": {
        "id": 1,
        "username": "作者用户名",
        "avatar": "头像URL",
        "level": "gold"
      },
      "category": {
        "id": 1,
        "name": "前端开发"
      },
      "viewCount": 1245,
      "likeCount": 145,
      "replyCount": 32,
      "isLiked": false // 当前用户是否已点赞
    }
  }
}
```

### 3.5 创建话题

- **URL**: `/community/topics`
- **方法**: POST
- **认证**: 需要

**请求参数**:

```json
{
  "title": "话题标题",
  "content": "话题内容",
  "summary": "话题摘要",
  "categoryId": 1,
  "tags": ["JavaScript", "Vue", "前端"],
  "isOriginal": true
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "topic": {
      "id": 1,
      "title": "话题标题",
      "content": "话题内容",
      "summary": "话题摘要",
      "tags": ["JavaScript", "Vue", "前端"],
      "categoryId": 1,
      "createdAt": "2023-04-15T12:00:00Z"
    }
  }
}
```

### 3.6 更新话题

- **URL**: `/community/topics/:id`
- **方法**: PUT
- **认证**: 需要

**请求参数**:

```json
{
  "title": "更新的标题",
  "content": "更新的内容",
  "summary": "更新的摘要",
  "categoryId": 1,
  "tags": ["JavaScript", "Vue", "前端"],
  "isOriginal": true
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "topic": {
      "id": 1,
      "title": "更新的标题",
      "content": "更新的内容",
      "summary": "更新的摘要",
      "tags": ["JavaScript", "Vue", "前端"],
      "categoryId": 1,
      "updatedAt": "2023-04-16T12:00:00Z"
    }
  }
}
```

### 3.7 删除话题

- **URL**: `/community/topics/:id`
- **方法**: DELETE
- **认证**: 需要

**响应**:

```json
{
  "success": true,
  "message": "话题已删除"
}
```

### 3.8 获取用户的话题

- **URL**: `/user/topics`
- **方法**: GET
- **认证**: 需要

**查询参数**:

- `page`: 页码，默认值1
- `perPage`: 每页数量，默认值20

**响应**:

```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": 1,
        "title": "话题标题",
        "summary": "话题摘要",
        "createdAt": "2023-04-15T12:00:00Z",
        "category": {
          "id": 1,
          "name": "前端开发"
        },
        "viewCount": 1245,
        "likeCount": 145,
        "replyCount": 32
      },
      // 更多话题...
    ],
    "total": 15, // 用户话题总数
    "page": 1,
    "perPage": 20,
    "totalPages": 1
  }
}
```

### 3.9 获取热门标签

- **URL**: `/community/tags`
- **方法**: GET
- **认证**: 不需要

**查询参数**:

- `limit`: 返回数量，默认值20

**响应**:

```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": 1,
        "name": "JavaScript",
        "count": 128
      },
      {
        "id": 2,
        "name": "Vue",
        "count": 97
      },
      // 更多标签...
    ]
  }
}
```

## 4. 回帖管理

### 4.1 获取话题回帖

- **URL**: `/community/topics/:topicId/posts`
- **方法**: GET
- **认证**: 不需要

**查询参数**:

- `page`: 页码，默认值1
- `perPage`: 每页数量，默认值20
- `sortBy`: 排序方式，可选值：newest(最新)、oldest(最旧)、likes(最多点赞)

**响应**:

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "content": "回帖内容，支持HTML",
        "createdAt": "2023-04-15T12:30:00Z",
        "author": {
          "id": 2,
          "username": "回帖者用户名",
          "avatar": "头像URL",
          "level": "silver"
        },
        "likes": 42,
        "isLiked": false // 当前用户是否已点赞
      },
      // 更多回帖...
    ],
    "total": 32, // 总回帖数
    "page": 1,
    "perPage": 20,
    "totalPages": 2
  }
}
```

### 4.2 发表回帖

- **URL**: `/community/topics/:topicId/posts`
- **方法**: POST
- **认证**: 需要

**请求参数**:

```json
{
  "content": "回帖内容，支持HTML"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "post": {
      "id": 33,
      "content": "回帖内容，支持HTML",
      "createdAt": "2023-04-16T09:15:00Z",
      "author": {
        "id": 5,
        "username": "当前用户名",
        "avatar": "头像URL",
        "level": "bronze"
      },
      "likes": 0,
      "isLiked": false
    }
  }
}
```

### 4.3 更新回帖

- **URL**: `/community/topics/:topicId/posts/:id`
- **方法**: PUT
- **认证**: 需要

**请求参数**:

```json
{
  "content": "更新后的回帖内容"
}
```

**响应**:

```json
{
  "success": true,
  "data": {
    "post": {
      "id": 33,
      "content": "更新后的回帖内容",
      "updatedAt": "2023-04-16T09:20:00Z"
    }
  }
}
```

### 4.4 删除回帖

- **URL**: `/community/topics/:topicId/posts/:id`
- **方法**: DELETE
- **认证**: 需要

**响应**:

```json
{
  "success": true,
  "message": "回帖已删除"
}
```

### 4.5 获取用户的所有回帖

- **URL**: `/user/posts`
- **方法**: GET
- **认证**: 需要

**查询参数**:

- `page`: 页码，默认值1
- `perPage`: 每页数量，默认值20

**响应**:

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 33,
        "content": "回帖内容，支持HTML",
        "createdAt": "2023-04-16T09:15:00Z",
        "topic": {
          "id": 1,
          "title": "话题标题"
        },
        "likes": 3
      },
      // 更多回帖...
    ],
    "total": 48, // 用户回帖总数
    "page": 1,
    "perPage": 20,
    "totalPages": 3
  }
}
```

## 5. 点赞和收藏

### 5.1 话题点赞

- **URL**: `/community/topics/:id/like`
- **方法**: POST
- **认证**: 需要

**响应**:

```json
{
  "success": true,
  "data": {
    "liked": true, // true为点赞，false为取消点赞
    "likesCount": 146 // 更新后的点赞数
  }
}
```

### 5.2 回帖点赞

- **URL**: `/community/posts/:id/like`
- **方法**: POST
- **认证**: 需要

**响应**:

```json
{
  "success": true,
  "data": {
    "liked": true, // true为点赞，false为取消点赞
    "likesCount": 43 // 更新后的点赞数
  }
}
```

### 5.3 收藏话题

- **URL**: `/community/topics/:id/favorite`
- **方法**: POST
- **认证**: 需要

**响应**:

```json
{
  "success": true,
  "data": {
    "favorited": true, // true为收藏，false为取消收藏
    "favoritesCount": 85 // 更新后的收藏数
  }
}
```

### 5.4 获取收藏的话题

- **URL**: `/user/favorites`
- **方法**: GET
- **认证**: 需要

**查询参数**:

- `page`: 页码，默认值1
- `perPage`: 每页数量，默认值20

**响应**:

```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": 1,
        "title": "话题标题",
        "summary": "话题摘要",
        "createdAt": "2023-04-15T12:00:00Z",
        "author": {
          "id": 1,
          "username": "作者用户名",
          "avatar": "头像URL"
        },
        "viewCount": 1245,
        "likeCount": 145,
        "replyCount": 32
      },
      // 更多话题...
    ],
    "total": 24, // 收藏话题总数
    "page": 1,
    "perPage": 20,
    "totalPages": 2
  }
}
```

## 6. 统计数据

### 6.1 获取社区统计数据

- **URL**: `/community/stats`
- **方法**: GET
- **认证**: 不需要

**响应**:

```json
{
  "success": true,
  "data": {
    "topicCount": 1024, // 话题总数
    "userCount": 512, // 用户总数
    "postCount": 8754, // 回帖总数
    "todayTopics": 32, // 今日新增话题
    "todayUsers": 16, // 今日新增用户
    "todayPosts": 128 // 今日新增回帖
  }
}
```

### 6.2 获取活跃用户

- **URL**: `/community/activeUsers`
- **方法**: GET
- **认证**: 不需要

**查询参数**:

- `limit`: 返回数量，默认值10

**响应**:

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "username": "活跃用户1",
        "avatar": "头像URL",
        "level": "diamond",
        "topicCount": 86,
        "replyCount": 215
      },
      // 更多用户...
    ]
  }
}
```

### 6.3 获取热门话题

- **URL**: `/community/hotTopics`
- **方法**: GET
- **认证**: 不需要

**查询参数**:

- `limit`: 返回数量，默认值5
- `period`: 时间段，可选值：day(今日)、week(本周)、month(本月)，默认值week

**响应**:

```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": 1,
        "title": "热门话题标题",
        "viewCount": 1245,
        "likeCount": 145,
        "replyCount": 32,
        "author": {
          "id": 1,
          "username": "作者用户名",
          "avatar": "头像URL"
        }
      },
      // 更多话题...
    ]
  }
}
```

---

## 错误码

| 状态码 | 错误码      | 描述                       |
|------|--------------|---------------------------|
| 400  | BAD_REQUEST  | 请求参数错误                |
| 401  | UNAUTHORIZED | 未授权或token失效          |
| 403  | FORBIDDEN    | 权限不足                   |
| 404  | NOT_FOUND    | 资源未找到                 |
| 409  | CONFLICT     | 资源冲突(如用户名已存在)   |
| 422  | VALIDATION   | 数据验证失败               |
| 500  | SERVER_ERROR | 服务器内部错误             | 