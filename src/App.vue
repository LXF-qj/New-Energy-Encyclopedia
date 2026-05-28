<template>
  <div id="app">
    <NavBar0110 />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <FooterBar0110 />
    <el-backtop :right="40" :bottom="40" />
  </div>
</template>

<script setup>
import NavBar0110 from './components/NavBar0110.vue'
import FooterBar0110 from './components/FooterBar0110.vue'
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
