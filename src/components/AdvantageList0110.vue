<template>
  <div class="advantage-list">
    <div class="advantages">
      <h3>
        <el-icon color="#67c23a"><CircleCheck /></el-icon>
        优势
      </h3>
      <ul>
        <li v-for="(item, index) in advantages" :key="index">
          <el-icon color="#67c23a"><CircleCheck /></el-icon>
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="disadvantages">
      <h3>
        <el-icon color="#f56c6c"><CircleClose /></el-icon>
        劣势
      </h3>
      <ul>
        <li v-for="(item, index) in disadvantages" :key="index">
          <el-icon color="#f56c6c"><CircleClose /></el-icon>
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  advantages: {
    type: Array,
    default: () => []
  },
  disadvantages: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.advantage-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.advantages,
.disadvantages {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.advantages {
  border-top: 3px solid #67c23a;
}

.disadvantages {
  border-top: 3px solid #f56c6c;
}

h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

li:last-child {
  border-bottom: none;
}

li .el-icon {
  margin-top: 4px;
  flex-shrink: 0;
}
</style>
