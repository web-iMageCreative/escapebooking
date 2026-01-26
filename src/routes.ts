export const ROUTES = {
  LOGIN: '/login',
  
  // Admin routes
  // ADMIN_USERS: '/admin/users',
  // ADMIN_SETTINGS: '/admin/settings',
  
  // Owner routes
  OWNER_DASHBOARD: 'owner/dashboard',
  OWNER_ESCAPE_ROOMS: '/owner/escape-rooms',
  OWNER_ESCAPE_ROOM: '/owner/escape-room/:id',
  OWNER_ESCAPE_ROOMS_CREATE: '/owner/escape-rooms/new',
  OWNER_ESCAPE_ROOMS_UPDATE: '/owner/escape-rooms/edit/:id',
  OWNER_ROOMS: '/owner/room/:escaperoom_id'
  // OWNER_BOOKINGS: '/owner/bookings',
  
  // Customer routes
  // CUSTOMER_BROWSE: '/customer/browse',
  // CUSTOMER_MY_BOOKINGS: '/customer/my-bookings',
  
  // Public routes
  // HOME: '/',
  // ABOUT: '/about',
  // CONTACT: '/contact'
} as const;