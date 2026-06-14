import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferRequest } from "@ts-rest/core";
import { faker } from "@faker-js/faker";
import { expect } from "earl";
import { describe, test } from "mocha";
import { publicClient } from "../../tools/client.js";
import "../../tools/earl-extensions.js";
import { RemoveNullishProps } from "../../tools/utils.js";

const generator = new CoreEntititesGenerator(publicClient);

describe("create user", () => {
  test("with minimum fields", async () => {
    const email = faker.internet.email().toLowerCase();
    const request: CreateUserRequestBodyRequiredFields = {
      email,
      password: "Passw0rd!",
    };

    const response = await publicClient.register({ body: request });

    expect(response).toEqual({
      status: 201,
      headers: expect.anything(),
      body: {
        id: expect.a(Number),
        email,
        isActive: true,
        isEmailVerified: false,
        createdTimestamp: expect.anything(),
      },
    });
  });

  test("with all fields", async () => {
    const email = faker.internet.email().toLowerCase();
    const request: CreateUserRequestBodyAllFieldsRequired = {
      email,
      password: "Passw0rd!",
      name: "Test User",
    };

    const response = await publicClient.register({ body: request });

    expect(response).toEqual({
      status: 201,
      headers: expect.anything(),
      body: {
        id: expect.a(Number),
        email,
        name: request.name,
        isActive: true,
        isEmailVerified: false,
        createdTimestamp: expect.anything(),
      },
    });
  });

  test("duplicate email", async () => {
    const created = await generator.users.create();

    const response = await publicClient.register({
      body: {
        email: created.email,
        password: "Passw0rd!",
        name: "Another User",
      },
    });

    expect(response).toEqual({
      status: 400,
      headers: expect.anything(),
      body: {},
    });
  });
});

type CreateUserRequestBodyRequiredFields =
  RemoveNullishProps<CreateUserRequestBody>;
type CreateUserRequestBodyAllFieldsRequired = Required<CreateUserRequestBody>;
type CreateUserRequestBody = CreateUserRequest["body"];
type CreateUserRequest = ClientInferRequest<typeof contract.register>;
