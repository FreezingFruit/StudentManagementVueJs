export function initializeAdminCredentials() {
  const existingAdmin = localStorage.getItem('admin')

  if (!existingAdmin) {
    const defaultAdminData = {
      username: 'admin',
      password: 'admin123',
    }
    localStorage.setItem('admin', JSON.stringify(defaultAdminData))
    console.log('Default admin credentials initialized')
  }
}

export function getStoredAdminCredentials() {
  const adminData = localStorage.getItem('admin')
  return adminData ? JSON.parse(adminData) : null
}
//adminInit for adding in admin creds
