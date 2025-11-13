import { z } from "zod";

export const ZodAssignTaskSchema = z.object({
  task_id: z.string(),
  assign_to: z.string(),
});

export type TAssignTask = z.infer<typeof ZodAssignTaskSchema>;
