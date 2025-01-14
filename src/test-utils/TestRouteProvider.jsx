import { routes } from "providers/RouterProvider";
import React from "react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

const TestRouteProvider = ({initialEntries=["/"]}) => {

    const router = createMemoryRouter(routes, { initialEntries });
  
    return <RouterProvider router={router} />
  
}

export default TestRouteProvider;