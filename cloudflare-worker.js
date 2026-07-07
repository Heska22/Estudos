// ============================================================
// Worker da Cloudflare — "Gerar prova com IA"
// ============================================================
// O QUE É ISSO: um servidorzinho gratuito que fica entre o seu site
// e a IA (Gemini, do Google). Ele existe só pra esconder sua chave
// secreta da IA — se você chamasse a IA direto do navegador, qualquer
// pessoa poderia roubar sua chave apertando F12.
//
// COMO USAR:
// 1. Crie uma conta grátis em https://dash.cloudflare.com (não pede cartão)
// 2. No menu, vá em "Workers e Pages" → "Criar" → "Criar Worker"
// 3. Dê um nome (ex: "prova-ia") e crie
// 4. Clique em "Editar código" e apague tudo, colando o conteúdo deste arquivo
// 5. Vá em Configurações do Worker → Variáveis → adicione uma variável
//    SECRETA (não uma normal) chamada GEMINI_API_KEY com sua chave do
//    Google AI Studio (pegue grátis em https://aistudio.google.com/apikey)
// 6. Clique em "Implantar" (Deploy)
// 7. Copie a URL que aparece (tipo https://prova-ia.SEUNOME.workers.dev)
//    e cole ela no arquivo ai-config.js do site
// ============================================================

export default {
  async fetch(request, env) {
    // Troque "*" pelo endereço exato do seu site depois que tudo funcionar,
    // pra só o seu site poder usar esse Worker (mais seguro).
    // Ex: "https://seunome.github.io"
    const allowedOrigin = "*";

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Método não permitido." }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      const body = await request.json();
      const weakSubjects = Array.isArray(body.weakSubjects) ? body.weakSubjects : [];
      const count = Math.min(Math.max(parseInt(body.count) || 8, 1), 15);

      if (weakSubjects.length === 0) {
        return jsonError(corsHeaders, "Nenhuma matéria fraca foi enviada.", 400);
      }

      const subjectList = weakSubjects
        .map((s) => `${s.subject} (errou ${s.wrongCount}x)`)
        .join(", ");
      const validSubjectIds = weakSubjects.map((s) => s.subject).join(", ");

      const prompt = `Você é um professor brasileiro criando uma prova de revisão.
A pessoa erra bastante nestas matérias: ${subjectList}.
Crie ${count} questões NOVAS e INÉDITAS (nunca copiadas de nenhum lugar), de múltipla escolha (4 alternativas, tipo "mc") ou verdadeiro/falso (tipo "vf"), cobrindo essas matérias, com dificuldade de nível escolar (ensino fundamental/médio).
Distribua as questões entre as matérias de forma equilibrada.
Responda APENAS com um JSON válido (um array), sem nenhum texto antes ou depois, sem markdown, no formato exato:
[
  {
    "id": "ia1",
    "type": "mc",
    "stem": "texto da pergunta",
    "options": [
      {"value":"a","label":"a) alternativa"},
      {"value":"b","label":"b) alternativa"},
      {"value":"c","label":"c) alternativa"},
      {"value":"d","label":"d) alternativa"}
    ],
    "correct": "b",
    "subject": "uma destas exatamente: ${validSubjectIds}"
  }
]
Para questões tipo "vf", use "options" como:
[{"value":"verdadeiro","label":"Verdadeiro"},{"value":"falso","label":"Falso"}] e "correct" como "verdadeiro" ou "falso".`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.9 },
          }),
        }
      );

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        return jsonError(corsHeaders, "Erro ao falar com a IA: " + errText, 502);
      }

      const geminiData = await geminiRes.json();
      let text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

      let questions;
      try {
        questions = JSON.parse(text);
      } catch (e) {
        return jsonError(corsHeaders, "A IA não devolveu um JSON válido. Tente de novo.", 502);
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        return jsonError(corsHeaders, "A IA não gerou nenhuma questão.", 502);
      }

      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      return jsonError(corsHeaders, err.message || String(err), 500);
    }
  },
};

function jsonError(corsHeaders, message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
