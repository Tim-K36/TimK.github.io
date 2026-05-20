(() => {
  "use strict";

  /** @type {Array<{title: string, description: string, content: string, permalink: string}>} */
  let searchData = [];
  const searchSections = document.querySelectorAll(".sidebar__section--search");

  if (!searchSections) {
    return;
  }

  document.addEventListener("keydown", (e) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }

    if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();

      /** @type {HTMLInputElement | null} */
      const searchInput = searchSections[0].querySelector(
        'input[type="text"], input[type="search"]',
      );

      if (searchInput) {
        searchInput.focus();
      }
    }
  });

  for (const searchSection of searchSections) {
    /** @type {HTMLInputElement | null} */
    const searchInput = searchSection.querySelector(
      'input[type="text"], input[type="search"]',
    );

    /** @type {HTMLUListElement | null} */
    const resultsContainer = searchSection.querySelector(
      ".sidebar__section--search-results",
    );

    if (!searchInput || !resultsContainer) {
      continue;
    }

    /** @type {HTMLDivElement | null} */
    const sidebarContent = document.querySelector(".sidebar__content");

    /** @type {HTMLDivElement | null} */
    const searchContainer = searchInput.closest(".sidebar__section--search");

    if (!sidebarContent || !searchContainer) {
      continue;
    }

    /**
     * @param {HTMLDivElement} sidebarContent
     * @param {HTMLDivElement} searchContainer
     * @param {HTMLUListElement} resultsContainer
     */
    function updateSidebarSearchResultsMaxHeight(
      sidebarContent,
      searchContainer,
      resultsContainer,
    ) {
      if (!resultsContainer.children.length) {
        return;
      }

      const maxHeight =
        sidebarContent.clientHeight - searchContainer.clientHeight;
      resultsContainer.style.maxHeight = `${maxHeight}px`;
    }

    updateSidebarSearchResultsMaxHeight(
      sidebarContent,
      searchContainer,
      resultsContainer,
    );

    globalThis.addEventListener("resize", () => {
      updateSidebarSearchResultsMaxHeight(
        sidebarContent,
        searchContainer,
        resultsContainer,
      );
    });

    let isSearching = false;
    const minChars = 3;

    searchInput.addEventListener("input", () => {
      search(
        searchInput.value,
        sidebarContent,
        searchContainer,
        searchInput,
        resultsContainer,
      );
    });

    searchInput.addEventListener("focus", () => {
      search(
        searchInput.value,
        sidebarContent,
        searchContainer,
        searchInput,
        resultsContainer,
      );
    });

    /**
     * @param {string} query
     * @param {HTMLDivElement} sidebarContent
     * @param {HTMLDivElement} searchContainer
     * @param {HTMLInputElement} searchInput
     * @param {HTMLUListElement} resultsContainer
     */
    async function search(
      query,
      sidebarContent,
      searchContainer,
      searchInput,
      resultsContainer,
    ) {
      if (isSearching) {
        return;
      }

      searchInput.classList.remove("has-results");
      resultsContainer.innerHTML = "";

      if (query.length < minChars) {
        return;
      }

      isSearching = true;

      if (searchData.length === 0) {
        try {
          const response = await fetch("/index.json");
          searchData = await response.json();
        } catch (error) {
          console.error(error);
        }
      }

      const results = searchData
        .filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 10);

      for (const result of results) {
        const li = document.createElement("li");
        const a = document.createElement("a");

        a.href = result.permalink;
        a.classList.add("search-result");
        a.innerHTML = formatSearchResult(result, query);

        li.appendChild(a);
        resultsContainer.appendChild(li);
      }

      if (results.length > 0) {
        searchInput.classList.add("has-results");

        updateSidebarSearchResultsMaxHeight(
          sidebarContent,
          searchContainer,
          resultsContainer,
        );
      }

      isSearching = false;
    }

    /**
     * @param {typeof searchData[number]} result
     * @param {string} query
     * @returns {string}
     */
    function formatSearchResult(result, query) {
      const titleElement = document.createElement("div");
      titleElement.classList.add("search-result__title");
      titleElement.innerHTML = extractSnippet(result.title, query);

      const snippetElement = document.createElement("p");
      snippetElement.classList.add("search-result__body");
      snippetElement.innerHTML = extractSnippet(result.content, query);

      return titleElement.outerHTML + snippetElement.outerHTML;
    }

    /**
     * @param {string} content
     * @param {string} query
     * @returns {string}
     */
    function extractSnippet(content, query) {
      if (!content || !query) {
        return "";
      }

      const queryLower = query.toLowerCase();
      const contentLower = content.toLowerCase();
      const queryIndex = contentLower.indexOf(queryLower);
      const snippetLength = 140;

      if (queryIndex === -1) {
        if (content.length < snippetLength) {
          return content;
        }

        return `${content.substring(0, snippetLength)}...`;
      }

      const start = Math.max(0, queryIndex - snippetLength / 2);
      const end = Math.min(content.length, start + snippetLength);

      let snippet = content.substring(start, end);

      if (start > 0 && end < content.length) {
        snippet = `...${snippet}...`;
      } else if (start > 0) {
        snippet = `...${snippet}`;
      } else if (end < content.length) {
        snippet = `${snippet}...`;
      }

      snippet = snippet.replace(
        new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
        "<mark>$&</mark>",
      );

      return snippet;
    }
  }
})();
