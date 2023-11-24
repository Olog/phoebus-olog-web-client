import BetaApp from "beta/views/BetaApp";
import SearchView from "beta/views/SearchView";
import LogEntriesView from "components/LogEntriesView";
import React from "react";
import {
    createBrowserRouter,
    RouterProvider as ReactRouterDomRouterProvider,
  } from "react-router-dom";
import App from "views/App";
import CreateLogView from "views/CreateLogView";
import EditLogView from "views/EditLogView";
import LogHistoryView from "views/LogHistoryView";
import ReplyLogView from "views/ReplyLogView";

export const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <LogEntriesView />
            },
            {
                path: "logs/:id",
                element: <LogEntriesView />
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
            }
        ]
    },
    {
        path: "/beta",
        element: <BetaApp />,
        children: [
            {
                path: "",
                element: <SearchView />
            },
            {
                path: "logs/:id",
                element: <SearchView />
            },
        ]
    },
];

const router = createBrowserRouter(routes);

const RouterProvider = () => {
    return (
        <ReactRouterDomRouterProvider router={router} />
    )
}
export default RouterProvider;