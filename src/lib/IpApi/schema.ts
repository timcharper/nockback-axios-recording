import { z } from "zod";

export const IpApiResponseSchema = z.object({
  status: z.enum(["success", "fail"]),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  region: z.string().optional(),
  regionName: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  timezone: z.string().optional(),
  isp: z.string().optional(),
  org: z.string().optional(),
  as: z.string().optional(),
  query: z.string(),
  message: z.string().optional(), // Present when status is "fail"
});

export type IpApiResponse = z.infer<typeof IpApiResponseSchema>;

