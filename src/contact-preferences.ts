// Preferences follow an accepted enquiry; this form never records a conversion.
export function initContactPreferences(locale: "fr" | "en") {
  const form = document.querySelector<HTMLFormElement>("#contact-preferences");
  const status = document.querySelector<HTMLElement>("#preferences-status");
  if (!form || !status) return;
  const emailChoice = form.querySelector<HTMLInputElement>("#marketingEmail")!;
  const phoneChoice = form.querySelector<HTMLInputElement>("#marketingPhone")!;
  const email = form.querySelector<HTMLInputElement>("#preference-email")!;
  const phone = form.querySelector<HTMLInputElement>("#preference-phone")!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const text = (fr: string, en: string) => locale === "fr" ? fr : en;
  let receipt = "";
  let pending = false;
  let generation = 0;
  let attempt: { fingerprint: string; collectedAt: string } | undefined;

  function update() {
    for (const [choice, field] of [[emailChoice, email], [phoneChoice, phone]] as const) {
      field.closest<HTMLElement>(".field")!.hidden = !choice.checked;
      field.disabled = !choice.checked;
      field.required = choice.checked;
    }
    phone.setCustomValidity("");
  }
  emailChoice.addEventListener("change", update);
  phoneChoice.addEventListener("change", update);
  phone.addEventListener("input", () => phone.setCustomValidity(""));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending || !receipt) return;
    const value = phone.value.trim();
    const digits = value.replace(/\D/g, "");
    phone.setCustomValidity(phoneChoice.checked && value && (!/^\+?[0-9 ()\u00a0.-]+$/.test(value) || digits.length < 7 || digits.length > 15)
      ? text("Indiquez un numéro de téléphone valide.", "Enter a valid phone number.") : "");
    if (!form.reportValidity()) return;
    const payload = { receipt, marketingEmail: emailChoice.checked, marketingPhone: phoneChoice.checked,
      email: emailChoice.checked ? email.value.trim() : "", phone: phoneChoice.checked ? value : "" };
    const fingerprint = JSON.stringify(payload);
    if (attempt?.fingerprint !== fingerprint) attempt = { fingerprint, collectedAt: new Date().toISOString() };
    pending = true;
    const currentGeneration = generation;
    button.disabled = true;
    const fields = [emailChoice, phoneChoice, email, phone];
    fields.forEach(field => { field.disabled = true; });
    status.textContent = text("Transmission de vos choix…", "Sending your preferences…");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);
    let sent = false;
    try {
      const response = await fetch("/api/contact-preferences", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, collectedAt: attempt.collectedAt }), signal: controller.signal });
      const result = await response.json();
      if (currentGeneration !== generation) return;
      if (!response.ok || result?.success !== true) {
        if (result?.expired === true) {
          receipt = "";
          status.textContent = text("Ce lien de préférences a expiré. Votre demande reste transmise. Pour vos choix commerciaux, écrivez à contact@inastia.fr.", "This preference link has expired. Your enquiry has already been sent. For marketing preferences, email contact@inastia.fr.");
          return;
        }
        throw new Error("Preferences not confirmed");
      }
      sent = true;
      receipt = "";
      status.textContent = text("Vos choix ont été transmis à notre équipe. Ils sont distincts du traitement de votre demande.", "Your preferences have been sent to our team. They are separate from how your enquiry is handled.");
    } catch {
      if (currentGeneration === generation) status.textContent = text("La transmission de vos choix n’a pas été confirmée. Votre demande est déjà transmise. Vous pouvez réessayer ou écrire à contact@inastia.fr.", "Your preferences could not be confirmed. Your enquiry has already been sent. You can retry or email contact@inastia.fr.");
    } finally {
      window.clearTimeout(timer);
      if (currentGeneration === generation) {
        pending = false;
        if (!sent && receipt) {
          emailChoice.disabled = false;
          phoneChoice.disabled = false;
          update();
          button.disabled = false;
        }
        status.focus();
      }
    }
  });
  return {
    show(token: string, initialEmail: string, initialPhone: string) {
      generation++;
      pending = false;
      receipt = token;
      attempt = undefined;
      form.reset();
      emailChoice.disabled = phoneChoice.disabled = button.disabled = false;
      email.value = initialEmail;
      phone.value = initialPhone;
      status.textContent = "";
      update();
      form.hidden = false;
    },
    hide() {
      generation++;
      pending = false;
      form.hidden = true;
      receipt = "";
      attempt = undefined;
      form.reset();
    },
  };
}
