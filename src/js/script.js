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
var galleryThumbsSwipe = document.getElementById("gallery-thumbs-swipe");
var galleryPrev = document.getElementById("gallery-prev");
var galleryNext = document.getElementById("gallery-next");
var thumbPrev = document.getElementById("thumb-prev");
var thumbNext = document.getElementById("thumb-next");

var THUMB_TOTAL = 4;
var CENTER_SLOT = 2;
var SLOT_POSITIONS = ["hidden-left", "left", "center", "right"];
var thumbOrder = [2, 3, 0, 1];
var thumbButtons = null;
var SWIPE_THRESHOLD = 40;
var touchStartX = 0;

function getCenterDataIndex() {
  return thumbOrder[CENTER_SLOT];
}

function updateMainPanel() {
  var activeItem = galleryData[getCenterDataIndex()];
  galleryMainImage.src = activeItem.src;
  galleryMainImage.alt = activeItem.alt;
  galleryMainTitle.textContent = activeItem.title;
  galleryMainDescription.textContent = activeItem.description;
}

function rotateThumbsNext() {
  thumbOrder.unshift(thumbOrder.pop());
  renderGallery();
}

function rotateThumbsPrev() {
  thumbOrder.push(thumbOrder.shift());
  renderGallery();
}

function rotateToCenter(dataIndex) {
  if (thumbOrder[CENTER_SLOT] === dataIndex) {
    return;
  }

  var slotIndex = thumbOrder.indexOf(dataIndex);
  if (slotIndex === -1) {
    return;
  }

  var stepsForward = (slotIndex - CENTER_SLOT + THUMB_TOTAL) % THUMB_TOTAL;
  var stepsBackward = (CENTER_SLOT - slotIndex + THUMB_TOTAL) % THUMB_TOTAL;

  if (stepsForward <= stepsBackward) {
    for (var i = 0; i < stepsForward; i++) {
      rotateThumbsNext();
    }
  } else {
    for (var j = 0; j < stepsBackward; j++) {
      rotateThumbsPrev();
    }
  }
}

function renderGallery() {
  updateMainPanel();

  if (!thumbButtons) {
    thumbButtons = {};
    galleryData.forEach(function (item, dataIndex) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.index = String(dataIndex);
      btn.className = "gallery-thumb focus:outline-none";
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.className = "gallery-thumb-img";
      img.width = 168;
      img.height = 168;
      btn.appendChild(img);
      galleryThumbnails.appendChild(btn);
      thumbButtons[dataIndex] = btn;
    });
  }

  galleryData.forEach(function (_, dataIndex) {
    var slotIndex = thumbOrder.indexOf(dataIndex);
    var btn = thumbButtons[dataIndex];
    var isFocused = slotIndex === CENTER_SLOT;
    btn.dataset.pos = SLOT_POSITIONS[slotIndex];
    btn.classList.toggle("focused", isFocused);
    btn.setAttribute("aria-hidden", slotIndex === 0 ? "true" : "false");
  });
}

if (galleryPrev) {
  galleryPrev.addEventListener("click", rotateThumbsPrev);
}

if (galleryNext) {
  galleryNext.addEventListener("click", rotateThumbsNext);
}

if (thumbPrev) {
  thumbPrev.addEventListener("click", rotateThumbsPrev);
}

if (thumbNext) {
  thumbNext.addEventListener("click", rotateThumbsNext);
}

galleryThumbnails.addEventListener("click", function (event) {
  var button = event.target.closest("button[data-index]");
  if (!button) {
    return;
  }
  rotateToCenter(Number(button.dataset.index));
});

if (galleryThumbsSwipe) {
  galleryThumbsSwipe.addEventListener(
    "touchstart",
    function (event) {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true },
  );

  galleryThumbsSwipe.addEventListener(
    "touchend",
    function (event) {
      var touchEndX = event.changedTouches[0].screenX;
      var deltaX = touchEndX - touchStartX;

      if (deltaX < -SWIPE_THRESHOLD) {
        rotateThumbsNext();
      } else if (deltaX > SWIPE_THRESHOLD) {
        rotateThumbsPrev();
      }
    },
    { passive: true },
  );
}

renderGallery();
