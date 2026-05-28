<template>
  <div class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3>新能源科普百科</h3>
        <p>致力于推广新能源知识，助力绿色发展</p>
      </div>
      <div class="footer-section">
        <h3>快速链接</h3>
        <ul>
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/list">能源百科</router-link></li>
          <li><router-link to="/about">关于我们</router-link></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>能源分类</h3>
        <ul>
          <li><router-link to="/list/太阳能">太阳能</router-link></li>
          <li><router-link to="/list/风能">风能</router-link></li>
          <li><router-link to="/list/水能">水能</router-link></li>
          <li><router-link to="/list/氢能">氢能</router-link></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>联系我们</h3>
        <p>邮箱：contact@newenergy.com</p>
        <p>电话：400-123-4567</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 新能源科普百科 版权所有</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 40px 0 0;
  margin-top: 60px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.footer-section h3 {
  font-size: 16px;
  margin-bottom: 16px;
  color: #409eff;
}

.footer-section p {
  font-size: 14px;
  line-height: 1.8;
  color: #bdc3c7;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: #bdc3c7;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #409eff;
}

.footer-bottom {
  text-align: center;
  padding: 20px;
  margin-top: 40px;
  border-top: 1px solid #34495e;
}

.footer-bottom p {
  font-size: 14px;
  color: #7f8c8d;
}
</style>
