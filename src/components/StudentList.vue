<script lang="ts" setup>
import { ref, onMounted, computed, readonly } from 'vue'
import { useStudentStore } from '@/stores/register.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseHeader from '@/components/BaseHeader.vue'
import RegisterDrawer from '@/components/RegisterDrawer.vue'
import EditDrawer from '@/components/EditDrawer.vue'
import type { Student } from '../types/studentInterface'
import { Courses } from '@/constants/courses'
import { Avatar } from '@element-plus/icons-vue'

const emit = defineEmits<{
  studentRegistered: [student: Student]
  studentUpdated: [student: Student, index: number]
  studentDeleted: [index: number]
  viewModeChanged: [showCards: boolean]
  formValidationError: [errors: string[]]
  operationSuccess: [message: string]
  operationError: [message: string]
}>()

const searchQuery = ref('')
const selectedCourseFilter = ref<string>('')
const ageFilter = ref('')
const showFilters = ref(false)
const showStudentCard = ref(false)

const drawerRegister = ref(false)
const drawerEdit = ref(false)

const studentStore = useStudentStore()
const students = computed(() => studentStore.students)
const loadStudents = studentStore.loadStudents

const longPressTimer = ref<number | null>(null)
const isLongPress = ref(false)
const selectedStudent = ref<Student | null>(null)
const selectedIndex = ref<number>(-1)

const editStudentData = ref<Student | null>(null)
const editStudentIndex = ref(-1)

const filteredStudents = computed(() => {
  let filtered = [...studentStore.students]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((student) => {
      const fullName =
        `${student.firstName} ${student.middleInitial} ${student.lastName}`.toLowerCase()
      const address = student.address.toLowerCase()
      return fullName.includes(query) || address.includes(query)
    })
  }

  if (selectedCourseFilter.value) {
    filtered = filtered.filter((student) =>
      student.courses.some((course) => course === selectedCourseFilter.value),
    )
  }

  if (ageFilter.value) {
    const [min, max] = ageFilter.value.split('-').map(Number)
    filtered = filtered.filter((student) => student.age >= min && student.age <= max)
  }

  return filtered
})

function startLongPress(student: Student, index: number) {
  isLongPress.value = false
  selectedStudent.value = student
  selectedIndex.value = index
  longPressTimer.value = setTimeout(() => {
    isLongPress.value = true
    ElMessageBox.confirm(
      `Are you sure you want to delete ${student.firstName} ${student.middleInitial} ${student.lastName}`,
      'Delete Student?',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
      .then(() => {
        deleteStudent(index)
      })
      .catch(() => {
        ElMessage.info('Delete Cancelled')
        emit('operationError', 'Delete operation cancelled')
      })
  }, 400)
}

function endLongPress() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
  setTimeout(() => {
    if (!isLongPress.value && selectedStudent.value && selectedIndex.value >= 0) {
      editStudent(selectedStudent.value, selectedIndex.value)
    }
  }, 270)
}

function editStudent(student: Student, index: number) {
  try {
    editStudentData.value = student
    editStudentIndex.value = index
    drawerEdit.value = true
  } catch (error) {
    ElMessage.error('Something went wrong')
    emit('operationError', 'Failed to open edit form')
    console.error(error)
  }
}

function deleteStudent(index: number) {
  const deletedStudent = studentStore.students[index]
  studentStore.students.splice(index, 1)

  localStorage.setItem('students', JSON.stringify(studentStore.students))
  ElMessage.success('Deletion successful')

  emit('studentDeleted', index)
  emit(
    'operationSuccess',
    `Student ${deletedStudent.firstName} ${deletedStudent.lastName} deleted successfully`,
  )
}

function handleStudentRegistered(student: Student) {
  drawerRegister.value = false
  emit('studentRegistered', student)
}

function handleStudentUpdated(student: Student, index: number) {
  drawerEdit.value = false
  editStudentIndex.value = -1
  editStudentData.value = null
  emit('studentUpdated', student, index)
}

function handleRegistrationSuccess(message: string) {
  emit('operationSuccess', message)
}

function handleRegistrationError(message: string) {
  emit('operationError', message)
}

function handleFormValidationError(errors: string[]) {
  emit('formValidationError', errors)
}

function toggleViewMode() {
  showStudentCard.value = !showStudentCard.value
  emit('viewModeChanged', showStudentCard.value)
}

function openRegistration() {
  drawerRegister.value = true
}

onMounted(() => {
  loadStudents()
})

defineExpose({
  toggleViewMode,
  openRegistration,
  showStudentCard: readonly(showStudentCard),
})
</script>

