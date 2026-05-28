<template>
  <div class="banner">
    <el-carousel :interval="4000" height="400px" indicator-position="outside">
      <el-carousel-item v-for="item in banners" :key="item.id">
        <div class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
          <div class="banner-content">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <el-button type="primary" size="large" @click="router.push(item.link)">
              了解更多
            </el-button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  banners: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()
</script>

<style scoped>
.banner {
  margin-bottom: 40px;
}

.banner-item {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.banner-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
}

.banner-content h2 {
  font-size: 36px;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.banner-content p {
  font-size: 18px;
  margin-bottom: 24px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
