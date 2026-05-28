<template>
  <div class="user-profile">
    <div class="profile-header">
      <el-avatar :size="100" :src="user.avatar" />
      <h2>{{ user.nickname || user.username }}</h2>
      <p class="user-bio">
        <slot name="bio">{{ user.bio || '这个人很懒，什么都没写~' }}</slot>
      </p>
    </div>
    <el-divider />
    <div class="profile-info">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ user.createTime }}</el-descriptions-item>
        <el-descriptions-item label="收藏数量">
          <el-tag type="primary">{{ user.favorites?.length || 0 }} 个</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <slot name="extra"></slot>
    </div>
    <div class="profile-actions">
      <slot name="actions">
        <el-button type="primary" @click="$emit('edit')">编辑资料</el-button>
        <el-button @click="$emit('logout')">退出登录</el-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'logout'])
</script>

<style scoped>
.user-profile {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
}

.profile-header {
  text-align: center;
  margin-bottom: 24px;
}

.profile-header h2 {
  margin-top: 16px;
  font-size: 24px;
  color: #333;
}

.user-bio {
  margin-top: 8px;
  font-size: 14px;
  color: #999;
}

.profile-info {
  margin-bottom: 24px;
}

.profile-actions {
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
