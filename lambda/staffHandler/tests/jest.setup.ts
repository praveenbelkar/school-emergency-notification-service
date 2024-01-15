/*import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { jest } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import { server } from "./mocks/msw/server.js";

console.log("Setting up mocks...");

// Mock logging
jest.mock("logging", () => ({
  createLogger: jest.fn(),
  getLogger: () => console,
}));

// Mock HTTP responses
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock secrets manager
const secretsManagerMock = mockClient(SecretsManagerClient);
secretsManagerMock.resolves({
  SecretString: JSON.stringify({
    clientId: "tokenClientId",
    clientSecret: "tokenClientSecret",
  }),
});*/
