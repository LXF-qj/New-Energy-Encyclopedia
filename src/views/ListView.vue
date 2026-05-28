<template>
  <div class="list-page">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>能源百科</el-breadcrumb-item>
        <el-breadcrumb-item v-if="category">{{ category }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="page-header">
        <h1>{{ category || '能源百科' }}</h1>
        <p>探索新能源的无限可能</p>
      </div>

      <SearchBar0110 @search="handleSearch" />
      <CategoryFilter0110 :categories="categories" v-model="selectedCategory" @change="filterByCategory" />

      <div v-if="filteredList.length" class="energy-list">
        <EnergyCard0110
          v-for="item in paginatedList"
          :key="item.id"
          :energy="item"
          @click="goDetail"
        />
      </div>
      <el-empty v-else description="暂无数据" />

      <div class="pagination" v-if="filteredList.length > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredList.length"
          layout="prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEnergyStore } from '../stores/energy'
import SearchBar0110 from '../components/SearchBar0110.vue'
import CategoryFilter0110 from '../components/CategoryFilter0110.vue'
import EnergyCard0110 from '../components/EnergyCard0110.vue'

const props = defineProps({
  category: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const route = useRoute()
const energyStore = useEnergyStore()

const selectedCategory = ref(props.category || 'all')
const currentPage = ref(1)
const pageSize = 8

const categories = computed(() => energyStore.categories)
const energyList = computed(() => energyStore.energyList)

const filteredList = computed(() => {
  let list = energyList.value
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    list = list.filter(item => item.category === selectedCategory.value)
  }
  return list
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredList.value.slice(start, start + pageSize)
})

watch(() => props.category, (val) => {
  selectedCategory.value = val || 'all'
  currentPage.value = 1
})

onMounted(async () => {
  if (energyStore.energyList.length === 0) {
    await energyStore.fetchEnergyList()
  }
  if (energyStore.categories.length === 0) {
    await energyStore.fetchCategories()
  }
  if (props.category) {
    selectedCategory.value = props.category
  }
})

const filterByCategory = (cat) => {
  if (cat === 'all') {
    router.push('/list')
  } else {
    router.push(`/list/${cat}`)
  }
  currentPage.value = 1
}

const handleSearch = (keyword) => {
  router.push({ path: '/search', query: { keyword } })
}

const goDetail = (id) => {
  router.push(`/detail/${id}`)
}

const handlePageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.list-page {
  padding-top: 80px;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin: 24px 0 32px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 16px;
  color: #666;
}

.energy-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
</style>
