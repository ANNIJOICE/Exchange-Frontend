export const getItemFromLocalStorage = (token: string) =>
  localStorage.getItem(token) || '';

export const setItemToLocalStorage = (key: string, value: string) =>
  localStorage.setItem(key, value);

export const clearLocalStorage = () => localStorage.clear();
