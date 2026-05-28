<template>
  <div class="detail-page">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/list' }">能源百科</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/list/${energy?.category}` }">{{ energy?.category }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ energy?.name }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div v-if="energy" class="detail-content">
        <div class="detail-hero">
          <img :src="energy.image" :alt="energy.name" class="hero-image" />
          <div class="hero-overlay">
            <div class="hero-info">
              <h1>{{ energy.name }}</h1>
              <p>{{ energy.name_en }}</p>
            </div>
            <el-button
              class="favorite-btn"
              :type="isFav ? 'danger' : 'default'"
              :icon="isFav ? 'StarFilled' : 'Star'"
              circle
              size="large"
              @click="handleFavorite"
            />
          </div>
        </div>

        <div class="detail-body">
          <div class="detail-main">
            <DetailInfo0110 :energy="energy" />
            <AdvantageList0110 :advantages="energy.advantages" :disadvantages="energy.disadvantages" />

            <div class="comments-section">
              <h3>
                <el-icon><ChatDotRound /></el-icon>
                用户评论 ({{ comments.length }})
              </h3>

              <div class="comment-form" v-if="userStore.isLoggedIn">
                <el-input
                  v-model="commentContent"
                  type="textarea"
                  :rows="3"
                  placeholder="分享你的看法..."
                  maxlength="500"
                  show-word-limit
                />
                <el-button type="primary" :loading="commentLoading" @click="submitComment">
                  <el-icon><Promotion /></el-icon>
                  发表评论
                </el-button>
              </div>
              <div v-else class="login-tip">
                <el-icon><InfoFilled /></el-icon>
                <span>请先 <router-link to="/login">登录</router-link> 后发表评论</span>
              </div>

              <el-divider />
              <div v-if="comments.length" class="comment-list">
                <div v-for="comment in comments" :key="comment.id" class="comment-item">
                  <el-avatar :size="40" :src="comment.avatar" />
                  <div class="comment-content">
                    <div class="comment-header">
                      <span class="comment-user">{{ comment.username }}</span>
                      <span class="comment-time">{{ comment.createTime }}</span>
                    </div>
                    <p>{{ comment.content }}</p>
                  </div>
                </div>
              </div>
              <el-empty v-else description="暂无评论，快来发表第一条评论吧" />
            </div>
          </div>

          <div class="detail-sidebar">
            <RelatedCard0110 :related-items="relatedList" @click="goRelated" />
            <div v-if="energy.video" class="video-section">
              <h3>
                <el-icon><VideoPlay /></el-icon>
                科普视频
              </h3>
              <video
                :src="energy.video"
                controls
                preload="metadata"
                class="video-player"
                :poster="energy.image"
              >
                您的浏览器不支持视频播放
              </video>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="loading">
        <el-skeleton :rows="10" animated />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEnergyStore } from '../stores/energy'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import * as api from '../api'
import DetailInfo0110 from '../components/DetailInfo0110.vue'
import AdvantageList0110 from '../components/AdvantageList0110.vue'
import RelatedCard0110 from '../components/RelatedCard0110.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const router = useRouter()
const route = useRoute()
const energyStore = useEnergyStore()
const userStore = useUserStore()

const energy = ref(null)
const comments = ref([])
const relatedList = ref([])
const commentContent = ref('')
const commentLoading = ref(false)

const isFav = computed(() => userStore.isFavorite(Number(props.id)))

const loadData = async () => {
  energy.value = null
  const data = await energyStore.getEnergyDetail(props.id)
  energy.value = data

  const [commentsRes, allEnergy] = await Promise.all([
    api.getComments(props.id),
    energyStore.energyList.length ? Promise.resolve({ data: energyStore.energyList }) : api.getEnergyList()
  ])

  comments.value = commentsRes.data
  relatedList.value = allEnergy.data
    .filter(e => e.category === data.category && e.id !== data.id)
    .slice(0, 4)
}

watch(() => props.id, loadData)

onMounted(loadData)

const goRelated = (id) => {
  router.push(`/detail/${id}`)
}

const submitComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  commentLoading.value = true
  try {
    await api.addComment({
      energyId: Number(props.id),
      userId: userStore.user.id,
      username: userStore.user.nickname || userStore.user.username,
      avatar: userStore.user.avatar,
      content: commentContent.value.trim(),
      createTime: new Date().toLocaleString('zh-CN')
    })
    ElMessage.success('评论发表成功')
    commentContent.value = ''
    const res = await api.getComments(props.id)
    comments.value = res.data
  } catch {
    ElMessage.error('评论发表失败')
  } finally {
    commentLoading.value = false
  }
}

const handleFavorite = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  const result = await userStore.toggleFavorite(Number(props.id))
  ElMessage.success(result ? '已收藏' : '已取消收藏')
}
</script>

<style scoped>
.detail-page {
  padding-top: 80px;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.detail-hero {
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 32px;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.hero-info h1 {
  font-size: 36px;
  margin-bottom: 8px;
}

.hero-info p {
  font-size: 18px;
  opacity: 0.9;
}

.favorite-btn {
  width: 48px;
  height: 48px;
  font-size: 20px;
}

.detail-body {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comments-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.comments-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

.login-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  color: #909399;
  font-size: 14px;
}

.login-tip a {
  color: #409eff;
  font-weight: bold;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-user {
  font-weight: bold;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.video-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.video-section h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.video-section h3 .el-icon {
  color: #409eff;
}

.video-player {
  width: 100%;
  border-radius: 8px;
  background: #000;
}

.loading {
  padding: 40px 0;
}
</style>
