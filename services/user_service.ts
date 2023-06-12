import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { prepare } from "../db/db.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Result, err, ok } from "../utils/result.ts";
import { User, userSchema } from "../db/schema.ts";

const createUserSchema = userSchema.omit({ id: true });
export type CreateUser = z.infer<typeof createUserSchema>;

const createUserQuery = prepare<
  User,
  ["id", "fullName", "username", "email", "password"]
>`INSERT INTO users VALUES (${"id"}, ${"fullName"}, ${"username"}, ${"email"}, ${"password"}) RETURNING *)`;

export async function createUser(
  user: unknown
): Promise<Result<User, Record<string, string[]>>> {
  const res = createUserSchema.safeParse(user);
  if (!res.success) {
    return err(res.error.flatten().fieldErrors);
  }
  const { data } = res;
  const hashedPassword = await bcrypt.hash(data.password);
  return ok(
    createUserQuery.firstEntry({
      id: crypto.randomUUID(),
      ...data,
      password: hashedPassword,
    })!
  );
}

const getUserByIdQuery = prepare<
  User,
  ["id"]
>`SELECT * FROM users WHERE id = ${"id"}`;
export function getUserById(id: string): Result<User, string> {
  const res = getUserByIdQuery.firstEntry({ id });
  if (!res) {
    return err("User not found");
  }

  return ok(res);
}

const getUserByEmailQuery = prepare<
  User,
  ["email"]
>`SELECT * FROM users WHERE email = ${"email"}`;
export function getUserByEmail(email: string): Result<User, string> {
  const res = getUserByEmailQuery.firstEntry({ email });
  if (!res) {
    return err("User not found");
  }
  return ok(res);
}
