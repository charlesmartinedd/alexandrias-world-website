const NOTES_STORAGE_KEY = "alexandriasWorld.notes.v1";
const FLAGS_STORAGE_KEY = "alexandriasWorld.flags.v1";

const state = {
  countries: [],
  filtered: [],
  filters: {
    search: "",
    status: "all",
  },
  activeCountry: null,
  activePageNumber: 1,
  notes: loadStorage(NOTES_STORAGE_KEY),
  flags: loadStorage(FLAGS_STORAGE_KEY),
};

const dom = {
  gallery: document.querySelector("[data-role='gallery']"),
  emptyState: document.querySelector("[data-role='empty-state']"),
  metrics: {
    total: document.querySelector("[data-role='metric-total']"),
    complete: document.querySelector("[data-role='metric-complete']"),
    incomplete: document.querySelector("[data-role='metric-incomplete']"),
    flagged: document.querySelector("[data-role='metric-flagged']"),
  },
  searchInput: document.querySelector("[data-role='search']"),
  filterChips: Array.from(document.querySelectorAll("[data-role='status-chip']")),
  modal: document.querySelector("#country-modal"),
  modalClose: document.querySelector("[data-role='modal-close']"),
  modalSidebar: document.querySelector("[data-role='modal-sidebar']"),
  modalImage: document.querySelector("[data-role='modal-image']"),
  modalTitle: document.querySelector("[data-role='modal-title']"),
  modalSubtitle: document.querySelector("[data-role='modal-subtitle']"),
  modalProgress: document.querySelector("[data-role='modal-progress']"),
  viewerCaption: document.querySelector("[data-role='viewer-caption']"),
  modalPrev: document.querySelector("[data-role='modal-prev']"),
  modalNext: document.querySelector("[data-role='modal-next']"),
  flagToggle: document.querySelector("[data-role='flag-toggle']"),
  notesField: document.querySelector("[data-role='notes-field']"),
  queuePanel: document.querySelector("#review-queue"),
  queueButton: document.querySelector("[data-role='queue-button']"),
  queueClose: document.querySelector("[data-role='queue-close']"),
  queueList: document.querySelector("[data-role='queue-items']"),
  exportButton: document.querySelector("[data-role='export-notes']"),
};

document.addEventListener("DOMContentLoaded", async () => {
  const manifest = await fetchManifest();
  state.countries = manifest.countries;
  applyFilters();
  renderMetrics();
  bindEvents();
});

async function fetchManifest() {
  try {
    const response = await fetch("./public/data/books.json?" + Date.now());
    if (!response.ok) throw new Error("Failed to load books.json");
    return response.json();
  } catch (error) {
    console.error(error);
    dom.emptyState.innerHTML = `<h3>Manifest unavailable</h3><p>Please run <code>node scripts/generate-book-data.mjs</code> and reload.</p>`;
    return { countries: [] };
  }
}

