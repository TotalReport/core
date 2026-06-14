import { faker } from "@faker-js/faker";
import { contract } from "@total-report/core-contract/contract";
import {
  users
} from "@total-report/core-schema/schema";
import { ClientInferRequest, ClientInferResponseBody } from "@ts-rest/core";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env["ENTITIES_GENERATOR_DB_URL"] ?? process.env["DB_URL"],
});

export const db = drizzle(pool);

export const closeUserGeneratorDb = (): Promise<void> => pool.end();

/**
 * This class is responsible for generating users.
 */
export class UsersGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  async create(
    args: GenerateUser | undefined = undefined,
  ): Promise<CreateUserResponse> {
    const email = (args as any)?.email ?? faker.internet.email().toLowerCase();
    const password = (args as any)?.password ?? "Passw0rd!";
    const name = (args as any)?.name ?? "Test User";

    const response = await this.client.register({ body: { email, password, name } });

    assertEquals(
      response.status,
      201,
      `Failed to create user. Server response status ${response.status}, body ${JSON.stringify(response.body)}`,
    );

    const user = response.body;

    if (args?.isActive !== undefined || args?.isEmailVerified !== undefined) {
      await this.updateFlags(email, {
        isActive: args.isActive,
        isEmailVerified: args.isEmailVerified,
      });
      if (args.isActive !== undefined) user.isActive = args.isActive;
      if (args.isEmailVerified !== undefined) {
        user.isEmailVerified = args.isEmailVerified;
      }
    }

    return user;
  }

  async updateFlags(
    email: string,
    flags: { isActive?: boolean; isEmailVerified?: boolean },
  ): Promise<void> {
    const patch: Partial<{ isActive: boolean; isEmailVerified: boolean }> = {};
    if (flags.isActive !== undefined) patch.isActive = flags.isActive;
    if (flags.isEmailVerified !== undefined) {
      patch.isEmailVerified = flags.isEmailVerified;
    }
    if (Object.keys(patch).length === 0) return;

    await db.update(users).set(patch).where(eq(users.email, email));
  }
}

export type GenerateUser = Partial<CreateUserRequest> & {
  isActive?: boolean;
  isEmailVerified?: boolean;
};

export type CreateUserRequest = ClientInferRequest<
  typeof contract.register
>["body"];

export type CreateUserResponse = ClientInferResponseBody<
  typeof contract.register,
  201
>;
