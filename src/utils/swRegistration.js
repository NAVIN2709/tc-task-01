export const getSWRegistration = async () => {
  if (!("serviceWorker" in navigator)) return null;

  const existing = await navigator.serviceWorker.getRegistration("/");

  if (existing) return existing;

  return await navigator.serviceWorker.register("/sw.js");
};
