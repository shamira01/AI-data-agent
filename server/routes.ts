import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { parseQuestion } from "./queryParser";
import { z } from "zod";

const querySchema = z.object({
  question: z.string().min(1).max(500)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for processing natural language queries
  app.post('/api/query', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validation = querySchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request body',
          errors: validation.error.errors 
        });
      }
      
      const { question } = validation.data;
      
      console.log('Processing question:', question);
      
      // Check for required environment variables
      if (!process.env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY is not set');
        return res.status(500).json({ 
          message: 'OpenAI API key is not configured',
          error: 'Missing environment variable: OPENAI_API_KEY'
        });
      }
      
      // Parse the question and generate a response
      const result = await parseQuestion(question);
      
      console.log('Query processed successfully');
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error processing query:', error);
      
      // More specific error handling
      let errorMessage = 'An error occurred while processing your query';
      let statusCode = 500;
      
      if (error instanceof Error) {
        if (error.message?.includes('API key')) {
          errorMessage = 'OpenAI API key error. Please check your environment variables.';
          statusCode = 401;
        } else if (error.message?.includes('database') || error.message?.includes('SQL')) {
          errorMessage = 'Database error. Please check your database connection.';
          statusCode = 500;
        } else if (error.message?.includes('rate limit')) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
          statusCode = 429;
        }
      }
      
      return res.status(statusCode).json({ 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined 
      });
    }
  });

  // API route for fetching available datasets
  app.get('/api/datasets', (_req: Request, res: Response) => {
    const datasets = [
      {
        id: 1,
        name: "E-commerce Analytics",
        description: "Sales, products, customers",
        active: true,
        tables: 7,
        records: 245000,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Finance Dataset",
        description: "Revenue, expenses, forecasts",
        active: false,
        tables: 5,
        records: 150000,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        name: "HR Analytics",
        description: "Employees, departments, performance",
        active: false,
        tables: 6,
        records: 85000,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      }
    ];
    
    return res.status(200).json(datasets);
  });

  // Health check route
  app.get('/api/health', (_req: Request, res: Response) => {
    return res.status(200).json({ status: 'ok' });
  });

  const httpServer = createServer(app);
  return httpServer;
}