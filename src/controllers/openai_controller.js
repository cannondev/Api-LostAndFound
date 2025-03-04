import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function getCountryDescription(countryName) {
  const prompt = `Provide a 2 to 3 sentence description that highlights only the most essential things to know about ${countryName}. This response MUST include mentions of the country's official name, capital city, languages spoken, population, and leader(s), BUT KEEP IT LIGHTHEARTED`;

  try {
    const response = await openai.createCompletion({
      model: 'gpt-4o-mini',
      prompt,
      max_tokens: 50,
      temperature: 0.7,
    });

    const fact = response.data.choices[0].text.trim();
    return fact;
  } catch (error) {
    console.error('Error generating fun fact:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function getFoodFunFact(countryName) {
  const prompt = `Provide a single sentence fun fact about a notable cuisine from ${countryName}.`;

  try {
    const response = await openai.createCompletion({
      model: 'gpt-4o-mini',
      prompt,
      max_tokens: 50,
      temperature: 0.7,
    });

    const fact = response.data.choices[0].text.trim();
    return fact;
  } catch (error) {
    console.error('Error generating fun fact:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function getCultureFunFact(countryName) {
  const prompt = `Provide a single sentence fun fact about a notable aspect of culture from ${countryName}. Do not make it about food, but maybe a fun fact about a citizen's lifestyle.`;

  try {
    const response = await openai.createCompletion({
      model: 'gpt-4o-mini',
      prompt,
      max_tokens: 50,
      temperature: 0.7,
    });

    const fact = response.data.choices[0].text.trim();
    return fact;
  } catch (error) {
    console.error('Error generating fun fact:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function getPersonFunFact(countryName) {
  const prompt = `Provide a single sentence fun fact about a notable person native to ${countryName}. Maybe its an inspiring story or great accomplishment.`;

  try {
    const response = await openai.createCompletion({
      model: 'gpt-4o-mini',
      prompt,
      max_tokens: 50,
      temperature: 0.7,
    });

    const fact = response.data.choices[0].text.trim();
    return fact;
  } catch (error) {
    console.error('Error generating fun fact:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}
