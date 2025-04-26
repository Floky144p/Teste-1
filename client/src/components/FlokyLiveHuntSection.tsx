import { motion } from "framer-motion";
import type { Stats } from "@shared/schema";

interface FlokyLiveHuntSectionProps {
  stats?: Stats;
}

export default function FlokyLiveHuntSection({ stats }: FlokyLiveHuntSectionProps) {
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#0A0A12] to-[#2D0A3A] constellation-bg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 mb-8 md:mb-0"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-komoda text-3xl mb-4 frosted-text">
              <span className="text-[#8A2BE2]">FLOKY</span> SCOUT
            </h3>
            <p className="text-xl mb-6 text-gray-300">
              Nosso sistema de IA varre as lojas de hora em hora para identificar promoções relâmpago.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-[#00A3FF] mt-1 mr-3"></i>
                <span>Varre a Steam e Epic Games a cada 60 minutos</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-[#00A3FF] mt-1 mr-3"></i>
                <span>Verifica se o jogo já foi gratuito antes (evita repetições)</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-[#00A3FF] mt-1 mr-3"></i>
                <span>Alerta imediatamente quando jogos AAA viram gratuitos</span>
              </li>
            </ul>
            
            {/* Alert Button - Changed from Discord */}
            <motion.a 
              href="#" 
              className="mt-8 inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00A3FF] to-[#8A2BE2] rounded-lg font-medium hover:brightness-110 transition"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #00A3FF" }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-bell mr-2 text-xl"></i>
              Ativar Alertas via Navegador
            </motion.a>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 md:pl-10"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="carved-border rounded-lg p-6 bg-[#151515] relative overflow-hidden">
              {/* Background Runes */}
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="pattern-runes" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    {/* Simplified Rune Shapes */}
                    <path d="M5,2 L5,18 M2,5 L18,5 M2,15 L18,15" stroke="#8A2BE2" strokeWidth="1" fill="none"/>
                    <path d="M15,2 L10,18 L5,2" stroke="#00A3FF" strokeWidth="1" fill="none"/>
                  </pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-runes)" />
                </svg>
              </div>
              
              {/* Live Hunt Stats */}
              <h4 className="font-komoda text-2xl mb-4 frosted-text relative z-10">
                ESTATÍSTICAS DA CAÇADA
              </h4>
              
              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="bg-[#1A1A1A] p-4 rounded-lg text-center">
                  <p className="text-[#00A3FF] text-3xl font-bold">{stats?.totalGamesHunted || 237}</p>
                  <p className="text-gray-400">Jogos caçados este mês</p>
                </div>
                <div className="bg-[#1A1A1A] p-4 rounded-lg text-center">
                  <p className="text-[#8A2BE2] text-3xl font-bold">R$ {stats?.totalValueSaved || 12490}</p>
                  <p className="text-gray-400">Valor economizado em jogos</p>
                </div>
                <div className="bg-[#1A1A1A] p-4 rounded-lg text-center">
                  <p className="text-[#00A3FF] text-3xl font-bold">{stats?.aaaGamesHunted || 22}</p>
                  <p className="text-gray-400">Jogos AAA caçados</p>
                </div>
                <div className="bg-[#1A1A1A] p-4 rounded-lg text-center">
                  <p className="text-[#8A2BE2] text-3xl font-bold">{stats?.averageAlertTimeMinutes || 24}min</p>
                  <p className="text-gray-400">Tempo médio de alerta</p>
                </div>
              </div>
              
              {/* Last Successful Hunt */}
              <div className="bg-[#151515] p-4 rounded-lg relative z-10 border border-[#00A3FF] shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium flex items-center">
                    <i className="fas fa-trophy text-[#00A3FF] mr-2"></i>
                    Última Caçada Bem-Sucedida
                  </h5>
                  <span className="text-xs text-gray-400 bg-[#1A1A1A] px-2 py-1 rounded-full">Há 14 minutos</span>
                </div>
                <p className="text-[#00A3FF] mb-1 font-komoda text-lg">Control Ultimate Edition</p>
                <p className="text-sm text-gray-400">
                  <span className="line-through">R$ 129,90</span> 
                  <i className="fas fa-arrow-right mx-2"></i> 
                  <span className="text-[#00A3FF] font-bold">GRÁTIS</span> 
                  <span className="bg-[#151515] text-xs ml-2 px-2 py-1 rounded border border-[#8A2BE2]">Epic Games</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
