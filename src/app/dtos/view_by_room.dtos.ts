import { z } from "zod";

export const ViewByRoomSchema = z
  .object({
    type: z.string().min(1, "type is required"),
    name: z.string().optional(),
    added_by: z.string(),
    item: z.array(z.string().min(1)).nonempty("item array cannot be empty"),
  })
  .strict();

export type TViewByRoomDto = z.infer<typeof ViewByRoomSchema>;
