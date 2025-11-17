import { pgTable, varchar, boolean } from "drizzle-orm/pg-core";

export const masterPic = pgTable("master_pic", {
  uid: varchar("uid").primaryKey(),
  email: varchar("email"),
  departement: varchar("departement"),
  CC: boolean("CC"),
  password: varchar("password", { length: 255 }),
});
