<template>
  <div class="profile-page">
    <div class="container">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="个人资料" name="info">
          <UserProfile0110 :user="user" @edit="showEditDialog" @logout="handleLogout">
            <template #extra>
              <el-button type="primary" @click="showEditDialog">编辑资料</el-button>
            </template>
          </UserProfile0110>
        </el-tab-pane>
        <el-tab-pane label="我的收藏" name="favorites">
          <div v-if="favoriteList.length" class="favorites-grid">
            <EnergyCard0110
              v-for="item in favoriteList"
              :key="item.id"
              :energy="item"
              @click="goDetail"
            />
          </div>
          <el-empty v-else description="暂无收藏" />
        </el-tab-pane>
      </el-tabs>

      <el-dialog v-model="editVisible" title="编辑资料" width="500px">
        <el-form :model="editForm" label-width="80px">
          <el-form-item label="昵称">
            <el-input v-model="editForm.nickname" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="editForm.email" />
          </el-form-item>
          <el-form-item label="头像">
            <el-input v-model="editForm.avatar" placeholder="请输入头像URL" />
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="editForm.bio" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="editVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useEnergyStore } from '../stores/energy'
import { ElMessage } from 'element-plus'
import UserProfile0110 from '../components/UserProfile0110.vue'
import EnergyCard0110 from '../components/EnergyCard0110.vue'

const router = useRouter()
const userStore = useUserStore()
const energyStore = useEnergyStore()

const activeTab = ref('info')
const editVisible = ref(false)

const user = computed(() => userStore.user || {})
const favoriteList = computed(() => {
  if (!user.value.favorites || !energyStore.energyList.length) return []
  return energyStore.energyList.filter(e => user.value.favorites.includes(e.id))
})

const editForm = reactive({
  nickname: '',
  email: '',
  avatar: '',
  bio: ''
})

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  if (energyStore.energyList.length === 0) {
    await energyStore.fetchEnergyList()
  }
})

const showEditDialog = () => {
  editForm.nickname = user.value.nickname || ''
  editForm.email = user.value.email || ''
  editForm.avatar = user.value.avatar || ''
  editForm.bio = user.value.bio || ''
  editVisible.value = true
}

const handleSave = async () => {
  try {
    await userStore.updateProfile(user.value.id, { ...editForm })
    editVisible.value = false
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
  ElMessage.success('已退出登录')
}

const goDetail = (id) => {
  router.push(`/detail/${id}`)
}
</script>

<style scoped>
.profile-page {
  padding-top: 80px;
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 16px 0;
}
</style>
