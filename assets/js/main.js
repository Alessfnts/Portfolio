document.addEventListener("DOMContentLoaded", function () {
  // External links and document links should not replace the current portfolio page.
  document.querySelectorAll("a[href]").forEach((link) => {
    if (link.getAttribute("aria-disabled") === "true") return;

    const href = (link.getAttribute("href") || "").trim();
    if (!href || href.startsWith("#") || href.toLowerCase().startsWith("javascript:")) return;

    const isDocumentLink = /\.(pdf|xlsx|docx?|pptx?)($|[?#])/i.test(href);
    const isExternalLink = /^https?:\/\//i.test(href);

    if (isExternalLink || isDocumentLink) {
      link.setAttribute("target", "_blank");

      const relTokens = new Set(
        (link.getAttribute("rel") || "")
          .split(/\s+/)
          .filter(Boolean),
      );
      relTokens.add("noopener");
      if (isExternalLink) relTokens.add("noreferrer");
      link.setAttribute("rel", Array.from(relTokens).join(" "));
    }

    if (isDocumentLink && !link.hasAttribute("download")) {
      link.setAttribute("download", "");
    }
  });

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBar.style.transform = "scaleX(0)";
  document.body.prepend(progressBar);

  const mentionsTrigger = document.querySelector(".mentions-trigger");
  if (mentionsTrigger) {
    const mentionsModal = document.createElement("div");
    mentionsModal.className = "mentions-modal";
    mentionsModal.innerHTML = `
      <div class="mentions-content" role="dialog" aria-modal="true" aria-labelledby="mentions-title">
        <div class="mentions-header">
          <h2 id="mentions-title" class="mentions-title">Mentions légales</h2>
          <button class="mentions-close" type="button" aria-label="Fermer les mentions légales">×</button>
        </div>
        <div class="mentions-body">
          <h3>1. Informations éditeur</h3>
          <p><strong>Alessandro FUENTES</strong><br>
          Étudiant en BTS SIO option SISR<br>
          Lycée René Cassin<br>
          Strasbourg, France</p>

          <h3>2. Hébergement</h3>
          <p>Ce portfolio est hébergé sur <strong>GitHub Pages</strong><br>
          GitHub Inc., 88 Market Street, San Francisco, CA 94105, USA</p>

          <h3>3. Contact</h3>
          <p><a href="mailto:aless.fuentes6@gmail.com" class="mentions-contact-mail">aless.fuentes6@gmail.com</a></p>

          <h3>4. Directeur de la publication</h3>
          <p>Alessandro FUENTES</p>

          <h3>5. URL du site</h3>
          <p>https://alessandro-fuentes.com</p>

          <h3>6. Propriété intellectuelle</h3>
          <p>Tous les contenus de ce portfolio (textes, icônes, design) sont
          la propriété exclusive d'Alessandro Fuentes, sauf mention contraire.</p>

          <h3>7. Données personnelles</h3>
          <ul>
            <li>Aucune donnée personnelle n'est collectée via ce portfolio</li>
            <li>L'adresse email est utilisée uniquement pour les contacts</li>
            <li>Aucun cookie tiers n'est déposé à la connaissance de l'éditeur</li>
            <li>Le site charge des polices externes depuis Google Fonts</li>
          </ul>

          <h3>8. Responsabilité</h3>
          <p>Les liens externes ouvrant vers d'autres sites ne sont pas
          sous la responsabilité de l'auteur. Le contenu est mis à jour
          régulièrement mais l'auteur ne peut être tenu responsable
          d'éventuelles erreurs.</p>

          <p><em>Dernière mise à jour : ${new Date().getFullYear()}</em></p>
        </div>
      </div>`;
    document.body.appendChild(mentionsModal);

    const mentionsClose = mentionsModal.querySelector(".mentions-close");
    let lastFocusedElement = null;

    const closeMentionsModal = () => {
      mentionsModal.classList.remove("active");
      lastFocusedElement?.focus();
    };

    mentionsTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      lastFocusedElement = document.activeElement;
      mentionsModal.classList.add("active");
      mentionsClose.focus();
    });

    mentionsClose.addEventListener("click", closeMentionsModal);

    mentionsModal.addEventListener("click", (e) => {
      if (e.target === mentionsModal) closeMentionsModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mentionsModal.classList.contains("active")) {
        closeMentionsModal();
      }
    });
  }

  let scrollTicking = false;
  const updateProgressBar = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    progressBar.style.transform = `scaleX(${ratio})`;
    scrollTicking = false;
  };

  const handleScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateProgressBar);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);
  handleScroll();
});
