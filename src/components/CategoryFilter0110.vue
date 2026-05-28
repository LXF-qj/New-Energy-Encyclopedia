<template>
  <div class="category-filter">
    <el-radio-group v-model="selected" @change="handleChange">
      <el-radio-button label="all">全部</el-radio-button>
      <el-radio-button
        v-for="cat in categories"
        :key="cat.id"
        :label="cat.name"
      >
        {{ cat.name }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const selected = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  selected.value = val
})

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.category-filter {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.el-radio-group {
  flex-wrap: wrap;
  justify-content: center;
}

:deep(.el-radio-button__inner) {
  border-radius: 4px !important;
  margin: 0 4px 8px;
}
</style>
