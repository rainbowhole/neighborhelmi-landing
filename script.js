const pages = Array.from(document.querySelectorAll("[data-page]"));
const links = Array.from(document.querySelectorAll("[data-route-link]"));

function routeFromHash() {
  const route = window.location.hash.replace("#", "");
  return ["home", "about", "contact"].includes(route) ? route : "home";
}

function showPage(route) {
  pages.forEach((page) => {
    page.classList.toggle("is-active", page.dataset.page === route);
  });

  links.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.routeLink === route);
  });

  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", () => showPage(routeFromHash()));
showPage(routeFromHash());
