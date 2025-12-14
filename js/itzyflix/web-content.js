const modal = document.getElementById("modal");
const modalLinks = modal.querySelector(".modal-links");
const closeBtn = modal.querySelector(".modal-close");

closeBtn.onclick = () => modal.classList.remove("active");
modal.onclick = (e) => {
  if (e.target === modal) modal.classList.remove("active");
};

fetch("/json/itzyflix/web-content.json")
  .then(res => res.json())
  .then(data => {
    const section = document.getElementById("webContent");

    data.webContent.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("item");

      div.innerHTML = `
        <div class="card-img">
          <img src="${item.img}" alt="">
        </div>
      `;

      div.addEventListener("click", () => {
        // Caso 1: link direto
        if (item.url) {
          window.open(item.url, "_blank");
        }

        // Caso 2: popup com lista
        if (item.links) {
          modalLinks.innerHTML = "";

          item.links.forEach(link => {
            modalLinks.innerHTML += `
              <li>
                <a href="${link.url}" target="_blank">${link.title}</a>
              </li>
            `;
          });

          modal.classList.add("active");
        }
      });

      section.appendChild(div);
    });
  })
  .catch(err => console.error(err));
