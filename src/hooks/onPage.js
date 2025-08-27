const showSearchBoxRegex = /^\/$|^\/logs\/?$|^\/logs\/\d+$/;
const createPageRegex = /^\/logs\/create\/?$/;
const editPageRegex = /^\/logs\/\d+\/edit\/?$/;

export const onHomePage = () =>
  showSearchBoxRegex.test(window.location.pathname);
export const onEditPage = () => editPageRegex.test(window.location.pathname);
export const onCreatePage = () =>
  createPageRegex.test(window.location.pathname);
