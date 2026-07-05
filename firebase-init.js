import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
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
    name = prompt('Como você se chama? (isso identifica seus registros pros outros)');
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
export async function deleteStudyEntry(id){
  await deleteDoc(doc(db, "studyEntries", id));
}
export async function updateStudyEntry(id, data){
  await updateDoc(doc(db, "studyEntries", id), data);
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
export async function getAllQuizzesOnce(){
  const snap = await getDocs(collection(db, "quizzes"));
  const quizzes = [];
  snap.forEach(d => quizzes.push({ id: d.id, ...d.data() }));
  return quizzes;
}
export async function deleteQuiz(id){
  await deleteDoc(doc(db, "quizzes", id));
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

// ---------- Banco de questões erradas ----------
function sanitizeIdPart(str){
  return (str || '').toString().replace(/[^a-zA-Z0-9_-]/g, '_');
}
export { sanitizeIdPart as sanitizeId };

// ---------- Perfis (login simples com nome + senha + foto) ----------
export async function getProfile(name){
  const ref = doc(db, "profiles", sanitizeIdPart(name));
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}
export async function setProfile(name, data){
  await setDoc(doc(db, "profiles", sanitizeIdPart(name)), data, { merge: true });
}
export function wrongQuestionId(author, sourceQuizId, questionId){
  return `${sanitizeIdPart(author)}__${sanitizeIdPart(sourceQuizId)}__${sanitizeIdPart(questionId)}`;
}
export async function upsertWrongQuestion(data){
  const id = wrongQuestionId(data.author, data.sourceQuizId, data.questionId);
  await setDoc(doc(db, "wrongQuestions", id), data);
}
export async function removeWrongQuestion(author, sourceQuizId, questionId){
  const id = wrongQuestionId(author, sourceQuizId, questionId);
  await deleteDoc(doc(db, "wrongQuestions", id));
}
export function listenWrongQuestions(callback, onError){
  const q = query(collection(db, "wrongQuestions"), orderBy("date", "desc"));
  return onSnapshot(q, (snap) => {
    const items = [];
    snap.forEach(d => items.push({ id: d.id, ...d.data() }));
    callback(items);
  }, (err) => {
    console.error('Erro ao carregar wrongQuestions:', err);
    if(onError) onError(err);
  });
}

// ---------- Mural de recados ----------
export async function addMessage(msg){
  await addDoc(collection(db, "messages"), msg);
}
export function listenMessages(callback, onError){
  const q = query(collection(db, "messages"), orderBy("date", "desc"));
  return onSnapshot(q, (snap) => {
    const items = [];
    snap.forEach(d => items.push({ id: d.id, ...d.data() }));
    callback(items);
  }, (err) => {
    console.error('Erro ao carregar messages:', err);
    if(onError) onError(err);
  });
}
