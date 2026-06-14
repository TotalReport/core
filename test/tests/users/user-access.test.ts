import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { faker } from "@faker-js/faker";
import { expect } from "earl";
import { describe, test } from "mocha";
import { authenticatedClient, publicClient } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(publicClient);

describe("user system access", () => {
  test("login is forbidden when email is not verified", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "Passw0rd!";

    await generator.users.create({ email, password });

    const loginResponse = await publicClient.login({ body: { email, password } });

    expect(loginResponse).toEqual({
      status: 403,
      headers: expect.anything(),
      body: {},
    });
  });

  test("login is forbidden when user is disabled", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "Passw0rd!";

    await generator.users.create({
      email,
      password,
      isEmailVerified: true,
      isActive: false,
    });

    const loginResponse = await publicClient.login({ body: { email, password } });

    expect(loginResponse).toEqual({
      status: 403,
      headers: expect.anything(),
      body: {},
    });
  });

  test("protected routes are forbidden when email is not verified", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "Passw0rd!";

    await generator.users.create({
      email,
      password,
      isEmailVerified: true,
    });

    const loginResponse = await publicClient.login({ body: { email, password } });
    expect(loginResponse.status).toEqual(200);

    await generator.users.updateFlags(email, { isEmailVerified: false });

    const response = await authenticatedClient(
      loginResponse.body.tokens.accessToken,
    ).createLaunch({
      body: {
        title: "Blocked launch",
        startedTimestamp: new Date("2024-07-21T06:52:32Z"),
      },
    });

    expect(response).toEqual({
      status: 403,
      headers: expect.anything(),
      body: { message: "Forbidden" },
    });
  });

  test("protected routes are forbidden when user is disabled", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "Passw0rd!";

    await generator.users.create({
      email,
      password,
      isEmailVerified: true,
    });

    const loginResponse = await publicClient.login({ body: { email, password } });
    expect(loginResponse.status).toEqual(200);

    await generator.users.updateFlags(email, { isActive: false });

    const response = await authenticatedClient(
      loginResponse.body.tokens.accessToken,
    ).createLaunch({
      body: {
        title: "Blocked launch",
        startedTimestamp: new Date("2024-07-21T06:52:32Z"),
      },
    });

    expect(response).toEqual({
      status: 403,
      headers: expect.anything(),
      body: { message: "Forbidden" },
    });
  });

  test("refresh is forbidden when email is not verified", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "Passw0rd!";

    await generator.users.create({ email, password, isEmailVerified: true });
    const loginResponse = await publicClient.login({ body: { email, password } });
    expect(loginResponse.status).toEqual(200);

    await generator.users.updateFlags(email, { isEmailVerified: false });

    const refreshResponse = await publicClient.refreshToken({
      body: { refreshToken: loginResponse.body.tokens.refreshToken },
    });

    expect(refreshResponse).toEqual({
      status: 403,
      headers: expect.anything(),
      body: {},
    });
  });

  test("verified active user can use protected routes", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = "Passw0rd!";

    await generator.users.create({ email, password, isEmailVerified: true });
    const loginResponse = await publicClient.login({ body: { email, password } });
    expect(loginResponse.status).toEqual(200);

    const response = await authenticatedClient(
      loginResponse.body.tokens.accessToken,
    ).createLaunch({
      body: {
        title: "Allowed launch",
        startedTimestamp: new Date("2024-07-21T06:52:32Z"),
      },
    });

    expect(response.status).toEqual(201);
  });
});
