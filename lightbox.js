export function enableLightbox(containerSelector){
  const container = document.querySelector(containerSelector);
  if(!container) return;

  container.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if(!img || !container.contains(img)) return;
    openLightbox(img.src);
  });
}

function openLightbox(src){
  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.innerHTML = `
    <button id="lightbox-close" aria-label="Fechar">✕</button>
    <img src="${src}" alt="Foto ampliada">
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => {
    if(e.target.id === 'lightbox-overlay' || e.target.id === 'lightbox-close') close();
  });
  document.addEventListener('keydown', function escHandler(e){
    if(e.key === 'Escape'){ close(); document.removeEventListener('keydown', escHandler); }
  });
}
