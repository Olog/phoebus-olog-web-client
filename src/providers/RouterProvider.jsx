import {
  createBrowserRouter,
  RouterProvider as ReactRouterDomRouterProvider
} from "react-router-dom";
import App from "src/views/App";
import SearchView from "src/views/SearchView";
// import { LogEntriesView } from "components/LogEntriesView";
import { AppErrorBoundary } from "components/shared/error/ErrorBoundary";
import CreateLogView from "views/CreateLogView";
import EditLogView from "views/EditLogView";
import { HelpView } from "views/HelpView";
import LogHistoryView from "views/LogHistoryView";
import NotFoundView from "views/NotFoundView";
import ReplyLogView from "views/ReplyLogView";
// import LogEntriesView from "src/components/LogEntriesView/LogEntriesView";

export const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <AppErrorBoundary />,
    children: [
      {
        path: "",
        element: <SearchView />
      },
      {
        path: "logs/",
        element: <SearchView />
      },
      {
        path: "logs/:id",
        element: <SearchView />
      },
      {
        path: "logs/create",
        element: <CreateLogView />
      },
      {
        path: "logs/:id/reply",
        element: <ReplyLogView />
      },
      {
        path: "logs/:id/edit",
        element: <EditLogView />
      },
      {
        path: "logs/:id/history",
        element: <LogHistoryView />
      },
      {
        path: "help",
        element: <HelpView />
      },
      {
        path: "*",
        element: <NotFoundView homeHref="/" />
      }
    ]
  }
];

const router = createBrowserRouter(routes, {basename: import.meta.env.BASE_URL});

const RouterProvider = () => {
  return <ReactRouterDomRouterProvider router={router} />;
};
export default RouterProvider;
