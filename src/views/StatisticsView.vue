<template>
  <div class="statistics-page">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据可视化</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="page-header">
        <h1>新能源数据可视化</h1>
        <p>用数据洞察新能源发展趋势</p>
      </div>

      <div class="stats-cards">
        <el-card v-for="stat in summaryStats" :key="stat.label" class="stat-card">
          <div class="stat-icon" :style="{ background: stat.color }">
            <el-icon :size="24"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </el-card>
      </div>

      <div class="charts-grid">
        <el-card class="chart-card">
          <template #header>
            <span>各类能源全球装机容量</span>
          </template>
          <Charts0110 :option="barOption" :height="400" />
        </el-card>

        <el-card class="chart-card">
          <template #header>
            <span>能源分类占比</span>
          </template>
          <Charts0110 :option="pieOption" :height="400" />
        </el-card>

        <el-card class="chart-card full-width">
          <template #header>
            <span>能源分类统计</span>
          </template>
          <Charts0110 :option="categoryBarOption" :height="350" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEnergyStore } from '../stores/energy'
import Charts0110 from '../components/Charts0110.vue'

const energyStore = useEnergyStore()

const summaryStats = computed(() => {
  const list = energyStore.energyList
  const totalCapacity = list.reduce((sum, e) => sum + e.global_capacity_gw, 0)
  const categories = [...new Set(list.map(e => e.category))]
  const countries = [...new Set(list.flatMap(e => e.key_countries))]
  return [
    { label: '能源种类', value: list.length, icon: 'Lightning', color: '#409eff' },
    { label: '分类数量', value: categories.length, icon: 'Grid', color: '#67c23a' },
    { label: '总装机容量', value: `${(totalCapacity / 1000).toFixed(1)} TW`, icon: 'DataLine', color: '#e6a23c' },
    { label: '涉及国家', value: countries.length, icon: 'Location', color: '#f56c6c' }
  ]
})

const barOption = computed(() => {
  const sorted = [...energyStore.energyList]
    .sort((a, b) => b.global_capacity_gw - a.global_capacity_gw)
    .slice(0, 10)
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '装机容量 (GW)' },
    yAxis: {
      type: 'category',
      data: sorted.map(e => e.name),
      axisLabel: { width: 100, overflow: 'truncate' }
    },
    series: [{
      type: 'bar',
      data: sorted.map(e => e.global_capacity_gw),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#79bbff' }
          ]
        },
        borderRadius: [0, 4, 4, 0]
      }
    }]
  }
})

const pieOption = computed(() => {
  const categoryData = {}
  energyStore.energyList.forEach(e => {
    categoryData[e.category] = (categoryData[e.category] || 0) + e.global_capacity_gw
  })
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} GW ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false, position: 'center' },
      emphasis: {
        label: { show: true, fontSize: 18, fontWeight: 'bold' }
      },
      labelLine: { show: false },
      data: Object.entries(categoryData).map(([name, value]) => ({ name, value }))
    }]
  }
})

const categoryBarOption = computed(() => {
  const categoryCount = {}
  energyStore.energyList.forEach(e => {
    categoryCount[e.category] = (categoryCount[e.category] || 0) + 1
  })
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: Object.keys(categoryCount),
      axisLabel: { rotate: 30 }
    },
    yAxis: { type: 'value', name: '数量' },
    series: [{
      type: 'bar',
      data: Object.values(categoryCount),
      itemStyle: {
        color: (params) => {
          const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#b37feb', '#36cfc9', '#ff85c0', '#ffc53d', '#73d13d']
          return colors[params.dataIndex % colors.length]
        },
        borderRadius: [4, 4, 0, 0]
      }
    }]
  }
})

onMounted(async () => {
  if (energyStore.energyList.length === 0) {
    await energyStore.fetchEnergyList()
  }
})
</script>

<style scoped>
.statistics-page {
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

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.chart-card.full-width {
  grid-column: 1 / -1;
}
</style>
