describe("hello world test", () => {
  it("should concatenate hello and world", () => {
    const hello = "hello";
    const world = "world";
    const result = hello + " " + world;
    expect(result).toBe("hello world");
  });
});
