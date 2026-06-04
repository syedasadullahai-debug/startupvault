export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const TOKEN_KEY = 'sv_token';
export const THEME_KEY = 'sv_theme';

export const CATEGORIES = [
  'FinTech', 'HealthTech', 'EdTech', 'E-Commerce', 'SaaS',
  'AI/ML', 'Web3', 'Gaming', 'Social', 'CleanTech',
  'FoodTech', 'PropTech', 'LegalTech', 'HRTech', 'Other',
];

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const ROLES = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN',
};

export const MAX_JOINED_STARTUPS = 2;
