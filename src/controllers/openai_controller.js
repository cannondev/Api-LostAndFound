import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.AI_API_KEY });

export async function genCountryDescription(countryName) {
  const prompt = `Provide a 2 to 3 sentence description that highlights only the most essential things to know about ${countryName}. This response MUST include mentions of the country's full name (in english chracters and official language characters), capital city, languages spoken, population, and leader(s), BUT KEEP IT LIGHTHEARTED.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
      store: true,
    });

    const description = completion.choices[0].message.content.trim();
    return description;
  } catch (error) {
    console.error('Error generating country description:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function genFoodFunFact(countryName) {
  const prompt = `Provide a single sentence fun fact about a notable cuisine from ${countryName}.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 100,
      temperature: 0.7,
      store: true,
    });

    const foodFunFact = completion.choices[0].message.content.trim();
    return foodFunFact;
  } catch (error) {
    console.error('Error generating food fun fact:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function genCultureFunFact(countryName) {
  const prompt = `Provide a single sentence fun fact about a notable aspect of culture from ${countryName}. Do not make it about food, but maybe a fun fact about a citizen's lifestyle.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 100,
      temperature: 0.7,
      store: true,
    });

    const cultureFunFact = completion.choices[0].message.content.trim();
    return cultureFunFact;
  } catch (error) {
    console.error('Error generating culture fun fact:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function genPersonFunFact(countryName) {
  const prompt = `Provide a single sentence fun fact about a notable person native to ${countryName}. Maybe it's an inspiring story or great accomplishment.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 100,
      temperature: 0.7,
      store: true,
    });

    const personFunFact = completion.choices[0].message.content.trim();
    return personFunFact;
  } catch (error) {
    console.error('Error generating person fun fact:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}
