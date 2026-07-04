# Painel de Estudos (v2 — com Firebase)

Site com:
- **Início** — painel com dados seus e do seu amigo, em tempo real (com filtro "Todos / Só eu / Só ele(a)")
- **Diário de Estudos** — registre quantos estudos quiser por dia (assunto, tempo, dificuldade, tags, foto)
- **Provas** — lista de provas que cresce com o tempo; qualquer um dos dois pode fazer, o placar é compartilhado
- **Nova prova** — página restrita por senha pra publicar novas provas

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub (público), ex: `estudos`.
2. Faça upload de **todos os arquivos desta pasta**:
   - `index.html`
   - `diario.html`
   - `provas.html`
   - `prova-jogar.html`
   - `nova-prova.html`
   - `style.css`
   - `firebase-config.js`
   - `firebase-init.js`
   - `subjects.js`
   - `theme.js`
   - `gamification.js`
   - `FEATURES.md`
   - `README.md`
3. Em **Settings → Pages**, ative o branch `main` / pasta raiz.
4. Aguarde ~1 minuto — vai aparecer o link `https://seuusuario.github.io/estudos/`.

## Primeira vez usando

1. Ao abrir o site pela primeira vez em cada aparelho, ele vai perguntar seu nome (aparece um popup). Isso identifica quem fez cada registro/prova pro outro conseguir ver.
2. Publicar a primeira prova:
   - Acesse `nova-prova.html` pelo menu (ou direto pelo link `.../nova-prova.html`).
   - Senha: `quimica20` (você pode trocar isso no arquivo `firebase-config.js`, na constante `ADMIN_PASSPHRASE`).
   - Copie o conteúdo do arquivo `prova-exemplo-1.json` (as 20 questões que já fizemos), cole no campo de JSON, dê um título (ex: "Prova 1 — Tabela Periódica, Genética e Revolução Industrial"), clique em **Pré-visualizar** e depois **Publicar prova**.
   - Ela vai aparecer automaticamente na aba **Provas**.

## Criando provas novas em outros fins de semana

Sempre que quiser uma prova nova:
1. Me peça aqui no chat (ex: "cria uma prova sobre X assunto").
2. Eu gero o JSON no formato certo.
3. Você entra em `nova-prova.html`, cola a senha, cola o JSON, dá um título e publica.
4. Ela aparece na lista pro seu amigo fazer, sem precisar subir nenhum arquivo novo no GitHub.

## Sobre a "senha" da página de nova prova

Ela é só uma trava simples pra evitar que seu amigo crie provas por engano — não é segurança de verdade. Como o site é público, qualquer pessoa que abrir o código-fonte da página consegue ver a senha. Isso não é um problema sério pra um projeto de estudo entre amigos, mas vale saber que não é como uma senha de banco.

## Sobre as respostas corretas nas provas

As respostas ficam ocultas na tela até o envio, mas como o site roda inteiramente no navegador (sem servidor "por trás"), alguém que soubesse mexer no código do navegador (F12 → aba de rede) tecnicamente conseguiria ver os dados da prova antes de responder. Pra dois amigos brincando nos fins de semana isso não é um problema real, só é bom saber que não é um cofre inviolável.

## Sobre as fotos

Fotos ficam guardadas no Firestore como texto (base64), por isso o limite é baixo (~900KB por foto) — comprima ou tire fotos em resolução menor se passar do limite.
