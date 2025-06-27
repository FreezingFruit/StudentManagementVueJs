import type { FormRules } from 'element-plus'
import { ref } from 'vue'

const namePattern = /^[A-Za-z\s'-]+$/
const middleInitialPattern = /^[A-Za-z]{1,3}$/
const newPassword = ref('')

const validateCollegeAge = (_rule: unknown, value: number, callback: (error?: Error) => void) => {
  if (!value) {
    return callback(new Error('Age is required'))
  }
  if (value < 17) {
    return callback(new Error('Minimum age is 17'))
  }
  if (value > 100) {
    return callback(new Error('Invalid Age'))
  }
  callback()
}

export const studentFormRules: FormRules = {
  firstName: [
    { required: true, message: 'Please input first name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50 characters', trigger: 'blur' },
    { pattern: namePattern, message: 'Numbers are invalid name inputs', trigger: 'blur' },
  ],
  middleInitial: [
    { required: true, message: 'Ex. T. IG', trigger: 'blur' },
    { min: 1, max: 3, message: 'Length maximum is 2', trigger: 'blur' },
    { pattern: middleInitialPattern, message: 'Numbers are invalid inputs', trigger: 'blur' },
  ],
  lastName: [
    { required: true, message: 'Please input last name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50 characters', trigger: 'blur' },
    { pattern: namePattern, message: 'Numbers are invalid inputs', trigger: 'blur' },
  ],
  birthDay: [{ required: true, message: 'Please select birthday', trigger: 'change' }],
  age: [
    { required: true, message: 'Please input age', trigger: 'blur' },
    { required: true, type: 'number', message: 'Age must be a number', trigger: 'blur' },
    { validator: validateCollegeAge, trigger: 'blur' },
  ],
  address: [
    { required: true, message: 'Please input address', trigger: 'blur' },
    { min: 10, message: 'Address should be at least 10 characters', trigger: 'blur' },
  ],
  courses: [
    { required: true, message: 'Please select a course', trigger: 'blur' },
    {
      type: 'array',
      min: 1,
      message: 'Please select at least one course',
      trigger: 'change',
    },
  ],
}

export const adminFormRules: FormRules = {
  username: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }],
}

export const passwordFields = {
  newPassword,
}

export const passwordResetRules: FormRules = {
  newPassword: [
    { required: true, message: 'Please input new password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    {
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== newPassword.value) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
