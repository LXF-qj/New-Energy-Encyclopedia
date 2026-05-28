<template>
  <div class="search-bar">
    <el-input
      v-model="keyword"
      :placeholder="placeholder"
      clearable
      @keyup.enter="handleSearch"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
      <template #append>
        <el-button @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </template>
    </el-input>
    <div class="search-history" v-if="history.length && showHistory">
      <div class="history-header">
        <span>搜索历史</span>
        <el-button type="primary" link size="small" @click="clearHistory">
          <el-icon><Delete /></el-icon> 清空
        </el-button>
      </div>
      <div class="history-tags">
        <el-tag
          v-for="item in history"
          :key="item"
          class="history-tag"
          @click="handleHistoryClick(item)"
          closable
          @close="removeHistory(item)"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索新能源...'
  },
  modelValue: {
    type: String,
    default: ''
  },
  showHistory: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['search', 'update:modelValue'])

const keyword = ref(props.modelValue)
const history = ref([])
const HISTORY_KEY = 'search_history'

onMounted(() => {
  loadHistory()
})

const loadHistory = () => {
  const saved = localStorage.getItem(HISTORY_KEY)
  history.value = saved ? JSON.parse(saved) : []
}

const saveHistory = (kw) => {
  const index = history.value.indexOf(kw)
  if (index > -1) {
    history.value.splice(index, 1)
  }
  history.value.unshift(kw)
  if (history.value.length > 10) {
    history.value = history.value.slice(0, 10)
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
}

const handleSearch = () => {
  if (keyword.value.trim()) {
    saveHistory(keyword.value.trim())
    emit('search', keyword.value.trim())
    emit('update:modelValue', keyword.value.trim())
  }
}

const handleHistoryClick = (item) => {
  keyword.value = item
  emit('search', item)
  emit('update:modelValue', item)
}

const removeHistory = (item) => {
  history.value = history.value.filter(h => h !== item)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
}

const clearHistory = () => {
  history.value = []
  localStorage.removeItem(HISTORY_KEY)
}
</script>

<style scoped>
.search-bar {
  max-width: 600px;
  margin: 0 auto 24px;
}

:deep(.el-input__inner) {
  height: 44px;
  font-size: 15px;
}

.search-history {
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: #909399;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.history-tag:hover {
  background: #ecf5ff;
  color: #409eff;
}
</style>
