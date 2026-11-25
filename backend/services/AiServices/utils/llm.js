import { ChatOpenRouter } from "@langchain/openrouter";
import dotenv from 'dotenv'
dotenv.config()
const llm = new ChatOpenRouter({
    // apiKey: process.env.OPENROUTER_API_KEY,
    // // model: "deepseek/deepseek-chat",
    // model: "perplexity/pplx-decider-v1.3:free",
    // maxTokens: 1024,
    // temperature: 0.2,
    // other params...

    apiKey: process.env.OPENROUTER_API_KEY,
    model: "openrouter/free",

    maxTokens: 8192,   // use 4096 if the model rejects 8192
    temperature: 0.2,
    configuration: { baseURL: "https://openrouter.ai/api/v1" },
});

export default llm


// fetch('https://openrouter.ai/api/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//         Authorization: 'Bearer <OPENROUTER_API_KEY>',
//         'HTTP-Referer': '<YOUR_SITE_URL>',
//         'X-Title': '<YOUR_SITE_NAME>',
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//         model: 'openai/gpt-4o',
//         messages: [
//             {
//                 role: 'user',
//                 content: 'What is the meaning of life?',
//             },
//         ],
//     }),
// });


// curl https://openrouter.ai/api/v1/chat/completions \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer <OPENROUTER_API_KEY>" \
//   -d '{
//   "model": "openai/gpt-4o",
//   "messages": [
//     {
//       "role": "user",
//       "content": "What is the meaning of life?"
//     }
//   ]
// }'
