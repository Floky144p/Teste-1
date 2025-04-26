interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

// Cache de respostas para economizar chamadas API
const responseCache = new Map<string, { text: string, timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hora de TTL para o cache

/**
 * Envia uma requisição para a API Gemini com cache e resiliência
 * @param prompt O prompt de texto para enviar para a API Gemini
 * @returns O texto de resposta do Gemini
 */
export async function getGeminiResponse(prompt: string): Promise<string> {
  // Usar versão normalizada do prompt como chave de cache (sem espaços extras)
  const cacheKey = prompt.trim().replace(/\s+/g, ' ').toLowerCase();
  
  // Verificar cache
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Usando resposta em cache para Gemini');
    return cached.text;
  }
  
  try {
    console.log('Fazendo nova requisição para Gemini API');
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro da API Gemini:', errorData);
      throw new Error(`Erro HTTP: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }

    const data: GeminiResponse = await response.json();
    const resultText = data.candidates[0]?.content?.parts[0]?.text || 
                      'Desculpe, não consegui gerar uma resposta. Tente uma pergunta diferente.';
    
    // Armazenar no cache
    responseCache.set(cacheKey, {
      text: resultText,
      timestamp: Date.now()
    });
    
    return resultText;
  } catch (error) {
    console.error('Erro ao chamar Gemini API:', error);
    throw new Error('Falha ao comunicar com a API Gemini. Verifique sua conexão e tente novamente.');
  }
}

/**
 * Gera recomendações de jogos baseadas nas preferências do usuário
 * @param preferences Preferências do usuário para recomendações de jogos
 * @returns Texto com as recomendações de jogos
 */
export async function getGameRecommendations(preferences: string): Promise<string> {
  // Prompt otimizado para obter melhores resultados
  const prompt = `
    Você é um especialista em jogos gratuitos. 
    Com base nas seguintes preferências: "${preferences}", 
    recomende 3-4 jogos gratuitos que estão disponíveis ou estiveram recentemente disponíveis gratuitamente nas lojas digitais.
    
    Para cada jogo, forneça:
    1. Nome do jogo em negrito
    2. Uma breve descrição (máximo 20 palavras)
    3. Gêneros principais
    4. Plataforma onde está/esteve disponível (Steam, Epic Games ou ambos)
    5. Uma frase curta explicando por que este jogo combina com as preferências do usuário

    Responda em português, em formato de lista, sendo conciso e direto. 
    Se não souber alguma informação específica, faça uma estimativa razoável sem indicar que está estimando.
  `;

  return getGeminiResponse(prompt);
}

/**
 * Analisa um jogo e fornece insights
 * @param gameDetails Detalhes sobre o jogo
 * @returns Análise do jogo
 */
export async function analyzeGame(gameDetails: string): Promise<string> {
  // Prompt aprimorado para análises mais úteis
  const prompt = `
    Analise este jogo: "${gameDetails}".
    
    Forneça uma análise estruturada com:
    1. Um breve resumo geral (máximo 30 palavras)
    2. Três pontos fortes em tópicos curtos
    3. Um ponto fraco ou cuidado a se tomar
    4. Para qual tipo de jogador este jogo é mais adequado
    5. Tempo estimado para completar o jogo
    6. Uma nota de 1-10, considerando qualidade e valor como jogo gratuito

    Responda em português, em formato fácil de ler com marcadores. 
    Seja conciso, objetivo e enfatize o valor do jogo como uma oferta gratuita.
  `;

  return getGeminiResponse(prompt);
}