<template>
  <BaseHeader />
  <div class="page-body">
    <div class="page-body-content">
      <!-- Dashboard Cards -->
      <div v-if="!showStudentCard" class="dashboard-cards">
        <el-card class="action-card" shadow="hover">
          <div class="card-header">
            <span class="card-title">
              <el-icon><UserFilled /></el-icon>
              Register a Student
            </span>
          </div>
          <div class="card-body">
            <p class="card-description">
              Add new students to the system with their personal information and course selections.
            </p>
            <el-button type="primary" class="action-btn" @click="drawerRegister = true">
              <el-icon><Plus /></el-icon>
              Open Registration
            </el-button>
          </div>
        </el-card>

        <el-card class="action-card" shadow="hover">
          <div class="card-header">
            <span class="card-title">
              <el-icon><Grid /></el-icon>
              Display Students
            </span>
          </div>
          <div class="card-body">
            <p class="card-description">
              View all registered students in an organized card layout with their details.
            </p>
            <el-button
              type="success"
              class="action-btn"
              @click="showStudentCard = !showStudentCard"
            >
              <el-icon><View /></el-icon>
              Show Students
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- Student List View -->
      <template v-if="showStudentCard">
        <div class="search-container">
          <div class="search-bar">
            <el-input
              v-model="searchQuery"
              placeholder="Search students by name or address..."
              prefix-icon="Search"
              clearable
              class="search-input"
            />
            <el-button
              icon="Filter"
              @click="showFilters = !showFilters"
              :type="showFilters ? 'primary' : 'default'"
            >
              Filters
            </el-button>
          </div>

          <el-collapse-transition>
            <div v-show="showFilters" class="filter-row">
              <el-select
                v-model="selectedCourseFilter"
                placeholder="Filter by course"
                clearable
                class="filter-select"
              >
                <el-option
                  v-for="course in Courses"
                  :key="course"
                  :label="course"
                  :value="course"
                />
              </el-select>

              <el-select
                v-model="ageFilter"
                placeholder="Filter by age range"
                clearable
                class="filter-select"
              >
                <el-option label="18-25" value="18-25" />
                <el-option label="26-35" value="26-35" />
                <el-option label="36-50" value="36-50" />
                <el-option label="50+" value="50-100" />
              </el-select>
            </div>
          </el-collapse-transition>

          <div class="instructions-banner">
            <div class="instruction-item">
              <el-icon class="instruction-icon"><EditPen /></el-icon>
              <span>Tap a card to edit student</span>
            </div>
            <div class="instruction-item">
              <el-icon class="instruction-icon"><Delete /></el-icon>
              <span>Press and hold a card to delete</span>
            </div>
          </div>
        </div>

        <div class="card-container">
          <div v-if="students.length === 0" class="no-students">
            <el-empty class="empty-desc" description="No students available" />
          </div>

          <el-card
            v-for="(student, index) in filteredStudents"
            :key="index"
            class="student-card"
            shadow="hover"
            @mousedown="startLongPress(student, index)"
            @mouseup="endLongPress"
            @touchstart="startLongPress(student, index)"
            @touchend="endLongPress"
          >
            <template #header>
              <div class="card-header">
                <span class="student-name" style="font-weight: bold">
                  <el-icon><Avatar /></el-icon>
                  {{ student.firstName }} {{ student.middleInitial }} {{ student.lastName }}
                </span>
              </div>
            </template>

            <div class="student-info">
              <p class="info-item">
                <el-icon><Calendar /></el-icon> <strong> Age:</strong> {{ student.age }} |
                <strong>Birthday:</strong> {{ student.birthDay }}
              </p>

              <p class="info-item">
                <el-icon><Location /></el-icon><strong> Address:</strong> {{ student.address }}
              </p>
              <p class="info-item">
                <el-icon><School /></el-icon>
                <strong> Courses: </strong>
                <span v-for="(course, index) in student.courses" :key="course">
                  {{ course }}<span v-if="index < student.courses.length - 1">, </span>
                </span>
              </p>
            </div>
          </el-card>
        </div>

        <el-button
          class="hide-student-btn"
          type="primary"
          size="default"
          @click="showStudentCard = false"
        >
          <el-icon><Hide /></el-icon> Hide Student
        </el-button>
      </template>
    </div>
  </div>

  <RegisterDrawer
    v-model="drawerRegister"
    @student-registered="handleStudentRegistered"
    @form-validation-error="handleFormValidationError"
    @operation-success="handleRegistrationSuccess"
    @operation-error="handleRegistrationError"
  />

  <EditDrawer
    v-model="drawerEdit"
    :student="editStudentData"
    :student-index="editStudentIndex"
    @student-updated="handleStudentUpdated"
    @operation-success="handleRegistrationSuccess"
    @operation-error="handleRegistrationError"
  />
</template>