function bindEvents() {
  dom.searchInput?.addEventListener("input", (event) => {
    state.filters.search = event.target.value.toLowerCase();
    applyFilters();
  });

  dom.filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const current = chip.getAttribute("data-filter");
      state.filters.status = current;
      dom.filterChips.forEach((item) =>
        item.setAttribute("data-active", item === chip ? "true" : "false")
      );
      applyFilters();
    });
  });

  dom.modalClose?.addEventListener("click", closeModal);
  dom.modal?.addEventListener("click", (event) => {
    if (event.target === dom.modal) {
      closeModal();
    }
  });

  dom.modalPrev?.addEventListener("click", () => stepPage(-1));
  dom.modalNext?.addEventListener("click", () => stepPage(1));

  dom.flagToggle?.addEventListener("click", () => {
    if (!state.activeCountry) return;
    const key = `${state.activeCountry.slug}:${state.activePageNumber}`;
    const active = toggleFlag(state.activeCountry.slug, state.activePageNumber);
    dom.flagToggle?.setAttribute("data-active", active ? "true" : "false");
    dom.flagToggle?.setAttribute(
      "aria-pressed",
      active ? "true" : "false"
    );
    updateQueuePanel();
  });

  dom.notesField?.addEventListener("input", (event) => {
    if (!state.activeCountry) return;
    saveNote(
      state.activeCountry.slug,
      state.activePageNumber,
      event.target.value
    );
  });

  dom.queueButton?.addEventListener("click", () => {
    const isOpen = dom.queuePanel.hasAttribute("open");
    if (isOpen) {
      dom.queuePanel.removeAttribute("open");
    } else {
      updateQueuePanel();
      dom.queuePanel.setAttribute("open", "");
    }
  });

  dom.queueClose?.addEventListener("click", () => {
    dom.queuePanel.removeAttribute("open");
  });

  dom.exportButton?.addEventListener("click", exportNotes);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      dom.queuePanel.removeAttribute("open");
    }

    if (!dom.modal.hasAttribute("open")) return;

    if (event.key === "ArrowRight") {
      stepPage(1);
    } else if (event.key === "ArrowLeft") {
      stepPage(-1);
    }
  });
}

function applyFilters() {
  const { search, status } = state.filters;
  const query = search.trim();

  state.filtered = state.countries.filter((country) => {
    const matchesSearch =
      query.length === 0 ||
      country.name.toLowerCase().includes(query) ||
      country.slug.includes(query);

    const matchesStatus =
      status === "all" || country.status === status;

    return matchesSearch && matchesStatus;
  });

  renderGallery();
}

function renderGallery() {
  dom.gallery.innerHTML = "";

  if (!state.filtered.length) {
    dom.emptyState.removeAttribute("hidden");
    dom.gallery.setAttribute("hidden", "");
    dom.emptyState.querySelector("[data-role='empty-count']").textContent =
      state.countries.length ? "No matches yet." : "Manifest loading.";
    return;
  }

  dom.emptyState.setAttribute("hidden", "");
  dom.gallery.removeAttribute("hidden");

  const fragment = document.createDocumentFragment();

  for (const country of state.filtered) {
    const card = buildCountryCard(country);
    fragment.appendChild(card);
  }

  dom.gallery.appendChild(fragment);
}

function buildCountryCard(country) {
  const card = document.createElement("article");
  card.className = "card";
  card.setAttribute("tabindex", "0");

  const badge = document.createElement("span");
  badge.className = `card__badge card__badge--${country.status}`;
  badge.textContent =
    country.status === "complete"
      ? "Complete"
      : country.status === "incomplete"
      ? "Needs pages"
      : "Not started";

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "card__image-wrapper";

  const img = document.createElement("img");
  img.className = "card__image";
  img.loading = "lazy";
  img.alt = `${country.name} cover preview`;
  img.src = country.coverImage?.imageUrl ?? placeholderGradient(country.slug);

  imageWrapper.appendChild(img);
  imageWrapper.appendChild(badge);

  const content = document.createElement("div");
  content.className = "card__content";

  const heading = document.createElement("h3");
  heading.className = "card__heading";
  heading.textContent = country.name;

  const meta = document.createElement("div");
  meta.className = "card__meta";

  const progress = document.createElement("span");
  progress.className = "card__progress";
  progress.textContent = `${country.availablePages}/${country.totalPages} pages`;

  const missing = document.createElement("span");
  missing.className = "card__missing";
  if (country.missingPages.length) {
    missing.textContent = `Missing p${country.missingPages
      .map((num) => num.toString().padStart(2, "0"))
      .join(', ')}`;
  } else {
    missing.textContent = "Ready to review";
  }

  meta.appendChild(progress);
  meta.appendChild(missing);

  content.appendChild(heading);
  content.appendChild(meta);

  card.appendChild(imageWrapper);
  card.appendChild(content);

  const open = () => openModal(country.slug);
  card.addEventListener("click", open);
  card.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });

  return card;
}

