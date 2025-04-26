import { memo } from "react";

function Footer() {
  const socialLinks = [
    { 
      icon: "twitter", 
      url: "https://twitter.com/ApenasFloky",
      label: "Twitter de Floky" 
    },
    { 
      icon: "youtube", 
      url: "https://youtube.com/@flokyhd?si=lRMXoK49g1UN3BAN",
      label: "Canal do YouTube de Floky"
    }
    // Discord removido conforme solicitado pelo usuário
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A12] py-6 border-t border-[#1E1E2A] constellation-bg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-5 md:mb-0">
            <div className="flex items-center">
              <img 
                src="/attached_assets/corvo.png"
                alt="Floky Crow"
                className="w-7 h-7 mr-2" 
                loading="lazy"
                width="28"
                height="28"
              />
              <p className="text-white">
                <span className="font-heading font-semibold">FLOKY'S FREE HUNT</span>
              </p>
            </div>
            <p className="text-gray-400 mt-1 text-sm">
              Floky não dorme. Atualizado a cada 60 minutos.
            </p>
          </div>
          
          {/* Doação com gradiente - otimizado */}
          <div className="mb-5 md:mb-0">
            <a
              href="https://livepix.gg/apenasfloky"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-[#00A3FF] to-[#8A2BE2] rounded text-white text-sm hover:opacity-90 transition-opacity shadow-md"
              aria-label="Apoie o projeto Floky's Free Hunt"
            >
              Apoiar Projeto <i className="fas fa-heart ml-1"></i>
            </a>
          </div>
          
          {/* Links sociais - mais leves e com melhores labels de acessibilidade */}
          <div className="flex gap-4 justify-center">
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#151520] text-white p-2 rounded-full hover:bg-gradient-to-r hover:from-[#00A3FF] hover:to-[#8A2BE2] transition-colors shadow-sm"
                aria-label={link.label}
              >
                <i className={`fab fa-${link.icon} text-lg`}></i>
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-[#1E1E2A] text-center text-gray-400 text-xs">
          <p>© {currentYear} Floky's Free Hunt - Desenvolvido por @ApenasFloky</p>
          <p className="mt-1">Nenhuma afiliação com Steam, Epic Games ou outras plataformas.</p>
        </div>
      </div>
    </footer>
  );
}

// Memo para evitar re-renders desnecessários
export default memo(Footer);
