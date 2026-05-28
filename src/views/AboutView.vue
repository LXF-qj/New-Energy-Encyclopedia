<template>
  <div class="about-page">
    <div class="container">
      <div class="about-hero">
        <h1>关于新能源科普百科</h1>
        <p>致力于推广新能源知识，助力绿色发展</p>
      </div>

      <div class="about-section">
        <h2>我们的使命</h2>
        <p>
          新能源科普百科是一个专注于新能源知识普及的在线平台。我们致力于通过生动有趣的方式，
          向公众传播太阳能、风能、水能、氢能等清洁能源的知识，帮助更多人了解新能源技术的发展现状和未来趋势。
        </p>
      </div>

      <div class="about-section">
        <h2>为什么选择我们</h2>
        <div class="feature-grid">
          <el-card v-for="feature in features" :key="feature.title" class="feature-card">
            <el-icon :size="40" color="#409eff">
              <component :is="feature.icon" />
            </el-icon>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </el-card>
        </div>
      </div>

      <div class="about-section">
        <h2>发展历程</h2>
        <el-timeline>
          <el-timeline-item
            v-for="item in timeline"
            :key="item.date"
            :timestamp="item.date"
            placement="top"
          >
            <el-card>
              <h4>{{ item.title }}</h4>
              <p>{{ item.content }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <div class="about-section">
        <h2>联系我们</h2>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="邮箱">contact@newenergy.com</el-descriptions-item>
          <el-descriptions-item label="电话">400-123-4567</el-descriptions-item>
          <el-descriptions-item label="地址">北京市海淀区中关村科技园</el-descriptions-item>
          <el-descriptions-item label="工作时间">周一至周五 9:00-18:00</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  { icon: 'DataLine', title: '专业权威', desc: '所有内容均经过专业审核，确保信息准确可靠' },
  { icon: 'Reading', title: '通俗易懂', desc: '用简单易懂的语言解释复杂的技术原理' },
  { icon: 'Connection', title: '内容丰富', desc: '涵盖太阳能、风能、氢能等多种新能源类型' },
  { icon: 'TrendCharts', title: '实时更新', desc: '紧跟行业发展，及时更新最新技术和政策' }
]

const timeline = [
  { date: '2024年1月', title: '项目启动', content: '新能源科普百科项目正式立项，组建核心团队' },
  { date: '2024年3月', title: '内容建设', content: '完成首批20种新能源技术的内容编写和审核' },
  { date: '2024年6月', title: '平台上线', content: '网站正式上线，开始向公众提供新能源科普服务' },
  { date: '2024年12月', title: '持续发展', content: '用户突破10万，内容持续扩充和优化' }
]
</script>

<style scoped>
.about-page {
  padding-top: 80px;
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.about-hero {
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #fff;
  margin-bottom: 48px;
}

.about-hero h1 {
  font-size: 36px;
  margin-bottom: 12px;
}

.about-hero p {
  font-size: 18px;
  opacity: 0.9;
}

.about-section {
  margin-bottom: 48px;
}

.about-section h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
}

.about-section p {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  text-align: center;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.feature-card {
  text-align: center;
  padding: 24px;
}

.feature-card h3 {
  font-size: 18px;
  color: #333;
  margin: 16px 0 8px;
}

.feature-card p {
  font-size: 14px;
  color: #666;
}
</style>
