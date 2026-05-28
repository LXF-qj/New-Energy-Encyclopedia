<template>
  <div class="search-page">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>搜索结果</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="page-header">
        <h1>搜索结果</h1>
        <p v-if="keyword">关键词：<span class="keyword-tag">{{ keyword }}</span>，共找到 <strong>{{ searchResults.length }}</strong> 条结果</p>
      </div>

      <SearchBar0110 placeholder="重新搜索..." :model-value="keyword" @search="handleSearch" />

      <div v-if="searchResults.length" class="search-results">
        <div class="view-toggle">
          <el-radio-group v-model="viewMode">
            <el-radio-button label="grid">
              <el-icon><Grid /></el-icon>
            </el-radio-button>
            <el-radio-button label="list">
              <el-icon><List /></el-icon>
            </el-radio-button>
          </el-radio-group>
        </div>

        <div v-if="viewMode === 'grid'" class="results-grid">
          <EnergyCard0110
            v-for="item in searchResults"
            :key="item.id"
            :energy="item"
            @click="goDetail"
          />
        </div>

        <div v-else class="results-list">
          <div
            v-for="item in searchResults"
            :key="item.id"
            class="result-item"
            @click="goDetail(item.id)"
          >
            <img :src="item.image" :alt="item.name" class="result-image" />
            <div class="result-info">
              <h3 v-html="highlightText(item.name)"></h3>
              <el-tag size="small" type="primary">{{ item.category }}</el-tag>
              <p v-html="highlightText(item.summary)"></p>
              <div class="result-meta">
                <span>全球装机容量：{{ item.global_capacity_gw }} GW</span>
                <span>主要国家：{{ item.key_countries.join('、') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-empty v-else-if="keyword" description="未找到相关内容">
        <template #description>
          <p>未找到与 "{{ keyword }}" 相关的内容</p>
          <p class="search-tip">请尝试其他关键词，如：太阳能、风能、氢能</p>
        </template>
      </el-empty>
      <el-empty v-else description="请输入搜索关键词" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEnergyStore } from '../stores/energy'
import SearchBar0110 from '../components/SearchBar0110.vue'
import EnergyCard0110 from '../components/EnergyCard0110.vue'

const router = useRouter()
const route = useRoute()
const energyStore = useEnergyStore()

const viewMode = ref('grid')

const keyword = computed(() => route.query.keyword || '')

const searchResults = computed(() => {
  if (!keyword.value) return []
  const kw = keyword.value.toLowerCase()
  return energyStore.energyList.filter(item =>
    item.name.toLowerCase().includes(kw) ||
    item.summary.toLowerCase().includes(kw) ||
    item.category.toLowerCase().includes(kw) ||
    item.name_en.toLowerCase().includes(kw) ||
    item.applications?.some(app => app.toLowerCase().includes(kw)) ||
    item.key_countries?.some(country => country.toLowerCase().includes(kw))
  )
})

const highlightText = (text) => {
  if (!keyword.value || !text) return text
  const regex = new RegExp(`(${keyword.value})`, 'gi')
  return text.replace(regex, '<mark class="highlight">$1</mark>')
}

onMounted(async () => {
  if (energyStore.energyList.length === 0) {
    await energyStore.fetchEnergyList()
  }
})

const handleSearch = (kw) => {
  router.push({ path: '/search', query: { keyword: kw } })
}

const goDetail = (id) => {
  router.push(`/detail/${id}`)
}
</script>

<style scoped>
.search-page {
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

.keyword-tag {
  display: inline-block;
  padding: 2px 12px;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 4px;
  font-weight: bold;
}

.view-toggle {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.result-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-image {
  width: 200px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-info h3 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.result-info p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-meta {
  display: flex;
  gap: 24px;
  font-size: 13px;
  color: #909399;
  margin-top: auto;
}

:deep(.highlight) {
  background: #fef08a;
  color: #f59e0b;
  padding: 0 2px;
  border-radius: 2px;
}

.search-tip {
  font-size: 13px;
  color: #909399;
  margin-top: 8px;
}
</style>
