export const saveToStorage = (key: string, value: string) =>
  localStorage.setItem(key, value);

export const getFromStorage = (key: string) => localStorage.getItem(key);
