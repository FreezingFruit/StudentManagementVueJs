<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { Student } from '../types/studentInterface'
import { Courses } from '@/constants/courses'
import { useStudentStore } from '../stores/register'
import { studentFormRules } from '@/composables/ruleForm'

interface Props {
  modelValue: boolean
  student: Student | null
  studentIndex: number
}

interface Emits {
  'update:modelValue': [value: boolean]
  'student-updated': [student: Student, index: number]
  'operation-success': [message: string]
  'operation-error': [message: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const editFormRef = ref()
const isLoading = ref(false)

const editStudentInfo = ref<Student>({
  firstName: '',
  middleInitial: '',
  lastName: '',
  birthDay: '',
  age: 0,
  address: '',
  courses: [],
})

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function calculateAge(birthDate: string): number {
  if (!birthDate) return 0

  const today = new Date()
  const birth = new Date(birthDate)

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Watch for student prop changes to populate the form
watch(
  () => props.student,
  (newStudent) => {
    if (newStudent) {
      editStudentInfo.value = {
        firstName: newStudent.firstName,
        middleInitial: newStudent.middleInitial,
        lastName: newStudent.lastName,
        birthDay: newStudent.birthDay,
        age: newStudent.age,
        address: newStudent.address,
        courses: Array.isArray(newStudent.courses) ? [...newStudent.courses] : [],
      }
    }
  },
  { immediate: true },
)

watch(
  () => editStudentInfo.value.birthDay,
  (newBirthDay) => {
    if (newBirthDay) {
      editStudentInfo.value.age = calculateAge(newBirthDay)
    }
    nextTick(() => {
      editFormRef.value?.validateField('age')
    })
  },
)

async function onEditSubmit() {
  if (!editFormRef.value || isLoading.value) return

  isLoading.value = true

  try {
    let valid = false
    await editFormRef.value.validate((validResult: boolean) => {
      valid = validResult
    })
    if (!valid) {
      ElMessage.error('Please fill in all required fields')
      return
    }

    await wait(1000)

    const updatedStudent = { ...editStudentInfo.value }
    console.log('Updating student:', updatedStudent)

    const studentStore = useStudentStore()
    studentStore.updateStudent(props.studentIndex, updatedStudent)

    emit('update:modelValue', false)
    ElMessage.success('Student updated successfully!')
    emit('student-updated', updatedStudent, props.studentIndex)
    emit(
      'operation-success',
      `Student ${updatedStudent.firstName} ${updatedStudent.lastName} updated successfully`,
    )
  } catch (error) {
    console.error('Error:', error)
    ElMessage.error('Something went wrong')
    emit('operation-error', 'Failed to update student')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="Edit Student"
    :withHeader="false"
  >
    <span><h2>Edit student</h2></span>
    <el-form
      :model="editStudentInfo"
      ref="editFormRef"
      :rules="studentFormRules"
      label-position="top"
      size="normal"
    >
      <el-form-item label="First Name" prop="firstName">
        <el-input v-model="editStudentInfo.firstName" placeholder="First Name" clearable></el-input>
      </el-form-item>

      <el-form-item label="Middle Initial" prop="middleInitial">
        <el-input
          v-model="editStudentInfo.middleInitial"
          :maxlength="2"
          :minlength="1"
          placeholder="Middle Inital"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="Last Name" prop="lastName">
        <el-input v-model="editStudentInfo.lastName" placeholder="Last Name" clearable></el-input>
      </el-form-item>

      <el-form-item label="Birthday" prop="birthDay">
        <el-input v-model="editStudentInfo.birthDay" type="date" placeholder="Birthday"></el-input>
      </el-form-item>

      <el-form-item label="Age" prop="age">
        <el-input
          v-model="editStudentInfo.age"
          :min="1"
          :max="100"
          placeholder="Age"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="Address" prop="address">
        <el-input
          v-model="editStudentInfo.address"
          type="textarea"
          rows="3"
          placeholder="Address"
        ></el-input>
      </el-form-item>

      <el-form-item label="Course" prop="courses">
        <el-select
          v-model="editStudentInfo.courses"
          multiple
          placeholder="Select Courses"
          style="width: 100%"
        >
          <el-option v-for="course in Courses" :key="course" :label="course" :value="course">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="isLoading" :disabled="isLoading" @click="onEditSubmit">
          {{ isLoading ? 'Updating...' : 'Edit Student' }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped>
.el-drawer__body {
  padding: 24px;
}

.el-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h2 {
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .el-drawer__body {
    padding: 16px 12px;
  }

  h2 {
    font-size: 20px;
    text-align: center;
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
