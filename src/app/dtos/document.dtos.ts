import z from "zod";

// Schema for a single file object
export const FileSchema = z.object({
  file_url: z.string().min(1),
  file_id: z.string().min(1),
});

// Schema for the full document
export const NewDocumentSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1),
  title: z.string().min(1),
  brand: z.string().min(1),
  url: z.string().min(1),
  exp_date: z.date().optional(),
  note: z.string().min(1),
});
export type TNewDocument = z.infer<typeof NewDocumentSchema>;
export type TFile = z.infer<typeof FileSchema>;
