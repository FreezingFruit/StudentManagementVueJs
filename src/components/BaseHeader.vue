<script lang="ts" setup>
import { useAuthenticationStore } from '../stores/auth'

const authStore = useAuthenticationStore()
</script>

<template>
  <div class="header-container">
    <header class="header-content">
      <h2 class="title">DIGISTUDENT - STUDENT MANAGEMENT SYSTEM</h2>
      <div class="header-btns">
        <button @click="authStore.logout" class="logout-btn">
          <el-icon><ArrowLeftBold /></el-icon>Logout
        </button>
      </div>
    </header>
  </div>
</template>

<style scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgb(53, 2, 134);
  z-index: 1000;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(127, 255, 212, 0.2);
  border: none;
  outline: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  color: #7fffd4;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  background: linear-gradient(45deg, #7fffd4, #40e0d0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-btns {
  display: flex;
  align-items: center;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  position: relative;
  overflow: hidden;
}

.logout-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.logout-btn:hover::before {
  left: 100%;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  background: linear-gradient(45deg, #ff5252, #f44336);
}

.logout-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
}

.logout-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2.5;
}

@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }

  .title {
    font-size: 1.2rem;
    letter-spacing: 0.5px;
  }

  .logout-btn {
    padding: 8px 16px;
    font-size: 0.8rem;
  }

  .logout-icon {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1rem;
  }

  .logout-btn {
    padding: 6px 12px;
    gap: 6px;
  }

  .logout-btn span {
    display: none;
  }
}
</style>
