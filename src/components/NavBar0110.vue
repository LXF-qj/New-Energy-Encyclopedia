<template>
  <div class="navbar">
    <div class="navbar-container">
      <div class="logo" @click="router.push('/')">
        <el-icon :size="28" color="#409eff"><Sunny /></el-icon>
        <span class="logo-text">新能源科普百科</span>
      </div>
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/list">能源百科</el-menu-item>
        <el-menu-item index="/statistics">数据可视化</el-menu-item>
        <el-menu-item index="/compare">能源对比</el-menu-item>
        <el-menu-item index="/graph">能源图谱</el-menu-item>
        <el-menu-item index="/about">关于我们</el-menu-item>
      </el-menu>
      <div class="user-actions">
        <slot name="actions">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown @command="handleCommand">
              <div class="user-info">
                <el-avatar :size="32" :src="userStore.user?.avatar" />
                <span class="username">{{ userStore.user?.nickname }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided>
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="router.push('/login')">登录</el-button>
            <el-button @click="router.push('/register')">注册</el-button>
          </template>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const props = defineProps({
  activeIndex: {
    type: String,
    default: '/'
  }
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeIndex = computed(() => props.activeIndex || route.path)

const handleSelect = (index) => {
  router.push(index)
}

const handleCommand = (command) => {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'logout') {
    userStore.logout()
    router.push('/')
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-right: 40px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.el-menu {
  flex: 1;
  border-bottom: none;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #333;
}
</style>
