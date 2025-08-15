const { GoogleGenAI } =  require("@google/genai");

const ai = new GoogleGenAI({});

async function generateContent(title, contentType, prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `based on the prompt: ${prompt}` + `, write a ${contentType} on the topic: ${title}`,
//      config: {
//       systemInstruction: `
//       you are a professional content writer, you have to write a ${contentType} on the topic ${title} based on the prompt: ${prompt}. 
// `,
//     },
  });
 return response;
}

module.exports = generateContent;

