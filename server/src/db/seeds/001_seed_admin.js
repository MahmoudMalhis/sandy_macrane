import { hash } from "bcrypt";

export async function seed (knex) {
  // Delete existing entries
  await knex("admin_users").del();

  // Hash the default password
  const passwordHash = await hash("Sandy@123456", 10);

  // Insert seed entries
  await knex("admin_users").insert([
    {
      email: "admin@sandy.com",
      password_hash: passwordHash,
      role: "owner",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
}
