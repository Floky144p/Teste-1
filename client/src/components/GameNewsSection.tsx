import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock news data em português para o Brasil
const GAME_NEWS = [
  {
    id: 1,
    title: "Epic Games Store anuncia novos jogos gratuitos toda semana",
    category: "Notícia",
    date: "25 de Abril, 2025",
    content: "A Epic Games Store reafirmou seu compromisso de oferecer jogos gratuitos toda semana para os gamers. Esta estratégia, que começou em 2019, já disponibilizou centenas de jogos sem custo para os usuários. A loja digital continua a expandir seu catálogo e a oferecer títulos de alta qualidade gratuitamente.",
    source: "Epic Games Blog",
    imageUrl: "https://cdn2.unrealengine.com/updates-social-share-1920x1080-1920x1080-7eacd49a84c5.jpg"
  },
  {
    id: 2,
    title: "Steam bate recorde de usuários simultâneos",
    category: "Estatística",
    date: "20 de Abril, 2025",
    content: "A plataforma Steam quebrou mais um recorde de usuários simultâneos este mês, com mais de 35 milhões de jogadores online ao mesmo tempo. Este número representa um crescimento significativo em relação ao ano anterior e demonstra a força contínua da plataforma no mercado de jogos para PC.",
    source: "SteamDB",
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1938090/ss_734836764602c7f75c9a8a4b28ab8642e2eae244.1920x1080.jpg"
  },
  {
    id: 3,
    title: "Promoções relâmpago são cada vez mais comuns nas plataformas digitais",
    category: "Análise",
    date: "18 de Abril, 2025",
    content: "As lojas digitais de jogos têm aumentado a frequência de promoções relâmpago, onde títulos premium ficam disponíveis gratuitamente por períodos limitados. Esta estratégia tem sido eficaz para atrair novos usuários às plataformas e aumentar o engajamento dos jogadores existentes. Especialistas do setor preveem que esta tendência continuará crescendo nos próximos anos.",
    source: "GamesIndustry.biz",
    imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1190170/ss_0360f7a38feee31637450231be5395fbe98d2d4d.1920x1080.jpg"
  },
  {
    id: 4,
    title: "Indie games dominam as ofertas gratuitas de Abril",
    category: "Tendência",
    date: "12 de Abril, 2025",
    content: "Os jogos independentes têm dominado as ofertas gratuitas nas principais plataformas durante o mês de abril. Títulos criativos e inovadores de estúdios pequenos estão recebendo destaque, oferecendo aos jogadores experiências únicas sem custo. Esta tendência ajuda a promover desenvolvedores menores e diversificar o mercado de jogos.",
    source: "IndieGameMag",
    imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/588650/ss_6ad6503ae3e9e9e017a25bc1ba5d1bc24ef05a19.1920x1080.jpg"
  },
  {
    id: 5,
    title: "Como as promoções gratuitas afetam os desenvolvedores de jogos",
    category: "Análise",
    date: "5 de Abril, 2025",
    content: "Um estudo recente analisou o impacto das promoções gratuitas nos desenvolvedores de jogos. Contrariamente à crença popular, muitos estúdios relatam benefícios significativos quando seus jogos são oferecidos sem custo por períodos limitados. O aumento na base de jogadores frequentemente leva a mais compras de DLCs, sequências e outros títulos do mesmo estúdio.",
    source: "GameDeveloper.com",
    imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/678960/ss_a21474a5ba75c060ac7ab492d18353a7e2f1f8a3.1920x1080.jpg"
  }
];

export default function GameNewsSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedNewsId, setExpandedNewsId] = useState<number | null>(null);

  const filteredNews = activeTab === "all" 
    ? GAME_NEWS 
    : GAME_NEWS.filter(news => news.category.toLowerCase() === activeTab.toLowerCase());

  const toggleExpand = (id: number) => {
    setExpandedNewsId(expandedNewsId === id ? null : id);
  };

  return (
    <section className="py-12 px-4 md:px-6 constellation-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-10">
          <h2 className="font-medieval text-3xl md:text-4xl mb-3 frosted-text">Notícias do Mundo dos Games</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Acompanhe as últimas notícias e tendências sobre jogos gratuitos e promoções relâmpago.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-6">
            <TabsList className="bg-[#151515] carved-border">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00A3FF] data-[state=active]:to-[#8A2BE2] data-[state=active]:text-white">
                Todas
              </TabsTrigger>
              <TabsTrigger value="notícia" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00A3FF] data-[state=active]:to-[#8A2BE2] data-[state=active]:text-white">
                Notícias
              </TabsTrigger>
              <TabsTrigger value="análise" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00A3FF] data-[state=active]:to-[#8A2BE2] data-[state=active]:text-white">
                Análises
              </TabsTrigger>
              <TabsTrigger value="tendência" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00A3FF] data-[state=active]:to-[#8A2BE2] data-[state=active]:text-white">
                Tendências
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((news) => (
                <motion.div 
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-[#151515] carved-border h-full flex flex-col overflow-hidden border-none">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={news.imageUrl} 
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-[#8A2BE2] px-2 py-1 rounded text-xs font-medium">
                        {news.category}
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className="text-sm text-gray-400 mb-1">{news.date}</div>
                      <CardTitle className="font-medieval text-xl">{news.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      <CardDescription className="text-gray-300">
                        {expandedNewsId === news.id 
                          ? news.content 
                          : `${news.content.substring(0, 120)}...`}
                      </CardDescription>
                    </CardContent>
                    
                    <CardFooter className="pt-0 flex justify-between items-center">
                      <span className="text-xs text-[#00A3FF]">Fonte: {news.source}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs hover:text-[#00A3FF]"
                        onClick={() => toggleExpand(news.id)}
                      >
                        {expandedNewsId === news.id ? "Ler menos" : "Ler mais"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}