<style lang="css" scoped>
.dashboard-cards {
  display: flex;
  gap: 24px;
  padding: 32px;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
}

.action-card {
  min-width: 250px;
  margin-top: 50px;
  border-radius: 12px;
  transition: transform 0.3s ease;
  height: 400px;
}

.action-card:hover {
  transform: translateY(-5px);
}

.card-header {
  padding: 10px;
}

.card-title {
  font-size: 30px;
  font-weight: 600;
  color: #303133;
}

.card-body {
  padding: 20px;
  text-align: center;
}

.action-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  top: 80px;
}

.student-card {
  width: 320px;
  min-height: 360px;
  max-height: 600px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.info-item {
  padding: 5px;
  font-size: 15px;
  margin: 4px 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
}

.student-name {
  font-size: 20px;
}

.student-card:hover {
  transform: translateY(-5px);
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
  padding: 18px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  cursor: pointer;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  overflow-x: hidden;
}

.page-body {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: #020024;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 9, 121, 1) 24%,
    rgba(0, 212, 255, 1) 100%
  );
  overflow: hidden;
}

.hide-student-btn {
  width: 60%;
  height: 48px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 15px;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
  margin-top: 20px;
  flex-shrink: 0;
}

.page-body-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 95%;
  max-width: 1600px;
  height: 90vh;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  margin-top: 50px;
}

.search-container {
  width: 100%;
  max-width: 1100px;
  padding: 20px;
  margin-bottom: 10px;
}

.search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.filter-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.filter-select {
  min-width: 200px;
}

.instructions-banner {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 12px 20px;
  background: #cc85d4;
  background: linear-gradient(90deg, rgba(204, 133, 212, 1) 32%, rgba(0, 212, 255, 1) 92%);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 16px;
  flex-wrap: wrap;
  cursor: default;
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #020024;
  font-size: 14px;
  font-weight: 500;
}

.instruction-icon {
  font-size: 16px;
  color: linear-gradient(90deg, rgba(107, 23, 115, 1) 32%, rgba(0, 212, 255, 1) 92%);
}

/* Mobile Responsive for Student List */
@media (max-width: 768px) {
  .dashboard-cards {
    padding: 16px;
    gap: 16px;
  }

  .action-card {
    min-width: 200px;
    height: 320px;
    margin-top: 20px;
  }

  .card-title {
    font-size: 24px;
  }

  .action-btn {
    font-size: 14px;
    height: 42px;
  }

  .page-body-content {
    width: 98%;
    height: 85vh;
    margin-top: 80px;
    border-radius: 16px;
  }

  .card-container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
    padding: 12px;
    max-height: calc(100vh - 250px);
  }

  .student-card {
    width: 100%;
    min-height: 320px;
  }

  .search-container {
    padding: 16px;
  }

  .search-bar {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .search-input {
    max-width: 100%;
  }

  .filter-row {
    gap: 8px;
    padding: 12px;
  }

  .filter-select {
    min-width: 150px;
    flex: 1;
  }

  .instructions-banner {
    gap: 16px;
    padding: 10px 16px;
  }

  .instruction-item {
    font-size: 12px;
  }

  .hide-student-btn {
    width: 80%;
    height: 44px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .dashboard-cards {
    padding: 12px;
    flex-direction: column;
  }

  .action-card {
    min-width: 180px;
    height: 280px;
    margin-top: 15px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-body {
    padding: 15px;
  }

  .action-btn {
    font-size: 13px;
    height: 40px;
  }

  .page-body-content {
    width: 100%;
    height: 80vh;
    margin-top: 100px;
    border-radius: 12px;
  }

  .card-container {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px;
    max-height: calc(100vh - 300px);
  }

  .student-card {
    min-height: 300px;
  }

  .student-name {
    font-size: 18px;
  }

  .info-item {
    font-size: 14px;
    padding: 4px;
  }

  .search-container {
    padding: 12px;
  }

  .filter-row {
    flex-direction: column;
    gap: 8px;
  }

  .filter-select {
    min-width: 100%;
  }

  .instructions-banner {
    gap: 12px;
    padding: 8px 12px;
    flex-direction: column;
    text-align: center;
  }

  .instruction-item {
    font-size: 11px;
    justify-content: center;
  }

  .hide-student-btn {
    width: 90%;
    height: 42px;
    font-size: 13px;
  }
}

@media (max-width: 360px) {
  .action-card {
    min-width: 160px;
    height: 260px;
  }

  .card-title {
    font-size: 18px;
  }

  .page-body-content {
    height: 75vh;
    margin-top: 120px;
  }

  .student-name {
    font-size: 16px;
  }

  .info-item {
    font-size: 13px;
  }

  .hide-student-btn {
    width: 95%;
    height: 40px;
    font-size: 12px;
  }
}
</style>
