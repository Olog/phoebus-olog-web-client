import { useLocation } from "react-router-dom";

const showSearchBoxRegex = /^\/$|^\/logs$|^\/logs\/\d+$/;
const createPageRegex = /^\/logs\/create\/?$/;
export const editPageRegex = /^\/logs\/\d+\/edit\/?$/;

export const useOnPage = () => {
  const { pathname } = useLocation();
  return {
    onHomePage: showSearchBoxRegex.test(pathname),
    onEditPage: editPageRegex.test(pathname),
    onCreatePage: createPageRegex.test(pathname)
  };
};
