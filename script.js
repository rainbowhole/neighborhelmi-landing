const pages = document.querySelectorAll("[data-page]");
const routeLinks = document.querySelectorAll("[data-route]");
const navLinks = document.querySelectorAll(".nav-link");
const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector("[data-menu]");
const faq = document.querySelector("[data-faq]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

const vercelContactEndpoint =
  "https://todough-landing.vercel.app/api/contact";
const contactEndpoint =
  window.TODOUGH_CONTACT_ENDPOINT ||
  (window.location.hostname.endsWith(".vercel.app") ? "/api/contact" : vercelContactEndpoint);

function setActiveRoute(route) {
  pages.forEach((page) => {
    page.classList.toggle("is-visible", page.dataset.page === route);
  });

  routeLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === route);
  });

  if (menu) {
    menu.classList.remove("is-open");
  }

  if (menuButton) {
    menuButton.setAttribute("aria-expanded", "false");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

routeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const route = link.dataset.route;
    const scrollTarget = link.dataset.scrollTarget;

    if (!route) {
      return;
    }

    event.preventDefault();
    setActiveRoute(route);

    if (scrollTarget) {
      document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
      navLinks.forEach((navLink) => navLink.classList.toggle("is-active", navLink === link));
    }

    history.replaceState(null, "", link.getAttribute("href"));
  });
});

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
      menu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

if (faq) {
  faq.addEventListener("click", (event) => {
    const trigger = event.target.closest(".faq-trigger");

    if (!trigger) {
      return;
    }

    const item = trigger.closest(".faq-item");
    const isOpen = item.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      wantsReply: true,
      locale: navigator.language,
      platform: "web",
      sentAt: new Date().toISOString(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      formStatus.textContent = "Please fill in every field before submitting.";
      return;
    }

    if (!contactEndpoint) {
      formStatus.textContent =
        "Thanks. Your message is ready, but the contact endpoint has not been configured yet.";
      return;
    }

    submitButton.disabled = true;
    formStatus.textContent = "Sending...";

    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      contactForm.reset();
      formStatus.textContent = "Thanks. Your message was sent through the website.";
    } catch {
      formStatus.textContent = "Sorry, the message could not be sent. Please try again soon.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

const initialRoute = window.location.hash.replace("#", "");

if (["contact", "privacy", "terms"].includes(initialRoute)) {
  setActiveRoute(initialRoute);
}
