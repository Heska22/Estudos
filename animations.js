// Carrega o Anime.js de forma resiliente: se o CDN falhar (sem internet, bloqueio, etc.),
// as funções abaixo caem pra um modo "sem animação" (aplicam o valor final direto),
// em vez de quebrar a página inteira.
let animate = null;
let stagger = null;

try{
  const mod = await import('https://cdn.jsdelivr.net/npm/animejs@4/+esm');
  animate = mod.animate;
  stagger = mod.stagger;
}catch(err){
  console.warn('Anime.js não carregou (sem internet ou CDN bloqueado) — animações desativadas, o site continua funcionando normalmente.', err);
}

// Conta um número subindo de 0 até o valor final (ex: streak, XP)
export function animateCountUp(el, to, duration = 900){
  if(!el) return;
  if(!animate){ el.textContent = Math.round(to); return; }
  const obj = { val: 0 };
  animate(obj, {
    val: to,
    duration,
    ease: 'outQuint',
    onUpdate: () => { el.textContent = Math.round(obj.val); }
  });
}

// Anima uma barra de progresso crescendo de 0% até o valor final
export function animateBarFill(el, targetPercent, opts = {}){
  if(!el) return;
  if(!animate){ el.style.width = `${targetPercent}%`; return; }
  el.style.width = '0%';
  requestAnimationFrame(() => {
    animate(el, {
      width: `${targetPercent}%`,
      duration: opts.duration || 850,
      delay: opts.delay || 0,
      ease: 'outQuint'
    });
  });
}

// Faz uma lista de elementos aparecer em sequência (fade + leve deslize pra cima)
export function staggerFadeIn(selector, opts = {}){
  const els = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
  if(!els || els.length === 0) return;
  if(!animate){ els.forEach(el => { el.style.opacity = '1'; }); return; }
  animate(els, {
    opacity: [0, 1],
    translateY: [14, 0],
    delay: stagger(opts.staggerMs || 55),
    duration: opts.duration || 420,
    ease: 'outQuad'
  });
}

// Faz elementos "pipocarem" (escala + fade), bom pra conquistas desbloqueadas
export function popIn(selector, opts = {}){
  const els = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
  if(!els || els.length === 0) return;
  if(!animate){ els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; }); return; }
  animate(els, {
    scale: [0.55, 1],
    opacity: [0, 1],
    delay: stagger(opts.staggerMs || 45),
    duration: opts.duration || 550,
    ease: 'outElastic(1, .6)'
  });
}
