import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '../api'

export const useEnergyStore = defineStore('energy', () => {
  const energyList = ref([])
  const categories = ref([])
  const banners = ref([])
  const loading = ref(false)

  async function fetchEnergyList() {
    loading.value = true
    try {
      const res = await api.getEnergyList()
      energyList.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    const res = await api.getCategories()
    categories.value = res.data
  }

  async function fetchBanners() {
    const res = await api.getBanners()
    banners.value = res.data
  }

  async function getEnergyDetail(id) {
    const res = await api.getEnergyDetail(id)
    return res.data
  }

  async function getByCategory(category) {
    const res = await api.getEnergyByCategory(category)
    return res.data
  }

  async function search(keyword) {
    const res = await api.searchEnergy(keyword)
    return res.data
  }

  return {
    energyList,
    categories,
    banners,
    loading,
    fetchEnergyList,
    fetchCategories,
    fetchBanners,
    getEnergyDetail,
    getByCategory,
    search
  }
})
