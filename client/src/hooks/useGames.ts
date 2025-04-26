import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";

interface UseGamesOptions {
  onlyAAA?: boolean;
  lessThan24h?: boolean;
  recommended?: boolean;
  store?: "steam" | "epic" | "all";
  searchTerm?: string;
}

export function useGames(options: UseGamesOptions = {}) {
  const { 
    onlyAAA = false, 
    lessThan24h = false, 
    recommended = false, 
    store = "all",
    searchTerm = "" 
  } = options;
  
  // Fetch games from the API
  const { data: allGames, ...queryResults } = useQuery<Game[]>({
    queryKey: [store === "all" ? '/api/games' : `/api/games/store/${store}`],
  });
  
  // Filter the games based on options
  const games = allGames?.filter(game => {
    let include = true;
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = game.title.toLowerCase().includes(searchLower) ||
                           game.description.toLowerCase().includes(searchLower) ||
                           game.categories.toLowerCase().includes(searchLower);
      include = include && matchesSearch;
    }
    
    // Filter AAA games (based on price)
    if (onlyAAA) {
      const price = parseInt(game.originalPrice.replace(/\D/g, '')) || 0;
      include = include && price >= 100;
    }
    
    // Filter games about to expire (less than 24 hours)
    if (lessThan24h) {
      const endTime = new Date(game.endTime);
      const now = new Date();
      const remainingTimeMs = endTime.getTime() - now.getTime();
      include = include && remainingTimeMs > 0 && remainingTimeMs < 24 * 60 * 60 * 1000;
    }
    
    // Filter recommended games (based on hot flag)
    if (recommended) {
      // Handle the case when isHot might be undefined or null
      const isHotGame = typeof game.isHot === 'boolean' ? game.isHot : false;
      include = include && isHotGame;
    }
    
    return include;
  });
  
  return {
    games,
    ...queryResults
  };
}
