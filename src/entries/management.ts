import "../client.ts";
import { initManagementArt } from "../management-art-client.ts";
import { initPricing } from "../pricing-client.ts";

initManagementArt();
initPricing();

function openManagementService(): void {
  const service = document.getElementById(location.hash.slice(1));
  if (service instanceof HTMLDetailsElement && service.classList.contains("management-service")) service.open = true;
}
if (document.querySelector(".management-services")) {
  openManagementService();
  window.addEventListener("hashchange", openManagementService);
}
