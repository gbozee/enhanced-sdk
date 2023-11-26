import { expect, test, describe } from "bun:test";
// import { EnhancedSavingsClient } from "../src";
import { EnhancedSavingsClient } from "../dist";

describe("EnhancedSavingsClient", () => {
  const options = {
    baseUrl: process.env.BASE_URL,
  };
  const client = new EnhancedSavingsClient(options);

  describe("updateAuthToken", () => {
    test("should update the authentication token", async () => {
      // Define the payload for updating the auth token
      const payload = {
        api_key: "api_key",
        api_secret: "api_secret",
        owner: "owner",
        email: "email@example.com",
        password: "password",
      };
      await client.updateAuthToken(payload);
      console.log("token", client.token);
      // test the example exposed method
      const result = await client.exampleCall();
      expect(result).toEqual({
        hello: "world",
      });
    });
    test("run worker test", async () => {
      const worker = new Worker(new URL("../dist/worker.js", import.meta.url));
      const result = await client.sampleWorker(worker);
      expect(result).toEqual({
        hello: "world",
      });
    });
  });

  // Add more test cases for other functions in the EnhancedSavingsClient class
});
