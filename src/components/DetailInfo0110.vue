<template>
  <div class="detail-info">
    <el-descriptions :title="energy.name" :column="2" border>
      <template #extra>
        <el-tag size="large">{{ energy.category }}</el-tag>
      </template>
      <el-descriptions-item label="英文名称">{{ energy.name_en }}</el-descriptions-item>
      <el-descriptions-item label="全球装机容量">{{ energy.global_capacity_gw }} GW</el-descriptions-item>
      <el-descriptions-item label="成本趋势" :span="2">{{ energy.cost_trend }}</el-descriptions-item>
      <el-descriptions-item label="主要国家" :span="2">
        <el-tag v-for="country in energy.key_countries" :key="country" class="country-tag" type="info">
          {{ country }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="应用场景" :span="2">
        <el-tag v-for="app in energy.applications" :key="app" class="app-tag" type="success">
          {{ app }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <div class="section">
      <h3>
        <el-icon><InfoFilled /></el-icon>
        能源简介
      </h3>
      <p>{{ energy.summary }}</p>
    </div>

    <div class="section">
      <h3>
        <el-icon><Operation /></el-icon>
        工作原理
      </h3>
      <p>{{ energy.principle }}</p>
    </div>

    <div class="section fun-fact">
      <h3>
        <el-icon><Star /></el-icon>
        趣味小知识
      </h3>
      <p>{{ energy.fun_fact }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  energy: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.detail-info {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.country-tag,
.app-tag {
  margin: 4px;
}

.section {
  margin-top: 24px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section h3 .el-icon {
  color: #409eff;
}

.section p {
  font-size: 15px;
  line-height: 1.8;
  color: #666;
}

.fun-fact {
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%);
  border-left: 4px solid #409eff;
}
</style>
