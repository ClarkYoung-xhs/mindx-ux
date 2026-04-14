// Mock module for @vercel/postgres in development
// This prevents Vite from trying to import the real @vercel/postgres package
export const sql = () => {
  throw new Error('@vercel/postgres is only available in Vercel serverless environment');
};
