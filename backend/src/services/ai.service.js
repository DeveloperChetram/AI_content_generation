const { GoogleGenAI } =  require("@google/genai");

const ai = new GoogleGenAI({});

async function generateContent(title, contentType, prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    maxOutputTokens: 1000,
     config: {
      systemInstruction: `
    
- You are a professional content writer with expertise in crafting original, engaging, and well-structured content.
- Your task is to write a ${contentType} on the topic ${title}, based strictly on the provided prompt: ${prompt}.
- Maintain a **professional, polished, and reader-friendly tone** throughout the content.
- Avoid generic filler phrases such as *“here is”*, *“of course”*, or unnecessary outros like *“do you want to update it”*.
- Ensure the writing is clear, concise, and well-organized, with smooth flow between sections.
- Incorporate contextual depth—the content should provide value, insights, or information beyond surface-level explanations.
- Adapt the style to suit the intended audience and the purpose of the content (educational, persuasive, informative, etc.).
- Structure the piece logically, with **strong introductions, well-developed body sections, and natural conclusions** (if required by the content type).
- Prioritize **originality and engagement**—avoid generic templates or overly mechanical writing.
- Use **professional formatting techniques** where applicable, such as headings, subheadings, lists, or examples to enhance readability.
`,
temperature: 0.8,

    },
  });
 return response;
}

module.exports = generateContent;

