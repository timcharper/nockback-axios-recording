import axios from "axios";
import { IpApiResponseSchema, type IpApiResponse } from "./schema";

export class AxiosIpApiClient {
  private readonly baseUrl = "http://ip-api.com/json";

  async lookupIp(ip: string): Promise<IpApiResponse> {
    const response = await axios.get(`${this.baseUrl}/${ip}`);
    return IpApiResponseSchema.parse(response.data);
  }
}

