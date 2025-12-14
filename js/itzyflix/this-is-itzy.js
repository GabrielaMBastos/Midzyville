fetch("/json/itzyflix/this-is-itzy.json")
  .then(res => res.json())
  .then(data => {
    const section = document.getElementById("this-is-itzy");
    if (!section) return;

    data.thisIsItzy.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("item");
      div.innerHTML = `
        <a href="${item.url}" target="_blank">
          <div class="card-img">
            <img src="${item.img}" alt="${item.alt}" />
          </div>
        </a>
      `;
      section.appendChild(div);
    });
  })
  .catch(err => console.error("Erro ao carregar JSON:", err));
