import { setupNock } from "../../test-helpers/SetupNock";
import { NodeFetchEchoApiClient } from "./NodeFetchEchoApiClient";

describe("NodeFetchEchoApiClient", () => {
  const client = new NodeFetchEchoApiClient();
  let nockDone: () => void;
  beforeEach(async () => {
    nockDone = await setupNock();
  });
  afterEach(() => {
    nockDone();
  });

  it("should post form data and return echo response", async () => {
    const result = await client.postFormData({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Test Message",
    });

    expect(result.form).toMatchInlineSnapshot(`
{
  "email": "jane@example.com",
  "message": "Test Message",
  "name": "Jane Doe",
}
`);
  });
});
