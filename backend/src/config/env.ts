import * as dotenvFlow from 'dotenv-flow';
import path from 'path';

// Load environment variables based on NODE_ENV
dotenvFlow.config({
  node_env: process.env.NODE_ENV || 'development',
  default_node_env: 'development',
  path: path.resolve(__dirname, '../../'),
  silent: true,
});

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  databaseUrl: process.env.DATABASE_URL,
}; 