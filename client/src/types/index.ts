export interface QueryResult {
  question: string;
  sql: string;
  data: any;
  insights?: string[];
  recommendations?: string[];
  visualizationType?: 'bar' | 'line' | 'pie' | 'scatter' | 'table' | 'none';
  error?: string; // Add error field to handle database or API failures
}