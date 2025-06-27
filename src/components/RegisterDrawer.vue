<script lang="ts" setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useStudentStore } from '@/stores/register.ts'
import { ElMessage } from 'element-plus'
import type { Student } from '../types/studentInterface'
import { Courses } from '@/constants/courses'
import { studentFormRules } from '../composables/ruleForm'
import { capitalize } from '@/composables/capitalize'

interface Props {
  modelValue: boolean
}

interface Emits {
  'update:modelValue': [value: boolean]
  'student-registered': [student: Student]
  'form-validation-error': [errors: string[]]
  'operation-success': [message: string]
  'operation-error': [message: string]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isMobile = ref(window.innerWidth <= 768)

const studentStore = useStudentStore()
const formRef = ref()
const isLoading = ref(false)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

watch(
  () => studentStore.studentInfo.firstName,
  (newValue) => {
    if (newValue) {
      studentStore.studentInfo.firstName = capitalize(newValue)
    }
  },
)

watch(
  () => studentStore.studentInfo.lastName,
  (newValue) => {
    if (newValue) {
      studentStore.studentInfo.lastName = capitalize(newValue)
    }
  },
)

watch(
  () => studentStore.studentInfo.middleInitial,
  (newValue) => {
    if (newValue) {
      studentStore.studentInfo.middleInitial = newValue.toUpperCase()
    }
  },
)

watch(
  () => studentStore.studentInfo.address,
  (newValue) => {
    if (newValue) {
      studentStore.studentInfo.address = newValue.toUpperCase()
    }
  },
)

const closeDrawer = () => {
  emit('update:modelValue', false)
}

//Mobile resizing
function updateIsMobile() {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})

function calculateAge(birthDate: string): number {
  if (!birthDate) return 0

  const today = new Date()
  const birth = new Date(birthDate)

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  if (age < 17 && age > 0) {
    ElMessage.warning('Age should be atleast 17 years old')
  }
  return age
}

watch(
  () => studentStore.studentInfo.birthDay,
  (newBirthDay) => {
    if (newBirthDay) {
      studentStore.studentInfo.age = calculateAge(newBirthDay)
    }
    nextTick(() => {
      formRef.value?.validateField('age')
    })
  },
)

async function onSubmit() {
  if (!formRef.value) return
  isLoading.value = true

  try {
    let valid = false
    await formRef.value.validate((validResult: boolean) => {
      valid = validResult
    })
    if (!valid) {
      ElMessage.error('Please fill in all required fields correctly')
      emit('form-validation-error', ['Form validation failed'])
      return
    }

    await wait(1000)

    const newStudent = { ...studentStore.studentInfo }
    console.log('Form submitted:', newStudent)

    studentStore.addStudent()

    formRef.value.resetFields()
    emit('update:modelValue', false)

    ElMessage.success('Registration successful')
    emit('student-registered', newStudent)
    emit(
      'operation-success',
      `Student ${newStudent.firstName} ${newStudent.lastName} registered successfully`,
    )
  } catch (error) {
    console.error('Form submission error:', error)
    ElMessage.error('Registration failed. Please try again.')
    emit('operation-error', 'Registration failed due to validation errors')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="Register"
    :with-header="false"
    :size="isMobile ? '100%' : '40%'"
    direction="rtl"
  >
    <button class="close-button" @click="closeDrawer" aria-label="Close drawer">×</button>
    <span><h2>Register</h2></span>

    <el-form
      :model="studentStore.studentInfo"
      ref="formRef"
      :rules="studentFormRules"
      label-position="top"
      label-width="100%"
      :inline="false"
    >
      <el-form-item label="First Name" prop="firstName">
        <el-input
          v-model="studentStore.studentInfo.firstName"
          placeholder="Enter your name"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="Middle Initial" prop="middleInitial">
        <el-input
          v-model="studentStore.studentInfo.middleInitial"
          :minlength="1"
          :maxlength="3"
          placeholder="Enter your middle initial (type 'NA' if unavailable)"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="Last Name" prop="lastName">
        <el-input
          v-model="studentStore.studentInfo.lastName"
          placeholder="Enter your last name"
          required
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="Birthday" prop="birthDay">
        <el-input
          v-model="studentStore.studentInfo.birthDay"
          type="date"
          placeholder="Enter your Birthday"
          required
        ></el-input>
      </el-form-item>
      <el-form-item label="Age" prop="age">
        <el-input
          v-model.number="studentStore.studentInfo.age"
          :min="1"
          :max="100"
          placeholder="Auto-calculated from birthday"
          readonly
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="Address" prop="address"
        ><el-input
          v-model="studentStore.studentInfo.address"
          type="textarea"
          rows="2"
          placeholder="Enter your address"
        ></el-input
      ></el-form-item>
      <el-form-item label="Courses" prop="courses">
        <el-select
          v-model="studentStore.studentInfo.courses"
          multiple
          placeholder="Select Courses"
          style="width: 100%"
        >
          <el-option v-for="course in Courses" :key="course" :label="course" :value="course" />
        </el-select>
      </el-form-item>

      <el-button
        color="#0683D0"
        size="large"
        type="primary"
        icon="Select"
        :loading="isLoading"
        :disabled="isLoading"
        @click="onSubmit"
      >
        {{ isLoading ? 'Saving...' : 'Submit' }}
      </el-button>
    </el-form>
  </el-drawer>
</template>

<style scoped>
.el-drawer__body {
  padding: 24px;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.close-button:hover {
  box-shadow: 0 0 10px black;
}

.el-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 768px) {
  .el-drawer__body {
    padding: 16px 12px;
  }

  h2 {
    font-size: 20px;
    text-align: center;
    margin-bottom: 16px;
  }

  .el-form {
    gap: 12px;
  }

  .el-form-item__label {
    font-size: 14px;
  }

  .el-input,
  .el-textarea,
  .el-select {
    font-size: 14px;
  }

  .el-button {
    font-size: 14px;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .el-drawer__body {
    padding: 12px 10px;
  }

  h2 {
    font-size: 18px;
  }

  .el-button {
    height: 42px;
  }
}
</style>
