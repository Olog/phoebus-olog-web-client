import { setupServer } from "msw/node";
import { defaultHandlers } from "./handlers";

// Setup MSW for node env, e.g. for tests
export const server = setupServer(...defaultHandlers);
