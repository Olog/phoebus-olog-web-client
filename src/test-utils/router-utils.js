import { routes } from "providers/RouterProvider";
import React from "react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

export const TestRouteProvider = ({ initialEntries = ["/"] }) => {
  const router = createMemoryRouter(routes, { initialEntries });

  return <RouterProvider router={router} />;
};
