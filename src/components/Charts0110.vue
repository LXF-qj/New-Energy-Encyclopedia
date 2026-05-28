<template>
  <div class="chart-wrapper" :style="{ height: height + 'px' }">
    <div ref="chartRef" class="chart-instance"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  height: {
    type: Number,
    default: 400
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(props.option)
}

const handleResize = () => {
  chartInstance?.resize()
}

watch(() => props.option, (newOption) => {
  if (chartInstance) {
    chartInstance.setOption(newOption, true)
  }
}, { deep: true })

onMounted(() => {
  nextTick(initChart)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
}

.chart-instance {
  width: 100%;
  height: 100%;
}
</style>
