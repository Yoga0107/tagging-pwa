import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const openTagging = pgTable("open_tagging", {
  uid: varchar("uid"),
  plant_area: varchar("plant_area"),
  business_unit: varchar("business_unit"),
  tagger: varchar("tagger"),
  nik_tagger: varchar("nik_tagger"),
  dept_tagger: varchar("dept_tagger"),
  tag_category: varchar("tag_category"),
  tag_category_system: varchar("tag_category_system"),
  tag_category_subsystem: varchar("tag_category_subsystem"),
  tag_priority: varchar("tag_priority"),
  tagging_timestamp: timestamp("tagging_timestamp"),
  tag_pic: varchar("tag_pic"),
  tag_desc: text("tag_desc"),
  tag_open_media: text("tag_open_media"),
});
