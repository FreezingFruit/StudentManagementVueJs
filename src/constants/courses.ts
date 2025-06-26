export const Courses = [
  'Bachelor of Science in Information and Technology',
  'Bachelor in Computer Science',
  'Bachelor of Science in Tourism',
  'Bachelor of Science in Hotel and Restaurant Management',
  'Bachelor of Science in Nursing',
] as const

export type Course = (typeof Courses)[number]