function placeholderGradient(slug) {
  const hash = Array.from(slug).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 10'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='hsl(${hue},70%,82%)'/><stop offset='100%' stop-color='hsl(${(hue + 40) % 360},70%,72%)'/></linearGradient></defs><rect fill='url(%23g)' width='16' height='10'/></svg>`;
}

function renderMetrics() {
  const total = state.countries.length;
  const complete = state.countries.filter((c) => c.status === "complete").length;
  const incomplete = state.countries.filter((c) => c.status === "incomplete").length;
  const flagged = Object.values(state.flags).reduce((acc, pages) => acc + Object.keys(pages).length, 0);

  dom.metrics.total.textContent = `${total} countries`;
  dom.metrics.complete.textContent = `${complete} ready`;
  dom.metrics.incomplete.textContent = `${incomplete} needs work`;
  dom.metrics.flagged.textContent = `${flagged} flagged`;
}

function openModal(slug) {
  const country = state.countries.find((entry) => entry.slug === slug);
  if (!country) return;

  state.activeCountry = country;
  if (country.pages.length) {
    state.activePageNumber = country.pages[0].number;
  } else {
    state.activePageNumber = 1;
  }

  dom.modal.setAttribute("open", "");
  dom.modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  populateModal();
}

function closeModal() {
  dom.modal.removeAttribute("open");
  dom.modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
  state.activeCountry = null;
}

function populateModal() {
  const country = state.activeCountry;
  if (!country) return;

  if (dom.modalTitle) {
    dom.modalTitle.textContent = country.name;
  }
  const subtitleParts = [];
  if (country.continent) subtitleParts.push(country.continent);
  if (country.code) subtitleParts.push(country.code);
  if (dom.modalSubtitle) {
    dom.modalSubtitle.textContent = subtitleParts.join(" · ");
  }
  if (dom.modalProgress) {
    dom.modalProgress.textContent = `${country.availablePages}/${country.totalPages} pages ready`;
  }

  renderThumbnails(country);
  renderActivePage(country, state.activePageNumber);
  renderMetadata(country);
}

function renderThumbnails(country) {
  dom.modalSidebar.innerHTML = "";
  const fragment = document.createDocumentFragment();

  if (!country.pages.length) {
    const empty = document.createElement("p");
    empty.textContent = "No pages available yet.";
    empty.style.color = "var(--navy-700)";
    empty.style.padding = "6px 0";
    fragment.appendChild(empty);
  }

  for (const page of country.pages) {
    const thumb = document.createElement("div");
    thumb.className = "page-thumb";
    thumb.dataset.page = page.number;
    thumb.setAttribute("data-active", page.number === state.activePageNumber ? "true" : "false");

    const img = document.createElement("img");
    img.src = page.imageUrl;
    img.alt = `${country.name} page ${page.number}`;
    img.loading = "lazy";

    thumb.appendChild(img);
    thumb.addEventListener("click", () => {
      state.activePageNumber = page.number;
      renderActivePage(country, page.number);
      renderThumbnails(country);
    });

    fragment.appendChild(thumb);
  }

  dom.modalSidebar.appendChild(fragment);
}

function renderActivePage(country, pageNumber) {
  if (!dom.modalImage) return;
  const page = country.pages.find((entry) => entry.number === pageNumber);
  if (page) {
    dom.modalImage.src = page.imageUrl;
    dom.modalImage.alt = `${country.name} - ${page.title}`;
    dom.modalImage.dataset.page = pageNumber;
    if (dom.viewerCaption) {
      dom.viewerCaption.textContent = page.title;
    }
  } else {
    dom.modalImage.src = placeholderGradient(country.slug);
    dom.modalImage.alt = `${country.name} page placeholder`;
    dom.modalImage.dataset.page = pageNumber;
    if (dom.viewerCaption) {
      dom.viewerCaption.textContent = `Page ${pageNumber} missing`;
    }
  }

  const note = getNote(country.slug, pageNumber);
  if (dom.notesField) {
    dom.notesField.value = note ?? "";
  }

  const flagged = isFlagged(country.slug, pageNumber);
  dom.flagToggle?.setAttribute("data-active", flagged ? "true" : "false");
  dom.flagToggle?.setAttribute("aria-pressed", flagged ? "true" : "false");

  if (dom.modalPrev) {
    dom.modalPrev.disabled = pageNumber <= 1;
  }
  if (dom.modalNext) {
    dom.modalNext.disabled = pageNumber >= country.totalPages;
  }
}

