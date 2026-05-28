import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '../api'

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const isLoggedIn = computed(() => !!user.value)

  async function login(data) {
    const res = await api.login(data)
    if (res.data && res.data.length > 0) {
      user.value = res.data[0]
      localStorage.setItem('user', JSON.stringify(user.value))
      return { success: true, data: user.value }
    }
    return { success: false, message: '用户名或密码错误' }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  async function updateProfile(id, data) {
    const res = await api.updateUserInfo(id, data)
    user.value = { ...user.value, ...res.data }
    localStorage.setItem('user', JSON.stringify(user.value))
    return res.data
  }

  function isFavorite(energyId) {
    if (!user.value || !user.value.favorites) return false
    return user.value.favorites.includes(energyId)
  }

  async function toggleFavorite(energyId) {
    if (!user.value) return false
    const favorites = [...(user.value.favorites || [])]
    const index = favorites.indexOf(energyId)
    if (index > -1) {
      favorites.splice(index, 1)
    } else {
      favorites.push(energyId)
    }
    await updateProfile(user.value.id, { favorites })
    return index === -1
  }

  return { user, isLoggedIn, login, logout, updateProfile, isFavorite, toggleFavorite }
})
