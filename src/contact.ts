interface TurnstileAPI {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      size: "compact";
      language: "fr" | "en";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ): string;
  reset(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI;
    inastiaTurnstileReady?: () => void;
  }
}

const messages = {
  fr: {
    loading: "Chargement de la vérification anti-spam…",
    challenge: "Veuillez effectuer la vérification anti-spam avant l’envoi.",
    unavailable:
      "La vérification anti-spam est indisponible. Réessayez ou contactez-nous par téléphone ou par e-mail.",
    expired: "La vérification a expiré. Veuillez la renouveler avant l’envoi.",
    sending: "Envoi de votre demande…",
    success:
      "Votre demande a bien été envoyée. Notre équipe vous recontactera pour échanger sur votre projet.",
    error:
      "Votre demande n’a pas pu être envoyée. Vos informations sont conservées. Réessayez ou contactez-nous par téléphone ou par e-mail.",
    timeout:
      "L’envoi a pris trop de temps et sa confirmation n’a pas été reçue. Avant de réessayer, vous pouvez nous contacter pour vérifier la réception.",
    uncertain:
      "La confirmation de votre envoi n’a pas été reçue. Vos informations sont conservées. Vous pouvez réessayer sans les modifier ou nous contacter pour vérifier la réception.",
    phone: "Indiquez un numéro de téléphone de 7 à 15 chiffres, avec son indicatif si nécessaire.",
    required: "Veuillez renseigner ce champ.",
  },
  en: {
    loading: "Loading spam protection…",
    challenge: "Please complete the spam protection check before sending.",
    unavailable:
      "Spam protection is unavailable. Please try again or contact us by phone or email.",
    expired:
      "The verification has expired. Please complete it again before sending.",
    sending: "Sending your enquiry…",
    success:
      "Your enquiry has been sent. Our team will contact you to discuss your property.",
    error:
      "Your enquiry could not be sent. Your information has been kept. Please try again or contact us by phone or email.",
    timeout:
      "Sending took too long and we did not receive confirmation. You can contact us to check whether your enquiry arrived before trying again.",
    uncertain:
      "We did not receive confirmation of your enquiry. Your information has been kept. You can retry without changing it or contact us to check whether it arrived.",
    phone: "Enter a phone number with 7 to 15 digits, including its country code if needed.",
    required: "Please complete this field.",
  },
};

