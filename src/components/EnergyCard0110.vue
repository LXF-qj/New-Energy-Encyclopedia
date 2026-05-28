<template>
  <el-card class="energy-card" shadow="hover" @click="handleClick">
    <div class="card-image">
      <img :src="energy.image" :alt="energy.name" />
      <el-tag class="card-category" type="primary">{{ energy.category }}</el-tag>
      <el-icon
        class="card-favorite"
        :class="{ 'is-favorite': isFav }"
        :color="isFav ? '#f56c6c' : '#fff'"
        @click.stop="handleFavorite"
      >
        <StarFilled />
      </el-icon>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ energy.name }}</h3>
      <p class="card-summary">{{ energy.summary }}</p>
      <div class="card-meta">
        <span class="capacity">
          <el-icon><DataLine /></el-icon>
          {{ energy.global_capacity_gw }} GW
        </span>
        <span class="detail-link">
          查看详情
          <el-icon><ArrowRight /></el-icon>
        </span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const props = defineProps({
  energy: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])
const userStore = useUserStore()

const isFav = computed(() => userStore.isFavorite(props.energy.id))

const handleClick = () => {
  emit('click', props.energy.id)
}

const handleFavorite = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  const result = await userStore.toggleFavorite(props.energy.id)
  ElMessage.success(result ? '已收藏' : '已取消收藏')
}
</script>

<style scoped>
.energy-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
}

.energy-card:hover {
  transform: translateY(-4px);
}

.card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
  margin: -20px -20px 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.energy-card:hover .card-image img {
  transform: scale(1.05);
}

.card-category {
  position: absolute;
  top: 12px;
  right: 12px;
}

.card-favorite {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.3s;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.card-favorite:hover {
  transform: scale(1.2);
}

.card-favorite.is-favorite {
  animation: heartbeat 0.3s ease-in-out;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.card-content {
  padding-top: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.card-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
}

.capacity {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409eff;
}
</style>
