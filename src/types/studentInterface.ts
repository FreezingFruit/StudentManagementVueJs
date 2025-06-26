import type { Course } from '@/constants/courses'

export interface Student {
  firstName: string
  middleInitial: string
  lastName: string
  birthDay: string
  age: number
  address: string
  courses: Course[]
}
