import { ChatOpenRouter } from "@langchain/openrouter";
import dotenv from 'dotenv'
dotenv.config()
const llm = new ChatOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    // model: "deepseek/deepseek-chat",
    model: "openrouter/free",
    temperature: 0,
    maxTokens: 1024,
    // other params...
});

export default llm