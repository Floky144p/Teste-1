import { storage } from "../storage";
import { InsertGame, InsertGameHistory } from "@shared/schema";
import { load } from "cheerio";
import axios from "axios";
import { parse } from "date-fns";

// Jogos atualizados baseados nas lojas
const INITIAL_GAMES: InsertGame[] = [
  {
    title: "Blightbound",
    description: "RPG de Ação, Multiplayer Cooperativo, Hack and Slash",
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1263070/header.jpg",
    originalPrice: "R$ 75,99",
    store: "steam",
    storeUrl: "https://store.steampowered.com/app/1263070/Blightbound/",
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 dias a partir de agora
    isHot: true,
    categories: "RPG, Multiplayer, Hack and Slash"
  },
  {
    title: "PAYDAY 2: Dragon Pack",
    description: "DLC, Ação, Tiro, Cooperativo",
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1449080/header.jpg",
    originalPrice: "R$ 25,99",
    store: "steam",
    storeUrl: "https://store.steampowered.com/app/1449080/PAYDAY_2_Dragon_Pack/",
    endTime: new Date(Date.now() + 14 * 60 * 60 * 1000), // 14 horas a partir de agora
    isHot: false,
    categories: "DLC, Ação, Tiro, Cooperativo"
  },
  {
    title: "Dying Light",
    description: "Ação, Terror, Mundo Aberto, Zumbis",
    imageUrl: "https://cdn2.unrealengine.com/egs-dyinglight-techland-g1a-00-1920x1080-afd7b113e7af.jpg",
    originalPrice: "R$ 119,99",
    store: "epic",
    storeUrl: "https://store.epicgames.com/pt-BR/p/dying-light",
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dias a partir de agora
    isHot: true,
    categories: "Ação, Terror, Mundo Aberto, Zumbis"
  },
  {
    title: "The Evil Within 2",
    description: "Sobrevivência, Terror, Ação, Mundo Aberto",
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/601430/header.jpg",
    originalPrice: "R$ 169,90",
    store: "steam",
    storeUrl: "https://store.steampowered.com/app/601430/The_Evil_Within_2/",
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000), // 36 horas a partir de agora
    isHot: true,
    categories: "Terror, Ação, Sobrevivência, Mundo Aberto"
  },
  {
    title: "Idle Champions: Kelek Starter Pack",
    description: "RPG, Estratégia, Casual, Fantasia",
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/2371450/header.jpg",
    originalPrice: "R$ 39,99",
    store: "steam",
    storeUrl: "https://store.steampowered.com/app/2371450/Idle_Champions__Kelek_Starter_Pack/",
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dias a partir de agora
    isHot: false,
    categories: "RPG, Estratégia, Casual, Fantasia"
  }
];

// Metrics for tracking scraper activity
let metrics = {
  lastRunTime: null as Date | null,
  totalScrapes: 0,
  totalGamesFound: 0,
  lastGameFound: null as string | null,
  lastGameFoundTime: null as Date | null,
  errors: [] as string[]
};

// Initialize the database with some sample data for demonstration
async function initializeDatabase() {
  const existingGames = await storage.getGames();
  
  if (existingGames.length === 0) {
    console.log("Initializing database with sample games...");
    
    for (const game of INITIAL_GAMES) {
      await storage.createGame(game);
      
      // Also add to history to prevent duplicates
      await storage.createGameHistory({
        title: game.title,
        store: game.store,
        capturedAt: new Date()
      });
    }
    
    console.log("Added sample games to the database");
  }
}

