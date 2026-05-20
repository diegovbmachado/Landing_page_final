var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
var bgToggleBtn = document.getElementById("bg-toggle");
var bgToggleOffIcon = document.getElementById("bg-toggle-off-icon");
var bgToggleOnIcon = document.getElementById("bg-toggle-on-icon");

function isStudioBgActive() {
  return document.body.classList.contains("studio-bg");
}

function updateBgToggleIcons() {
  if (!bgToggleOffIcon || !bgToggleOnIcon) return;
  if (isStudioBgActive()) {
    bgToggleOffIcon.classList.add("hidden");
    bgToggleOnIcon.classList.remove("hidden");
  } else {
    bgToggleOffIcon.classList.remove("hidden");
    bgToggleOnIcon.classList.add("hidden");
  }
}

function disableStudioBg() {
  document.body.classList.remove("studio-bg");
  localStorage.removeItem("studio-bg");
  updateBgToggleIcons();
}

function enableStudioBg() {
  document.body.classList.add("studio-bg");
  localStorage.setItem("studio-bg", "on");
  updateBgToggleIcons();
}

if (localStorage.getItem("studio-bg") === "on") {
  enableStudioBg();
} else {
  updateBgToggleIcons();
}

if (bgToggleBtn) {
  bgToggleBtn.addEventListener("click", function () {
    if (isStudioBgActive()) {
      disableStudioBg();
    } else {
      enableStudioBg();
    }
  });
}

function getNavOffset() {
  var nav = document.querySelector("nav.studio-nav");
  return nav ? nav.offsetHeight + 12 : 88;
}

function scrollToSection(hash, behavior) {
  if (!hash || hash === "#") return;
  var target = document.querySelector(hash);
  if (!target) return;
  var top =
    target.getBoundingClientRect().top + window.scrollY - getNavOffset();
  window.scrollTo({ top: Math.max(0, top), behavior: behavior || "smooth" });
}

function closeMobileNav() {
  var menu = document.getElementById("navbar-sticky");
  var toggle = document.querySelector('[data-collapse-toggle="navbar-sticky"]');
  if (menu && toggle && window.innerWidth < 768 && !menu.classList.contains("hidden")) {
    toggle.click();
  }
}

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    var href = this.getAttribute("href");
    if (!href || href === "#" || href.length < 2) return;
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    scrollToSection(href, "smooth");
    closeMobileNav();
  });
});

if (window.location.hash) {
  requestAnimationFrame(function () {
    scrollToSection(window.location.hash, "auto");
  });
}

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

var themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function () {
  disableStudioBg();

  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

// Gallery slider with thumbnails
var galleryData = [
  {
    src: "images/mywork/work-01.jpg",
    alt: "Tatuagem no braço",
    title: "",
    description:
      "Detalhes da tattoo com acabamento preciso e com uma leve suavização no contorno.",
  },
  {
    src: "images/mywork/work-02.jpg",
    alt: "Tatuagem no ombro",
    title: "",
    description:
      "Baseado em foto de um lobo realista com elementos abstratos sugeridos pelo cliente...",
  },
  {
    src: "images/mywork/work-03.jpg",
    alt: "Tatuagem na perna",
    title: "",
    description:
      "Tatuagens que ganham profundidade natural com sombreados bem trabalhados.",
  },
  {
    src: "images/mywork/work-04.jpg",
    alt: "Tatuagem na perna",
    title: "",
    description:
      "Tatuagens com contraste, cor  e estilo, perfeitas para quem quer causar impacto.",
  },
];

var galleryMainImage = document.getElementById("gallery-main-image");
var galleryMainTitle = document.getElementById("gallery-main-title");
var galleryMainDescription = document.getElementById(
  "gallery-main-description",
);
var galleryThumbnails = document.getElementById("gallery-thumbnails");
var galleryPrev = document.getElementById("gallery-prev");
var galleryNext = document.getElementById("gallery-next");
var thumbPrev = document.getElementById("thumb-prev");
var thumbNext = document.getElementById("thumb-next");

var activeIndex = 0;
var thumbStart = 0;
var THUMB_VISIBLE = 4;

function renderGallery() {
  var activeItem = galleryData[activeIndex];
  galleryMainImage.src = activeItem.src;
  galleryMainImage.alt = activeItem.alt;
  galleryMainTitle.textContent = activeItem.title;
  galleryMainDescription.textContent = activeItem.description;

  galleryThumbnails.innerHTML = galleryData
    .map(function (item, index) {
      var isActive = index === activeIndex;
      return (
        '<button type="button" data-index="' +
        index +
        '" class="shrink-0 rounded-3xl overflow-hidden border transition-shadow duration-200 focus:outline-none ' +
        (isActive
          ? "ring-2 ring-blue-500 shadow-lg"
          : "border-gray-200 dark:border-gray-700") +
        '">' +
        '<img src="' +
        item.src +
        '" alt="' +
        item.alt +
        '" class="h-36 w-36 object-cover sm:h-[168px] sm:w-[168px]" />' +
        "</button>"
      );
    })
    .join("");

  Array.from(galleryThumbnails.children).forEach(function (button, index) {
    if (index < thumbStart || index >= thumbStart + THUMB_VISIBLE) {
      button.classList.add("hidden");
    } else {
      button.classList.remove("hidden");
    }
  });

  if (galleryPrev) galleryPrev.disabled = activeIndex === 0;
  if (galleryNext)
    galleryNext.disabled = activeIndex === galleryData.length - 1;
  if (thumbPrev) thumbPrev.disabled = activeIndex === 0;
  if (thumbNext) thumbNext.disabled = activeIndex === galleryData.length - 1;
}

function setActiveSlide(index) {
  activeIndex = Math.max(0, Math.min(galleryData.length - 1, index));
  if (activeIndex < thumbStart) {
    thumbStart = activeIndex;
  } else if (activeIndex >= thumbStart + THUMB_VISIBLE) {
    thumbStart = activeIndex - THUMB_VISIBLE + 1;
  }
  renderGallery();
}

if (galleryPrev) {
  galleryPrev.addEventListener("click", function () {
    setActiveSlide(activeIndex - 1);
  });
}

if (galleryNext) {
  galleryNext.addEventListener("click", function () {
    setActiveSlide(activeIndex + 1);
  });
}

if (thumbPrev) {
  thumbPrev.addEventListener("click", function () {
    setActiveSlide(activeIndex - 1);
  });
}

if (thumbNext) {
  thumbNext.addEventListener("click", function () {
    setActiveSlide(activeIndex + 1);
  });
}

galleryThumbnails.addEventListener("click", function (event) {
  var button = event.target.closest("button[data-index]");
  if (!button) {
    return;
  }
  setActiveSlide(Number(button.dataset.index));
});

renderGallery();
