import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// Helper to extract the JSON array from OpenAI's response
function extractJsonArrayBetweenBrackets(str) {
  const first = str.indexOf('[');
  const last = str.lastIndexOf(']');
  if (first === -1 || last === -1 || last < first) {
    return null; // or throw an error if you prefer
  }
  return str.substring(first, last + 1); // +1 is what makes it inclusive!
}

app.post('/api/recipes', async (req, res) => {
  const userIngredients = req.body.ingredients || [];
  const dietary = req.body.dietary || {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
  };

  // Build the prompt
  const prompt = `
Given these user inputs:
Ingredients: ${JSON.stringify(userIngredients)}
Dietary preferences: vegetarian: ${dietary.vegetarian}, vegan: ${dietary.vegan}, gluten free: ${dietary.glutenFree}, dairy free: ${dietary.dairyFree}

Generate an array of 2 JSON objects, each representing a recipe. 
The JSON must match EXACTLY this TypeScript interface, and be able to be interpreted using JSON.parse:

type Recipe = {
  id: number,
  title: string,
  readyInMinutes: number,
  servings: number,
  summary: string,
  instructions: string,
  image: string,
  dishTypes: string[]
};

Requirements:
- Use only the provided ingredients and dietary preferences.
- Each recipe should be unique and follow all selected dietary preferences.
- Provide a realistic, Unsplash-style food image URL for each recipe.
- The output should be a valid JavaScript array assigned to a variable named 'mockRecipes'.

Respond ONLY with the code, nothing else.
`;

  try {
    const completion = await openai.responses.create({
      model: "gpt-4",
      instructions: "You are a helpful assistant that generates JSON objects for recipes in a React app. Be strictly on format.",
      input: prompt,
      temperature: 0.2
    });

    console.log("OpenAI response:", completion);
    const responseText = completion.output_text;
    const arrayString = extractJsonArrayBetweenBrackets(responseText);
    let recipes = [];

    try {
      recipes = JSON.parse(arrayString);
    } catch (err) {
      // If parse fails, return raw content for debugging.
      return res.status(200).json({ error: "Parsing failed", raw: responseText, arrayString });
    }

    return res.json({ recipes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/midwest', async (req, res) => {
  const userIngredients = req.body.ingredients || [];
  const dietary = req.body.dietary || {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
  };

  // Build the prompt
  const prompt = `
Given these user inputs:
Ingredients: ${JSON.stringify(userIngredients)}
Dietary preferences: vegetarian: ${dietary.vegetarian}, vegan: ${dietary.vegan}, gluten free: ${dietary.glutenFree}, dairy free: ${dietary.dairyFree}

Generate an array of 2 JSON objects, each representing a recipe popular in the midwest. 
The JSON must match EXACTLY this TypeScript interface, and be able to be interpreted using JSON.parse.
The output must be a valid JSON array, with all property names and string values wrapped in double quotes ("). DO NOT use JavaScript variable assignments, only the plain JSON array.

type Recipe = {
  id: number,
  title: string,
  readyInMinutes: number,
  servings: number,
  summary: string,
  instructions: string,
  image: string,
  dishTypes: string[]
};

Requirements:
- Use only the provided ingredients and dietary preferences.
- Each recipe should be unique and follow all selected dietary preferences.
- Provide a realistic, Unsplash-style food image URL for each recipe.
- The output should be a valid JavaScript array assigned to a variable named 'mockRecipes'.

Respond ONLY with the code, nothing else.
`;

  try {
    const completion = await openai.responses.create({
      model: "gpt-4",
      instructions: "You are a helpful assistant that generates JSON objects for recipes in a React app. Be strictly on format.",
      input: prompt,
      temperature: 0.2
    });

    console.log("OpenAI response:", completion);
    const responseText = completion.output_text;
    const arrayString = extractJsonArrayBetweenBrackets(responseText);
    let recipes = [];

    try {
      recipes = JSON.parse(arrayString);
    } catch (err) {
      // If parse fails, return raw content for debugging.
      return res.status(200).json({ error: "Parsing failed", raw: responseText, arrayString });
    }

    return res.json({ recipes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`OpenAI recipes API listening on port ${PORT}`);
});