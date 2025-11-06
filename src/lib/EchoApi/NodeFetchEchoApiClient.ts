import FormData from "form-data";
import { EchoApiResponseSchema, type EchoApiResponse } from "./schema";

export class NodeFetchEchoApiClient {
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

    const response = await fetch(`${this.baseUrl}/post`, {
      method: "POST",
      body: form.getBuffer(), // FormData stream
      headers: form.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return EchoApiResponseSchema.parse(data);
  }

  async get(): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}/get`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
}
