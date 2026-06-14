import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { faker } from "@faker-js/faker";
import { expect } from "earl";
import { describe, test } from "mocha";
import { authenticatedClient, publicClient } from "../../tools/client.js";
import "../../tools/earl-extensions.js";
import { expect_toBe } from "../../tools/utils.js";

const generator = new CoreEntititesGenerator(publicClient);

describe("read user", () => {
  test("me", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "Passw0rd!";
    const created = await generator.users.create({
      email,
      password,
      name: "Test User",
      isEmailVerified: true,
    });

    const loginResponse = await publicClient.login({ body: { email, password } });
    expect_toBe(loginResponse.status, 200);

    const authClient = authenticatedClient(loginResponse.body.tokens.accessToken);
    const response = await authClient.me();

    expect(response).toEqual({
      status: 200,
      headers: expect.anything(),
      body: {
        ...created,
      },
    });
  });

  test("me without auth", async () => {
    const response = await publicClient.me();

    expect(response).toEqual({
      status: 401,
      headers: expect.anything(),
      body: {},
    });
  });
});
