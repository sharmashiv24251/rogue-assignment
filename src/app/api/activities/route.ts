import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("Gemini API Key not found in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


type Activity = {
  title: string;
  description: string;
  emoji: string;
};

type GeminiResponseFormat = {
  activities: Activity[];
};

export async function POST(request: Request) {
  try {
    const { weather, temperature, city, time } = await request.json();

    if (!weather || !temperature || !city || !time) {
      return NextResponse.json(
        { error: "Weather, temperature, city and time are required" },
        { status: 400 }
      );
    }

    const prompt = generatePrompt(weather, temperature , city, time);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    let jsonData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch && jsonMatch[0]) {
        jsonData = JSON.parse(jsonMatch[0]);
      } else {
        console.error("Gemini response did not contain valid JSON:", text);
        throw new Error("Invalid JSON response from AI");
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text, parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response", details: text },
        { status: 500 }
      );
    }

    if (!jsonData || !Array.isArray(jsonData.activities)) {
      console.error("Parsed JSON does not have the expected structure:", jsonData);
      return NextResponse.json(
        { error: "AI response has unexpected structure", details: jsonData },
        { status: 500 }
      );
    }

    return NextResponse.json(jsonData);
  } catch (error: any) {
    console.error("Error in /api/activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities from AI", details: error.message },
      { status: 500 }
    );
  }
}

function generatePrompt(weather: string, temperature: number, city: string, time: string) {
  const safeWeather = String(weather).toLowerCase();
  const safeTemp = Number(temperature);
  const safeCity = String(city);
  const safeTime = String(time);

  return `
reply only in json data no other text, json format

{
  "activities": [
    {
      "title": "Activity Title",
      "description": "Activity Description",
      "emoji": "any one emoji like 🍿 for movie"
    }
  ]
}

Provide 3-4 creative and specific activity suggestions based on the following weather conditions:
Weather: ${safeWeather}
Temperature: ${safeTemp}°C
City: ${safeCity}
Time: ${safeTime}

Consider both indoor and outdoor activities that would be enjoyable and safe in these conditions.
Make suggestions specific and engaging, with clear descriptions and relevant emojis.
`;
}