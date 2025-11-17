import { z } from "zod";

export const ViewByTypeZodSchema = z
  .object({
    type: z.string(),
    title: z.string(),
    location: z.string(),
    note: z.string(),
  })
  .strict();

export type TViewByTypesType = z.infer<typeof ViewByTypeZodSchema>;
