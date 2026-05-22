// Seleção de elementos principais para controle de tema e fundo especial
var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
var bgToggleBtn = document.getElementById("bg-toggle");
var bgToggleOffIcon = document.getElementById("bg-toggle-off-icon");
var bgToggleOnIcon = document.getElementById("bg-toggle-on-icon");

// Verifica se o modo "Studio BG" (fundo estilizado) está ativo no body
function isStudioBgActive() {
  return document.body.classList.contains("studio-bg");
}

// Atualiza os ícones do botão de alternância de fundo com base no estado atual
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

// Desativa o modo Studio e remove a preferência do armazenamento local
function disableStudioBg() {
  document.body.classList.remove("studio-bg");
  localStorage.removeItem("studio-bg");
  updateBgToggleIcons();
}

// Ativa o modo Studio e salva a preferência no localStorage
function enableStudioBg() {
  document.body.classList.add("studio-bg");
  localStorage.setItem("studio-bg", "on");
  updateBgToggleIcons();
}

// Inicialização: verifica se o usuário já tinha ativado o modo Studio anteriormente
if (localStorage.getItem("studio-bg") === "on") {
  enableStudioBg();
} else {
  updateBgToggleIcons();
}

if (bgToggleBtn) {
  // Alterna o estado do modo Studio ao clicar no botão de paleta
  bgToggleBtn.addEventListener("click", function () {
    if (isStudioBgActive()) {
      disableStudioBg();
    } else {
      enableStudioBg();
    }
  });
}

// Calcula a altura da navbar para que a rolagem suave não pare embaixo do menu
function getNavOffset() {
  var nav = document.querySelector("nav.studio-nav");
  return nav ? nav.offsetHeight + 12 : 88;
}

// Função genérica para realizar a rolagem suave até um elemento específico
function scrollToSection(hash, behavior) {
  if (!hash || hash === "#") return;
  var target = document.querySelector(hash);
  if (!target) return;
  var top =
    target.getBoundingClientRect().top + window.scrollY - getNavOffset();
  window.scrollTo({ top: Math.max(0, top), behavior: behavior || "smooth" });
}

// Fecha o menu mobile automaticamente após clicar em um link (para telas pequenas)
function closeMobileNav() {
  var menu = document.getElementById("navbar-sticky");
  var toggle = document.querySelector('[data-collapse-toggle="navbar-sticky"]');
  if (menu && toggle && window.innerWidth < 768 && !menu.classList.contains("hidden")) {
    toggle.click();
  }
}

// Aplica a lógica de scroll suave a todos os links internos que começam com #
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

// Se o usuário acessar a página com uma # na URL, rola automaticamente para a seção
if (window.location.hash) {
  requestAnimationFrame(function () {
    scrollToSection(window.location.hash, "auto");
  });
}

// Configura os ícones do tema (Lua/Sol) baseado na preferência salva ou do sistema operacional
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

// Lógica para alternar entre Dark Mode e Light Mode
themeToggleBtn.addEventListener("click", function () {
  // Ao trocar de tema, desativa o modo Studio para evitar conflitos visuais imediatos
  disableStudioBg();

  // Alterna a visibilidade dos ícones de tema
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

// Dados que alimentam o carrossel de fotos da galeria
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

// Configurações de exibição do carrossel: 4 fotos no total, posição 2 é o centro
var THUMB_TOTAL = 4;
var CENTER_SLOT = 2;
var SLOT_POSITIONS = ["hidden-left", "left", "center", "right"];
var thumbOrder = [2, 3, 0, 1]; // Ordem inicial dos índices dos dados
var thumbButtons = null;
var SWIPE_THRESHOLD = 40; // Sensibilidade do deslize (touch)
var touchStartX = 0;

// Retorna o índice da imagem que deve estar no centro
function getCenterDataIndex() {
  return thumbOrder[CENTER_SLOT];
}

// Atualiza a imagem grande e os textos com base na foto central do carrossel
function updateMainPanel() {
  var activeItem = galleryData[getCenterDataIndex()];
  if (!activeItem) return;
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

// Move o carrossel até que a miniatura clicada chegue ao centro
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

// Renderiza as miniaturas e aplica as classes de posição (CSS transitions fazem a animação)
function renderGallery() {
  updateMainPanel();

  if (!thumbButtons) {
    // Cria os botões das miniaturas apenas na primeira execução
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

  // Atualiza as posições (data-pos) de cada miniatura para disparar as transições CSS
  galleryData.forEach(function (_, dataIndex) {
    var slotIndex = thumbOrder.indexOf(dataIndex);
    var btn = thumbButtons[dataIndex];
    var isFocused = slotIndex === CENTER_SLOT;
    btn.dataset.pos = SLOT_POSITIONS[slotIndex];
    btn.classList.toggle("focused", isFocused);
    btn.setAttribute("aria-hidden", slotIndex === 0 ? "true" : "false");
  });
}

// Eventos de clique nos controles da galeria
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

// Permite clicar diretamente em uma miniatura para centralizá-la
galleryThumbnails.addEventListener("click", function (event) {
  var button = event.target.closest("button[data-index]");
  if (!button) {
    return;
  }
  rotateToCenter(Number(button.dataset.index));
});

// Suporte a gestos de deslize (swipe) em dispositivos móveis
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

// Lógica do Lightbox (zoom de imagem) para a seção de Materiais
(function () {
  var lightbox = document.getElementById("materials-lightbox");
  var lightboxImg = document.getElementById("materials-lightbox-img");
  var lightboxCaption = document.getElementById("materials-lightbox-caption");
  var desktopMedia = window.matchMedia("(min-width: 1024px)"); // Ativo apenas em telas grandes

  if (!lightbox || !lightboxImg) {
    return;
  }

  // Seleciona imagens que possuem a classe de zoom
  var zoomImages = document.querySelectorAll(
    "#bastidores .materials-bento-figure--zoomable img",
  );

  // Exibe o modal com a imagem clicada
  function openLightbox(img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) {
      lightboxCaption.textContent = img.alt;
    }
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  // Esconde o modal e limpa os atributos
  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.removeAttribute("src");
    lightboxImg.alt = "";
    if (lightboxCaption) {
      lightboxCaption.textContent = "";
    }
    document.body.style.overflow = "";
  }

  zoomImages.forEach(function (img) {
    img.addEventListener("click", function () {
      if (!desktopMedia.matches) {
        return;
      }
      openLightbox(img);
    });
  });

  lightbox.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
    el.addEventListener("click", closeLightbox);
  });

  // Fecha o lightbox ao pressionar a tecla ESC
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
})();
