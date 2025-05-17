import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { Message, QueryResult } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { welcomeMessage } from '@/lib/sampleData';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send request to API
      const response = await apiRequest('POST', '/api/query', { question: content });
      const data: QueryResult = await response.json();

      // Create AI response message
      const aiMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: data.question ? data.data.message || 'Here are the results based on your query.' : 'I couldn\'t process that query. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentResult(data);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Provide more specific error messages to help users troubleshoot
      let errorContent = 'Sorry, I encountered an error processing your request. Please try again.';
      
      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('API key') || error.message.includes('authentication')) {
          errorContent = 'There seems to be an issue with the API authentication. Please check your API key configuration.';
        } else if (error.message.includes('database') || error.message.includes('SQL')) {
          errorContent = 'There was a problem connecting to the database. Please check your database connection.';
        } else if (error.message.includes('timeout') || error.message.includes('network')) {
          errorContent = 'The request timed out. Please check your internet connection and try again.';
        }
      }
      
      // Add error message from AI
      const errorMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // If we have a server error with a response, try to use that information
      if (error instanceof Response) {
        try {
          error.json().then(data => {
            if (data.error) {
              setCurrentResult({
                question: content,
                error: data.error,
                sql: data.sql || '',
                data: [],
                visualizationType: 'table'
              });
            }
          });
        } catch (jsonError) {
          // JSON parsing failed, ignore
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    currentResult
  };
}