export function initContact(): void {
  const form = document.querySelector<HTMLFormElement>("#contact-form");
  const status = document.querySelector<HTMLElement>("#form-status");
  const container = document.querySelector<HTMLElement>("#turnstile-container");
  const submit = document.querySelector<HTMLButtonElement>("#submit-contact");
  const reset = document.querySelector<HTMLButtonElement>("#form-reset");
  if (!form || !status || !container || !submit || form.dataset.initialized)
    return;
  form.dataset.initialized = "true";
  const locale = form.dataset.locale === "en" ? "en" : "fr";
  const copy = messages[locale];
  const intent = form.querySelector<HTMLSelectElement>("#contact-intent");
  const intents = ["audit", "gestion"];
  const initialIntent =
    new URLSearchParams(location.search).get("intent") ?? "";
  if (intent)
    intent.value = intents.includes(initialIntent) ? initialIntent : "";
  function updateIntent(): void {
    const audit = intent?.value === "audit";
    const management = intent?.value === "gestion";
    const title = document.querySelector("#contact-title");
    const label = document.querySelector("#submit-contact-label");
    const lead = document.querySelector("#contact-lead");
    const help = document.querySelector("#message-help");
    const phone = form!.querySelector<HTMLInputElement>("#phone");
    const phoneLabel = form!.querySelector('label[for="phone"]');
    if (title)
      title.textContent =
        locale === "fr"
          ? audit
            ? "Votre audit gratuit."
            : management ? "Confiez-nous la gestion de votre bien." : "Parlons de votre bien."
          : audit
            ? "Your free property review."
            : management ? "Let us manage your property." : "Let’s talk about your property.";
    if (lead) lead.textContent = locale === "fr"
      ? audit
        ? "Nous vous rappelons sous 24 h, selon votre convenance, pour parler de votre bien et préparer votre audit gratuit. Indiquez votre numéro et vos disponibilités."
        : "Présentez-nous votre bien et votre situation. Un premier échange par appel ou email permettra de préciser la gestion complète et le cadre adapté à votre logement."
      : audit
        ? "We call you back within 24 hours, at a time that suits you, to prepare your free review."
        : "Tell us about your property and current situation. An initial conversation by phone or email will help define full management and the arrangements suited to your home.";
    if (help) help.textContent = locale === "fr"
      ? audit
        ? "Présentez votre bien et vos disponibilités pour le rappel. Vous pouvez ajouter sa capacité d’accueil et le lien de l’annonce, si elle existe."
        : "Précisez votre situation actuelle, votre projet de gestion complète et votre rôle dans la décision. Vous pouvez ajouter la capacité d’accueil et le lien de votre annonce."
      : audit
        ? "Tell us about your property and when you are available for the callback. You can add its guest capacity and a listing link, if one exists."
        : "Tell us about your current situation, your full management plans and your role in the decision. You can add the guest capacity and a listing link.";
    if (phone) phone.required = audit;
    if (phoneLabel) phoneLabel.textContent = locale === "fr"
      ? audit ? "Téléphone *" : "Téléphone (facultatif)"
      : audit ? "Phone *" : "Phone (optional)";
    if (label)
      label.textContent =
        locale === "fr"
          ? audit
            ? "Demander mon audit gratuit"
            : management ? "Parlons de la gestion de mon bien" : "Envoyer ma demande"
          : audit
            ? "Request my free property review"
            : management ? "Discuss my property management" : "Send my enquiry";
    document
      .querySelectorAll<HTMLAnchorElement>(".language-link")
      .forEach((link) => {
        const url = new URL(link.href);
        if (intent?.value) url.searchParams.set("intent", intent.value);
        else url.searchParams.delete("intent");
        link.href = url.href;
      });
  }
  intent?.addEventListener("change", updateIntent);
  updateIntent();
  let token = "";
  let widgetId: string | undefined;
  let scriptPromise: Promise<void> | undefined;
  let pending = false;
  let completed = false;
  let enquiry: { fingerprint: string; id: string } | undefined;

  function validateFields(): void {
    for (const name of ["firstName", "lastName", "location"]) {
      const field = form!.querySelector<HTMLInputElement>(`[name="${name}"]`);
      field?.setCustomValidity(field.value.trim() ? "" : copy.required);
    }
    const phone = form!.querySelector<HTMLInputElement>("#phone");
    if (phone) {
      const value = phone.value.trim();
      const digits = value.replace(/\D/g, "");
      phone.setCustomValidity(value && (!/^\+?[0-9 ()\u00a0.-]+$/.test(value) || digits.length < 7 || digits.length > 15) ? copy.phone : "");
    }
  }
  form.addEventListener("input", validateFields);

  function announce(message: string, state: string, focus = false): void {
    status!.textContent = message;
    status!.dataset.state = state;
    if (focus) status!.focus();
  }

  function loadWidget(): Promise<void> {
    if (widgetId !== undefined) return Promise.resolve();
    if (scriptPromise) return scriptPromise;
    announce(copy.loading, "loading");
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      const timer = window.setTimeout(() => fail(), 15000);
      function fail(): void {
        window.clearTimeout(timer);
        script.remove();
        window.inastiaTurnstileReady = undefined;
        reject(new Error("Challenge unavailable"));
      }
      function render(): void {
        window.clearTimeout(timer);
        window.inastiaTurnstileReady = undefined;
        try {
          if (!window.turnstile) throw new Error("Challenge unavailable");
          widgetId = window.turnstile.render(container!, {
            sitekey: "0x4AAAAAACfqzkKmQzM62oPC",
            size: "compact",
            language: locale,
            callback: (value) => {
              token = value;
              if (!pending && !completed) announce("", "ready");
            },
            "expired-callback": () => {
              token = "";
              if (!pending && !completed) announce(copy.expired, "error");
            },
            "error-callback": () => {
              token = "";
              if (!pending && !completed) announce(copy.unavailable, "error");
            },
          });
          announce(copy.challenge, "ready");
          resolve();
        } catch {
          fail();
        }
      }
      if (window.turnstile) {
        render();
        return;
      }
      window.inastiaTurnstileReady = render;
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=inastiaTurnstileReady";
      script.async = true;
      script.addEventListener("error", fail, { once: true });
      document.head.append(script);
    }).catch(() => {
      scriptPromise = undefined;
      announce(copy.unavailable, "error");
      throw new Error("Challenge unavailable");
    });
    return scriptPromise;
  }

  function beginVerification(event: FocusEvent): void {
    // A pointerdown on Submit must not move that button before pointerup.
    // Load protection only when the visitor enters an actual form field.
    if (
      !completed &&
      event.target instanceof HTMLElement &&
      event.target.matches("input, select, textarea")
    ) {
      void loadWidget().catch(() => {});
    }
  }
  form.addEventListener("focusin", beginVerification);
  form.addEventListener("input", () => {
    if (completed && !reset) {
      completed = false;
      announce("", "ready");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    validateFields();
    if (pending || completed || !form.reportValidity()) return;
    try {
      await loadWidget();
    } catch {
      status.focus();
      return;
    }
    if (!token) {
      announce(copy.challenge, "error", true);
      return;
    }
    // Another submit may have completed while the challenge script was loading.
    if (pending || completed) return;
    pending = true;
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    announce(copy.sending, "pending");
    const fields = new FormData(form);
    const payload: Record<string, string> = {};
    for (const name of [
      "intent",
      "firstName",
      "lastName",
      "email",
      "propertyType",
      "location",
      "phone",
      "bedrooms",
      "capacity",
      "surface",
      "bathrooms",
      "message",
    ]) {
      const value = fields.get(name);
      payload[name] = typeof value === "string" ? value.trim() : "";
    }
    const fingerprint = JSON.stringify(payload);
    if (enquiry?.fingerprint !== fingerprint) {
      enquiry = { fingerprint, id: globalThis.crypto.randomUUID() };
    }
    payload.requestId = enquiry.id;
    payload.turnstileToken = token;
    // Snapshot first: disabled controls are excluded from FormData.
    const controls = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea"));
    const disabledStates = controls.map((field) => ({ field, disabled: field.disabled }));
    controls.forEach((field) => { field.disabled = true; });
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 25000);
    let uncertain = true;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result: unknown = await response.json();
      if (result && typeof result === "object" && "success" in result && result.success === false) {
        uncertain = "uncertain" in result ? result.uncertain !== false : response.status >= 500;
      }
      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("success" in result) ||
        result.success !== true
      ) {
        throw new Error("Request failed");
      }
      completed = true;
      form.reset();
      if (intent) intent.value = payload.intent ?? "";
      updateIntent();
      if (reset) reset.hidden = false;
      announce(
        payload.intent === "audit"
          ? locale === "fr"
            ? "Votre demande d’audit gratuit a bien été envoyée. Nous vous rappelons sous 24 h, selon votre convenance, pour échanger sur votre bien et préparer l’audit."
            : "Your free property review request has been sent. We will call you back within 24 hours, at a time that suits you, to discuss your property and prepare the review."
          : copy.success,
        "success",
        true,
      );
    } catch {
      announce(
        controller.signal.aborted ? copy.timeout : uncertain ? copy.uncertain : copy.error,
        "error",
        true,
      );
    } finally {
      window.clearTimeout(timer);
      disabledStates.forEach(({ field, disabled }) => { field.disabled = disabled; });
      token = "";
      if (widgetId !== undefined) {
        try {
          window.turnstile?.reset(widgetId);
        } catch {
          widgetId = undefined;
          scriptPromise = undefined;
        }
      }
      pending = false;
      form.removeAttribute("aria-busy");
      submit.disabled = completed && !!reset;
    }
  });

  reset?.addEventListener("click", (event) => {
    event.preventDefault();
    if (pending) return;
    completed = false;
    enquiry = undefined;
    reset.hidden = true;
    submit.disabled = false;
    announce("", "ready");
    form.querySelector<HTMLElement>('[name="firstName"]')?.focus();
  });
}
