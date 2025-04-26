import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, insertGameHistorySchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupScraper, getMetrics } from "./services/scraper";

export async function registerRoutes(app: Express): Promise<Server> {
  // Root API route
  app.get("/api", (req: Request, res: Response) => {
    res.json({ message: "Floky's Free Hunt API" });
  });

  // Get all currently free games
  app.get("/api/games", async (req: Request, res: Response) => {
    try {
      // Get query parameters
      const onlyAAA = req.query.onlyAAA === "true";
      const lessThan24h = req.query.lessThan24h === "true";
      const store = req.query.store as string | undefined;
      const search = req.query.search as string | undefined;
      
      let games = await storage.getGames();
      
      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase();
        games = games.filter(game => 
          game.title.toLowerCase().includes(searchLower) || 
          game.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by store
      if (store && store !== "all") {
        games = games.filter(game => game.store === store);
      }
      
      // Filter by AAA
      if (onlyAAA) {
        games = games.filter(game => game.isHot === true);
      }
      
      // Filter by time remaining (less than 24h)
      if (lessThan24h) {
        const now = new Date();
        const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        games = games.filter(game => {
          const endTime = new Date(game.endTime);
          return endTime <= in24Hours && endTime >= now;
        });
      }
      
      res.json(games);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Erro ao buscar jogos grátis" });
    }
  });

  // Get games by store
  app.get("/api/games/store/:store", async (req: Request, res: Response) => {
    try {
      const { store } = req.params;
      if (store !== "steam" && store !== "epic") {
        return res.status(400).json({ message: "Loja inválida. Use 'steam' ou 'epic'." });
      }
      
      const games = await storage.getGamesByStore(store);
      res.json(games);
    } catch (error) {
      console.error("Error fetching games by store:", error);
      res.status(500).json({ message: "Erro ao buscar jogos da loja" });
    }
  });

  // Get site statistics
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      if (!stats) {
        return res.status(404).json({ message: "Estatísticas não encontradas" });
      }
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  // Add a new game (for testing purposes)
  app.post("/api/games", async (req: Request, res: Response) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const newGame = await storage.createGame(gameData);
      res.status(201).json(newGame);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating game:", error);
      res.status(500).json({ message: "Erro ao adicionar jogo" });
    }
  });

  // Get scraper metrics
  app.get("/api/metrics", async (req: Request, res: Response) => {
    try {
      const metrics = getMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Erro ao buscar métricas do scraper" });
    }
  });

  // Manually trigger scraper (for testing)
  app.post("/api/scrape", async (req: Request, res: Response) => {
    try {
      // This will be scheduled via cron, but allow manual trigger for testing
      const message = "Iniciando verificação manual de jogos grátis";
      console.log(message);
      res.json({ message });
    } catch (error) {
      console.error("Error triggering scraper:", error);
      res.status(500).json({ message: "Erro ao iniciar verificação" });
    }
  });

  // Google Gemini API proxy endpoint
  app.post("/api/gemini", async (req: Request, res: Response) => {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: "Prompt é obrigatório" });
    }
    
    try {
      const geminiKey = process.env.GEMINI_API_KEY;
      
      if (!geminiKey) {
        console.error("GEMINI_API_KEY não configurada");
        return res.status(500).json({ message: "Chave da API Gemini não configurada" });
      }
      
      // Vamos tentar primeiro o novo modelo Gemini 1.5 Flash
      const models = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro"
      ];
      
      let lastError = null;
      
      // Tentar modelos em ordem até um funcionar
      for (const model of models) {
        try {
          console.log(`Tentando modelo Gemini: ${model}`);
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
                topK: 40,
                topP: 0.95
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
              ]
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error(`Erro com modelo ${model}:`, errorData);
            lastError = errorData;
            continue; // Tentar próximo modelo
          }
          
          const data = await response.json();
          
          // Se chegou aqui, funcionou
          console.log(`Modelo ${model} respondeu com sucesso`);
          
          // Adaptar a resposta para o formato esperado pelo cliente
          const formattedResponse = {
            candidates: [
              {
                content: {
                  parts: [
                    { text: data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem recomendações disponíveis no momento." }
                  ]
                }
              }
            ]
          };
          
          return res.json(formattedResponse);
        } catch (modelError) {
          console.error(`Erro ao usar modelo ${model}:`, modelError);
          lastError = modelError;
        }
      }
      
      // Se chegar aqui, nenhum modelo funcionou
      console.error("Todos os modelos Gemini falharam", lastError);
      return res.status(500).json({ 
        message: "Não foi possível obter resposta de nenhum modelo Gemini disponível",
        error: lastError 
      });
    } catch (error) {
      console.error("Erro global ao chamar Gemini API:", error);
      res.status(500).json({ 
        message: "Erro ao processar requisição",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);

  // Start the scraper service
  setupScraper();

  return httpServer;
}
