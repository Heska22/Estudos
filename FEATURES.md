# Changelog e Roadmap — Painel de Estudos

Este arquivo é a fonte de verdade sobre o que existe no site. Sempre que pedir uma mudança nova pro Claude, pode linkar ou colar este arquivo pra dar contexto completo, especialmente em uma conversa nova.

## Estrutura de arquivos

- `index.html` — Painel inicial (estatísticas, streak, XP, conquistas, gráfico por matéria, últimos registros/provas)
- `diario.html` — Diário de estudos (criar, editar, excluir, filtrar registros)
- `provas.html` — Lista de provas + placar geral
- `prova-jogar.html` — Executa uma prova específica (lida via `?id=`)
- `nova-prova.html` — Página restrita (senha) pra publicar novas provas
- `style.css` — Estilo visual compartilhado (inclui tema claro/escuro)
- `theme.js` — Lógica do modo escuro/claro
- `subjects.js` — Lista de matérias, cores e rótulos
- `firebase-config.js` — Credenciais do Firebase + senha de admin de provas
- `firebase-init.js` — Funções de acesso ao Firestore (ler/gravar dados)
- `prova-exemplo-1.json` — Conteúdo da primeira prova (Tabela Periódica, Genética, Revolução Industrial)

## Coleções no Firestore

- `studyEntries` — registros do diário: `{author, date, subject, customSubject, notes, minutes, difficulty, tags[], photo, createdAt}`
- `quizzes` — provas cadastradas: `{title, dateCreated, questions[]}` (cada questão: `{id, type, stem, options[], correct}`)
- `quizAttempts` — tentativas de prova: `{author, quizId, quizTitle, correct, total, percent, date}`

## Status das funcionalidades

### ✅ Implementado
- Painel compartilhado em tempo real (dados de todos que usam o site)
- Diário de estudos com múltiplas matérias, tags, dificuldade, tempo, foto
- **Editar e excluir registros do diário** (só o autor edita/exclui o próprio)
- Provas dinâmicas (lista que cresce, cadastradas via `nova-prova.html`)
- Placar geral de provas
- Filtros por nome real da pessoa (painel e diário)
- **Modo escuro/claro** (botão no menu, lembra a escolha no aparelho)
- **Streak** (dias seguidos estudando, por pessoa)
- **Gráfico de progresso por matéria** (tempo total estudado, por matéria)
- **Sistema de XP e Nível** (pontos por registro de estudo e por prova feita)
- **Conquistas/medalhas** (badges desbloqueadas conforme uso)

### 🔜 Planejado (próximos lotes)
- Estatística por matéria nas provas (exige adicionar campo "subject" em cada questão)
- Banco de questões erradas (revisão das que você errou)
- Prova aleatória (mistura questões de várias provas)
- Lembrete de revisão espaçada (sugestão de o que revisar)
- Mural social/competitivo (recados + placar semanal entre os dois)
- PWA (instalar como app no celular)

## Regras de XP (pra manter consistência se for mexer depois)
- +10 XP por registro de estudo salvo no diário
- +15 XP por prova concluída (independente da nota)
- +5 XP extra por cada acerto na prova
- Nível = piso de raiz quadrada de (XP / 40) + 1 (fica mais difícil subir de nível conforme avança)

## Conquistas atuais (calculadas automaticamente, não ficam salvas no banco)
- 🥉 Primeiro Registro — 1 registro de estudo
- 📚 Dedicado — 25 registros de estudo
- 🔥 Sequência de 3 — streak de 3 dias
- 🔥🔥 Sequência de 7 — streak de 7 dias
- 📝 Primeira Prova — 1 prova concluída
- 💯 Perfeição — alguma prova com 100%
- 🌐 Poliglota dos Estudos — estudou 5+ matérias diferentes
