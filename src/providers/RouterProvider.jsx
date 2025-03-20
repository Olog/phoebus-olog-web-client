import {
  createBrowserRouter,
  RouterProvider as ReactRouterDomRouterProvider
} from "react-router-dom";
import BetaApp from "beta/views/BetaApp";
import SearchView from "beta/views/SearchView";
// import { LogEntriesView } from "components/LogEntriesView";
import { AppErrorBoundary } from "components/shared/error/ErrorBoundary";
// import App from "views/App";
import CreateLogView from "views/CreateLogView";
import EditLogView from "views/EditLogView";
import { HelpView } from "views/HelpView";
import LogHistoryView from "views/LogHistoryView";
import NotFoundView from "views/NotFoundView";
import ReplyLogView from "views/ReplyLogView";
import { TestErrorView } from "views/TestErrorView";

export const routes = [
  // {
  //   path: "/legacy",
  //   element: <App />,
  //   children: [
  //     {
  //       path: "",
  //       element: <LogEntriesView />
  //     },
  //     {
  //       path: "logs/:id",
  //       element: <LogEntriesView />
  //     },
  //     {
  //       path: "logs/create",
  //       element: <CreateLogView />
  //     },
  //     {
  //       path: "logs/:id/reply",
  //       element: <ReplyLogView />
  //     },
  //     {
  //       path: "logs/:id/edit",
  //       element: <EditLogView />
  //     },
  //     {
  //       path: "logs/:id/history",
  //       element: <LogHistoryView />
  //     },
  //     {
  //       path: "error-test",
  //       element: <TestErrorView />
  //     },
  //     {
  //       path: "help",
  //       element: <HelpView />
  //     },
  //     {
  //       path: "*",
  //       element: <NotFoundView />
  //     }
  //   ]
  // },
  {
    path: "/",
    element: <BetaApp />,
    errorElement: <AppErrorBoundary />,
    children: [
      {
        path: "",
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
        path: "error-test",
        element: <TestErrorView />
      },
      {
        path: "help",
        element: <HelpView />
      },
      {
        path: "/*",
        element: <NotFoundView homeHref="/" />
      }
    ]
  }
];

const router = createBrowserRouter(routes);

const RouterProvider = () => {
  return <ReactRouterDomRouterProvider router={router} />;
};
export default RouterProvider;
