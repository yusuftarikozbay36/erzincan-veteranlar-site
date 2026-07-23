const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");
const galleryGrid = document.getElementById("galleryGrid");
const newsGrid = document.getElementById("newsGrid");
const newsModal = document.getElementById("newsModal");
const newsModalClose = document.querySelector(".news-modal-close");
const newsModalImage = document.getElementById("newsModalImage");
const newsModalCategory = document.getElementById("newsModalCategory");
const newsModalDate = document.getElementById("newsModalDate");
const newsModalTitle = document.getElementById("newsModalTitle");
const newsModalBody = document.getElementById("newsModalBody");
let activeNewsItems = [];

menuButton?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

function closeLightbox() {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
  if (lightboxImage) lightboxImage.src = "";
  document.body.classList.remove("lightbox-open");
}

galleryGrid?.addEventListener("click", (event) => {
  const item = event.target.closest(".gallery-item");
  if (!item || !lightbox || !lightboxImage) return;
  lightboxImage.src = item.dataset.image || "";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeNewsModal();
  }
});

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && typeof value === "string") element.textContent = value;
}

function setImage(id, src) {
  const image = document.getElementById(id);
  if (image && src) image.src = src;
}

function renderParagraphs(containerId, paragraphs, motto) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(paragraphs)) return;
  container.replaceChildren();
  paragraphs.forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    container.appendChild(paragraph);
  });
  if (motto) {
    const paragraph = document.createElement("p");
    paragraph.id = "heroMotto";
    paragraph.className = "hero-motto";
    paragraph.textContent = motto;
    container.appendChild(paragraph);
  }
}

function renderStats(stats) {
  const container = document.getElementById("heroStats");
  if (!container || !Array.isArray(stats)) return;
  container.replaceChildren();
  stats.forEach((stat) => {
    const wrapper = document.createElement("div");
    const value = document.createElement("strong");
    const label = document.createElement("span");
    value.textContent = stat.value || "";
    label.textContent = stat.label || "";
    wrapper.append(value, label);
    container.appendChild(wrapper);
  });
}

function renderManagement(groups) {
  const container = document.getElementById("managementGrid");
  if (!container || !Array.isArray(groups)) return;
  container.replaceChildren();
  groups.forEach((group) => {
    const column = document.createElement("div");
    column.className = "management-column";
    const title = document.createElement("h3");
    title.className = "management-title";
    title.textContent = group.group || "Ekip";
    column.appendChild(title);

    (group.people || []).forEach((person) => {
      const card = document.createElement("article");
      card.className = "person-card";
      const mark = document.createElement("div");
      mark.className = "person-mark";
      mark.textContent = (person.name || "?").trim().charAt(0).toLocaleUpperCase("tr-TR");
      const info = document.createElement("div");
      const role = document.createElement("span");
      const name = document.createElement("h3");
      role.textContent = person.role || "";
      name.textContent = person.name || "";
      info.append(role, name);
      card.append(mark, info);
      column.appendChild(card);
    });
    container.appendChild(column);
  });
}

function renderActivities(activities) {
  const container = document.getElementById("activitiesGrid");
  if (!container || !Array.isArray(activities)) return;
  container.replaceChildren();
  activities.forEach((activity) => {
    const card = document.createElement("article");
    card.className = `sport-card${activity.featured ? " featured" : ""}`;
    const title = document.createElement("h3");
    const text = document.createElement("p");
    title.textContent = activity.name || "";
    text.textContent = activity.description || "";
    card.append(title, text);
    container.appendChild(card);
  });
}

function renderGallery(images) {
  if (!galleryGrid || !Array.isArray(images)) return;
  galleryGrid.replaceChildren();
  images.forEach((image) => {
    const button = document.createElement("button");
    const layoutClass = image.layout === "large" ? " gallery-large" : image.layout === "wide" ? " gallery-wide" : "";
    button.className = `gallery-item${layoutClass}`;
    button.type = "button";
    button.dataset.image = image.image || "";
    const img = document.createElement("img");
    img.src = image.image || "";
    img.alt = image.alt || "Kulüp fotoğrafı";
    img.loading = "lazy";
    button.appendChild(img);
    galleryGrid.appendChild(button);
  });
}


