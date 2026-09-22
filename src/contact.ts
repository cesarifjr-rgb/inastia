import { enquiryAttribution, trackEnquiry } from "./ads.ts";
import { enquiryJourney } from "./analytics.ts";

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
      "Votre demande a bien été envoyée. Nous examinons votre projet et vous répondons par le canal choisi pour préparer notre premier échange.",
    registered:
      "Votre demande a bien été enregistrée. Nous examinons votre projet et vous répondons par le canal choisi pour préparer notre premier échange.",
    error:
      "Votre demande n’a pas pu être envoyée. Vos informations sont conservées. Réessayez ou contactez-nous par téléphone ou par e-mail.",
    timeout:
      "L’envoi a pris trop de temps et sa confirmation n’a pas été reçue. Avant de réessayer, vous pouvez nous contacter pour vérifier la réception.",
    uncertain:
      "La confirmation de votre envoi n’a pas été reçue. Vos informations sont conservées. Vous pouvez réessayer sans les modifier ou nous contacter pour vérifier la réception.",
    phone: "Indiquez un numéro de téléphone de 7 à 15 chiffres, avec son indicatif si nécessaire.",
    required: "Veuillez renseigner ce champ.",
    requestExpired: "Pour éviter un doublon, contactez-nous pour vérifier la réception de votre précédente demande avant d’en envoyer une nouvelle.",
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
      "Your enquiry has been sent. We will review your plans and reply through your chosen channel to prepare our first conversation.",
    registered:
      "Your enquiry has been recorded. We will review your plans and reply through your chosen channel to prepare our first conversation.",
    error:
      "Your enquiry could not be sent. Your information has been kept. Please try again or contact us by phone or email.",
    timeout:
      "Sending took too long and we did not receive confirmation. You can contact us to check whether your enquiry arrived before trying again.",
    uncertain:
      "We did not receive confirmation of your enquiry. Your information has been kept. You can retry without changing it or contact us to check whether it arrived.",
    phone: "Enter a phone number with 7 to 15 digits, including its country code if needed.",
    required: "Please complete this field.",
    requestExpired: "To avoid a duplicate, contact us to check whether your previous enquiry arrived before sending a new one.",
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
  const contactPreference = form.querySelector<HTMLSelectElement>("#contactPreference");
  const marketingPhone = form.querySelector<HTMLInputElement>("#marketingPhone");
  const intentField = form.querySelector<HTMLSelectElement>("#contact-intent");
  const project = form.querySelector<HTMLDetailsElement>("#contact-project");
  const planField = form.querySelector<HTMLSelectElement>("#intendancePlan");
  const params = new URL(location.href).searchParams;
  const requestedIntent = params.get("intent");
  if (intentField) intentField.value = requestedIntent === "audit" || requestedIntent === "intendance" ? requestedIntent : "gestion";
  const requestedPlan = params.get("formule") ?? "";
  if (planField && ["essentielle", "serenite", "surmesure"].includes(requestedPlan)) planField.value = requestedPlan;

  function updateIntent(resetProject = false): void {
    const care = intentField?.value === "intendance";
    const audit = intentField?.value === "audit";
    const text = (fr: string, en: string): string => locale === "fr" ? fr : en;
    const label = audit ? text("Demander mon audit gratuit", "Request my free review") : care ? text("Demander une proposition d’intendance", "Request a home-care proposal") : text("Parlons de votre logement", "Let’s talk about your property");
    const formTitle = document.getElementById("contact-form-title");
    if (formTitle) formTitle.textContent = audit || care ? label : text("Présentez-nous votre logement", "Tell us about your property");
    const submitLabel = document.getElementById("submit-contact-label");
    if (submitLabel) submitLabel.textContent = audit || care ? label : text("Envoyer ma demande", "Send my enquiry");
    for (const link of document.querySelectorAll<HTMLAnchorElement>(".header-cta, #mobile-menu .button")) {
      if (link.firstChild?.nodeType === Node.TEXT_NODE) link.firstChild.textContent = label;
      link.setAttribute("href", "#contact-form");
    }
    const title = document.getElementById("contact-title");
    if (title) title.textContent = audit ? text("Faisons le point sur votre projet locatif", "Let’s review your rental plans") : care ? text("Prenons soin de votre maison en Corse", "Let’s care for your home in Corsica") : text("Parlons de votre projet de gestion", "Let’s talk about managing your property");
    const lead = document.getElementById("contact-lead");
    if (lead) lead.textContent = audit ? text("Un premier audit gratuit, sans vous engager dans une gestion complète. Nous vous rappelons sous 24 h, selon vos disponibilités, pour commencer l’échange ; l’analyse se poursuit ensuite.", "A free initial review without committing to full management. We call you back within 24 hours, taking your availability into account, to start the conversation; the review continues afterwards.") : text("Indiquez où se trouve votre logement et ce que vous souhaitez déléguer. Ces informations nous permettent de vérifier sa prise en charge et de préparer notre premier échange.", "Tell us where your home is and what you would like to delegate. This helps us check whether we can look after it and prepare our first conversation.");
    const messageHelp = document.getElementById("message-help");
    if (messageHelp) messageHelp.textContent = audit ? text("Vous pouvez préciser vos questions et vos disponibilités pour le rappel. Aucune décision de déléguer n’est nécessaire.", "You can add your questions and availability for the callback. You do not need to have decided to hand over management.") : care ? text("Précisez vos périodes de présence, les dépendances, les accès et le suivi souhaité.", "Tell us when you stay, about any outbuildings and access, and the care you need.") : text("Précisez la capacité d’accueil, les accès et vos disponibilités pour notre échange.", "Add the guest capacity, access details and your availability for our conversation.");
    const nextStep = document.querySelector(".contact-next-steps li:nth-child(2)");
    if (nextStep) nextStep.textContent = audit ? text("Nous vous rappelons sous 24 h, selon vos disponibilités, pour préparer l’audit gratuit.", "We call you back within 24 hours, taking your availability into account, to prepare the free review.") : care ? text("Nous échangeons sur vos habitudes et le rythme de visite adapté.", "We discuss your routines and the right visit schedule.") : text("Nous échangeons pour préciser votre projet de gestion complète.", "We discuss your full management plans.");
    const finalStep = document.querySelector(".contact-next-steps li:nth-child(3)");
    if (finalStep) finalStep.textContent = audit ? text("Vous décidez ensuite si vous souhaitez poursuivre. Une éventuelle gestion fait l’objet d’une proposition distincte.", "You then decide whether to continue. Any management service is covered by a separate proposal.") : text("Nous définissons ensemble les prestations et le devis adaptés à votre logement.", "Together, we define the services and quote suited to your property.");
    const preferenceGroup = document.getElementById("contact-preference-field");
    if (preferenceGroup) preferenceGroup.hidden = audit;
    if (contactPreference) contactPreference.disabled = audit;
    for (const group of form!.querySelectorAll<HTMLElement>("[data-intendance-fields], [data-rental-field]")) {
      const visible = group.hasAttribute("data-intendance-fields") ? care : !care;
      group.hidden = !visible;
      group.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select").forEach(field => { field.disabled = !visible; });
    }
    for (const [name, fr, en] of [
      ["decisionRole", "Votre rôle dans le projet", "Your role in the project"],
      ["rentalSituation", "Situation locative", "Rental situation"],
      ["startTimeline", "Échéance envisagée", "Expected timing"],
    ]) {
      const field = form!.querySelector<HTMLSelectElement>('#' + name);
      const required = (audit || care) && !field?.disabled;
      if (field) field.required = required;
      const fieldLabel = form!.querySelector('label[for="' + name + '"]');
      if (fieldLabel) fieldLabel.textContent = text(fr!, en!) + (required ? " *" : text(" (facultatif)", " (optional)"));
    }
    if (project && resetProject) project.open = audit || care;
    const projectSummary = document.getElementById("contact-project-summary");
    if (projectSummary) projectSummary.textContent = audit || care ? text("Votre projet", "Your plans") : text("Votre projet (facultatif)", "Your plans (optional)");
    const projectHelp = document.getElementById("contact-project-help");
    if (projectHelp) projectHelp.hidden = audit || care;
    document.querySelectorAll<HTMLAnchorElement>(".language-link").forEach((link) => {
      const url = new URL(link.href);
      url.searchParams.set("intent", audit ? "audit" : care ? "intendance" : "gestion");
      if (care && planField?.value) url.searchParams.set("formule", planField.value);
      else url.searchParams.delete("formule");
      link.href = url.href;
    });
    updatePhoneRequirement();
  }
  function updatePhoneRequirement(): void {
    const phone = form!.querySelector<HTMLInputElement>("#phone");
    const phoneLabel = form!.querySelector('label[for="phone"]');
    const phoneRequired = intentField?.value === "audit" || contactPreference?.value === "phone" || marketingPhone?.checked === true;
    if (phone) {
      phone.required = phoneRequired;
      const phoneField = phone.closest<HTMLElement>(".field");
      if (phoneField) phoneField.hidden = !phoneRequired;
      if (!phoneRequired) phone.setCustomValidity("");
    }
    if (phoneLabel) phoneLabel.textContent = locale === "fr"
      ? phoneRequired ? "Téléphone *" : "Téléphone (facultatif)"
      : phoneRequired ? "Phone *" : "Phone (optional)";
  }
  intentField?.addEventListener("change", () => updateIntent(true));
  planField?.addEventListener("change", () => updateIntent());
  updateIntent(true);
  contactPreference?.addEventListener("change", updatePhoneRequirement);
  marketingPhone?.addEventListener("change", updatePhoneRequirement);
  updatePhoneRequirement();
  let token = "";
  let widgetId: string | undefined;
  let scriptPromise: Promise<void> | undefined;
  let pending = false;
  let completed = false;
  let enquiry: { fingerprint: string; id: string; collectedAt: string; createdWallAt: number; createdElapsedAt: number } | undefined;

  function validateFields(): void {
    for (const name of ["firstName", "lastName", "location", "propertyArea"]) {
      const field = form!.querySelector<HTMLInputElement>(`[name="${name}"]`);
      field?.setCustomValidity(field.value.trim() ? "" : copy.required);
    }
    const phone = form!.querySelector<HTMLInputElement>("#phone");
    if (phone) {
      const value = phone.value.trim();
      const digits = value.replace(/\D/g, "");
      phone.setCustomValidity(phone.required && value && (!/^\+?[0-9 ()\u00a0.-]+$/.test(value) || digits.length < 7 || digits.length > 15) ? copy.phone : "");
    }
  }
  form.addEventListener("input", validateFields);
  // Reveal invalid optional input (for example a listing URL) before native focus.
  form.addEventListener("invalid", (event) => {
    if (project && event.target instanceof Node && project.contains(event.target)) project.open = true;
  }, true);

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
    const payload: Record<string, string | boolean> = {};
    for (const name of [
      "intent",
      "intendancePlan",
      "firstName",
      "lastName",
      "email",
      "propertyType",
      "location",
      "propertyArea",
      "decisionRole",
      "rentalSituation",
      "startTimeline",
      "listingUrl",
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
    if (!form.querySelector<HTMLInputElement>("#phone")?.required) payload.phone = "";
    payload.contactPreference = payload.intent === "audit" ? "phone" : contactPreference?.value ?? "email";
    payload.marketingEmail = form.querySelector<HTMLInputElement>("#marketingEmail")?.checked === true;
    payload.marketingPhone = marketingPhone?.checked === true;
    payload.consentVersion = form.dataset.consentVersion ?? "";
    payload.consentLocale = locale;
    const fingerprint = JSON.stringify(payload);
    if (enquiry?.fingerprint !== fingerprint) {
      enquiry = { fingerprint, id: globalThis.crypto.randomUUID(), collectedAt: new Date().toISOString(), createdWallAt: Date.now(), createdElapsedAt: globalThis.performance.now() };
    }
    payload.requestId = enquiry.id;
    payload.consentCollectedAt = enquiry.collectedAt;
    Object.assign(payload, enquiryAttribution(), enquiryJourney());
    payload.turnstileToken = token;
    // Snapshot first: disabled controls are excluded from FormData.
    const controls = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea"));
    const disabledStates = controls.map((field) => ({ field, disabled: field.disabled }));
    controls.forEach((field) => { field.disabled = true; });
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 25000);
    let uncertain = true;
    let requestExpired = false;
    try {
      // Initial clock offsets cancel out; either clock can cover sleep or a clock change.
      if (Math.max(Date.now() - enquiry.createdWallAt, globalThis.performance.now() - enquiry.createdElapsedAt) >= 23 * 60 * 60 * 1000) {
        requestExpired = true;
        throw new Error("Enquiry retry window expired");
      }
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
      trackEnquiry(enquiry.id, payload.intent === "audit" ? "audit" : payload.intent === "intendance" ? "intendance" : "gestion");
      form.reset();
      if (intentField) intentField.value = String(payload.intent);
      if (planField) planField.value = String(payload.intendancePlan);
      if (contactPreference) contactPreference.value = String(payload.contactPreference);
      updatePhoneRequirement();
      if (reset) reset.hidden = false;
      const registered = "status" in result && result.status === "registered";
      const confirmation = registered ? copy.registered : copy.success;
      const auditConfirmation = locale === "fr"
        ? `Votre demande d’audit gratuit a bien été ${registered ? "enregistrée" : "envoyée"}. Nous vous rappelons sous 24 h, selon vos disponibilités, pour préparer ce premier échange. Vous ne vous engagez pas dans une gestion complète.`
        : `Your free review request has been ${registered ? "recorded" : "sent"}. We call you back within 24 hours, taking your availability into account, to prepare this first conversation. You are not committing to full management.`;
      announce(payload.intent === "audit" ? auditConfirmation : confirmation, "success", true);
    } catch {
      announce(
        requestExpired ? copy.requestExpired : controller.signal.aborted ? copy.timeout : uncertain ? copy.uncertain : copy.error,
        "error",
        true,
      );
    } finally {
      window.clearTimeout(timer);
      disabledStates.forEach(({ field, disabled }) => { field.disabled = disabled; });
      updateIntent(completed);
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
