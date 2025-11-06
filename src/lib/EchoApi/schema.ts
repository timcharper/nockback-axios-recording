import { z } from "zod";

export const EchoApiResponseSchema = z.object({
  form: z.record(z.string(), z.unknown()),
});

export type EchoApiResponse = z.infer<typeof EchoApiResponseSchema>;
