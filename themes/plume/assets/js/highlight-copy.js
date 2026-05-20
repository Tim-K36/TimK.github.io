(() => {
  "use strict";

  const highlights = document.querySelectorAll(".highlight");

  if (!highlights) {
    return;
  }

  for (const highlight of highlights) {
    const copyBtn = document.querySelector(".highlight__copy");

    if (!copyBtn) {
      continue;
    }

    copyBtn.addEventListener("click", () => {
      /** @type {HTMLPreElement | null} */
      const codeElement = highlight.querySelector("[data-lang]");
      const code = (codeElement?.innerText ?? "").replaceAll("\n\n", "\n");

      navigator.clipboard.writeText(code);
      copyBtn.classList.add("copied");

      setTimeout(() => {
        copyBtn.classList.remove("copied");
      }, 1000);
    });
  }
})();
