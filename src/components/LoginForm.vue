<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '../stores/auth'
import { getStoredAdminCredentials } from '@/components/utils/adminInit'
import { adminFormRules } from '@/composables/ruleForm'

const router = useRouter()
const formRef = ref()
const authStore = useAuthenticationStore()
const { handleLogin } = authStore
const isLoading = ref(false)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function onSubmit() {
  if (!formRef.value) return
  isLoading.value = true

  try {
    const valid = await formRef.value.validate()

    if (!valid) {
      return
    }

    const storedAdmin = getStoredAdminCredentials()

    if (!storedAdmin) {
      ElMessage.error('Admin credentials not found')
      return
    }

    if (
      authStore.admin.username === storedAdmin.username &&
      authStore.admin.password === storedAdmin.password
    ) {
      await wait(1000)

      handleLogin()
      await router.push('/studentList')
      ElMessage.success('Login successful')
    } else {
      ElMessage.error('Invalid username or password')
    }
  } catch (error) {
    console.log('Validation failed:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/studentList')
  }
})
</script>

<template>
  <div class="form-body">
    <el-form
      ref="formRef"
      :model="authStore.admin"
      :rules="adminFormRules"
      label-width="auto"
      @submit.prevent="onSubmit"
    >
      <el-form-item prop="username">
        <el-input
          v-model="authStore.admin.username"
          class="input-login"
          placeholder="Username"
          required
          clearable
          prefix-icon="User"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="authStore.admin.password"
          type="password"
          class="input-login"
          required
          placeholder="Password"
          show-password
          prefix-icon="Lock"
          @keyup.enter="onSubmit"
        />
      </el-form-item>

      <el-button
        class="login-button"
        type="primary"
        size="default"
        :loading="isLoading"
        :disabled="isLoading"
        @click="onSubmit"
        >{{ isLoading ? 'Logging in...' : 'Login' }}</el-button
      >
      <router-link to="/forgotpassword" class="forgot-password"> Forgot password? </router-link>
    </el-form>
  </div>
</template>

<style scoped>
:deep(.el-input input) {
  color: white !important;
}

:deep(.el-input__wrapper) {
  background-color: transparent;
  height: 30px;
  padding: 20px;
  margin-bottom: 30px;
  font-size: 20px;
  width: 400px;
  color: white;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:deep(.el-input) {
  --el-input-placeholder-color: rgba(255, 255, 255, 0.7);
}

:deep(.el-input__prefix) {
  font-size: 1.5rem;
  color: white;
}

:deep(.el-button) {
  width: 100%;
  height: 50px;
  font-size: large;
  background-color: white;
  color: #2148c0;
  border-radius: 10px;
  box-shadow: 0px 5px rgba(0, 0, 0, 0.301);
  transition: all 0.3s ease;
}

:deep(.el-button):hover {
  transform: translateY(-5px);
  background-color: rgb(139, 210, 252);
}

.forgot-password {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  color: white;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}
.form-body {
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.input-login {
  color: white;
}

/* Mobile Responsive Breakpoints */
@media (max-width: 768px) {
  :deep(.el-input__wrapper) {
    width: 350px;
    font-size: 18px;
    padding: 18px;
  }

  :deep(.el-input__prefix) {
    font-size: 1.3rem;
  }

  :deep(.el-button) {
    height: 45px;
    font-size: 16px;
  }

  .form-body {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  :deep(.el-input__wrapper) {
    width: 280px;
    font-size: 16px;
    padding: 16px;
    margin-bottom: 25px;
  }

  :deep(.el-input__prefix) {
    font-size: 1.2rem;
  }

  :deep(.el-button) {
    height: 42px;
    font-size: 15px;
  }

  .form-body {
    padding: 12px;
  }

  .forgot-password {
    font-size: 14px;
    margin-top: 12px;
  }
}

@media (max-width: 360px) {
  :deep(.el-input__wrapper) {
    width: 250px;
    font-size: 14px;
    padding: 14px;
    margin-bottom: 20px;
  }

  :deep(.el-input__prefix) {
    font-size: 1.1rem;
  }

  :deep(.el-button) {
    height: 40px;
    font-size: 14px;
  }

  .forgot-password {
    font-size: 13px;
    margin-top: 10px;
  }
}
</style>
