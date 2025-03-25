const showSearchBoxRegex = /^\/$|^\/$|^\/logs$|^\/logs\/\d+$/;

export const onHomePage = (pathname) => showSearchBoxRegex.test(pathname);
