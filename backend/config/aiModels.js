import dotenv from 'dotenv';
dotenv.config();

export function getAIModels() {
  return {
    general: process.env.HF_GENERAL_MODEL || 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    embedding: process.env.HF_EMBEDDING_MODEL || 'BAAI/bge-base-en-v1.5',
  };
}
