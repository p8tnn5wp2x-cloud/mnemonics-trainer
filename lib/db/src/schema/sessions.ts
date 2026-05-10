import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  exerciseType: text("exercise_type").notNull(),
  exerciseTitle: text("exercise_title").notNull(),
  itemsTotal: integer("items_total").notNull(),
  itemsCorrect: integer("items_correct").notNull(),
  accuracy: real("accuracy").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessionsTable).omit({ id: true, completedAt: true });
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessionsTable.$inferSelect;
