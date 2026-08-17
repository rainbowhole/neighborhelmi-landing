const accordion = document.querySelector("[data-accordion]");

if (accordion) {
  accordion.addEventListener("click", (event) => {
    const trigger = event.target.closest(".service-trigger");

    if (!trigger) {
      return;
    }

    const selectedItem = trigger.closest(".service-item");

    accordion.querySelectorAll(".service-item").forEach((item) => {
      const isSelected = item === selectedItem;
      item.classList.toggle("is-open", isSelected);
      item.querySelector(".service-trigger").setAttribute("aria-expanded", String(isSelected));
    });
  });
}
