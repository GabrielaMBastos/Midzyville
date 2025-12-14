
  document.querySelectorAll(".year h2").forEach(title => {
    title.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        title.parentElement.classList.toggle("active");
      }
    });
  });
