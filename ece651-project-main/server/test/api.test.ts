import { describe, expect, test, it } from "bun:test";
import { App } from "src";
import { buildJSONRequest } from "./common.test";

describe("Example API Test", () => {
  it('should get "Hello World!"', async () => {
    const res = await App.handle(new Request("http://localhost:3000"));
    expect(await res.text()).toBe("Hello World!");
  });

  it("should repeat back", async () => {
    const message = "This is a test message!";

    const res = await App.handle(
      buildJSONRequest("http://localhost:3000/repeat", "POST", {
        message,
      }),
    );
    expect(await res.text()).toBe(message);
  });

  it("should 404", async () => {
    const message = "This is a test message!";

    const res = await App.handle(
      buildJSONRequest("http://localhost:3000/badpath", "POST", {
        message,
      }),
    );
    expect(res.status).toBe(404);
  });

  it("should 400 on validation error", async () => {
    const message = "This is a test message!";

    const res = await App.handle(
      buildJSONRequest("http://localhost:3000/badrequest", "POST", {
        message,
      }),
    );
    expect(res.status).toBe(400);
  });

  it("should 500", async () => {
    const message = "This is a test message!";

    const res = await App.handle(
      buildJSONRequest("http://localhost:3000/return500", "GET", {
        message,
      }),
    );
    expect(res.status).toBe(500);
  });
});
