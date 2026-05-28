<template>
  <div class="home">
    <Banner0110 :banners="banners" />

    <div class="container">
      <div class="section-title">
        <h2>能源分类</h2>
        <p>探索不同类型的清洁能源</p>
      </div>
      <div class="category-grid">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="category-item"
          @click="router.push(`/list/${cat.name}`)"
        >
          <el-icon :size="32" color="#409eff">
            <component :is="cat.icon" />
          </el-icon>
          <span>{{ cat.name }}</span>
          <el-tag size="small" type="info">{{ cat.count }}</el-tag>
        </div>
      </div>

      <EnergyGrid0110
        title="热门能源"
        subtitle="最受欢迎的新能源技术"
        :items="hotEnergy"
        :show-more="true"
        @click="goDetail"
        @more="router.push('/list')"
      />

      <EnergyGrid0110
        title="储能技术"
        subtitle="支撑新能源发展的关键"
        :items="storageEnergy"
        @click="goDetail"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEnergyStore } from '../stores/energy'
import Banner0110 from '../components/Banner0110.vue'
import EnergyGrid0110 from '../components/EnergyGrid0110.vue'

const router = useRouter()
const energyStore = useEnergyStore()

const banners = computed(() => energyStore.banners)
const categories = computed(() => energyStore.categories)
const hotEnergy = computed(() => energyStore.energyList.slice(0, 8))
const storageEnergy = computed(() => energyStore.energyList.filter(e => e.category === '储能技术'))

onMounted(async () => {
  await Promise.all([
    energyStore.fetchBanners(),
    energyStore.fetchCategories(),
    energyStore.fetchEnergyList()
  ])
})

const goDetail = (id) => {
  router.push(`/detail/${id}`)
}
</script>

<style scoped>
.home {
  padding-top: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  margin: 40px 0 32px;
}

.section-title h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.section-title p {
  font-size: 16px;
  color: #666;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 48px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.category-item span {
  font-size: 14px;
  color: #333;
}
</style>
