import { useState, useCallback } from "react";

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
    }
  }, [searchTerm, onSearch]);

  return (
    <header className="w-full bg-[#0D0D14] p-4 sticky top-0 z-50 shadow-lg constellation-bg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo com efeito de animação */}
          <div className="animate-crow-swoop">
            <img 
              src="/attached_assets/corvo.png"
              alt="Floky Logo" 
              className="w-8 h-8 mr-3 hover:scale-110 transition-transform" 
              loading="eager" // Carregamento prioritário para o logo
            />
          </div>
          <h1 className="text-2xl font-heading">
            <span className="text-[#00A3FF] font-semibold frosted-text">Floky's</span>{" "}
            <span className="text-white">Free</span>{" "}
            <span className="text-[#8A2BE2] font-semibold frosted-text">Hunt</span>
          </h1>
        </div>
        
        {/* Search Bar com bordas gradiente - otimizado */}
        <form onSubmit={handleSearchSubmit} className="w-1/2 relative max-w-md">
          <div className="relative carved-border rounded-lg overflow-hidden">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange} 
              className="w-full bg-[#0D0D14] py-2 px-4 pl-10 pr-4 rounded-lg border-transparent focus:outline-none text-gray-300 placeholder-style transition-colors" 
              placeholder="Caçar jogos..."
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00A3FF]"></i>
          </div>
        </form>
      </div>
    </header>
  );
}
