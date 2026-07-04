# Changelog e Roadmap — Painel de Estudos

Este arquivo é a fonte de verdade sobre o que existe no site. Sempre que pedir uma mudança nova pro Claude, pode linkar ou colar este arquivo pra dar contexto completo, especialmente em uma conversa nova.

## Estrutura de arquivos

- `index.html` — Painel inicial (estatísticas, streak, XP, conquistas, gráfico por matéria, sugestões de revisão, últimos registros/provas)
- `diario.html` — Diário de estudos (criar, editar, excluir, filtrar registros)
- `provas.html` — Lista de provas, prova aleatória, precisão por matéria, placar geral
- `prova-jogar.html` — Executa uma prova específica (via `?id=`) ou aleatória (via `?random=1&n=15`)
- `nova-prova.html` — Página restrita (senha) pra publicar novas provas
- `revisao.html` — Banco de questões erradas (retry até acertar)
- `mural.html` — Recados entre os dois + placar semanal
- `style.css` — Estilo visual compartilhado (inclui tema claro/escuro)
- `theme.js` — Lógica do modo escuro/claro
- `subjects.js` — Lista de matérias, cores e rótulos
- `gamification.js` — Streak, XP, nível, conquistas, cor/inicial de avatar
- `firebase-config.js` — Credenciais do Firebase + senha de admin de provas
- `firebase-init.js` — Funções de acesso ao Firestore (ler/gravar dados)
- `prova-exemplo-1.json` — Conteúdo da primeira prova (com campo "subject" em cada questão)

## Coleções no Firestore

- `studyEntries` — registros do diário: `{author, date, subject, customSubject, notes, minutes, difficulty, tags[], photo, createdAt}`
- `quizzes` — provas cadastradas: `{title, dateCreated, questions[]}` (cada questão: `{id, type, subject, stem, options[], correct}`)
- `quizAttempts` — tentativas de prova: `{author, quizId, quizTitle, correct, total, percent, answers[], date}` (`answers`: `[{questionId, subject, correct}]`, usado pra estatística por matéria)
- `wrongQuestions` — banco de questões erradas: `{author, sourceQuizId, sourceQuizTitle, questionId, subject, stem, options, correct, date}` (ID do doc é determinístico: `autor__provaOrigem__questao`, pra sempre sobrescrever/remover certinho)
- `messages` — recados do mural: `{author, text, date}`

## Status das funcionalidades

### ✅ Implementado (Lote 1)
- Painel compartilhado em tempo real, diário com múltiplas matérias/tags/dificuldade/tempo/foto
- Editar e excluir registros do diário (só o autor)
- Provas dinâmicas cadastradas via `nova-prova.html`, placar geral
- Filtros por nome real, modo escuro/claro
- Streak, gráfico de progresso por matéria, XP/Nível, conquistas/medalhas

### ✅ Implementado (Lote 2)
- **Estatística por matéria nas provas** (exige que as questões tenham campo "subject" — provas antigas sem esse campo contam como "geral")
- **Banco de questões erradas** (`revisao.html`) — erros de qualquer prova (normal ou aleatória) entram automaticamente; acertar de novo remove da lista
- **Prova aleatória** — sorteia N questões (padrão 15) de todas as provas já cadastradas
- **Lembrete de revisão espaçada** — no painel, avisa quais matérias estão há 3+ dias sem estudo
- **Mural social/competitivo** (`mural.html`) — recados entre os dois + placar comparando registros/provas dos últimos 7 dias
- Avatares coloridos com inicial do nome (toque visual)

### 🔜 Planejado (ainda não implementado)
- PWA (instalar como app no celular)
- Editar uma prova já publicada (hoje só dá pra criar novas)
- Múltiplas fotos por registro de diário
- Cronômetro/tempo limite nas provas
- Metas semanais por matéria com barra de progresso
- Tema/cor personalizável por pessoa

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
