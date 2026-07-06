# Changelog e Roadmap — Painel de Estudos

Este arquivo é a fonte de verdade sobre o que existe no site. Sempre que pedir uma mudança nova pro Claude, pode linkar ou colar este arquivo pra dar contexto completo, especialmente em uma conversa nova.

## Estrutura de arquivos

- `index.html` — Painel inicial (estatísticas, streak, XP, conquistas, gráfico por matéria, sugestões de revisão, últimos registros/provas)
- `diario.html` — Diário de estudos (criar, editar, excluir, filtrar registros, zoom nas fotos)
- `provas.html` — Lista de provas, prova aleatória, precisão por matéria, placar geral
- `prova-jogar.html` — Executa uma prova específica (via `?id=`) ou aleatória (via `?random=1&n=15`)
- `nova-prova.html` — Página restrita (senha) pra publicar novas provas
- `revisao.html` — Banco de questões erradas (retry até acertar)
- `mural.html` — Recados entre os dois + placar semanal
- `perfil.html` — Trocar foto de perfil e senha, sair da conta
- `style.css` — Estilo visual compartilhado (inclui tema claro/escuro, lightbox, chip de perfil)
- `theme.js` — Lógica do modo escuro/claro
- `subjects.js` — Lista de matérias, cores e rótulos
- `gamification.js` — Streak, XP, nível, conquistas, cor/inicial de avatar
- `auth.js` — Login (nome + senha + foto), sessão salva no aparelho, chip de perfil na navbar
- `lightbox.js` — Visualizador de foto em tela cheia (clique pra ampliar)
- `animations.js` — Animações com Anime.js (barras, contadores, listas, conquistas, confete)
- `haptics.js` — Vibração tátil em celular (toque em botão, salvar, acertar/errar, conquista)
- `firebase-config.js` — Credenciais do Firebase + nome do dono do site
- `firebase-init.js` — Funções de acesso ao Firestore (ler/gravar dados)
- `prova-exemplo-1.json` — Conteúdo da primeira prova (com campo "subject" em cada questão)

## Coleções no Firestore

- `studyEntries` — registros do diário: `{author, date, subject, customSubject, notes, minutes, difficulty, tags[], photo, createdAt}`
- `quizzes` — provas cadastradas: `{title, dateCreated, questions[]}` (cada questão: `{id, type, subject, stem, options[], correct}`)
- `quizAttempts` — tentativas de prova: `{author, quizId, quizTitle, correct, total, percent, answers[], date}` (`answers`: `[{questionId, subject, correct}]`, usado pra estatística por matéria)
- `wrongQuestions` — banco de questões erradas: `{author, sourceQuizId, sourceQuizTitle, questionId, subject, stem, options, correct, date}` (ID do doc é determinístico: `autor__provaOrigem__questao`)
- `messages` — recados do mural: `{author, text, date}`
- `profiles` — contas de login: `{name, password, photo, createdAt}` (ID do doc = nome sanitizado; **senha em texto puro, sem criptografia real** — ok pra uso casual entre amigos, não use senha que você usa em outro lugar)

## Status das funcionalidades

### ✅ Implementado (Lote 1)
Painel compartilhado, diário com múltiplas matérias/tags/dificuldade/tempo/foto, editar/excluir registros, provas dinâmicas, placar geral, filtros por nome, modo escuro/claro, streak, gráfico por matéria, XP/Nível, conquistas.

### ✅ Implementado (Lote 2)
Estatística por matéria nas provas, banco de questões erradas (`revisao.html`), prova aleatória, lembrete de revisão espaçada, mural social/competitivo (`mural.html`), avatares coloridos.

### ✅ Implementado (Lote 3 — correções + perfil)
- **Mensagens de erro mostram o motivo técnico real** (não mais "confira as regras" genérico — agora aparece a mensagem exata do erro, pra debugar mais rápido)
- **Zoom nas fotos do diário** — clique em qualquer foto (diário ou painel) pra ver em tela cheia; Esc ou clique fora fecha
- **Sistema de login/perfil** (`auth.js` + `perfil.html`) — nome + senha simples na primeira visita, cria conta automaticamente; próximas visitas no mesmo aparelho não pedem de novo (sessão salva); dá pra trocar foto de perfil e senha em `perfil.html`; chip do perfil aparece no canto da navbar em toda página

### ✅ Implementado (Lote 4 — dono do site + upload de provas)
- **Cargo de "dono"** (`OWNER_NAME` em `firebase-config.js`) — só essa pessoa (pelo nome de login) vê "Criar nova prova" e o botão de excluir. Substitui a senha compartilhada.
- **Upload de arquivo `.json`** em `nova-prova.html` (arrastar ou selecionar), com preview automático — resolve o problema de colar texto pela metade
- **Excluir prova** — botão 🗑️ na lista, só visível pro dono
- Aviso claro de acesso restrito pra quem não é o dono

### ✅ Implementado (Lote 5 — animações)
- **Anime.js** (`animations.js`, via CDN) dando movimento a: barra de XP enchendo, streak contando, gráficos de matéria crescendo, conquistas "pipocando" ao desbloquear, listas (diário, provas, mural) aparecendo em sequência suave
- Resiliente: se o CDN do Anime.js falhar, o site continua funcionando normalmente, só sem os efeitos

### ✅ Implementado (Lote 6 — polimento visual)
- **Confete** 🎉 quando uma conquista é desbloqueada pela primeira vez (só dispara uma vez por conquista, guardado no aparelho)
- **Cards "levantam"** suavemente ao passar o mouse (sombra mais forte)
- **Botões** com feedback mais satisfatório ao passar o mouse/clicar
- **Brilho animado** (shine) passando pelas barras de XP e de matéria continuamente
- **Página aparece com fade suave** ao carregar, em vez de "piscar" tudo de uma vez

### ✅ Implementado (Lote 7 — polimento mobile)
- **Feedback ao toque** em cards, botões, fotos e conquistas (antes só funcionava com mouse/hover, agora funciona igual encostando o dedo)
- **Vibração tátil (haptics)** em celular: toque leve em qualquer botão, vibração de sucesso ao salvar registro/prova/acertar revisão, vibração de erro ao errar senha ou questão de revisão, vibração comemorativa ao desbloquear conquista
- Removido o "flash azul" padrão do navegador ao tocar em botões/links (visual mais nativo)

### 🔜 Planejado (ainda não implementado)
- PWA (instalar como app no celular)
- Editar uma prova já publicada (hoje só dá pra criar ou excluir)
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

## Nota sobre login e segurança
O login com senha é uma proteção leve, não é um sistema de segurança de verdade — a senha fica salva sem criptografia no banco. Serve pra evitar que alguém digite o nome errado sem querer, não pra proteger dados sensíveis. Nunca reutilizem uma senha "de verdade" (email, banco, etc.) aqui.
