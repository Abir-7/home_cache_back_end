import { z } from "zod";

export const ZodAssignTaskSchema = z.object({
  task_id: z.string().uuid(),
  assign_to: z.string().uuid(),
});

export type TAssignTask = z.infer<typeof ZodAssignTaskSchema>;
