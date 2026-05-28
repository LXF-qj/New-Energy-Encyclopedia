import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
})

// 获取能源列表
export const getEnergyList = () => api.get('/lxfdata')

// 获取单个能源详情
export const getEnergyDetail = (id) => api.get(`/lxfdata/${id}`)

// 按分类获取能源
export const getEnergyByCategory = (category) => api.get('/lxfdata', { params: { category } })

// 搜索能源
export const searchEnergy = (keyword) => api.get('/lxfdata', { params: { q: keyword } })

// 获取轮播图
export const getBanners = () => api.get('/banners')

// 获取分类列表
export const getCategories = () => api.get('/categories')

// 用户登录
export const login = (data) => api.get('/users', { params: { username: data.username, password: data.password } })

// 用户注册
export const register = (data) => api.post('/users', data)

// 获取用户信息
export const getUserInfo = (id) => api.get(`/users/${id}`)

// 更新用户信息
export const updateUserInfo = (id, data) => api.patch(`/users/${id}`, data)

// 获取评论列表
export const getComments = (energyId) => api.get('/comments', { params: { energyId } })

// 添加评论
export const addComment = (data) => api.post('/comments', data)

export default api
