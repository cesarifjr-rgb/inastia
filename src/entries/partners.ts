import "../client.ts";

function openPartnerQuestion(): void {
  const question = document.getElementById(location.hash.slice(1));
  if (question instanceof HTMLDetailsElement && question.closest(".partners-faq")) question.open = true;
}
openPartnerQuestion();
window.addEventListener("hashchange", openPartnerQuestion);
