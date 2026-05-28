<template>
  <div class="login-page">
    <div class="login-container">
      <el-card class="login-card">
        <template #header>
          <div class="card-header">
            <h2>用户登录</h2>
            <p>欢迎回到新能源科普百科</p>
          </div>
        </template>
        <LoginForm0110 :loading="loading" @submit="handleLogin" />
        <div class="card-footer">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import LoginForm0110 from '../components/LoginForm0110.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)

const handleLogin = async (data) => {
  loading.value = true
  try {
    const result = await userStore.login(data)
    if (result.success) {
      ElMessage.success('登录成功！')
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 440px;
  padding: 20px;
}

.login-card {
  border-radius: 12px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.card-header p {
  font-size: 14px;
  color: #999;
}

.card-footer {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}

.card-footer a {
  color: #409eff;
  margin-left: 4px;
}
</style>
