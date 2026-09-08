(() => {
  const replaceCopy = (value) => {
    if (!value || typeof value !== "string") return value;
    return value
      .replace(/\bAlly\b/g, "NGD")
      .replace(/Buy this Template/gi, "Try Demo")
      .replace(/Join Waitlist/gi, "Join us");
  };

  const normalizeText = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach((textNode) => {
      const updated = replaceCopy(textNode.nodeValue);
      if (updated !== textNode.nodeValue) textNode.nodeValue = updated;
    });
  };

  const normalizeLabels = () => {
    const updatedTitle = replaceCopy(document.title);
    if (updatedTitle !== document.title) document.title = updatedTitle;

    document.querySelectorAll("[aria-label], [alt], [title]").forEach((element) => {
      ["aria-label", "alt", "title"].forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        const value = element.getAttribute(attribute);
        const updated = replaceCopy(value);
        if (updated !== value) element.setAttribute(attribute, updated);
      });
    });
  };

  const replaceLogos = () => {
    document.querySelectorAll('a[data-framer-name="Logo"], .framer-1h4drck').forEach((link) => {
      if (!link.querySelector(".ngd-nav-logo") || link.querySelector("img")) {
        link.innerHTML = '<span class="ngd-text-logo ngd-nav-logo">NGD</span>';
      }
    });

    document.querySelectorAll(".framer-1p4q33z, .framer-tkwnsc").forEach((comparison) => {
      if (!comparison.querySelector(".ngd-comparison-logo") || comparison.querySelector("img")) {
        comparison.innerHTML = '<span class="ngd-text-logo ngd-comparison-logo">NGD</span>';
      }
    });

    document.querySelectorAll(
      'img[src*="kDCm12kIw9RRyNFBAQEzgkRcY"], img[src*="sPIsQodCKRqQoJqL2e407V0h1BA504d"], img[src*="ally.png"]',
    ).forEach((image) => {
      const container = image.closest('[data-framer-name="Logo"]') || image.parentElement;
      if (!container || (container.querySelector(".ngd-text-logo") && !container.querySelector("img"))) return;
      if (container.closest("footer")) return;
      const isNav = container.closest("nav") || container.classList.contains("framer-1h4drck");
      const logoClass = isNav ? "ngd-nav-logo" : "ngd-comparison-logo";
      container.innerHTML = `<span class="ngd-text-logo ${logoClass}">NGD</span>`;
    });
  };

  const normalizePage = () => {
    normalizeText(document.body);
    normalizeLabels();
    replaceLogos();
    document.querySelectorAll('footer img[alt="Logo"], footer img[src*="sPIsQodCKRqQoJqL2e407V0h1BA504d"]').forEach((image) => {
      (image.closest('[data-framer-background-image-wrapper="true"]') || image).remove();
    });
    document.querySelectorAll(".framer-a6rm50-container").forEach((element) => element.remove());
  };

  normalizePage();
  new MutationObserver(normalizePage).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  const shouldReload = (target) => {
    const button = target.closest("button, input[type=submit], input[type=button], a, [role=button]");
    if (!button) return false;
    if (button.tagName === "BUTTON" || (button.tagName === "INPUT" && ["submit", "button"].includes(button.type))) return true;
    if (
      button.classList.contains("framer-CLOpI") ||
      ["Nav", "Secondary Nav", "Large"].includes(button.dataset.framerName) ||
      button.getAttribute("role") === "button"
    ) return true;
    if (button.closest("footer") || ["framer-bsqkdh", "framer-o3e9cv", "framer-xmojnd"].some((className) => button.closest(`.${className}`))) return true;

    const href = button.getAttribute("href") || "";
    return ["waitlist.html", "terms-conditions.html", "privacy-policy.html", "blog.html"].some((page) => href.includes(page)) || href.startsWith("http://") || href.startsWith("https://");
  };

  window.addEventListener("click", (event) => {
    if (!shouldReload(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.location.reload();
  }, true);

  document.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.location.reload();
  }, true);
})();
