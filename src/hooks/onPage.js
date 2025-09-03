const showSearchBoxRegex = /^\/$|^\/logs\/?$|^\/logs\/\d+$/;
const createPageRegex = /^\/logs\/create\/?$/;

export const onHomePage = (pathname) => showSearchBoxRegex.test(pathname);
export const onCreatePage = (pathname) => createPageRegex.test(pathname);
