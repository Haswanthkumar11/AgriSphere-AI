/** localStorage helpers — centralised so keys are never scattered across components. */

const KEYS = {
  TOKEN: 'agri_token',
  USER: 'agri_user',
  LANG: 'agri_lang',
};

export const getStoredToken = () => localStorage.getItem(KEYS.TOKEN);
export const setStoredToken = (token) => localStorage.setItem(KEYS.TOKEN, token);

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) =>
  localStorage.setItem(KEYS.USER, JSON.stringify(user));

export const clearStorage = () => {
  localStorage.removeItem(KEYS.TOKEN);
  localStorage.removeItem(KEYS.USER);
};
