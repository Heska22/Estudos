export const SUBJECTS = [
  { id: 'quimica',    label: 'Química',      color: '#2f6f5e' },
  { id: 'biologia',   label: 'Biologia',     color: '#3f8f5e' },
  { id: 'genetica',   label: 'Genética',     color: '#7a4f9e' },
  { id: 'fisica',     label: 'Física',       color: '#1f6f8f' },
  { id: 'matematica', label: 'Matemática',   color: '#b0333f' },
  { id: 'historia',   label: 'História',     color: '#a15c2b' },
  { id: 'geografia',  label: 'Geografia',    color: '#6f8f2f' },
  { id: 'filosofia',  label: 'Filosofia',    color: '#3b5a8a' },
  { id: 'sociologia', label: 'Sociologia',   color: '#8f5e2f' },
  { id: 'portugues',  label: 'Português',    color: '#8a3b6f' },
  { id: 'ingles',     label: 'Inglês',       color: '#3b8a7a' },
  { id: 'outro',      label: 'Outro',        color: '#6b6a63' },
];

export function subjectLabel(id, customLabel){
  if(id === 'outro' && customLabel) return customLabel;
  const found = SUBJECTS.find(s => s.id === id);
  return found ? found.label : 'Outro';
}

export function subjectColor(id){
  const found = SUBJECTS.find(s => s.id === id);
  return found ? found.color : '#6b6a63';
}
