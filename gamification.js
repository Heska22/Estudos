export function getAvatarColor(name){
  let hash = 0;
  for(let i=0; i<(name||'').length; i++){ hash = name.charCodeAt(i) + ((hash<<5)-hash); }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 42%)`;
}

export function getInitial(name){
  return (name || '?').trim().charAt(0).toUpperCase();
}

// Retorna o streak (dias seguidos com pelo menos 1 registro) de uma pessoa.
// Não quebra o streak se a pessoa ainda não registrou nada HOJE (o dia não acabou).
export function calculateStreak(entries, authorName){
  const dates = [...new Set(entries.filter(e => e.author === authorName).map(e => e.date))];
  if(dates.length === 0) return 0;

  const oneDay = 24*60*60*1000;
  const today = new Date(); today.setHours(0,0,0,0);
  const todayStr = localDateStr(today);

  let cursor = dates.includes(todayStr) ? today : new Date(today.getTime() - oneDay);
  let streak = 0;

  while(true){
    const cursorStr = localDateStr(cursor);
    if(dates.includes(cursorStr)){
      streak++;
      cursor = new Date(cursor.getTime() - oneDay);
    } else {
      break;
    }
  }
  return streak;
}

// "YYYY-MM-DD" no fuso horário local (toISOString() converteria pra UTC e podia
// bagunçar a sequência de dias perto da meia-noite, dependendo do fuso).
function localDateStr(d){
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function calculateXP(entries, attempts, authorName){
  const myEntries = entries.filter(e => e.author === authorName);
  const myAttempts = attempts.filter(a => a.author === authorName);
  let xp = myEntries.length * 10;
  myAttempts.forEach(a => {
    xp += 15;
    xp += (a.correct || 0) * 5;
  });
  return xp;
}

export function xpForLevel(level){
  return Math.pow(Math.max(level - 1, 0), 2) * 40;
}

export function getLevelProgress(xp){
  const level = Math.floor(Math.sqrt(xp / 40)) + 1;
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const span = nextLevelXp - currentLevelXp;
  const progressPercent = span > 0 ? Math.min(100, Math.round(((xp - currentLevelXp) / span) * 100)) : 100;
  return { level, currentLevelXp, nextLevelXp, progressPercent, xp };
}

export function calculateAchievements(entries, attempts, authorName, streak){
  const myEntries = entries.filter(e => e.author === authorName);
  const myAttempts = attempts.filter(a => a.author === authorName);
  const distinctSubjects = new Set(myEntries.map(e => e.subject));
  const hasPerfect = myAttempts.some(a => a.percent === 100);

  return [
    { id:'first-entry', emoji:'🥉', name:'Primeiro Registro', unlocked: myEntries.length >= 1 },
    { id:'dedicated',   emoji:'📚', name:'Dedicado (25)',     unlocked: myEntries.length >= 25 },
    { id:'streak3',     emoji:'🔥', name:'Sequência de 3',    unlocked: streak >= 3 },
    { id:'streak7',     emoji:'🔥🔥', name:'Sequência de 7',  unlocked: streak >= 7 },
    { id:'first-quiz',  emoji:'📝', name:'Primeira Prova',    unlocked: myAttempts.length >= 1 },
    { id:'perfect',     emoji:'💯', name:'Perfeição',         unlocked: hasPerfect },
    { id:'polyglot',    emoji:'🌐', name:'Poliglota',         unlocked: distinctSubjects.size >= 5 },
  ];
}

export function calculateSubjectMinutes(entriesFiltered){
  const totals = {};
  entriesFiltered.forEach(e => {
    const mins = parseInt(e.minutes) || 0;
    totals[e.subject] = (totals[e.subject] || 0) + mins;
  });
  return totals;
}
