import { IpApiResponseSchema, type IpApiResponse } from "./schema";

export class NodeFetchApiClient {
  private readonly baseUrl = "http://ip-api.com/json";

  async lookupIp(ip: string): Promise<IpApiResponse> {
    const response = await fetch(`${this.baseUrl}/${ip}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return IpApiResponseSchema.parse(data);
  }
}
