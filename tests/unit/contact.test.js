import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import handler from "../../api/contact.js";

const valid = {
  firstName: "Jean",
  lastName: "Test",
  email: "test@example.com",
  turnstileToken: "test-token",
};
function request(body = valid, overrides = {}) {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return handler(
    {
      method: "POST",
      headers: {
        host: "preview.example.com",
        origin: "https://preview.example.com",
      },
      body,
      ...overrides,
    },
    res,
  ).then(() => res);
}

describe("contact API (all external requests mocked)", () => {
  beforeEach(() => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Unexpected external request")),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("rejects unsupported methods without calling providers", async () => {
    const res = await request(valid, { method: "GET" });
    expect(res.status).toHaveBeenCalledWith(405);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    null,
    [],
    "invalid",
    {},
    { ...valid, firstName: " " },
    { ...valid, email: ["test@example.com"] },
    { ...valid, phone: {} },
    { ...valid, message: "a".repeat(2001) },
    { ...valid, email: "bad email" },
    { ...valid, intent: "<script>bad</script>" },
    { ...valid, intent: "constructor" },
    { ...valid, intent: "__proto__" },
    { ...valid, intent: ["audit"] },
    { ...valid, intent: "unknown" },
  ])("rejects malformed input %# before provider calls", async (body) => {
    const res = await request(body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects missing body", async () => {
    const res = await request(valid, { body: undefined });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each(["https://attacker.example", "not a URL"])(
    "rejects invalid origin %s",
    async (origin) => {
      const res = await request(valid, {
        headers: { host: "preview.example.com", origin },
      });
      expect(res.status).toHaveBeenCalledWith(403);
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it("requires a token", async () => {
    const res = await request({ ...valid, turnstileToken: "" });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails closed without provider configuration", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await request();
    expect(res.status).toHaveBeenCalledWith(503);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    { ok: true, success: false },
    { ok: false, success: true },
    { ok: true, success: "true" },
  ])("does not send email on failed challenge %#", async ({ ok, success }) => {
    fetch.mockResolvedValueOnce({ ok, json: async () => ({ success }) });
    const res = await request();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("handles challenge timeout/network failure without sending email", async () => {
    const res = await request();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it("handles malformed challenge JSON without sending email", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });
    const res = await request();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it.each(["http", "network"])("reports Resend failure (%s)", async (mode) => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    if (mode === "http") fetch.mockResolvedValueOnce({ ok: false });
    else fetch.mockRejectedValueOnce(new Error("timeout"));
    const res = await request();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false }),
    );
  });

  it("sends one escaped HTML email with a plain reply address on verified success", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    fetch.mockResolvedValueOnce({ ok: true });
    const res = await request({
      ...valid,
      firstName: " <img src=x> ",
      email: "o'neil@example.com",
      message: "<script>bad</script>",
      location: "A\r\nB",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
    expect(fetch).toHaveBeenCalledTimes(2);
    const [url, options] = fetch.mock.calls[1];
    expect(url).toBe("https://api.resend.com/emails");
    expect(options.signal).toBeInstanceOf(AbortSignal);
    const mail = JSON.parse(options.body);
    expect(mail.reply_to).toBe("o'neil@example.com");
    expect(mail.to).toBe("contact@inastia.fr");
    expect(mail.html).toContain("&lt;script&gt;bad&lt;/script&gt;");
    expect(mail.html).not.toContain("<img src=x>");
    expect(mail.subject).not.toMatch(/[\r\n]/);
  });

  it.each([
    [undefined, "Demande générale"],
    ["", "Demande générale"],
    ["audit", "Audit gratuit"],
    ["gestion", "Gestion complète"],
    ["annonce", "Lancement et gestion d’annonce"],
    ["rotation", "Accueil et rotation"],
  ])(
    "includes the validated intent %s in the mocked email",
    async (intent, label) => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });
      fetch.mockResolvedValueOnce({ ok: true });
      const res = await request({ ...valid, intent });
      expect(res.status).toHaveBeenCalledWith(200);
      const mail = JSON.parse(fetch.mock.calls[1][1].body);
      expect(mail.html).toContain("Motif de la demande");
      expect(mail.html).toContain(label);
    },
  );
});
