import axios from "axios";
import FormData from "form-data";
import nock from "nock";

describe("Direct axios FormData test", () => {
  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.restore();
  });

  it("should post form data with manually configured nock", async () => {
    // Setup nock to intercept the POST request
    const scope = nock("https://httpbin.org")
      .post("/post")
      .reply(200, {
        args: {},
        data: "",
        files: {},
        form: {
          email: "john@example.com",
          message: "Hello World",
          name: "John Doe",
        },
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, compress, deflate, br",
          "Content-Length": "340",
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundaryFixedForNock",
          Host: "httpbin.org",
          "User-Agent": "axios/1.13.2",
          "X-Amzn-Trace-Id": "Root=1-690bf87e-1bb4d1757d6d3ab40fe762e4",
        },
        json: null,
        origin: "8.8.8.8",
        url: "https://httpbin.org/post",
      });

    // Create form data directly with axios
    const form = new FormData();
    const boundary = "----WebKitFormBoundaryFixedForNock";
    form.setBoundary(boundary);

    form.append("name", "John Doe");
    form.append("email", "john@example.com");
    form.append("message", "Hello World");

    // Make the request directly with axios
    const response = await axios.post("https://httpbin.org/post", form, {
      headers: {
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // Verify the response
    expect(response.data.form).toMatchInlineSnapshot(`
{
  "email": "john@example.com",
  "message": "Hello World",
  "name": "John Doe",
}
`);

    // Verify nock intercepted the request
    expect(scope.isDone()).toBe(true);
  });
});
