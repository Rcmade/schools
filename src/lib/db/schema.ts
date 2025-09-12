import {
  index,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

const commonFields = {
  id: int("id").autoincrement().primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow(),
};

export const schools = mysqlTable(
  "schools",
  {
    // Basic Info
    name: varchar("name", { length: 255 }).notNull(),
    board: varchar("board", { length: 64 }).notNull(), // CBSE, ICSE, State Board, IB
    medium: varchar("medium", { length: 64 }).notNull(), // English, Hindi
    type: varchar("type", { length: 64 }).notNull(), // Day School, Boarding

    // Location
    city: varchar("city", { length: 128 }).notNull(),
    state: varchar("state", { length: 128 }).notNull(),
    pinCode: varchar("pin_code", { length: 12 }),
    address: text("address"),

    feesMin: int("fees_min"),
    feesMax: int("fees_max"),
    phone: varchar("phone", { length: 32 }),
    email: varchar("email", { length: 55 }),
    website: varchar("website", { length: 255 }),
    image: text("image"),

    ...commonFields,
  },

  (table) => [index("idx_schools_name").on(table.name)]
);

export type School = typeof schools.$inferSelect;
export type NewSchool = typeof schools.$inferInsert;

export const users = mysqlTable("user", {
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  ...commonFields,
});
