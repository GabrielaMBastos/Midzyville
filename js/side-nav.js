fetch("/pages/side-nav.html")
  .then(res => res.text())
  .then(html => {
    const container = document.getElementById("side-nav-container");
    container.innerHTML = html;

    // event delegation no container: captura clicks no ícone e no close button
    container.addEventListener("click", (e) => {
      const sideNav = container.querySelector(".side-nav");
      if (!sideNav) return;

      // clique no ícone (ou em algum filho dele)
      if (e.target.closest(".nav-side-icon")) {
        sideNav.classList.add("open");
      }

      // clique no close button (ou em algum filho)
      if (e.target.closest(".close-btn")) {
        sideNav.classList.remove("open");
      }
    });

    // DEBUG: verifique se os elementos existem
    console.log("sideNav:", container.querySelector(".side-nav"));
    console.log("icon:", container.querySelector(".nav-side-icon"));
    console.log("closeBtn:", container.querySelector(".close-btn"));
  })
  .catch(err => {
    console.error("Erro ao carregar side-nav:", err);
  });
