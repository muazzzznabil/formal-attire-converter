import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

export async  function imageGeneration(image: string) {

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const imagePath = image;
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  // Prepare the content parts
  const contents = [
    { text: "Turn this photo into professional corporate image style" },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ];

  // Set responseModalities to include "Image" so the model can generate an image
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: contents,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });
  for (const part of response.candidates[0].content.parts) {
    // Based on the part type, either show the text or save the image
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      console.log("Image saved as gemini-native-image.png");
    }
  }
}

