<template>
  <div class="energy-grid">
    <div class="grid-header">
      <slot name="header">
        <h2 class="grid-title">{{ title }}</h2>
        <p v-if="subtitle" class="grid-subtitle">{{ subtitle }}</p>
      </slot>
    </div>
    <div class="grid-container" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
      <slot>
        <div v-for="item in items" :key="item.id" class="grid-item">
          <slot name="item" :item="item">
            <EnergyCard0110 :energy="item" @click="handleClick" />
          </slot>
        </div>
      </slot>
    </div>
    <div v-if="showMore" class="grid-footer">
      <slot name="footer">
        <el-button type="primary" link @click="$emit('more')">
          查看更多
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import EnergyCard0110 from './EnergyCard0110.vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Number,
    default: 4
  },
  showMore: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'more'])

const handleClick = (id) => {
  emit('click', id)
}
</script>

<style scoped>
.energy-grid {
  margin-bottom: 40px;
}

.grid-header {
  margin-bottom: 24px;
  text-align: center;
}

.grid-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.grid-subtitle {
  font-size: 16px;
  color: #666;
}

.grid-container {
  display: grid;
  gap: 24px;
}

.grid-footer {
  text-align: center;
  margin-top: 24px;
}
</style>
