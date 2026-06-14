import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { publicClient as client } from "../tools/client.js";
import { describe, test } from "mocha";
import { expect } from "earl";
import { faker } from "@faker-js/faker";
import { authenticatedClient } from "../tools/client.js";

const generator = new CoreEntititesGenerator(client);

describe("auth", () => {
  test("register -> verify -> login -> me -> refresh -> logout", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "Passw0rd!";

    const registerResponse = await client.register({
      body: { email, password, name: "Test User" },
    });
    expect(registerResponse).toEqual({
      status: 201,
      headers: expect.anything(),
      body: {
        email: email,
        name: "Test User",
        id: expect.anything(),
        isActive: true,
        isEmailVerified: false,
        createdTimestamp: expect.anything(),
      },
    });

    const loginBeforeVerify = await client.login({ body: { email, password } });
    expect(loginBeforeVerify).toEqual({
      status: 403,
      headers: expect.anything(),
      body: {},
    });

    await generator.users.updateFlags(email, { isEmailVerified: true });

    const loginResponse = await client.login({ body: { email, password } });
    expect(loginResponse).toEqual({
      status: 200,
      headers: expect.anything(),
      body: {
        user: {
          email: email,
          name: "Test User",
          id: expect.anything(),
          isActive: true,
          isEmailVerified: true,
          createdTimestamp: expect.anything(),
        },
        tokens: {
          accessToken: expect.anything(),
          refreshToken: expect.anything(),
          expiresIn: expect.anything(),
        },
      },
    });

    if (loginResponse.status !== 200 || !loginResponse?.body?.tokens) {
      throw new Error("Login response missing tokens");
    }
    const tokens = loginResponse.body.tokens;

    const authClient = authenticatedClient(tokens.accessToken);
    const meResponse = await authClient.me();
    expect(meResponse).toEqual({
      status: 200,
      headers: expect.anything(),
      body: {
        email: email,
        name: "Test User",
        id: expect.anything(),
        isActive: true,
        isEmailVerified: true,
        createdTimestamp: expect.anything(),
      },
    });

    const refreshResponse = await client.refreshToken({
      body: { refreshToken: tokens.refreshToken },
    });
    expect(refreshResponse).toEqual({
      status: 200,
      headers: expect.anything(),
      body: {
        accessToken: expect.anything(),
        refreshToken: expect.anything(),
        expiresIn: expect.anything(),
      },
    });

    if (refreshResponse.status !== 200 || !refreshResponse?.body) {
      throw new Error("Refresh response missing body");
    }
    const refreshed = refreshResponse.body;

    const logoutResponse = await client.logout({
      body: { refreshToken: refreshed.refreshToken },
    });
    expect(logoutResponse).toEqual({
      status: 204,
      headers: expect.anything(),
      body: expect.a(Blob),
    });

    const refreshAfterLogout = await client.refreshToken({
      body: { refreshToken: refreshed.refreshToken },
    });
    expect(refreshAfterLogout).toEqual({
      status: 401,
      headers: expect.anything(),
      body: {},
    });
  });
});
