<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getStoredAdminCredentials } from '@/components/utils/adminInit'
import { passwordFields, passwordResetRules } from '@/composables/ruleForm'

const router = useRouter()
const formRef = ref()
const newPassword = passwordFields.newPassword
const confirmPassword = ref('')
const isLoading = ref(false)

async function resetPassword() {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()

    if (valid) {
      isLoading.value = true

      setTimeout(() => {
        const currentAdmin = getStoredAdminCredentials()

        if (!currentAdmin) {
          ElMessage.error('Admin credentials not found')
          isLoading.value = false
          return
        }

        const updatedAdminData = {
          username: currentAdmin.username,
          password: newPassword.value,
        }
        localStorage.setItem('admin', JSON.stringify(updatedAdminData))

        ElMessage.success('Admin password reset successfully!')
        isLoading.value = false

        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }, 1500)
    }
  } catch (error) {
    console.log('Validation failed:', error)
    isLoading.value = false
  }
}
</script>

<template>
  <div class="form-body">
    <div class="forgot-password-container">
      <h2>Reset Password</h2>
      <p class="subtitle">Enter new admin password</p>

      <el-form
        ref="formRef"
        :model="{ newPassword, confirmPassword }"
        :rules="passwordResetRules"
        label-width="auto"
      >
        <el-form-item prop="newPassword">
          <el-input
            v-model="newPassword"
            type="password"
            placeholder="New Password"
            required
            show-password
            prefix-icon="Lock"
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            show-password
            prefix-icon="Lock"
          />
        </el-form-item>

        <el-button type="primary" size="default" :loading="isLoading" @click="resetPassword">
          {{ isLoading ? 'Resetting...' : 'Reset Password' }}
        </el-button>
      </el-form>

      <router-link to="/login" class="forgot-password-link"> Back to Login </router-link>
    </div>
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
  width: 500px;
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
  background-color: #53dbfd;
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

.forgot-password-container {
  text-align: center;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

h2 {
  color: white;
  margin-bottom: 10px;
  font-size: 2rem;
  font-weight: 600;
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
  font-size: 1.1rem;
  font-weight: 400;
}

.forgot-password-link {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  color: white;
  text-decoration: none;
}

.forgot-password-link:hover {
  text-decoration: underline;
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

  .forgot-password-container {
    max-width: 350px;
  }

  h2 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
    margin-bottom: 25px;
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

  .forgot-password-container {
    max-width: 280px;
  }

  h2 {
    font-size: 1.6rem;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }

  .forgot-password-link {
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

  .forgot-password-container {
    max-width: 250px;
  }

  h2 {
    font-size: 1.4rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .forgot-password-link {
    font-size: 13px;
    margin-top: 10px;
  }
}
</style>
