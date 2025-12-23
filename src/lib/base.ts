import type { ZodObject } from "zod";
import { serial, timestamp } from "drizzle-orm/pg-core";

export const insertExcludedFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Partial<Record<keyof ZodObject["shape"], true>>;

export const timestamps = {
  no: serial("no"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
};