function formatNewsDate(dateValue) {
  if (!dateValue) return "";
  const parts = String(dateValue).slice(0, 10).split("-");
  if (parts.length === 3) {
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
    }
  }
  return String(dateValue);
}

function appendNewsText(container, text) {
  container.replaceChildren();
  String(text || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      container.appendChild(p);
    });
}

function closeNewsModal() {
  newsModal?.classList.remove("open");
  newsModal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("news-modal-open");
}

function openNewsModal(newsItem) {
  if (!newsModal || !newsItem) return;
  const image = newsItem.image || "";
  if (newsModalImage) {
    newsModalImage.hidden = !image;
    newsModalImage.src = image;
    newsModalImage.alt = image ? (newsItem.title || "Haber fotoğrafı") : "";
  }
  if (newsModalCategory) newsModalCategory.textContent = newsItem.category || "Kulüp";
  if (newsModalDate) {
    newsModalDate.textContent = formatNewsDate(newsItem.date);
    newsModalDate.dateTime = newsItem.date || "";
  }
  if (newsModalTitle) newsModalTitle.textContent = newsItem.title || "Haber";
  if (newsModalBody) appendNewsText(newsModalBody, newsItem.body || newsItem.summary || "");
  newsModal.classList.add("open");
  newsModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("news-modal-open");
}

function renderNews(newsItems) {
  if (!newsGrid) return;
  const publishedItems = Array.isArray(newsItems)
    ? newsItems
        .filter((item) => item && item.published !== false)
        .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
    : [];

  activeNewsItems = publishedItems;
  newsGrid.replaceChildren();

  if (!publishedItems.length) {
    const empty = document.createElement("div");
    empty.className = "news-empty";
    empty.textContent = "Henüz haber eklenmedi.";
    newsGrid.appendChild(empty);
    return;
  }

  publishedItems.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "news-card";

    const media = document.createElement("div");
    media.className = "news-media";
    if (item.image) {
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.title || "Kulüp haberi";
      image.loading = "lazy";
      media.appendChild(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "news-media-placeholder";
      placeholder.textContent = item.category || "Haber";
      media.appendChild(placeholder);
    }

    const content = document.createElement("div");
    content.className = "news-content";

    const meta = document.createElement("div");
    meta.className = "news-meta";
    const category = document.createElement("span");
    category.textContent = item.category || "Kulüp";
    const date = document.createElement("time");
    date.textContent = formatNewsDate(item.date);
    date.dateTime = item.date || "";
    meta.append(category, date);

    const title = document.createElement("h3");
    title.textContent = item.title || "Kulüp haberi";
    const summary = document.createElement("p");
    summary.textContent = item.summary || "";

    content.append(meta, title, summary);

    if (item.body) {
      const button = document.createElement("button");
      button.className = "news-read-more";
      button.type = "button";
      button.dataset.newsIndex = String(index);
      button.textContent = "Haberi Oku";
      content.appendChild(button);
    }

    card.append(media, content);
    newsGrid.appendChild(card);
  });
}

newsGrid?.addEventListener("click", (event) => {
  const button = event.target.closest(".news-read-more");
  if (!button) return;
  const index = Number(button.dataset.newsIndex);
  if (Number.isInteger(index)) openNewsModal(activeNewsItems[index]);
});

newsModalClose?.addEventListener("click", closeNewsModal);
newsModal?.addEventListener("click", (event) => {
  if (event.target === newsModal) closeNewsModal();
});

function normalizePhone(phone) {
  return String(phone || "").replace(/[^+\d]/g, "");
}

