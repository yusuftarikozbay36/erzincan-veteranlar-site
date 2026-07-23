const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");
const galleryGrid = document.getElementById("galleryGrid");

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
  if (event.key === "Escape") closeLightbox();
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
