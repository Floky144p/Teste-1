import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import GamesList from "@/components/GamesList";
import Footer from "@/components/Footer";
import GeminiRecommendations from "@/components/GeminiRecommendations";
import { useToast } from "@/hooks/use-toast";
import { useGames } from "@/hooks/useGames";
import type { Stats } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    onlyAAA: false,
    lessThan24h: false,
    recommended: false,
    store: "all" as "steam" | "epic" | "all",
    searchTerm: ""
  });
  
  // Usar o custom hook para buscar jogos com filtros
  const { games, isLoading, error } = useGames({
    onlyAAA: filters.onlyAAA,
    lessThan24h: filters.lessThan24h,
    recommended: filters.recommended,
    store: filters.store,
    searchTerm: filters.searchTerm
  });
  
  // Buscar estatísticas do site
  const { data: stats } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  // Handler para atualizar filtros do HeroSection
  const handleFilterChange = useCallback((newFilters: {
    onlyAAA?: boolean;
    lessThan24h?: boolean;
    recommended?: boolean;
  }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Handler para busca via Header
  const handleSearch = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, []);
  
  // Handler para filtro de loja
  const handleStoreFilterChange = useCallback((store: "steam" | "epic" | "all") => {
    setFilters(prev => ({ ...prev, store }));
  }, []);

  // Mostrar erro se os jogos não puderem ser buscados
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar jogos",
        description: "Não foi possível buscar os jogos gratuitos. Tente novamente mais tarde."
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen bg-[#121212]">
      <div id="top" className="scroll-mt-16"></div>
      <Header onSearch={handleSearch} />
      <HeroSection 
        stats={stats} 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <GamesList 
        games={games || []} 
        isLoading={isLoading} 
        onStoreFilterChange={handleStoreFilterChange}
      />
      <GeminiRecommendations />
      <Footer />
      
      {/* Botão flutuante - otimizado */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="#top" 
          className="bg-[#0D0D14]/80 p-2 rounded-full shadow-lg border border-[#1E1E2A] hover:bg-[#00A3FF]/20 transition-colors"
          aria-label="Voltar ao topo"
        >
          <i className="fas fa-arrow-up text-[#00A3FF] text-sm"></i>
        </a>
      </div>
    </div>
  );
}
