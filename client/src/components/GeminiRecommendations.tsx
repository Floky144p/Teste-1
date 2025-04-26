import { useState, useCallback, memo } from 'react';
import { getGameRecommendations } from '../services/geminiService';

const EXAMPLE_PROMPTS = [
  "Gosto de jogos de aventura com mundo aberto e exploração",
  "Me recomende jogos de estratégia e simulação",
  "Estou procurando jogos de terror ou suspense",
  "Quero jogos gratuitos casuais para jogar com amigos",
  "Quais jogos de RPG estão gratuitos no momento?"
];

function GeminiRecommendations() {
  const [preferences, setPreferences] = useState('');
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Função para obter recomendações com debounce
  const handleGetRecommendations = useCallback(async () => {
    if (!preferences.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getGameRecommendations(preferences);
      setRecommendations(response);
    } catch (error) {
      console.error('Erro ao obter recomendações:', error);
      setError('Não foi possível obter recomendações. Tente novamente mais tarde.');
      setRecommendations(null);
    } finally {
      setIsLoading(false);
    }
  }, [preferences]);
  
  // Manipular evento de tecla Enter
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && preferences.trim()) {
      e.preventDefault();
      handleGetRecommendations();
    }
  }, [handleGetRecommendations, preferences]);
  
  // Usar prompt de exemplo
  const useExamplePrompt = useCallback((example: string) => {
    setPreferences(example);
  }, []);
  
  return (
    <section className="py-10 px-4 bg-[#0D0D14]">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-heading font-semibold mb-2">
            <i className="fas fa-robot text-[#00A3FF] mr-2"></i>
            <span className="text-white">Assistente </span>
            <span className="text-[#8A2BE2]">Gemini</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Use inteligência artificial para encontrar jogos gratuitos baseados em suas preferências
          </p>
        </div>
        
        <div className="bg-[#18181B] p-5 rounded-lg shadow-md border border-[#252535]">
          {/* Exemplos de prompts rápidos */}
          <div className="mb-4 overflow-x-auto pb-2">
            <div className="flex gap-2 flex-nowrap">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => useExamplePrompt(example)}
                  className="px-3 py-1.5 bg-[#252535] hover:bg-[#303045] text-gray-300 rounded-md text-xs whitespace-nowrap transition-colors"
                >
                  {example.length > 30 ? example.substring(0, 30) + '...' : example}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="preferences" className="block text-sm font-medium text-gray-300">
                O que você procura em jogos?
              </label>
              <span className="text-xs text-gray-500">
                {preferences.length}/200 caracteres
              </span>
            </div>
            <textarea
              id="preferences"
              rows={2}
              value={preferences}
              onChange={(e) => setPreferences(e.target.value.slice(0, 200))}
              onKeyDown={handleKeyDown}
              placeholder="Ex: Jogos de ação com elementos de RPG..."
              className="w-full bg-[#222228] text-white rounded-md border border-[#333] p-3 placeholder-gray-500 focus:border-[#00A3FF] focus:ring-1 focus:ring-[#00A3FF] focus:outline-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Pressione Enter para enviar ou use os exemplos acima
            </p>
          </div>
          
          <div className="text-right">
            <button
              onClick={handleGetRecommendations}
              disabled={isLoading || !preferences.trim()}
              className={`px-4 py-2 rounded-md text-sm ${
                isLoading || !preferences.trim()
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#00A3FF] to-[#8A2BE2] text-white hover:opacity-90 transition-opacity shadow-sm'
              }`}
              aria-label="Obter recomendações de jogos"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Consultando...
                </>
              ) : (
                <>
                  <i className="fas fa-gamepad mr-2"></i>
                  Recomendar Jogos
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 rounded-md border border-red-800 text-gray-300 text-sm">
              <h3 className="font-medium text-white mb-1">Erro:</h3>
              <p>{error}</p>
            </div>
          )}
          
          {recommendations && (
            <div className="mt-4 bg-[#222228] rounded-md border border-[#333] overflow-hidden">
              <div className="bg-gradient-to-r from-[#252535] to-[#303045] px-4 py-2 border-b border-[#333]">
                <h3 className="text-md font-medium text-white flex items-center">
                  <i className="fas fa-crown text-[#00A3FF] mr-2"></i>
                  Recomendações para você
                </h3>
              </div>
              <div className="p-4 text-gray-200 text-sm">
                <div 
                  className="prose prose-sm prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: recommendations.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Memo para evitar re-renders desnecessários
export default memo(GeminiRecommendations);