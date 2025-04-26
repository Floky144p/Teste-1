import { useCallback } from "react";
import type { Stats } from "@shared/schema";

interface HeroSectionProps {
  stats?: Stats;
  filters?: {
    onlyAAA: boolean;
    lessThan24h: boolean;
    recommended: boolean;
  };
  onFilterChange?: (newFilters: {
    onlyAAA?: boolean;
    lessThan24h?: boolean;
    recommended?: boolean;
  }) => void;
}

export default function HeroSection({ 
  stats, 
  filters = { onlyAAA: false, lessThan24h: false, recommended: false },
  onFilterChange 
}: HeroSectionProps) {
  
  const toggleFilter = useCallback((filter: keyof typeof filters) => {
    if (onFilterChange) {
      const newValue = !filters[filter];
      onFilterChange({ [filter]: newValue });
    }
  }, [filters, onFilterChange]);

  return (
    <section className="py-12 bg-gradient-to-b from-[#0D0D14] to-[#0A0A12] constellation-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* Logos das lojas com efeito de hover - otimizadas */}
          <div className="flex justify-center space-x-8 mb-10">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-[#00A3FF]/30 transition-all duration-300 hover:scale-110">
              <img 
                src="/attached_assets/Steam_icon_logo.svg.png"
                alt="Steam"
                className="w-8 h-8"
                loading="lazy"
                width="32"
                height="32"
              />
            </div>
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-[#8A2BE2]/30 transition-all duration-300 hover:scale-110">
              <img 
                src="/attached_assets/EpicGames.png"
                alt="Epic Games"
                className="w-8 h-8"
                loading="lazy"
                width="32"
                height="32"
              />
            </div>
          </div>
          
          {/* Título principal com efeito de texto */}
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 frosted-text">
            <span className="text-white">Jogos de </span>
            <span className="text-[#00A3FF]">R$300+</span>
            <span className="text-white"> GRÁTIS?</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl mb-4">
            <span className="text-[#8A2BE2] font-heading frosted-text">Floky</span> 
            <span className="text-white"> caça para você.</span>
          </h2>
          
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Somente jogos que eram <span className="line-through decoration-[#8A2BE2]">PAGOS</span> e viraram <span className="text-[#00A3FF] font-bold">GRÁTIS</span> por tempo limitado
          </p>
          
          {/* Stats com efeito de borda */}
          <div className="inline-block px-6 py-3 rounded carved-border mb-10">
            <i className="fas fa-gamepad text-[#00A3FF] mr-2"></i>
            Hoje Floky caçou <span className="text-[#00A3FF] font-bold">{stats?.totalGamesHunted || 237} jogos</span> de <span className="text-[#8A2BE2] font-bold">R${stats?.totalValueSaved || 12580}+</span> grátis!
          </div>
        </div>
        
        {/* Filtros com efeito de hover e gradiente */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6">
          <button
            className={`px-5 py-2 rounded-full border transition-all ${
              filters.onlyAAA 
                ? 'bg-gradient-to-r from-[#00A3FF] to-[#0091e6] text-white border-transparent shadow-lg' 
                : 'bg-[#0D0D14] text-white border-[#1E1E2A] hover:border-[#00A3FF]'
            }`}
            onClick={() => toggleFilter('onlyAAA')}
          >
            <i className="fas fa-trophy mr-2"></i>Só AAA
          </button>
          
          <button
            className={`px-5 py-2 rounded-full border transition-all ${
              filters.lessThan24h 
                ? 'bg-gradient-to-r from-[#8A2BE2] to-[#7526c0] text-white border-transparent shadow-lg' 
                : 'bg-[#0D0D14] text-white border-[#1E1E2A] hover:border-[#8A2BE2]'
            }`}
            onClick={() => toggleFilter('lessThan24h')}
          >
            <i className="fas fa-hourglass-half mr-2"></i>Expira em Breve
          </button>
          
          <button
            className={`px-5 py-2 rounded-full border transition-all ${
              filters.recommended 
                ? 'bg-gradient-to-r from-[#00A3FF] to-[#8A2BE2] text-white border-transparent shadow-lg' 
                : 'bg-[#0D0D14] text-white border-[#1E1E2A] hover:border-[#00A3FF]'
            }`}
            onClick={() => toggleFilter('recommended')}
          >
            <i className="fas fa-thumbs-up mr-2"></i>Recomendados pela Matilha
          </button>
        </div>
      </div>
    </section>
  );
}