function renderContact(contact) {
  const container = document.getElementById("contactItems");
  if (!container || !contact) return;
  container.replaceChildren();

  const phoneGroup = document.createElement("div");
  phoneGroup.className = "contact-group";
  const phoneTitle = document.createElement("h3");
  phoneTitle.textContent = "Telefon Numaraları";
  phoneGroup.appendChild(phoneTitle);
  (contact.phones || []).forEach((phone, index) => {
    const link = document.createElement("a");
    link.href = `tel:${normalizePhone(phone)}`;
    const label = document.createElement("span");
    const value = document.createElement("strong");
    label.textContent = `Telefon ${index + 1}`;
    value.textContent = phone;
    link.append(label, value);
    phoneGroup.appendChild(link);
  });

  const instagramGroup = document.createElement("div");
  instagramGroup.className = "contact-group";
  const instagramTitle = document.createElement("h3");
  instagramTitle.textContent = "Instagram Adresi";
  const instagramLink = document.createElement("a");
  instagramLink.className = "instagram-link";
  instagramLink.href = contact.instagram_url || "#";
  instagramLink.target = "_blank";
  instagramLink.rel = "noopener noreferrer";
  const instagramLabel = document.createElement("span");
  const instagramValue = document.createElement("strong");
  instagramLabel.textContent = "Instagram";
  instagramValue.textContent = contact.instagram_username || "";
  instagramLink.append(instagramLabel, instagramValue);
  instagramGroup.append(instagramTitle, instagramLink);

  const addressGroup = document.createElement("div");
  addressGroup.className = "contact-group";
  const addressTitle = document.createElement("h3");
  addressTitle.textContent = "Kulüp Konumu";
  const addressStatic = document.createElement("div");
  addressStatic.className = "contact-static";
  const addressLabel = document.createElement("span");
  const addressValue = document.createElement("strong");
  addressLabel.textContent = "Adres";
  addressValue.textContent = contact.address || "";
  addressStatic.append(addressLabel, addressValue);
  addressGroup.append(addressTitle, addressStatic);

  container.append(phoneGroup, instagramGroup, addressGroup);

  document.querySelectorAll(".instagram-link").forEach((link) => {
    link.href = contact.instagram_url || "#";
  });
}

async function loadSiteContent() {
  if (window.location.protocol === "file:") return;
  try {
    const response = await fetch(`/content/site.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`İçerik yüklenemedi: ${response.status}`);
    const data = await response.json();

    document.title = data.site_name || document.title;
    setText("brandName", data.short_name);
    setText("footerName", data.site_name);
    ["siteLogoBrand", "siteLogoHero", "siteLogoContact", "siteLogoFooter"].forEach((id) => setImage(id, data.logo));

    setText("heroEyebrow", data.hero?.eyebrow);
    setText("heroTitle", data.hero?.title);
    renderParagraphs("heroIntro", data.hero?.paragraphs, data.hero?.motto);
    renderStats(data.hero?.stats);

    setText("aboutTitle", data.about?.title);
    renderParagraphs("aboutText", data.about?.paragraphs);

    setText("managementTitle", data.management?.title);
    setText("managementIntro", data.management?.intro);
    renderManagement(data.management?.groups);

    setText("activitiesTitle", data.activities?.title);
    setText("activitiesIntro", data.activities?.intro);
    renderActivities(data.activities?.items);

    setText("newsTitle", data.news?.title);
    setText("newsIntro", data.news?.intro);
    renderNews(data.news?.items);
    setText("galleryTitle", data.gallery?.title);
    renderGallery(data.gallery?.images);

    setText("contactTitle", data.contact?.title);
    setText("contactIntro", data.contact?.intro);
    setText("contactCardTitle", data.contact?.card_title);
    setText("contactCardText", data.contact?.card_text);
    renderContact(data.contact);
  } catch (error) {
    console.warn("Yönetim paneli içeriği yüklenemedi; HTML içindeki mevcut içerik gösteriliyor.", error);
  }
}

loadSiteContent();

if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", (user) => {
    if (!user && window.location.hash.startsWith("#invite_token")) {
      window.netlifyIdentity.open("signup");
    }
  });
  window.netlifyIdentity.on("login", () => {
    window.location.href = "/admin/";
  });
}
