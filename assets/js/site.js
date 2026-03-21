(function () {
  "use strict";

  async function loadJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    return response.json();
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr + "T00:00:00");
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function setFooterYear() {
    const year = byId("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function renderHome(profile) {
    byId("name").textContent = profile.name;
    byId("headline").textContent = profile.headline;
    byId("location").textContent = profile.location;

    const email = byId("email");
    email.href = `mailto:${profile.email}`;
    email.textContent = profile.email;

    const bio = byId("bio");
    profile.bio.forEach((paragraph) => {
      const p = document.createElement("p");
      p.innerHTML = paragraph;
      bio.appendChild(p);
    });

    // Render research interests as pills
    if (Array.isArray(profile.interests) && profile.interests.length > 0) {
      const interestsRow = byId("interests");
      if (interestsRow) {
        profile.interests.forEach((interest) => {
          const span = document.createElement("span");
          span.className = "pill";
          span.textContent = interest;
          interestsRow.appendChild(span);
        });
      }
    }

    const brandIcons = {
      github: '<svg viewBox="0 0 24 24" aria-hidden="true" class="btn-icon"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>',
      linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" class="btn-icon"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    };

    const social = byId("social");
    profile.social.forEach((item) => {
      const a = document.createElement("a");
      a.href = item.url;
      a.className = "button-link secondary";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      const key = item.label.toLowerCase();
      const icon = brandIcons[key] || "";
      a.innerHTML = `${icon}<span>${item.label}</span>`;
      social.appendChild(a);
    });

    const cv = byId("cv-link");
    cv.href = profile.cvUrl;

    // Render projects section
    if (Array.isArray(profile.projects) && profile.projects.length > 0) {
      const projectsSection = byId("projects-section");
      const projectsGrid = byId("projects-list");
      if (projectsSection && projectsGrid) {
        projectsSection.style.display = "";
        profile.projects.forEach((proj) => {
          const card = document.createElement("article");
          card.className = "card";
          const nameHtml = proj.url
            ? `<a href="${proj.url}" class="inline-link" target="_blank" rel="noopener noreferrer">${proj.name}</a>`
            : proj.name;
          const headContent = proj.logo
            ? proj.url
              ? `<a href="${proj.url}" target="_blank" rel="noopener noreferrer"><img src="${proj.logo}" alt="${proj.name} logo" class="project-card-logo"></a>`
              : `<img src="${proj.logo}" alt="${proj.name} logo" class="project-card-logo">`
            : `<h3>${nameHtml}</h3>`;
          card.innerHTML = `
            <div class="card-head">
              ${headContent}
            </div>
            <p>${proj.description}</p>
          `;
          if (proj.github) {
            const a = document.createElement("a");
            a.href = proj.github;
            a.textContent = "GitHub";
            a.className = "inline-link";
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            card.appendChild(a);
          }
          projectsGrid.appendChild(card);
        });
      }
    }

    // Render experience section
    const expGrid = byId("experience-list");
    if (expGrid && Array.isArray(profile.experience)) {
      profile.experience.forEach((item) => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <div class="card-head">
            <h3>${item.role}</h3>
            <span class="meta">${item.dates}</span>
          </div>
          <p class="meta">${item.organization}</p>
        `;
        if (Array.isArray(item.highlights) && item.highlights.length > 0) {
          const ul = document.createElement("ul");
          ul.className = "exp-highlights";
          item.highlights.forEach((point) => {
            const li = document.createElement("li");
            li.textContent = point;
            ul.appendChild(li);
          });
          card.appendChild(ul);
        }
        expGrid.appendChild(card);
      });
    }

    // Render awards section
    const awardsList = byId("awards-list");
    if (awardsList && Array.isArray(profile.awards)) {
      profile.awards.forEach((award) => {
        const li = document.createElement("li");
        li.textContent = award;
        awardsList.appendChild(li);
      });
    }
  }

  function renderPublications(publications) {
    const grid = byId("publication-list");

    function isExternalUrl(url) {
      return /^https?:\/\//i.test(url || "");
    }

    function appendPaperLink(card, url, label) {
      if (!url) return;
      const link = document.createElement("a");
      link.href = url;
      link.textContent = label;
      link.className = "inline-link";
      if (isExternalUrl(url)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      card.appendChild(link);
    }

    function renderCard(item) {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="card-head">
          <h3>${item.title}</h3>
          <span class="meta">${formatDate(item.date)} · ${item.venue}</span>
        </div>
        <p>${item.excerpt}</p>
        <p class="meta">${item.citation}</p>
      `;

      const localUrl = item.localPaperUrl || "";
      const paperUrl = item.paperUrl || "";
      const externalUrl = item.externalUrl || "";

      let hasAnyLink = false;
      const primaryUrl = localUrl || paperUrl;

      if (primaryUrl) {
        const primaryLabel = isExternalUrl(primaryUrl) ? "View paper" : "Download PDF";
        appendPaperLink(card, primaryUrl, primaryLabel);
        hasAnyLink = true;
      }

      if (externalUrl && externalUrl !== primaryUrl) {
        const sep = document.createElement("span");
        sep.className = "meta";
        sep.textContent = "  |  ";
        card.appendChild(sep);
        const extLabel = /github\.com/i.test(externalUrl) ? "Code" : "Journal/Proceedings link";
        appendPaperLink(card, externalUrl, extLabel);
        hasAnyLink = true;
      }

      if (!hasAnyLink) {
        const warning = document.createElement("div");
        warning.className = "warning";
        warning.textContent = item.note || "PDF currently unavailable.";
        card.appendChild(warning);
      }

      return card;
    }

    // Render sections in order: main → mentorship → history
    const sectionDefs = [
      { key: undefined, label: null },
      { key: "mentorship", label: "PyHealth Research Initiative" },
      { key: "history", label: "History" },
    ];

    sectionDefs.forEach(({ key, label }) => {
      const items = publications.filter((p) =>
        key === undefined ? !p.section : p.section === key
      );
      if (items.length === 0) return;

      if (label) {
        const h2 = document.createElement("h2");
        h2.textContent = label;
        grid.appendChild(h2);
      }

      items.forEach((item) => grid.appendChild(renderCard(item)));
    });
  }

  async function init() {
    setFooterYear();

    try {
      const [profile, publications] = await Promise.all([
        loadJson("data/profile.json"),
        loadJson("data/publications.json"),
      ]);
      renderHome(profile);
      renderPublications(publications);
    } catch (err) {
      const target = byId("page-error");
      if (target) {
        target.textContent = "Could not load content. Please check data/profile.json and data/publications.json.";
        target.className = "warning";
      }
      console.error(err);
    }
  }

  init();
})();
