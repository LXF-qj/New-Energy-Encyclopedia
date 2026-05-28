<template>
  <div class="not-found-page">
    <div class="container">
      <el-empty description="页面未找到">
        <template #image>
          <div class="error-code">404</div>
        </template>
        <template #description>
          <p class="error-desc">抱歉，您访问的页面不存在</p>
        </template>
        <el-button type="primary" @click="router.push('/')">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #409eff;
  line-height: 1;
  text-shadow: 4px 4px 8px rgba(64, 158, 255, 0.3);
}

.error-desc {
  font-size: 18px;
  color: #666;
  margin-top: 16px;
}
</style>
