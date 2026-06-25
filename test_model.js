import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
(async () => {
  const models = await ai.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  console.log("Success with gemini-1.5-flash-latest");
})();
