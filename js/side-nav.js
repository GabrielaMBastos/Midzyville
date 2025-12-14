fetch("/pages/side-nav.html")
  .then(res => res.text())
  .then(html => {
    const container = document.getElementById("side-nav-container");
    container.innerHTML = html;

    container.addEventListener("click", (e) => {
      const sideNav = container.querySelector(".side-nav");
      if (!sideNav) return;

      if (e.target.closest(".nav-side-icon")) {
        sideNav.classList.add("open");
      }

      if (e.target.closest(".close-btn")) {
        sideNav.classList.remove("open");
      }
    });

    console.log("sideNav:", container.querySelector(".side-nav"));
    console.log("icon:", container.querySelector(".nav-side-icon"));
    console.log("closeBtn:", container.querySelector(".close-btn"));
  })
  .catch(err => {
    console.error("Erro ao carregar side-nav:", err);
  });
