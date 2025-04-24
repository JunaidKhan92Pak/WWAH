import OpenAI from "openai";
console.log(process.env.OPENAI_API_KEY, "openai key");

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Please define the OPENAI_API_KEY environment variable");
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
