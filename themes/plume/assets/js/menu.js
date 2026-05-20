(() => {
  "use strict";

  const menu = document.querySelector(".menu");

  if (!menu) {
    return;
  }

  const menuToggles = document.querySelectorAll(
    '[data-action="toggle-menu"]',
  );

  for (const toggle of menuToggles) {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();

      menu.classList.add("is-transitioning");
      menu.classList.toggle("open");

      setTimeout(() => {
        menu.classList.remove("is-transitioning");
      }, 200);
    });
  }
})();
