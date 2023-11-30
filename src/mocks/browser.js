import { setupWorker } from "msw";
import { handlers } from "./handlers";

// Setup MSW for browser environment, e.g. for storybook
export const worker = setupWorker(...handlers);