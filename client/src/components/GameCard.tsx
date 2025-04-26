import { useState, useMemo } from "react";
import type { Game } from "@shared/schema";
import ImgWithFallback from "./ImgWithFallback";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  // Usar fallback nativo para Store icons
  const storeIcon = game.store === "steam" 
    ? "/attached_assets/Steam_icon_logo.svg.png" 
    : "/attached_assets/EpicGames.png";

  // Calculate time remaining - memoize para evitar re-cálculos
  const timeInfo = useMemo(() => {
    const now = new Date();
    const endTime = new Date(game.endTime);
    const timeLeft = endTime.getTime() - now.getTime();
    
    const isExpired = timeLeft <= 0;
    const isAboutToExpire = timeLeft > 0 && timeLeft < 1000 * 60 * 60 * 24; // menos de 24h
    
    // Format time remaining
    let formattedTime = "EXPIRADO";
    if (timeLeft > 0) {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      formattedTime = `${hours}h ${minutes.toString().padStart(2, '0')}min`;
    }
    
    return { timeLeft, isExpired, isAboutToExpire, formattedTime };
  }, [game.endTime]);
  
  // Verificar se o jogo está gratuito
  const isFree = true; // No ambiente real, isso vem do servidor

  return (
    <div className="bg-game-card overflow-hidden border border-[#1E1E2A] rounded-lg transition-all hover:translate-y-[-2px] hover:shadow-lg carved-border">
      <div className="relative">
        {/* Game Image - com componente de fallback otimizado */}
        <ImgWithFallback
          src={game.imageUrl}
          fallbackSrc="/attached_assets/14730212-de-icone-plano-simples-de-corvo-vetor.jpg"
          alt={game.title}
          className="w-full h-48 object-cover transition-transform hover:scale-105"
        />
        
        {/* Hot Badge - só renderiza se for hot */}
        {game.isHot && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-red-800 px-2 py-1 rounded text-xs font-bold shadow-md text-white">
            HOT
          </div>
        )}

        {/* Store Badge - loja */}
        <div className="absolute top-2 right-2 bg-black/70 p-1 rounded shadow-md backdrop-blur-sm">
          <img 
            src={storeIcon}
            className="w-5 h-5" 
            alt={game.store}
            loading="lazy"
            width="20"
            height="20"
          />
        </div>
      </div>
      
      <div className="p-4 bg-[#0D0D14]">
        <h3 className="font-heading text-lg font-semibold text-white mb-1 line-clamp-1">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{game.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          {/* Price Section */}
          <div>
            <span className="text-sm text-gray-400 line-through">{game.originalPrice}</span>
            {isFree ? (
              <span className="text-[#00A3FF] font-bold ml-2">GRÁTIS</span>
            ) : (
              <span className="text-red-500 font-bold ml-2">EXPIRADO</span>
            )}
          </div>
          
          {/* Timer com degradê */}
          {timeInfo.isExpired ? (
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-2 py-1 rounded font-bold">
              EXPIRADO
            </div>
          ) : timeInfo.isAboutToExpire ? (
            <div className="flex items-center text-xs text-white bg-gradient-to-r from-yellow-500 to-red-500 px-2 py-1 rounded font-bold">
              <i className="fas fa-hourglass-half mr-1"></i>
              {timeInfo.formattedTime}
            </div>
          ) : (
            <div className="flex items-center text-xs text-[#00A3FF]">
              <i className="fas fa-clock mr-1"></i>
              {timeInfo.formattedTime}
            </div>
          )}
        </div>
        
        {/* Action Button - botão de ação */}
        <a 
          href={game.storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full py-2 text-center rounded font-bold ${
            timeInfo.isExpired || !isFree
              ? 'bg-gray-600 text-gray-300 pointer-events-none' 
              : 'bg-gradient-to-r from-[#00A3FF] to-[#8A2BE2] text-white hover:opacity-90 transition-opacity'
          }`}
          aria-disabled={timeInfo.isExpired || !isFree}
        >
          {timeInfo.isExpired ? 'PROMOÇÃO ENCERRADA' : !isFree ? 'NÃO DISPONÍVEL' : 'PEGAR AGORA'}
        </a>
      </div>
    </div>
  );
}
