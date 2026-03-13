import {
  authProviders,
  sessions,
  users,
} from "@total-report/core-schema/schema";
import { and, eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { db as defaultDB } from "./setup.js";

export class UsersDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB,
  ) {
    this.db = db;
  }

  async createUser(args: {
    email: string;
    passwordHash?: string | null;
    name?: string | null;
    isActive: boolean;
    isEmailVerified: boolean;
  }) {
    const createdTimestamp = new Date();
    const found = await this.db
      .insert(users)
      .values({
        email: args.email,
        passwordHash: args.passwordHash ?? null,
        name: args.name ?? null,
        isActive: args.isActive,
        isEmailVerified: args.isEmailVerified,
        createdTimestamp,
      })
      .returning();

    return rowToEntity(found[0]!);
  }

  async findByEmail(email: string) {
    const found = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (found.length === 0) return undefined;

    return rowToEntity(found[0]!);
  }

  async findById(id: number) {
    const found = await this.db.select().from(users).where(eq(users.id, id));

    if (found.length === 0) return undefined;

    return rowToEntity(found[0]!);
  }

  async createAuthProvider(args: {
    userId: number;
    provider: string;
    providerId: string;
    profile?: Record<string, unknown> | null;
  }) {
    const createdTimestamp = new Date();
    const found = await this.db
      .insert(authProviders)
      .values({
        userId: args.userId,
        provider: args.provider,
        providerId: args.providerId,
        profile: args.profile ?? null,
        createdTimestamp,
      })
      .returning();

    return found[0]!;
  }

  async findAuthProvider(provider: string, providerId: string) {
    const found = await this.db
      .select()
      .from(authProviders)
      .where(
        and(
          eq(authProviders.provider, provider),
          eq(authProviders.providerId, providerId),
        ),
      );

    if (found.length === 0) return undefined;

    return found[0]!;
  }

  async createSession(args: {
    id: string;
    userId: number;
    tokenHash: string;
    expiresTimestamp?: Date | null;
  }) {
    const createdTimestamp = new Date();
    const found = await this.db
      .insert(sessions)
      .values({
        id: args.id,
        userId: args.userId,
        tokenHash: args.tokenHash,
        expiresTimestamp: args.expiresTimestamp ?? null,
        createdTimestamp,
      })
      .returning();
    return found[0]!;
  }

  async findSessionByTokenHash(tokenHash: string) {
    const found = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.tokenHash, tokenHash));
    return found.at(0) ?? undefined;
  }

  async findSessionById(id: string) {
    const found = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id));
    return found.at(0) ?? undefined;
  }

  async updateSessionToken(
    sessionId: string,
    tokenHash: string,
    expiresTimestamp?: Date | null,
  ) {
    await this.db
      .update(sessions)
      .set({ tokenHash, expiresTimestamp })
      .where(eq(sessions.id, sessionId));
    return this.findSessionById(sessionId);
  }

  async deleteSessionByTokenHash(tokenHash: string) {
    await this.db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
  }
}

type UserRow = typeof users.$inferSelect;

const rowToEntity = (row: UserRow) => {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash ?? null,
    name: row.name ?? null,
    isActive: row.isActive,
    isEmailVerified: row.isEmailVerified,
    createdTimestamp: row.createdTimestamp,
    updatedTimestamp: row.updatedTimestamp ?? undefined,
  } as const;
};
