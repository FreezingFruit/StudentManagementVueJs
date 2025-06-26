# DIGISTUDENT - Student Management System

A web application made with VueJS and Typescript for managing student information efficiently

## Features

### Student Management

- **Register Students**: Allows student information to be registered with personal information and courses
- **View Students**: Displays all registered students in an organized card View
- **Edit Students**: Tap any student card to modify their information
- **Delete Studetns**: Press and hold any card to delete their information

### Search and Filter

- **Search**: Find students by name and address
- **Filter**: Filter age and courses to find specific student

### User Interface

- **Responsive Design**: Works with desktop and any mobile devices
- **Mobile-Optimized**: Touch-friendly interactions for mobile users

### TechStack

- **Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript
- **UI Library**: Element Plus
- **State Management**: Pinia
- **Storage**: localStorage for data persistence
- **Styling**: CSS with responsive design

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

- Open bash
- Type:
  - git clone https://github.com/FreezingFruit/StudentManagementVueJs.git
  - cd StudentManagementVueJs

2. Install Dependencies:

- Open bash or yarn
- Type:
  - for bash: npm install
  - for yarn: yarn install

3. Run the development Server

   - for bash: npm run dev
   - for yarn: yarn dev

4. Navigate to browser `http://localhost:5173`

## How to Use:

### Adding Students

1. Click the "Register a Student" card on the dashboard
2. Fill in the student's information:
   - Personal details (name, age, birthday, address)
   - Course selections from available options
3. Submit the form to add the student

### Managing Students

1. Click "Display Students" to view all registered students
2. Use the search bar to find specific students
3. Apply filters to narrow down the student list
4. **Edit**: Tap any student card to modify their information
5. **Delete**: Press and hold a student card to remove them

### Navigation

- Use the toggle button to switch between dashboard and student list views
- The header provides logout functionality
- All changes are automatically saved to localStorage

## Project Structure

```
src/
├── components/          # Vue components
│   ├── StudentList.vue     # Main student management component
│   ├── RegisterDrawer.vue  # Student registration form
│   ├── EditDrawer.vue     # Student editing form
│   └── BaseHeader.vue     # Application header
├── stores/             # Pinia state management
├── types/              # TypeScript interfaces
├── constants/          # Application constants
└── views/              # Page views
```

## Key Components

- **StudentList**: Main component handling student display, search, and management
- **RegisterDrawer**: Side drawer for adding new students
- **EditDrawer**: Side drawer for editing existing student information
- **BaseHeader**: Application header with branding and logout functionality

## Mobile Features

- Touch-friendly interface optimized for mobile devices
- Responsive grid layout that adapts to screen size
- Mobile-specific interactions (tap to edit, hold to delete)
- Optimized typography and spacing for small screens

## Data Persistence

Student data is automatically saved to the browser's localStorage, ensuring your information persists between sessions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**FreezingFruit**

- GitHub: [@FreezingFruit](https://github.com/FreezingFruit)
