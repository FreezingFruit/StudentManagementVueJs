import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Student } from '@/types/studentInterface'

export const useStudentStore = defineStore('students', () => {
  const studentInfo = ref<Student>({
    firstName: '',
    middleInitial: '',
    lastName: '',
    birthDay: '',
    age: 0,
    address: '',
    courses: [],
  })

  const students = ref<Student[]>([])

  function addStudent() {
    students.value.push({ ...studentInfo.value })
    saveToStorage()
    resetStudentInfo()
  }

  function updateStudent(index: number, updatedStudent: Student) {
    if (index >= 0 && index < students.value.length) {
      students.value[index] = updatedStudent
      saveToStorage()
    }
  }

  function saveToStorage() {
    localStorage.setItem('students', JSON.stringify(students.value))
  }

  function resetStudentInfo() {
    studentInfo.value = {
      firstName: '',
      middleInitial: '',
      lastName: '',
      birthDay: '',
      age: 0,
      address: '',
      courses: [],
    }
  }

  function loadStudents() {
    const saved = localStorage.getItem('students')
    if (saved) {
      students.value = JSON.parse(saved)
    }
  }
  return {
    studentInfo,
    students,
    addStudent,
    updateStudent,
    loadStudents,
  }
})
