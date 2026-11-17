/**
 * Application Configuration
 */

// Allow override via Expo environment variables
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://aidocare-backend-production.up.railway.app';

export const STORAGE_KEYS = {
  TOKEN: 'aido_mobile_token',
  USER: 'aido_mobile_user',
  REMEMBER_EMAIL: 'aido_mobile_remember_email',
};
