export const initGlobalVariables = () => {
  const app = window.__app || {};
  window.__app = app;
};
