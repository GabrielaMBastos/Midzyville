(function () {

  const GAP_PX = 14;

  function criarCard(item) {
    const el = document.createElement('div');
    el.className = 'card';

    const img = document.createElement('img');
    img.src = item.img.startsWith('/') ? item.img : '/' + item.img;
    img.alt = item.title || '';

    const body = document.createElement('div');
    body.className = 'card-body';

    const title = document.createElement('p');
    title.className = 'card-title';
    title.textContent = item.title || '';
    body.appendChild(title);

    if (Array.isArray(item.links) && item.links.length) {
      const links = document.createElement('div');
      links.className = 'card-links';
      item.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url || '#';
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = link.name || link.url;
        links.appendChild(a);
      });
      body.appendChild(links);
    }

    el.appendChild(img);
    el.appendChild(body);
    return el;
  }

  function initCarousel(wrapperEl, itens) {
  wrapperEl.classList.add('carousel');

  const track = document.createElement('div');
  track.className = 'track';
  track.style.paddingLeft = '0.5em';
  track.style.paddingRight = '0.5em';

  itens.forEach(item => track.appendChild(criarCard(item)));

  wrapperEl.innerHTML = '';
  wrapperEl.appendChild(track);

  let leftBtn, rightBtn;

  function getCardWidth() {
    const card = track.querySelector('.card');
    if (!card) return wrapperEl.clientWidth * 0.6;

    const style = getComputedStyle(card);
    const gap = parseFloat(style.marginRight) || GAP_PX;

    return card.getBoundingClientRect().width + gap;
  }

  function getVisibleCount() {
    const cw = getCardWidth();
    return Math.max(1, Math.floor((wrapperEl.clientWidth - 40) / cw));
  }

  function scrollPage(dir) {
    track.scrollBy({
      left: dir * getCardWidth() * getVisibleCount(),
      behavior: 'smooth'
    });
  }

  function needsArrows() {
    return track.scrollWidth > track.clientWidth + 5;
  }

  function updateArrows() {
    if (!leftBtn || !rightBtn) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const pos = track.scrollLeft;

    leftBtn.style.opacity = pos <= 5 ? '0' : '1';
    rightBtn.style.opacity = pos >= maxScroll - 5 ? '0' : '1';
  }

  function createArrowsIfNeeded() {
    // remove se já existirem
    wrapperEl.querySelectorAll('.arrow').forEach(a => a.remove());
    leftBtn = rightBtn = null;

    if (!needsArrows()) return;

    leftBtn = document.createElement('button');
    leftBtn.className = 'arrow left';
    leftBtn.innerHTML = '&#8249;';
    leftBtn.style.opacity = 0;

    rightBtn = document.createElement('button');
    rightBtn.className = 'arrow right';
    rightBtn.innerHTML = '&#8250;';

    wrapperEl.appendChild(leftBtn);
    wrapperEl.appendChild(rightBtn);

    leftBtn.addEventListener('click', () => scrollPage(-1));
    rightBtn.addEventListener('click', () => scrollPage(1));

    updateArrows();
  }

  // eventos
  track.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', createArrowsIfNeeded);

  // inicial
  setTimeout(createArrowsIfNeeded, 100);

  // teclado
  wrapperEl.tabIndex = 0;
  wrapperEl.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') scrollPage(-1);
    if (e.key === 'ArrowRight') scrollPage(1);
  });

  // fallback imagens
  track.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => img.src = '/assets/placeholder.png');
  });
}


  function loadCarousels(JSON_PATH) {
    fetch(JSON_PATH)
      .then(r => { if (!r.ok) throw new Error('JSON not found'); return r.json(); })
      .then(sections => {
        Object.entries(sections).forEach(([id, itens]) => {
          const el = document.getElementById(id);
          if (!el) return;

          itens.forEach(i => {
            if (!i.img.startsWith('/')) i.img = '/' + i.img;
          });

          initCarousel(el, itens);
        });
      })
      .catch(err => console.error('Erro ao carregar JSON:', err));
  }

  loadCarousels('/json/discography/yeji-discography.json');

})();
