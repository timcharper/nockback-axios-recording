import axios from "axios";
import FormData from "form-data";
import { EchoApiResponseSchema, type EchoApiResponse } from "./schema";

export class AxiosEchoApiClient {
  private readonly baseUrl = "https://httpbin.org";

  async postFormData(fields: Record<string, string>): Promise<EchoApiResponse> {
    const form = new FormData();

    // Set a fixed boundary for reproducible recordings
    // This ensures nock recordings are consistent
    const boundary = "----WebKitFormBoundaryFixedForNock";
    form.setBoundary(boundary);

    for (const [key, value] of Object.entries(fields)) {
      form.append(key, value);
    }

    const response = await axios.post(`${this.baseUrl}/post`, form, {
      headers: {
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return EchoApiResponseSchema.parse(response.data);
  }

  async get(): Promise<unknown> {
    const response = await axios.get(`${this.baseUrl}/get`);
    return response.data;
  }
}
