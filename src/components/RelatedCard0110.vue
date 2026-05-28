<template>
  <div class="related-card">
    <h3>
      <el-icon><Connection /></el-icon>
      相关推荐
    </h3>
    <div class="related-list">
      <div
        v-for="item in relatedItems"
        :key="item.id"
        class="related-item"
        @click="handleClick(item.id)"
      >
        <img :src="item.image" :alt="item.name" />
        <div class="related-info">
          <h4>{{ item.name }}</h4>
          <el-tag size="small" type="info">{{ item.category }}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  relatedItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['click'])

const handleClick = (id) => {
  emit('click', id)
}
</script>

<style scoped>
.related-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

h3 .el-icon {
  color: #409eff;
}

.related-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.related-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.related-item:hover {
  background: #ecf5ff;
  transform: translateX(4px);
}

.related-item img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.related-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.related-info h4 {
  font-size: 14px;
  color: #333;
  margin: 0;
}
</style>
