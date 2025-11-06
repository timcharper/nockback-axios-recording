import { setupNock } from "../../test-helpers/SetupNock";
import { AxiosEchoApiClient } from "./AxiosEchoApiClient";

describe("AxiosEchoApiClient", () => {
  const client = new AxiosEchoApiClient();
  let nockDone: () => void;
  beforeEach(async () => {
    nockDone = await setupNock();
  });
  afterEach(() => {
    nockDone();
  });

  it("should post form data and return echo response", async () => {
    const result = await client.postFormData({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello World",
    });

    expect(result.form).toMatchInlineSnapshot();
  });
});
