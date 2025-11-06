import { setupNock } from "../../test-helpers/SetupNock";
import { AxiosIpApiClient } from "./AxiosIpApiClient";

describe("AxiosIpApiClient", () => {
  const client = new AxiosIpApiClient();
  let nockDone: () => void;
  beforeEach(async () => {
    nockDone = await setupNock();
  });
  afterEach(() => {
    nockDone();
  });

  it("should lookup IP address and return valid response", async () => {
    const result = await client.lookupIp("8.8.8.8");

    expect(result.status).toBe("success");
    expect(result.query).toBe("8.8.8.8");
    expect(result.country).toBe("United States");
    expect(result.countryCode).toBe("US");
  });
});
