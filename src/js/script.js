var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

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
    src: "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1200&q=80",
    alt: "Tatuagem no braço",
    title: "Traço fino e delicado",
    description:
      "Detalhes da tattoo com acabamento preciso e suave no contorno.",
  },
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    alt: "Tatuagem no ombro",
    title: "Sombreamento suave",
    description:
      "Tatuagens que ganham profundidade natural com sombreados bem trabalhados.",
  },
  {
    src: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
    alt: "Tatuagem na mão",
    title: "Estilo autoral",
    description:
      "Peças únicas feitas para combinar com a personalidade de cada cliente.",
  },
  {
    src: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80",
    alt: "Tatuagem no peito",
    title: "Design com atitude",
    description:
      "Tatuagens com contraste e estilo, perfeitas para quem quer causar impacto.",
  },
  {
    src: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    alt: "Tatuagem de flores",
    title: "Floral elegante",
    description:
      "Traços suaves e orgânicos para uma tatuagem feminina e sofisticada.",
  },
  {
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    alt: "Tatuagem geométrica",
    title: "Geométrico moderno",
    description:
      "Linhas e formas precisas que criam um efeito visual marcante.",
  },
  {
    src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=80",
    alt: "Tatuagem minimalista",
    title: "Minimalismo com significado",
    description: "Menos é mais: pequenos símbolos com grande personalidade.",
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
        '" class="h-24 w-24 object-cover sm:h-28 sm:w-28" />' +
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
  if (thumbNext)
    thumbNext.disabled = activeIndex === galleryData.length - 1;
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
