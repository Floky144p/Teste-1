import { useState, useCallback } from "react";
import GameCard from "./GameCard";
import type { Game } from "@shared/schema";

interface GamesListProps {
  games: Game[];
  isLoading: boolean;
  onStoreFilterChange?: (store: "steam" | "epic" | "all") => void;
}

export default function GamesList({ 
  games, 
  isLoading,
  onStoreFilterChange
}: GamesListProps) {
  const [visibleGames, setVisibleGames] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStore, setActiveStore] = useState<"steam" | "epic" | "all">("all");
  
  const loadMoreGames = () => {
    setVisibleGames(prev => Math.min(prev + 6, filteredGames.length));
  };
  
  // Gerenciar mudança de loja
  const handleStoreChange = useCallback((store: "steam" | "epic" | "all") => {
    setActiveStore(store);
    // Resetar o contador de jogos visíveis
    setVisibleGames(6);
    
    if (onStoreFilterChange) {
      onStoreFilterChange(store);
    }
  }, [onStoreFilterChange]);
  
  // Contadores de jogos por loja (para os botões)
  const steamGamesCount = games.filter(game => game.store === "steam").length;
  const epicGamesCount = games.filter(game => game.store === "epic").length;
  
  // Filtra jogos com base na busca e na loja selecionada
  const filteredGames = games.filter(game => {
    // Filtro de termo de busca
    const matchesSearch = searchTerm === "" || 
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.categories.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de loja local (caso não esteja usando o filtro global via prop)
    const matchesStore = !onStoreFilterChange && activeStore !== "all" 
      ? game.store === activeStore 
      : true;
    
    return matchesSearch && matchesStore;
  });
  
  // Mostra esqueletos de carregamento quando estiver carregando
  if (isLoading) {
    return (
      <section className="py-6 px-4 bg-[#0A0A12] constellation-bg">
        <div className="container mx-auto">
          <h2 className="text-2xl text-white font-heading frosted-text mb-6 flex items-center">
            <i className="fas fa-bolt text-[#00A3FF] mr-2 animate-pulse"></i>
            JOGOS QUE VIRARAM GRÁTIS AGORA
            <span className="ml-3 bg-gradient-to-r from-[#00A3FF] to-[#8A2BE2] text-white text-xs px-2 py-1 rounded-sm">NOVO</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-[#0D0D14] rounded border border-[#1E1E2A] h-[400px] animate-pulse carved-border">
                <div className="h-48 w-full bg-[#151520]"></div>
                <div className="p-4 space-y-4">
                  <div className="h-6 bg-[#151520] rounded w-3/4"></div>
                  <div className="h-4 bg-[#151520] rounded w-full"></div>
                  <div className="h-4 bg-[#151520] rounded w-5/6"></div>
                  <div className="flex justify-between pt-4">
                    <div className="h-8 bg-[#151520] rounded w-1/3"></div>
                    <div className="h-8 bg-[#151520] rounded w-1/3"></div>
                  </div>
                  <div className="h-10 bg-gradient-to-r from-[#151520] to-[#1a1a28] rounded w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 px-4 bg-[#0A0A12] constellation-bg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl text-white font-heading frosted-text mb-4 md:mb-0 flex items-center">
            <i className="fas fa-bolt text-[#00A3FF] mr-2"></i>
            JOGOS QUE VIRARAM GRÁTIS AGORA
            <span className="ml-3 bg-gradient-to-r from-[#00A3FF] to-[#8A2BE2] text-white text-xs px-2 py-1 rounded-sm">NOVO</span>
          </h2>
          
          <div className="w-full md:w-1/3">
            <div className="relative carved-border rounded-lg overflow-hidden">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título, categoria, descrição..."
                className="w-full bg-[#0D0D14] py-2 px-4 pl-10 border-transparent focus:outline-none text-gray-300 placeholder-style"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00A3FF]"></i>
            </div>
          </div>
        </div>
        
        {/* Seletores de loja - botões compactos */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => handleStoreChange("all")}
            className={`px-4 py-1.5 rounded-md transition-all ${
              activeStore === "all"
                ? "bg-gradient-to-r from-[#00A3FF] to-[#8A2BE2] text-white shadow-md"
                : "bg-[#12121C] hover:bg-[#1E1E2A] text-gray-300 border border-[#252535]"
            }`}
            aria-label="Mostrar jogos de todas as lojas"
          >
            <i className="fas fa-gamepad mr-1.5"></i>
            Todas as Lojas ({games.length})
          </button>
          
          <button
            onClick={() => handleStoreChange("steam")}
            className={`px-4 py-1.5 rounded-md transition-all ${
              activeStore === "steam"
                ? "bg-gradient-to-r from-[#1b2838] to-[#00A3FF] text-white shadow-md"
                : "bg-[#12121C] hover:bg-[#1E1E2A] text-gray-300 border border-[#252535]"
            }`}
            aria-label="Filtrar jogos da Steam"
          >
            <i className="fab fa-steam mr-1.5"></i>
            Steam ({steamGamesCount})
          </button>
          
          <button
            onClick={() => handleStoreChange("epic")}
            className={`px-4 py-1.5 rounded-md transition-all ${
              activeStore === "epic"
                ? "bg-gradient-to-r from-[#2a2a2a] to-[#8A2BE2] text-white shadow-md"
                : "bg-[#12121C] hover:bg-[#1E1E2A] text-gray-300 border border-[#252535]"
            }`}
            aria-label="Filtrar jogos da Epic Games"
          >
            <i className="fas fa-shopping-bag mr-1.5"></i>
            Epic Games ({epicGamesCount})
          </button>
        </div>
        
        {filteredGames.length === 0 ? (
          <div className="text-center py-10 bg-[#0D0D14] rounded-lg border border-[#1E1E2A] carved-border">
            <i className="fas fa-crow text-5xl text-[#8A2BE2] mb-4 animate-crow-swoop"></i>
            <p className="text-lg text-gray-300">Floky ainda não encontrou jogos gratuitos para esta busca.</p>
            <p className="text-[#00A3FF] mt-2">Tente outros filtros ou volte mais tarde para novas caçadas!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.slice(0, visibleGames).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
            
            {/* Botão para carregar mais jogos com efeito de gradiente - otimizado */}
            {visibleGames < filteredGames.length && (
              <div className="text-center mt-8">
                <button
                  className="px-8 py-2.5 bg-gradient-to-r from-[#00A3FF] to-[#8A2BE2] rounded font-bold text-white hover:opacity-90 transition-opacity shadow-glow"
                  onClick={loadMoreGames}
                >
                  VER MAIS CAÇADAS
                  <i className="fas fa-chevron-down ml-2"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
