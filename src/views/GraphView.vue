<template>
  <div class="graph-page">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>能源图谱</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="page-header">
        <h1>新能源知识图谱</h1>
        <p>探索不同能源类型之间的关系</p>
      </div>

      <div class="graph-content">
        <div class="tree-section">
          <el-card>
            <template #header>
              <span>能源分类树</span>
            </template>
            <el-tree
              :data="treeData"
              :props="{ children: 'children', label: 'label' }"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <div class="tree-node">
                  <el-icon v-if="data.icon" :size="16" color="#409eff">
                    <component :is="data.icon" />
                  </el-icon>
                  <span>{{ node.label }}</span>
                  <el-tag v-if="data.count" size="small" type="info">{{ data.count }}</el-tag>
                </div>
              </template>
            </el-tree>
          </el-card>
        </div>

        <div class="detail-section">
          <el-card v-if="selectedCategory">
            <template #header>
              <span>{{ selectedCategory.name }} - 能源列表</span>
            </template>
            <div class="energy-grid">
              <div
                v-for="item in categoryEnergies"
                :key="item.id"
                class="energy-item"
                @click="goDetail(item.id)"
              >
                <img :src="item.image" :alt="item.name" />
                <div class="energy-info">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.summary }}</p>
                </div>
              </div>
            </div>
          </el-card>
          <el-card v-else>
            <el-empty description="请从左侧树形图选择一个分类" />
          </el-card>
        </div>
      </div>

      <div class="tags-section">
        <el-card>
          <template #header>
            <span>应用场景标签云</span>
          </template>
          <div class="tag-cloud">
            <el-tag
              v-for="tag in applicationTags"
              :key="tag.name"
              :size="tag.size"
              :type="tag.type"
              class="app-tag"
              @click="searchByTag(tag.name)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEnergyStore } from '../stores/energy'

const router = useRouter()
const energyStore = useEnergyStore()

const selectedCategory = ref(null)

const treeData = computed(() => {
  const categories = {}
  energyStore.energyList.forEach(e => {
    if (!categories[e.category]) {
      categories[e.category] = {
        label: e.category,
        icon: getCategoryIcon(e.category),
        count: 0,
        children: []
      }
    }
    categories[e.category].count++
    categories[e.category].children.push({
      label: e.name,
      id: e.id,
      icon: null
    })
  })
  return [{
    label: '新能源百科',
    icon: 'Sunny',
    children: Object.values(categories)
  }]
})

const categoryEnergies = computed(() => {
  if (!selectedCategory.value) return []
  return energyStore.energyList.filter(e => e.category === selectedCategory.value.name)
})

const applicationTags = computed(() => {
  const tagMap = {}
  energyStore.energyList.forEach(e => {
    e.applications?.forEach(app => {
      tagMap[app] = (tagMap[app] || 0) + 1
    })
  })
  const types = ['', 'success', 'warning', 'danger', 'info']
  return Object.entries(tagMap)
    .map(([name, count]) => ({
      name,
      count,
      size: count > 3 ? 'large' : count > 1 ? 'default' : 'small',
      type: types[Math.floor(Math.random() * types.length)]
    }))
    .sort((a, b) => b.count - a.count)
})

const getCategoryIcon = (category) => {
  const iconMap = {
    '太阳能': 'Sunny',
    '风能': 'WindPower',
    '水能': 'Water',
    '氢能': 'Lightning',
    '生物质能': 'Plant',
    '地热能': 'Sunrise',
    '海洋能': 'Ship',
    '核能': 'Connection',
    '储能技术': 'Battery',
    '绿色燃料': 'MagicStick'
  }
  return iconMap[category] || 'Document'
}

const handleNodeClick = (data) => {
  if (data.icon && data.count) {
    selectedCategory.value = data
  } else if (data.id) {
    router.push(`/detail/${data.id}`)
  }
}

const goDetail = (id) => {
  router.push(`/detail/${id}`)
}

const searchByTag = (tag) => {
  router.push({ path: '/search', query: { keyword: tag } })
}

onMounted(async () => {
  if (energyStore.energyList.length === 0) {
    await energyStore.fetchEnergyList()
  }
})
</script>

<style scoped>
.graph-page {
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

.graph-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.energy-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.energy-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.energy-item:hover {
  background: #ecf5ff;
  transform: translateX(4px);
}

.energy-item img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.energy-info {
  flex: 1;
}

.energy-info h4 {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.energy-info p {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags-section {
  margin-bottom: 40px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.app-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.app-tag:hover {
  transform: scale(1.1);
}
</style>