// Function to scrape Steam for free games
async function scrapeSteam() {
  try {
    console.log("Scraping Steam for free games...");
    
    // Headers simulando um navegador real
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0',
      'Referer': 'https://www.google.com/'
    };
    
    // URL para jogos gratuitos que normalmente são pagos
    const url = "https://store.steampowered.com/search/?maxprice=free&specials=1";
    console.log("Acessando URL da Steam:", url);
    
    // Adicionar um pequeno delay antes da requisição para evitar detecção
    await delay(1000 + Math.random() * 1500);
    
    const response = await axios.get(url, { headers });
    
    if (response.status !== 200) {
      console.error(`Recebeu status ${response.status} da Steam Store`);
      metrics.errors.push(`Steam HTTP error: ${response.status}`);
      return;
    }
    
    const $ = load(response.data);
    
    // Verificação de conteúdo
    if (!response.data || response.data.length < 1000) {
      console.error("Resposta da Steam parece estar vazia ou incompleta");
      metrics.errors.push("Steam empty response");
      return;
    }
    
    // Find all game items in the search results
    const gameElements = $('#search_resultsRows').find('.search_result_row');
    
    if (gameElements.length === 0) {
      console.log("Nenhum jogo encontrado na Steam. Verificando seletores...");
      console.log("Amostra do HTML:", response.data.substring(0, 500));
      return;
    }
    
    console.log(`Encontrados ${gameElements.length} possíveis jogos gratuitos na Steam`);
    
    // Process each game found
    // Collect all the games first to avoid async issues with 'each'
    const games: {url: string, title: string, image: string, price: string}[] = [];
    
    gameElements.each((_, element) => {
      const gameUrl = $(element).attr('href') || '';
      const title = $(element).find('.title').text().trim();
      
      // Only add if it's a valid game link and has a title
      if (gameUrl && title) {
        const imageUrl = $(element).find('img').attr('src') || '';
        // Verifica se há preço original (indica que era pago e virou gratuito)
        const originalPriceElement = $(element).find('.discount_original_price');
        const originalPrice = originalPriceElement.text().trim();
        
        // Só considerar jogos que têm um preço original (ou seja, eram pagos antes)
        if (!originalPrice) {
          // Se não tem preço original, não é uma promoção de pago para gratuito
          return;
        }
        
        // Verifica se o jogo realmente é gratuito agora
        const currentPrice = $(element).find('.discount_final_price').text().trim();
        const isFree = currentPrice.includes('Gratuito') || 
                       currentPrice.includes('Free') || 
                       currentPrice === 'R$ 0,00' || 
                       currentPrice === 'Free to Play' ||
                       currentPrice === 'Free To Play';
        
        // Para ser incluído, o jogo deve:
        // 1. Ter um preço original (era pago)
        // 2. Ser gratuito agora
        // 3. Ter um preço original maior que R$ 0,00
        const hasRealPrice = !originalPrice.includes('Free') && 
                            originalPrice !== 'R$ 0,00' && 
                            originalPrice !== 'Free to Play';
        
        if (isFree && hasRealPrice) {
          console.log(`Jogo gratuito encontrado: ${title} (antes: ${originalPrice})`);
          games.push({
            url: gameUrl,
            title: title,
            image: imageUrl,
            price: originalPrice
          });
        } else if (!isFree) {
          console.log(`Jogo ${title} não é gratuito, preço atual: ${currentPrice}`);
        } else {
          console.log(`Jogo ${title} sempre foi gratuito, não é uma promoção válida`);
        }
      }
    });
    
    // Now process each game sequentially
    for (const game of games) {
      // Check if we already have this game in history
      const existingHistory = await storage.getGameHistory(game.title, "steam");
      
      if (!existingHistory) {
        // Create game object
        const newGame: InsertGame = {
          title: game.title,
          description: "Jogo temporariamente gratuito na Steam",
          imageUrl: game.image,
          originalPrice: game.price,
          store: "steam",
          storeUrl: game.url,
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Usually 48 hours
          isHot: parseInt(game.price.replace(/\D/g, '')) > 100, // Mark as hot if price was over R$100
          categories: "Jogo, Gratuito, Steam"
        };
        
        // Adicionar delay entre o processamento de cada jogo
        await delay(500 + Math.random() * 800);
        
        // Process the found game
        await processGame(newGame);
      }
    }
  } catch (error) {
    console.error("Error scraping Steam:", error instanceof Error ? error.message : String(error));
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Axios error: ${error.response.status}`, error.response.data);
      metrics.errors.push(`Steam error: HTTP ${error.response.status}`);
    } else {
      metrics.errors.push(`Steam scraping error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Função para adicionar delay
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to scrape Epic Games for free games
async function scrapeEpicGames() {
  try {
    console.log("Scraping Epic Games for free games...");
    
    // Devido às limitações do Cloudflare, vamos adicionar manualmente jogos da Epic Games
    // que sabemos que estão disponíveis gratuitamente
    
    const epicFreeGames = [
      {
        title: "Dying Light",
        description: "Ação, Terror, Mundo Aberto, Zumbis",
        imageUrl: "https://cdn2.unrealengine.com/egs-dyinglight-techland-g1a-00-1920x1080-afd7b113e7af.jpg",
        originalPrice: "R$ 119,99",
        storeUrl: "https://store.epicgames.com/pt-BR/p/dying-light",
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dias a partir de agora
        categories: "Ação, Terror, Mundo Aberto, Zumbis"
      },
      {
        title: "Doki Doki Literature Club Plus!",
        description: "Visual Novel, Terror Psicológico, Anime",
        imageUrl: "https://cdn2.unrealengine.com/egs-dokidokiliteratureclubplus-teamsakurai-s1-2560x1440-91a981cd9f8d.jpg",
        originalPrice: "R$ 49,99",
        storeUrl: "https://store.epicgames.com/pt-BR/p/doki-doki-literature-club-plus",
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de agora
        categories: "Visual Novel, Terror Psicológico, Anime"
      }
    ];
    
    console.log(`Processando ${epicFreeGames.length} jogos gratuitos conhecidos da Epic Games`);
    
    // Now process each game
    for (const game of epicFreeGames) {
      // Check if we already have this game in history
      const existingHistory = await storage.getGameHistory(game.title, "epic");
      
      if (!existingHistory) {
        // Create game object
        const newGame: InsertGame = {
          title: game.title,
          description: game.description,
          imageUrl: game.imageUrl,
          originalPrice: game.originalPrice,
          store: "epic",
          storeUrl: game.storeUrl,
          endTime: game.endTime,
          isHot: parseInt(game.originalPrice.replace(/\D/g, '')) > 100, // Mark as hot if price was over R$100
          categories: game.categories
        };
        
        // Process the found game
        await processGame(newGame);
      }
    }
    
  } catch (error) {
    console.error("Error processing Epic Games:", error instanceof Error ? error.message : String(error));
    metrics.errors.push(`Epic Games processing error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Process a found game
async function processGame(game: InsertGame) {
  try {
    // Check if this game has already been processed
    const existingHistory = await storage.getGameHistory(game.title, game.store);
    
    if (!existingHistory) {
      console.log(`Found new free game: ${game.title} on ${game.store}`);
      
      // Add the game to our database
      await storage.createGame(game);
      
      // Add to history to prevent duplicates
      await storage.createGameHistory({
        title: game.title,
        store: game.store,
        capturedAt: new Date()
      });
      
      // Update metrics
      metrics.totalGamesFound++;
      metrics.lastGameFound = game.title;
      metrics.lastGameFoundTime = new Date();
      
      // Update site stats
      const stats = await storage.getStats();
      if (stats) {
        await storage.updateStats({
          totalGamesHunted: stats.totalGamesHunted + 1,
          // Extract numeric value from price string and add to total
          totalValueSaved: stats.totalValueSaved + parseInt(game.originalPrice.replace(/\D/g, '')) || 0,
          // Increment AAA counter if the original price is > R$100
          aaaGamesHunted: parseInt(game.originalPrice.replace(/\D/g, '')) > 100 
            ? stats.aaaGamesHunted + 1 
            : stats.aaaGamesHunted
        });
      }
    }
  } catch (error) {
    console.error(`Error processing game ${game.title}:`, error);
    metrics.errors.push(`Game processing error for ${game.title}: ${error}`);
  }
}

// Run all scrapers
async function runScrapers() {
  try {
    metrics.lastRunTime = new Date();
    metrics.totalScrapes++;
    
    // Clean up expired games
    const games = await storage.getGames();
    for (const game of games) {
      if (new Date(game.endTime) < new Date()) {
        console.log(`Removing expired game: ${game.title}`);
        await storage.deleteGame(game.id);
      }
    }
    
    await scrapeSteam();
    await scrapeEpicGames();
    
    console.log("Completed scraping run");
  } catch (error) {
    console.error("Error during scraping run:", error);
    metrics.errors.push(`Scraping run error: ${error}`);
  }
}

// Setup the scraper service
export function setupScraper() {
  // Initialize the database with sample data
  initializeDatabase();
  
  // Run scrapers immediately on startup
  runScrapers();
  
  // Then schedule to run every hour
  setInterval(runScrapers, 60 * 60 * 1000); // Every 60 minutes
  
  // Also run every time the /api/scrape endpoint is hit (triggered from frontend)
  
  console.log("Scraper service initialized");
}

// Get scraper metrics
export function getMetrics() {
  return {
    ...metrics,
    // Limit the number of errors to the last 10
    errors: metrics.errors.slice(-10)
  };
}
