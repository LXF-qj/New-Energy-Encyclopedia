<template>
  <div class="compare-page">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>能源对比</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="page-header">
        <h1>能源对比分析</h1>
        <p>选择2-3种能源进行多维度对比</p>
      </div>

      <div class="compare-selectors">
        <div v-for="(selected, index) in selectedEnergies" :key="index" class="selector-item">
          <el-select
            v-model="selectedEnergies[index]"
            placeholder="请选择能源"
            clearable
            @change="updateChart"
          >
            <el-option
              v-for="item in availableEnergies(index)"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-button
            v-if="selectedEnergies.length > 2"
            type="danger"
            :icon="Delete"
            circle
            @click="removeSelector(index)"
          />
        </div>
        <el-button
          v-if="selectedEnergies.length < 3"
          type="primary"
          :icon="Plus"
          @click="addSelector"
        >
          添加对比
        </el-button>
      </div>

      <div v-if="compareData.length >= 2" class="compare-content">
        <div class="chart-section">
          <el-card>
            <template #header>
              <span>综合雷达图对比</span>
            </template>
            <div ref="radarChart" class="chart-container"></div>
          </el-card>
        </div>

        <div class="table-section">
          <el-card>
            <template #header>
              <span>详细参数对比</span>
            </template>
            <el-table :data="tableData" border stripe>
              <el-table-column prop="label" label="对比项" width="150" fixed />
              <el-table-column
                v-for="item in compareData"
                :key="item.id"
                :label="item.name"
                min-width="200"
              >
                <template #default="{ row }">
                  <span v-html="getCellValue(row, item)"></span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>

        <div class="bar-section">
          <el-card>
            <template #header>
              <span>全球装机容量对比</span>
            </template>
            <div ref="barChart" class="chart-container"></div>
          </el-card>
        </div>
      </div>

      <el-empty v-else description="请至少选择2种能源进行对比" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useEnergyStore } from '../stores/energy'
import { Delete, Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const route = useRoute()
const energyStore = useEnergyStore()

const selectedEnergies = ref([1, 2])
const radarChart = ref(null)
const barChart = ref(null)

let radarInstance = null
let barInstance = null

const compareData = computed(() => {
  return selectedEnergies.value
    .filter(id => id)
    .map(id => energyStore.energyList.find(e => e.id === id))
    .filter(Boolean)
})

const availableEnergies = (currentIndex) => {
  const selectedIds = selectedEnergies.value.filter((id, i) => i !== currentIndex && id)
  return energyStore.energyList.filter(e => !selectedIds.includes(e.id))
}

const tableData = computed(() => {
  if (compareData.value.length < 2) return []
  return [
    { key: 'category', label: '分类' },
    { key: 'global_capacity_gw', label: '全球装机容量(GW)' },
    { key: 'cost_trend', label: '成本趋势' },
    { key: 'advantages', label: '优势' },
    { key: 'disadvantages', label: '劣势' },
    { key: 'applications', label: '应用场景' },
    { key: 'key_countries', label: '主要国家' }
  ]
})

const getCellValue = (row, item) => {
  const value = item[row.key]
  if (Array.isArray(value)) {
    return value.map(v => `<el-tag size="small" class="cell-tag">${v}</el-tag>`).join('')
  }
  return value
}

const addSelector = () => {
  if (selectedEnergies.value.length < 3) {
    selectedEnergies.value.push(null)
  }
}

const removeSelector = (index) => {
  selectedEnergies.value.splice(index, 1)
  updateChart()
}

const updateChart = () => {
  nextTick(() => {
    if (compareData.value.length >= 2) {
      renderRadarChart()
      renderBarChart()
    }
  })
}

const renderRadarChart = () => {
  if (!radarChart.value) return
  if (radarInstance) radarInstance.dispose()
  radarInstance = echarts.init(radarChart.value)

  const indicators = [
    { name: '技术成熟度', max: 100 },
    { name: '装机规模', max: 100 },
    { name: '成本竞争力', max: 100 },
    { name: '环保性', max: 100 },
    { name: '稳定性', max: 100 }
  ]

  const colors = ['#409eff', '#67c23a', '#e6a23c']

  const seriesData = compareData.value.map((item, index) => {
    const capacityScore = Math.min(item.global_capacity_gw / 16, 100)
    const scoreMap = {
      '太阳能': [75, capacityScore, 85, 95, 60],
      '风能': [80, capacityScore, 80, 95, 55],
      '水能': [95, capacityScore, 90, 85, 90],
      '氢能': [40, capacityScore, 50, 100, 70],
      '生物质能': [70, capacityScore, 65, 75, 75],
      '地热能': [65, capacityScore, 60, 90, 95],
      '海洋能': [35, capacityScore, 40, 95, 70],
      '核能': [85, capacityScore, 70, 80, 95],
      '储能技术': [60, capacityScore, 55, 90, 80],
      '绿色燃料': [45, capacityScore, 45, 85, 65]
    }
    return {
      value: scoreMap[item.category] || [50, capacityScore, 50, 80, 60],
      name: item.name,
      itemStyle: { color: colors[index] }
    }
  })

  radarInstance.setOption({
    tooltip: {},
    legend: { data: compareData.value.map(e => e.name) },
    radar: { indicator: indicators },
    series: [{
      type: 'radar',
      data: seriesData
    }]
  })
}

const renderBarChart = () => {
  if (!barChart.value) return
  if (barInstance) barInstance.dispose()
  barInstance = echarts.init(barChart.value)

  barInstance.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: compareData.value.map(e => e.name)
    },
    yAxis: { type: 'value', name: '装机容量(GW)' },
    series: [{
      type: 'bar',
      data: compareData.value.map(e => e.global_capacity_gw),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#409eff' },
          { offset: 1, color: '#79bbff' }
        ])
      }
    }]
  })
}

onMounted(async () => {
  if (energyStore.energyList.length === 0) {
    await energyStore.fetchEnergyList()
  }

  if (route.query.ids) {
    selectedEnergies.value = route.query.ids.split(',').map(Number)
  }

  updateChart()
})

watch(() => route.query.ids, (val) => {
  if (val) {
    selectedEnergies.value = val.split(',').map(Number)
    updateChart()
  }
})
</script>

<style scoped>
.compare-page {
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

.compare-selectors {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.selector-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.compare-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chart-container {
  height: 400px;
}

:deep(.cell-tag) {
  margin: 2px;
}
</style>
