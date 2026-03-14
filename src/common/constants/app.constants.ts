export const APP_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  CACHE: {
    TTL_SHORT: 60,
    TTL_MEDIUM: 300,
    TTL_LONG: 3600,
  },

  UPLOAD: {
    MAX_IMAGE_SIZE: 5 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
    MAX_IMAGES_PER_PROPERTY: 20,
  },

  BOOKING: {
    MIN_NIGHTS: 1,
    MAX_NIGHTS: 365,
    CANCELLATION_HOURS: 24,
  },

  REVIEW: {
    MIN_RATING: 1,
    MAX_RATING: 5,
  },

  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
} as const;