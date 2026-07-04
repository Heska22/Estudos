import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------- Nome do usuário (guardado neste aparelho) ----------
export function getMyName(){
  return localStorage.getItem('myName') || '';
}
export function setMyName(name){
  localStorage.setItem('myName', name);
}
export function ensureMyName(){
  let name = getMyName();
  if(!name){
    name = prompt('Como você se chama? (isso identifica seus registros pro seu amigo)');
    if(name && name.trim()){
      setMyName(name.trim());
      name = name.trim();
    }
  }
  return name;
}

// ---------- Diário de estudos ----------
export async function addStudyEntry(entry){
  await addDoc(collection(db, "studyEntries"), entry);
}
export function listenStudyEntries(callback, onError){
  const q = query(collection(db, "studyEntries"), orderBy("date", "desc"));
  return onSnapshot(q, (snap) => {
    const entries = [];
    snap.forEach(d => entries.push({ id: d.id, ...d.data() }));
    callback(entries);
  }, (err) => {
    console.error('Erro ao carregar studyEntries:', err);
    if(onError) onError(err);
  });
}

// ---------- Provas (quizzes) ----------
export async function addQuiz(quiz){
  await addDoc(collection(db, "quizzes"), quiz);
}
export function listenQuizzes(callback, onError){
  const q = query(collection(db, "quizzes"), orderBy("dateCreated", "desc"));
  return onSnapshot(q, (snap) => {
    const quizzes = [];
    snap.forEach(d => quizzes.push({ id: d.id, ...d.data() }));
    callback(quizzes);
  }, (err) => {
    console.error('Erro ao carregar quizzes:', err);
    if(onError) onError(err);
  });
}
export async function getQuizById(id){
  const ref = doc(db, "quizzes", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ---------- Tentativas de prova ----------
export async function addQuizAttempt(attempt){
  await addDoc(collection(db, "quizAttempts"), attempt);
}
export function listenQuizAttempts(callback, onError){
  const q = query(collection(db, "quizAttempts"), orderBy("date", "desc"));
  return onSnapshot(q, (snap) => {
    const attempts = [];
    snap.forEach(d => attempts.push({ id: d.id, ...d.data() }));
    callback(attempts);
  }, (err) => {
    console.error('Erro ao carregar quizAttempts:', err);
    if(onError) onError(err);
  });
}
