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
  const intents = ["audit", "gestion", "annonce", "rotation"];
  const initialIntent =
    new URLSearchParams(location.search).get("intent") ?? "";
  if (intent)
    intent.value = intents.includes(initialIntent) ? initialIntent : "";
  function updateIntent(): void {
    const audit = intent?.value === "audit";
    const title = document.querySelector("#contact-title");
    const label = document.querySelector("#submit-contact-label");
    if (title)
      title.textContent =
        locale === "fr"
          ? audit
            ? "Votre audit gratuit."
            : "Parlons de votre bien."
          : audit
            ? "Your free property review."
            : "Let’s talk about your property.";
    if (label)
      label.textContent =
        locale === "fr"
          ? audit
            ? "Demander mon audit gratuit"
            : "Envoyer ma demande"
          : audit
            ? "Request my free property review"
            : "Send my enquiry";
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

  const fields = Array.from(
    form.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >(".field input, .field select, .field textarea"),
  );
  const fieldErrors = new Map<HTMLElement, HTMLElement>();
  const summary = document.createElement("div");
  summary.className = "form-errors";
  summary.id = "contact-errors";
  summary.setAttribute("role", "alert");
  summary.setAttribute("aria-atomic", "true");
  summary.hidden = true;
  form.querySelector(".form-grid")?.before(summary);
  let validationStarted = false;
  let errorSignature = "";
  const requiredMessages: Record<string, string> =
    locale === "fr"
      ? {
          propertyType: "Choisissez le type de bien.",
          location: "Indiquez la commune de votre bien.",
          firstName: "Indiquez votre prénom.",
          lastName: "Indiquez votre nom.",
          email: "Indiquez votre adresse email.",
        }
      : {
          propertyType: "Choose the property type.",
          location: "Enter the town where your property is located.",
          firstName: "Enter your first name.",
          lastName: "Enter your last name.",
          email: "Enter your email address.",
        };

  function validateField(field: (typeof fields)[number]): boolean {
    let message = "";
    if (field.required && !field.value.trim()) {
      message =
        requiredMessages[field.name] ??
        (locale === "fr" ? "Renseignez ce champ." : "Complete this field.");
    } else if (field.validity.typeMismatch) {
      message =
        locale === "fr"
          ? "Saisissez une adresse email complète, par exemple nom@exemple.fr."
          : "Enter a complete email address, for example name@example.com.";
    } else if (!field.validity.valid) {
      message =
        locale === "fr"
          ? "Vérifiez la valeur saisie dans ce champ."
          : "Check the value entered in this field.";
    }
    let error = fieldErrors.get(field);
    if (message && !error) {
      error = document.createElement("p");
      error.id = `${field.id}-error`;
      error.className = "field-error";
      field.after(error);
      fieldErrors.set(field, error);
    }
    const descriptions = (field.getAttribute("aria-describedby") ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .filter((id) => id !== error?.id);
    if (message) {
      error!.textContent = message;
      error!.hidden = false;
      field.setAttribute("aria-invalid", "true");
      descriptions.push(error!.id);
    } else {
      if (error) error.hidden = true;
      field.removeAttribute("aria-invalid");
    }
    if (descriptions.length)
      field.setAttribute("aria-describedby", descriptions.join(" "));
    else field.removeAttribute("aria-describedby");
    return !message;
  }

  function updateErrorSummary(): void {
    const invalid = fields.filter(
      (field) => field.getAttribute("aria-invalid") === "true",
    );
    const signature = invalid
      .map((field) => `${field.id}:${fieldErrors.get(field)?.textContent}`)
      .join("|");
    if (signature === errorSignature) return;
    errorSignature = signature;
    summary.replaceChildren();
    summary.hidden = invalid.length === 0;
    if (!invalid.length) return;
    const heading = document.createElement("p");
    heading.textContent =
      locale === "fr"
        ? `Veuillez corriger ${invalid.length === 1 ? "le champ indiqué" : `les ${invalid.length} champs indiqués`} avant l’envoi.`
        : `Please correct ${invalid.length === 1 ? "the highlighted field" : `the ${invalid.length} highlighted fields`} before sending.`;
    const list = document.createElement("ul");
    for (const field of invalid) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${field.id}`;
      link.textContent = `${field.labels?.[0]?.textContent?.replace(/\s*\*\s*$/, "").trim() ?? field.name} : ${fieldErrors.get(field)!.textContent}`;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        field.focus();
      });
      item.append(link);
      list.append(item);
    }
    summary.append(heading, list);
  }

  function validateForm(): boolean {
    validationStarted = true;
    const invalid = fields.filter((field) => !validateField(field));
    updateErrorSummary();
    invalid[0]?.focus();
    return invalid.length === 0;
  }

  for (const field of fields) {
    field.addEventListener("input", () => {
      if (!validationStarted || pending || completed) return;
      validateField(field);
      updateErrorSummary();
    });
  }

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
    if (pending || completed || !validateForm()) return;
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
    const payload: Record<string, string> = { turnstileToken: token };
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
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result: unknown = await response.json();
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
            ? "Votre demande d’audit gratuit a bien été envoyée. Notre équipe vous répondra par appel ou par email."
            : "Your free property review request has been sent. Our team will respond by phone or email."
          : copy.success,
        "success",
        true,
      );
    } catch {
      announce(
        controller.signal.aborted ? copy.timeout : copy.error,
        "error",
        true,
      );
    } finally {
      window.clearTimeout(timer);
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
    reset.hidden = true;
    submit.disabled = false;
    announce("", "ready");
    form.querySelector<HTMLElement>('[name="firstName"]')?.focus();
  });
  // Native HTML constraints remain the fallback if JavaScript does not run.
  // Enhance only after the submit and inline-validation handlers are installed.
  form.noValidate = true;
}
