import { setupServer } from "msw/node";
import { handlers } from "./handler.js";

export const server = setupServer(...handlers);
