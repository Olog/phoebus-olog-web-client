import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { routes } from "providers/RouterProvider";

const TestRouteProvider = ({ initialEntries = ["/"] }) => {
  const router = createMemoryRouter(routes, { initialEntries });

  return <RouterProvider router={router} />;
};

export default TestRouteProvider;
