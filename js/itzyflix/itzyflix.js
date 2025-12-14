(function () {
  const GAP_PX = 8;

  function criarCard(item) {
    const el = document.createElement("div");
    el.className = "card";

    const img = document.createElement("img");
    img.src = item.img.startsWith("/") ? item.img : "/" + item.img;
    img.alt = item.title || "";

    el.addEventListener("click", () => {
      if (item.url) {
        window.open(item.url, "_blank");
      } else if (Array.isArray(item.links)) {
        abrirModal(item.links);
      }
    });

    el.appendChild(img);
    return el;
  }

  function initCarousel(wrapperEl, itens) {
    wrapperEl.classList.add("carousel");

    const track = document.createElement("div");
    track.className = "track";
    track.style.paddingLeft = '0.5em';
    track.style.paddingRight = '0.5em';

    itens.forEach((item) => track.appendChild(criarCard(item)));

    wrapperEl.innerHTML = "";
    wrapperEl.appendChild(track);

    let leftBtn, rightBtn;

    function getCardWidth() {
  const card = track.querySelector(".card");
  if (!card) return wrapperEl.clientWidth * 0.6;

  return card.getBoundingClientRect().width + GAP_PX;
}


    function getVisibleCount() {
      const cw = getCardWidth();
      return Math.max(1, Math.floor((wrapperEl.clientWidth - 40) / cw));
    }

    function scrollPage(dir) {
      track.scrollBy({
        left: dir * getCardWidth() * getVisibleCount(),
        behavior: "smooth",
      });
    }

    function needsArrows() {
      return track.scrollWidth > track.clientWidth + 5;
    }

    function updateArrows() {
      if (!leftBtn || !rightBtn) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      const pos = track.scrollLeft;

      leftBtn.style.opacity = pos <= 5 ? "0" : "1";
      rightBtn.style.opacity = pos >= maxScroll - 5 ? "0" : "1";
    }

    function createArrowsIfNeeded() {
      // remove se já existirem
      wrapperEl.querySelectorAll(".arrow").forEach((a) => a.remove());
      leftBtn = rightBtn = null;

      if (!needsArrows()) return;

      leftBtn = document.createElement("button");
      leftBtn.className = "arrow left";
      leftBtn.innerHTML = "&#8249;";
      leftBtn.style.opacity = 0;

      rightBtn = document.createElement("button");
      rightBtn.className = "arrow right";
      rightBtn.innerHTML = "&#8250;";

      wrapperEl.appendChild(leftBtn);
      wrapperEl.appendChild(rightBtn);

      leftBtn.addEventListener("click", () => scrollPage(-1));
      rightBtn.addEventListener("click", () => scrollPage(1));

      updateArrows();
    }

    // eventos
    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", createArrowsIfNeeded);

    // inicial
    setTimeout(createArrowsIfNeeded, 100);

    // teclado
    wrapperEl.tabIndex = 0;
    wrapperEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") scrollPage(-1);
      if (e.key === "ArrowRight") scrollPage(1);
    });

    // fallback imagens
    track.querySelectorAll("img").forEach((img) => {
      img.addEventListener(
        "error",
        () => (img.src = "/assets/placeholder.png")
      );
    });
  }

  function loadCarousels(JSON_PATH) {
    fetch(JSON_PATH)
      .then((r) => {
        if (!r.ok) throw new Error("JSON not found");
        return r.json();
      })
      .then((sections) => {
        Object.entries(sections).forEach(([id, itens]) => {
          const el = document.getElementById(id);
          if (!el) return;

          itens.forEach((i) => {
            if (!i.img.startsWith("/")) i.img = "/" + i.img;
          });

          initCarousel(el, itens);
        });
      })
      .catch((err) => console.error("Erro ao carregar JSON:", err));
  }

  const modal = document.getElementById("modal");
  const modalLinks = modal.querySelector(".modal-links");
  const closeBtn = modal.querySelector(".modal-close");

  function abrirModal(links) {
    modalLinks.innerHTML = "";

    links.forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.textContent = link.title;
      li.appendChild(a);
      modalLinks.appendChild(li);
    });

    modal.classList.add("active");
  }

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  loadCarousels("/json/itzyflix/itzyflix.json");
})();
