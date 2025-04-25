import { defineStore } from 'pinia'
import axios from 'axios'

export const useCommunityStore = defineStore('community', {
  state: () => ({
    categories: [],
    topics: [],
    currentTopic: null,
    posts: [],
    loading: false,
    error: null,
    totalTopics: 0,
    currentPage: 1,
    perPage: 20
  }),
  
  getters: {
    getCategories: (state) => state.categories,
    getTopics: (state) => state.topics,
    getCurrentTopic: (state) => state.currentTopic,
    getPosts: (state) => state.posts,
    hasNextPage: (state) => state.topics.length < state.totalTopics
  },
  
  actions: {
    // 获取所有分类
    async fetchCategories() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('/api/community/categories')
        
        if (response.data.success) {
          this.categories = response.data.categories
        } else {
          this.error = response.data.message || '获取分类失败'
        }
      } catch (error) {
        this.error = error.response?.data?.message || '获取分类时发生错误'
      } finally {
        this.loading = false
      }
    },
    
    // 获取话题列表
    async fetchTopics(categoryId = null, page = 1) {
      this.loading = true
      this.error = null
      this.currentPage = page
      
      try {
        const url = categoryId 
          ? `/api/community/categories/${categoryId}/topics?page=${page}&perPage=${this.perPage}`
          : `/api/community/topics?page=${page}&perPage=${this.perPage}`
          
        const response = await axios.get(url)
        
        if (response.data.success) {
          this.topics = response.data.topics
          this.totalTopics = response.data.total
        } else {
          this.error = response.data.message || '获取话题列表失败'
        }
      } catch (error) {
        this.error = error.response?.data?.message || '获取话题列表时发生错误'
      } finally {
        this.loading = false
      }
    },
    
    // 加载下一页
    async loadMoreTopics(categoryId = null) {
      if (this.loading || !this.hasNextPage) return
      
      this.currentPage++
      this.loading = true
      
      try {
        const url = categoryId 
          ? `/api/community/categories/${categoryId}/topics?page=${this.currentPage}&perPage=${this.perPage}`
          : `/api/community/topics?page=${this.currentPage}&perPage=${this.perPage}`
          
        const response = await axios.get(url)
        
        if (response.data.success) {
          this.topics = [...this.topics, ...response.data.topics]
        } else {
          this.error = response.data.message || '加载更多话题失败'
        }
      } catch (error) {
        this.error = error.response?.data?.message || '加载更多话题时发生错误'
      } finally {
        this.loading = false
      }
    },
    
    // 获取指定话题详情
    async fetchTopic(topicId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`/api/community/topics/${topicId}`)
        
        if (response.data.success) {
          this.currentTopic = response.data.topic
        } else {
          this.error = response.data.message || '获取话题详情失败'
        }
      } catch (error) {
        this.error = error.response?.data?.message || '获取话题详情时发生错误'
      } finally {
        this.loading = false
      }
    },
    
    // 获取话题的所有回帖
    async fetchPosts(topicId, page = 1) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`/api/community/topics/${topicId}/posts?page=${page}&perPage=${this.perPage}`)
        
        if (response.data.success) {
          this.posts = response.data.posts
        } else {
          this.error = response.data.message || '获取回帖失败'
        }
      } catch (error) {
        this.error = error.response?.data?.message || '获取回帖时发生错误'
      } finally {
        this.loading = false
      }
    },
    
    // 创建新话题
    async createTopic(topicData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/community/topics', topicData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.data.success) {
          // 如果创建成功，返回新话题数据
          return response.data.topic
        } else {
          this.error = response.data.message || '创建话题失败'
          return null
        }
      } catch (error) {
        this.error = error.response?.data?.message || '创建话题时发生错误'
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 创建回帖
    async createPost(topicId, content) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post(`/api/community/topics/${topicId}/posts`, { content }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.data.success) {
          // 添加新回帖到列表
          this.posts.push(response.data.post)
          return response.data.post
        } else {
          this.error = response.data.message || '创建回帖失败'
          return null
        }
      } catch (error) {
        this.error = error.response?.data?.message || '创建回帖时发生错误'
        return null
      } finally {
        this.loading = false
      }
    }
  }
}) 