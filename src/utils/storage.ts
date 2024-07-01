export const saveToStorage = (key: string, value: string) =>
  window.localStorage.setItem(key, value);

export const getFromStorage = (key: string) => window.localStorage.getItem(key);
