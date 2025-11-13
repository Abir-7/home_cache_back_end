import { z } from "zod";
import { recurrenceArray } from "../schema/task.schema";

/* Zod schema */
export const ZodTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  initial_date: z.date(),
  recurrence_type: z.enum(recurrenceArray),
  assign_to: z.string().optional(),
});

/* TypeScript type inferred from Zod */
export type TTask = z.infer<typeof ZodTaskSchema>;
export type TaskFilter = "upcoming" | "overdue";
