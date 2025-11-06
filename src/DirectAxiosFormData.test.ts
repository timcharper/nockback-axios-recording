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
    const scope = nock("https://httpbin.org:443")
      .post("/post")
      .reply(
        200,
        {
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
        },
        {
          "access-control-allow-credentials": "true",
          "access-control-allow-origin": "*",
          connection: "close",
          "content-length": "614",
          "content-type": "application/json",
          date: "Thu, 06 Nov 2025 01:23:20 GMT",
          server: "gunicorn/19.9.0",
        }
      );

    const form = new FormData();
    const boundary = "----WebKitFormBoundaryFixedForNock";
    form.setBoundary(boundary);

    form.append("name", "John Doe");
    form.append("email", "john@example.com");
    form.append("message", "Hello World");
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

  it("should post string with manually configured nock", async () => {
    const scope = nock("https://httpbin.org:443")
      .post("/post")
      .reply(200, "hello", {
        "content-length": "5",
      });

    const response = await axios.post("https://httpbin.org/post", "hello", {
      headers: {
        "content-type": "application/json",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // Verify the response
    expect(response.data).toMatchInlineSnapshot(`"hello"`);

    // Verify nock intercepted the request
    expect(scope.isDone()).toBe(true);
  });
});
