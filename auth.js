import { getProfile, setProfile } from "./firebase-init.js";

const SESSION_KEY = 'myName';
const PHOTO_CACHE_KEY = 'myPhotoCache';

export function getSessionName(){
  return localStorage.getItem(SESSION_KEY) || '';
}

export function getCachedPhoto(){
  return localStorage.getItem(PHOTO_CACHE_KEY) || null;
}

export function logout(){
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PHOTO_CACHE_KEY);
  window.location.href = 'index.html';
}

function injectStyles(){
  if(document.getElementById('auth-styles')) return;
  const style = document.createElement('style');
  style.id = 'auth-styles';
  style.textContent = `
    #auth-overlay{ position:fixed; inset:0; background:rgba(15,14,13,0.6); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; font-family:"Inter","Helvetica Neue",Arial,sans-serif; }
    .auth-box{ background:var(--paper,#fff); color:var(--ink,#1f2225); border-radius:16px; padding:30px 26px; max-width:380px; width:100%; box-shadow:0 20px 60px rgba(0,0,0,0.3); }
    .auth-box h2{ font-family:"Fraunces",Georgia,serif; margin:0 0 6px; font-size:1.5rem; }
    .auth-box .auth-sub{ font-size:0.85rem; color:var(--muted,#767569); margin:0 0 20px; }
    .auth-box label{ font-size:0.78rem; font-weight:700; color:var(--muted,#767569); display:block; margin-bottom:5px; }
    .auth-box input[type="text"], .auth-box input[type="password"]{ width:100%; padding:11px 14px; border:1.5px solid var(--rule,#e2dbc9); border-radius:9px; margin-bottom:16px; font-size:0.95rem; font-family:inherit; }
    .auth-box input[type="file"]{ margin-bottom:16px; font-size:0.82rem; width:100%; }
    .auth-box button{ width:100%; background:var(--ink,#1f2225); color:#fff; border:none; padding:13px; border-radius:10px; font-weight:600; cursor:pointer; font-size:0.95rem; }
    .auth-box button:disabled{ opacity:0.6; cursor:not-allowed; }
    .auth-error{ color:#b3492f; font-size:0.82rem; margin-top:12px; min-height:18px; }
  `;
  document.head.appendChild(style);
}

function fileToBase64(file){
  return new Promise((resolve, reject) => {
    if(file.size > 900 * 1024){
      reject(new Error('Essa foto é grande demais (limite de ~900KB). Escolha uma menor.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}

// Retorna uma Promise que resolve com o nome da pessoa logada.
// Se já existir sessão salva neste aparelho, resolve na hora sem pedir nada.
export function requireLogin(){
  const existing = getSessionName();
  if(existing) return Promise.resolve(existing);

  injectStyles();

  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.innerHTML = `
      <div class="auth-box">
        <h2>Entrar</h2>
        <p class="auth-sub">Primeira vez? Sua conta é criada automaticamente com a senha que você digitar. Já tem conta? Digite a mesma senha de sempre.</p>
        <label>Seu nome</label>
        <input type="text" id="auth-name" autocomplete="off">
        <label>Senha</label>
        <input type="password" id="auth-password">
        <label>Foto de perfil (opcional)</label>
        <input type="file" id="auth-photo" accept="image/*">
        <button id="auth-submit">Entrar</button>
        <p class="auth-error" id="auth-error"></p>
      </div>
    `;
    document.body.appendChild(overlay);

    const nameInput = overlay.querySelector('#auth-name');
    const passInput = overlay.querySelector('#auth-password');
    const photoInput = overlay.querySelector('#auth-photo');
    const errorEl = overlay.querySelector('#auth-error');
    const submitBtn = overlay.querySelector('#auth-submit');

    async function trySubmit(){
      const name = nameInput.value.trim();
      const password = passInput.value;
      errorEl.textContent = '';

      if(!name || !password){
        errorEl.textContent = 'Preencha nome e senha.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Verificando...';

      try{
        const profile = await getProfile(name);

        let photoData = null;
        const file = photoInput.files[0];
        if(file){
          photoData = await fileToBase64(file);
        }

        if(profile){
          if(profile.password !== password){
            errorEl.textContent = 'Senha incorreta pra esse nome.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar';
            return;
          }
          if(photoData){
            await setProfile(name, { photo: photoData });
          }
        } else {
          await setProfile(name, { name, password, photo: photoData || null, createdAt: Date.now() });
        }

        localStorage.setItem(SESSION_KEY, name);
        const finalPhoto = photoData || (profile && profile.photo) || null;
        if(finalPhoto) localStorage.setItem(PHOTO_CACHE_KEY, finalPhoto);

        overlay.remove();
        resolve(name);
      }catch(err){
        console.error(err);
        errorEl.textContent = err.message || 'Erro ao conectar. Confira sua internet e tente de novo.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
      }
    }

    submitBtn.addEventListener('click', trySubmit);
    passInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') trySubmit(); });
  });
}

export function mountProfileChip(name){
  const container = document.getElementById('profile-chip');
  if(!container) return;
  const photo = getCachedPhoto();
  const initial = (name || '?').trim().charAt(0).toUpperCase();

  container.innerHTML = `
    <a href="perfil.html" style="display:flex; align-items:center; gap:7px; text-decoration:none; color:#fff;">
      ${photo
        ? `<img src="${photo}" style="width:28px; height:28px; border-radius:50%; object-fit:cover; border:1.5px solid rgba(255,255,255,0.3);">`
        : `<span style="width:28px; height:28px; border-radius:50%; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700;">${initial}</span>`
      }
      <span class="profile-chip-name" style="font-size:0.78rem; font-weight:600;">${name}</span>
    </a>
  `;
}