function renderMetadata(country) {
  const list = document.querySelector("[data-role='meta-list']");
  if (!list) return;
  list.innerHTML = "";

  const addItem = (label, value) => {
    if (!value) return;
    const li = document.createElement("li");
    li.innerHTML = `<strong>${label}</strong>${value}`;
    list.appendChild(li);
  };

  addItem("Continent", country.continent ?? "—");
  addItem("Language", country.language ?? "—");
  addItem("Traditional dress", country.traditionalDress ?? "—");
  addItem("Friend", country.friendName ?? "—");
  if (country.landmarks?.length) {
    addItem("Landmarks", country.landmarks.join('<br>'));
  }
  addItem("Signature food", country.signatureFood ?? "—");
  addItem("Cultural activity", country.culturalActivity ?? "—");
}

function stepPage(delta) {
  const country = state.activeCountry;
  if (!country) return;

  const target = Math.min(
    country.totalPages,
    Math.max(1, state.activePageNumber + delta)
  );

  state.activePageNumber = target;
  renderActivePage(country, target);
  renderThumbnails(country);
}

function saveNote(slug, page, text) {
  if (!state.notes[slug]) state.notes[slug] = {};
  state.notes[slug][page] = text;
  persistStorage(NOTES_STORAGE_KEY, state.notes);
}

function getNote(slug, page) {
  return state.notes?.[slug]?.[page] ?? "";
}

function toggleFlag(slug, page) {
  if (!state.flags[slug]) state.flags[slug] = {};
  const current = !!state.flags[slug][page];
  if (current) {
    delete state.flags[slug][page];
    if (!Object.keys(state.flags[slug]).length) {
      delete state.flags[slug];
    }
  } else {
    state.flags[slug][page] = true;
  }
  persistStorage(FLAGS_STORAGE_KEY, state.flags);
  renderMetrics();
  return !current;
}

function isFlagged(slug, page) {
  return !!state.flags?.[slug]?.[page];
}

function updateQueuePanel() {
  dom.queueList.innerHTML = "";
  const items = [];

  for (const [slug, pages] of Object.entries(state.flags)) {
    const country = state.countries.find((entry) => entry.slug === slug);
    if (!country) continue;

    for (const page of Object.keys(pages)) {
      const pageNumber = Number(page);
      const record = country.pages.find((entry) => entry.number === pageNumber);
      items.push({ country, pageNumber, record });
    }
  }

  if (!items.length) {
    dom.queueList.innerHTML = "<p>No flagged pages yet.</p>";
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const div = document.createElement("div");
    div.className = "queue-item";
    div.innerHTML = `
      <strong>${item.country.name}</strong>
      <span>Page ${item.pageNumber.toString().padStart(2, '0')} · ${
        item.record?.title ?? 'Missing'
      }</span>
    `;
    div.addEventListener("click", () => {
      dom.queuePanel.removeAttribute("open");
      openModal(item.country.slug);
      state.activePageNumber = item.pageNumber;
      renderActivePage(item.country, item.pageNumber);
      renderThumbnails(item.country);
    });
    fragment.appendChild(div);
  }

  dom.queueList.appendChild(fragment);
}

function exportNotes() {
  const payload = {
    generatedAt: new Date().toISOString(),
    notes: state.notes,
    flags: state.flags,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `alexandrias-world-review-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function loadStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed to parse storage key ${key}`, error);
    return {};
  }
}

function persistStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to persist storage key ${key}`, error);
  }
}
