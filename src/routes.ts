export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  WIDGET: '/booking/:id',
  
  // Owner routes
  OWNER_DASHBOARD: '/owner/dashboard',
  OWNER_ESCAPE_ROOMS: '/owner/escape-rooms',
  OWNER_ESCAPE_ROOM: '/owner/escape-room/:id',
  OWNER_ESCAPE_ROOMS_CREATE: '/owner/escape-rooms/new',
  OWNER_ESCAPE_ROOMS_UPDATE: '/owner/escape-rooms/edit/:id',
  OWNER_ROOMS: '/owner/rooms/:escaperoom_id',
  OWNER_ROOM: '/owner/room/:id',
  OWNER_ROOMS_CREATE: '/owner/rooms/new/:escaperoom_id',
  OWNER_ROOMS_UPDATE: '/owner/rooms/edit/:id',
  OWNER_BOOKINGS: '/owner/bookings',
} as const;