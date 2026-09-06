import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import handler from "../../api/contact.js";

const valid = {
  firstName: "Jean",
  lastName: "Test",
  email: "test@example.com",
  turnstileToken: "test-token",
  propertyType: "Villa",
  location: "Porto-Vecchio",
  requestId: "b3f08a74-27f0-4a3b-9aab-4baab05f5c31",
};
function consentRecord(overrides = {}) {
  return {
    marketingEmail: false,
    marketingPhone: false,
    consentVersion: "commercial-2026-09-06-v1",
    consentLocale: "fr",
    consentCollectedAt: new Date().toISOString(),
    ...overrides,
  };
}
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
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", "");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Unexpected external request")),
    );
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it.each([undefined, "email"])("accepts management without a surname or phone and defaults preference %s to email", async (contactPreference) => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    const res = await request({ ...valid, lastName: "", intent: "gestion", contactPreference });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(JSON.parse(fetch.mock.calls[1][1].body).html).toContain('Canal de réponse souhaité</td><td style="padding:6px 0">Email');
    expect(JSON.parse(console.info.mock.calls[0][0])).toMatchObject({ intent: "gestion", contactPreference: "email" });
  });

  it.each(["sms", "", true, "x".repeat(11)])("rejects invalid service contact preference %s", async (contactPreference) => {
    const res = await request({ ...valid, contactPreference });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([{ intent: "gestion", contactPreference: "phone" }, { intent: "audit", contactPreference: "email" }])("requires a number for the requested service callback %j", async (choice) => {
    const res = await request({ ...valid, ...choice });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("keeps the audit callback by phone even if a client sends an email preference", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    const res = await request({ ...valid, intent: "audit", contactPreference: "email", phone: "+33 6 00 00 00 00" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(JSON.parse(console.info.mock.calls[0][0])).toMatchObject({ intent: "audit", contactPreference: "phone" });
    expect(JSON.parse(fetch.mock.calls[1][1].body).html).toContain("Téléphone — rappel d’audit sous 24 h");
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
    { ...valid, location: "  " },
    { ...valid, propertyType: "Castle" },
    { ...valid, propertyType: "" },
    { ...valid, phone: "x" },
    { ...valid, phone: "123456" },
    { ...valid, phone: "1234567890123456" },
    { ...valid, phone: "12+3456789" },
    { ...valid, requestId: "log-injection\nprivate" },
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

  it.each([undefined, "", "   "])("requires audit callback phone before providers (%s)", async (phone) => {
    const res = await request({ ...valid, intent: "audit", phone });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, error: expect.stringContaining("téléphone") }));
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
      json: async () => ({ success: true, hostname: "inastia.fr" }),
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
      json: async () => ({ success: true, hostname: "inastia.fr" }),
    });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    const res = await request({
      ...valid,
      firstName: " <img src=x> ",
      email: "o'neil@example.com",
      message: "<script>bad</script>",
      location: "A\r\nB",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, requestId: valid.requestId });
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
        json: async () => ({ success: true, hostname: "inastia.fr" }),
      });
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
      const res = await request({ ...valid, intent, ...(intent === "audit" ? { phone: " +33 6 00 00 00 00 " } : {}) });
      expect(res.status).toHaveBeenCalledWith(200);
      const mail = JSON.parse(fetch.mock.calls[1][1].body);
      expect(mail.html).toContain("Motif de la demande");
      expect(mail.html).toContain(label);
      if (intent === "audit") expect(mail.html).toContain('href="tel:+33 6 00 00 00 00"');
    },
  );

  it.each(["+33 (0)6 00 00 00 00", "020 7946 0958", "+1-202-555-0123", "0039 333.123.4567"])("accepts plausible international phone %s", async (phone) => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    const res = await request({ ...valid, intent: "audit", phone });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it.each([undefined, "other.example", "inastia.fr.attacker.example", "preview.example.com"])("rejects unapproved challenge hostname %s", async (hostname) => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname }) });
    const res = await request();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it.each(["inastia.fr", "www.inastia.fr", "preview.example.com"])("accepts exact configured challenge host %s", async (hostname) => {
    vi.stubEnv("TURNSTILE_ALLOWED_HOSTNAMES", "preview.example.com,*.example.com,https://bad.example");
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    const res = await request();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("retries ambiguous acceptance with an identical mail payload and idempotency key", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-06T10:00:00Z"));
    const body = { ...valid, ...consentRecord({ marketingEmail: true, marketingPhone: true }), phone: "+33 6 00 00 00 00" };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockRejectedValueOnce(new Error("Synthetic lost response after acceptance"));
    const first = await request(body);
    expect(first.json).toHaveBeenCalledWith(expect.objectContaining({ uncertain: true, requestId: valid.requestId }));
    vi.setSystemTime(new Date("2026-09-06T10:15:00Z"));
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    const second = await request({ ...body, turnstileToken: "fresh-test-token" });
    expect(second.status).toHaveBeenCalledWith(200);
    expect(fetch.mock.calls[1][1].headers["Idempotency-Key"]).toBe(`contact/${valid.requestId}`);
    expect(fetch.mock.calls[3][1].headers["Idempotency-Key"]).toBe(fetch.mock.calls[1][1].headers["Idempotency-Key"]);
    expect(fetch.mock.calls[3][1].body).toBe(fetch.mock.calls[1][1].body);
    expect(JSON.parse(fetch.mock.calls[2][1].body).response).toBe("fresh-test-token");
  });

  it("records provider receipt metadata without personal data or credentials", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    await request({ ...valid, message: "PRIVATE_MESSAGE", phone: "+33 6 12 34 56 78" });
    const events = console.info.mock.calls.map(([text]) => JSON.parse(text));
    expect(events).toEqual([expect.objectContaining({ requestId: valid.requestId, providerId: "fa64e6ef-875e-4e75-b9a1-593bdedb2629", stage: "provider_accepted", status: 200 })]);
    expect(Object.keys(events[0]).sort()).toEqual(["contactPreference", "durationMs", "event", "intent", "providerId", "receivedAt", "requestId", "stage", "status"]);
    expect(JSON.stringify(events)).not.toMatch(/PRIVATE_MESSAGE|test@example|test-secret|test-key|test-token|Jean|12 34 56/);
  });

  it("does not fail an accepted submission if logging fails", async () => {
    console.info.mockImplementation(() => { throw new Error("logger unavailable"); });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    const res = await request();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("treats a malformed provider receipt as uncertain without exposing its content", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "private@example.com" }) });
    const res = await request();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, uncertain: true }));
    expect(JSON.stringify(console.warn.mock.calls)).not.toContain("private@example.com");
  });

  it("accepts provider UUID receipts without assuming UUID version 4", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "01991b0e-9432-7000-8000-000000000001" }) });
    const res = await request();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining("01991b0e-9432-7000-8000-000000000001"));
  });

  it.each([
    ["marketingEmail", "true"], ["marketingPhone", "false"],
    ["marketingEmail", 1], ["marketingPhone", 0],
    ["marketingEmail", null], ["marketingPhone", []],
  ])("rejects invalid commercial boolean %s=%j", async (name, value) => {
    const res = await request({ ...valid, ...consentRecord(), [name]: value });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    { consentVersion: "" }, { consentVersion: "different-version" },
    { consentLocale: "de" }, { consentCollectedAt: "" },
    { consentCollectedAt: "not-a-date" }, { consentCollectedAt: "2026-02-31T10:00:00.000Z" },
  ])("rejects invalid consent evidence %#", async (override) => {
    const res = await request({ ...valid, ...consentRecord(override) });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects a new opt-in without its collection evidence", async () => {
    const res = await request({ ...valid, marketingEmail: true });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([[1, false], [1, true], [-48, false], [-48, true]])("accepts a declarative clock offset of %s hours with opt-ins %s", async (hours, optedIn) => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    const record = consentRecord({ marketingEmail: optedIn, marketingPhone: optedIn, consentCollectedAt: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString() });
    const res = await request({ ...valid, ...record, ...(optedIn ? { phone: "+33 6 00 00 00 00" } : {}) });
    expect(res.status).toHaveBeenCalledWith(200);
    const mail = JSON.parse(fetch.mock.calls[1][1].body);
    expect(mail.html).toContain(record.consentCollectedAt);
    expect(mail.html).toContain("horloge non vérifiée");
    expect(mail.html).toContain(`Email : <strong>${optedIn ? "Oui" : "Non"}</strong>`);
  });

  it.each(["", "x"])("requires a usable phone for optional telephone opt-in (%s)", async (phone) => {
    const res = await request({ ...valid, ...consentRecord({ marketingPhone: true }), phone });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([[false, false], [true, false], [false, true], [true, true]])("records independent email=%s and telephone=%s choices", async (marketingEmail, marketingPhone) => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    const record = consentRecord({ marketingEmail, marketingPhone });
    const res = await request({ ...valid, ...record, ...(marketingPhone ? { phone: "+33 6 00 00 00 00" } : {}) });
    expect(res.status).toHaveBeenCalledWith(200);
    const mail = JSON.parse(fetch.mock.calls[1][1].body);
    expect(mail.html).toContain(`Email : <strong>${marketingEmail ? "Oui" : "Non"}</strong>`);
    expect(mail.html).toContain(`Téléphone : <strong>${marketingPhone ? "Oui, pendant un an au maximum" : "Non</strong>"}`);
    expect(mail.html).toContain(record.consentVersion);
    expect(mail.html).toContain(record.consentCollectedAt);
    expect(mail.html).toContain("horloge non vérifiée");
    expect(mail.html).toContain("offres et relances commerciales d’Inastia concernant la gestion complète de locations");
    expect(JSON.stringify(console.info.mock.calls)).not.toContain("marketingEmail");
    expect(JSON.stringify(console.info.mock.calls)).not.toContain("marketingPhone");
  });

  it("keeps legacy requests without checkboxes explicitly opted out", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    const res = await request();
    expect(res.status).toHaveBeenCalledWith(200);
    const mail = JSON.parse(fetch.mock.calls[1][1].body);
    expect(mail.html).toContain("Email : <strong>Non</strong>");
    expect(mail.html).toContain("Téléphone : <strong>Non</strong>");
    expect(mail.html).toContain("aucune autorisation de prospection enregistrée");
    expect(mail.html).not.toContain("Date déclarée");
  });

  it("uses reliable receipt evidence rather than deriving telephone expiry from the visitor clock", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2028-02-29T10:00:00.000Z"));
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: "inastia.fr" }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" }) });
    const res = await request({ ...valid, ...consentRecord({ marketingPhone: true }), phone: "+33 6 00 00 00 00" });
    expect(res.status).toHaveBeenCalledWith(200);
    const mail = JSON.parse(fetch.mock.calls[1][1].body);
    expect(mail.html).toContain("première date fiable de réception serveur ou d’acceptation fournisseur");
    expect(mail.html).toContain("Aucun renouvellement automatique");
    expect(mail.html).not.toContain("2029-02-28");
    expect(mail.html).not.toContain("Fin du choix téléphone");
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('"receivedAt":"2028-02-29T10:00:00.000Z"'));
  });
});
