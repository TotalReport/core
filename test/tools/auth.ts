import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { contract } from "@total-report/core-contract/contract";
import { faker } from "@faker-js/faker";
import { InitClientReturn } from "@ts-rest/core";
import { authenticatedClient, publicClient } from "./client.js";

export type VerifiedTestUserSession = {
  client: InitClientReturn<typeof contract, { baseUrl: string }>;
  generator: CoreEntititesGenerator;
  email: string;
  password: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

export async function loginVerifiedTestUser(): Promise<VerifiedTestUserSession> {
  const email = faker.internet.email().toLowerCase();
  const password = "Passw0rd!";
  const generator = new CoreEntititesGenerator(publicClient);

  await generator.users.create({
    email,
    password,
    name: "Test User",
    isEmailVerified: true,
  });

  const loginResponse = await publicClient.login({ body: { email, password } });
  if (loginResponse.status !== 200) {
    throw new Error(
      `Failed to login test user. Status ${loginResponse.status}, body ${JSON.stringify(loginResponse.body)}`,
    );
  }

  const client = authenticatedClient(loginResponse.body.tokens.accessToken);

  return {
    client,
    generator: new CoreEntititesGenerator(client),
    email,
    password,
    tokens: loginResponse.body.tokens,
  };
}
