export function initTheme(){
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  return saved;
}

export function toggleTheme(){
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateToggleIcon(next);
}

export function updateToggleIcon(theme){
  const btn = document.getElementById('theme-toggle');
  if(btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

export function setupThemeToggle(){
  const theme = initTheme();
  updateToggleIcon(theme);
  const btn = document.getElementById('theme-toggle');
  if(btn){
    btn.addEventListener('click', toggleTheme);
  }
}
