// Vibração tátil (só funciona em celular com suporte — em computador simplesmente não faz nada, sem erro)
export function vibrate(pattern){
  if(typeof navigator !== 'undefined' && navigator.vibrate){
    try{ navigator.vibrate(pattern); }catch(e){ /* ignora silenciosamente */ }
  }
}

// Toque leve, tipo botão de app nativo
export function tapFeedback(){
  vibrate(12);
}

// Vibração de sucesso (ex: salvar registro, acertar questão)
export function successFeedback(){
  vibrate([15, 40, 15]);
}

// Vibração comemorativa (ex: desbloquear conquista)
export function celebrationFeedback(){
  vibrate([20, 50, 20, 50, 40]);
}

// Vibração de erro/atenção (ex: senha errada, resposta errada)
export function errorFeedback(){
  vibrate([30, 30, 30]);
}

// Liga automaticamente um leve "tap" em qualquer clique de botão/link .btn da página
export function enableGlobalTapFeedback(){
  document.addEventListener('click', (e) => {
    if(e.target.closest('.btn')){
      tapFeedback();
    }
  });
}
