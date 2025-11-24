import { pgTable, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const openTagging = pgTable("open_tagging", {
  uid: varchar("uid").primaryKey(),

  plant_area: varchar("plant_area"),
  business_unit: varchar("business_unit"),

  tagger: varchar("tagger").references(() => masterUser.user),
  nik_tagger: varchar("nik_tagger").references(() => masterUser.user_nik),
  dept_tagger: varchar("dept_tagger"),

  tag_category: varchar("tag_category"),
  tag_category_system: varchar("tag_category_system"),
  tag_category_subsystem: varchar("tag_category_subsystem"),
  tag_priority: varchar("tag_priority"),

  tagging_timestamp: timestamp("tagging_timestamp"),

  tag_pic: varchar("tag_pic").references(() => masterPic.uid),

  tag_desc: text("tag_desc"),
  tag_open_media: varchar("tag_open_media"),
});

export const masterPic = pgTable("master_pic", {
  uid: varchar("uid").primaryKey(),
  email: varchar("email"),
  departement: varchar("departement"),
  CC: boolean("CC"),
  password: varchar("password", { length: 255 }),
});

export const masterUser = pgTable("master_user", {
  uid: varchar("uid").primaryKey(),
  user: varchar("user").unique(),
  user_nik: varchar("user_nik").unique(),
  user_department: varchar("user_department"),
  user_password: varchar("user_password"),
});