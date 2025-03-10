import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.AI_API_KEY });

export async function genCountryDescription(countryName) {
  const prompt = `Provide a 1 sentence description that highlights only the most essential things to know about ${countryName}. This response MUST include mentions of the country's full name (in english chracters and official language characters), capital city, languages spoken, population, and leader(s), BUT KEEP IT LIGHTHEARTED BUT NOT CORNY AND CUT DOWN ON THE CLICHES. DO NOT EXCEED 200 CHARACTERS IN LENGTH`;

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
  const prompt = `Provide a single sentence fun fact about a notable cuisine from ${countryName}. BUT KEEP IT LIGHTHEARTED BUT NOT CORNY AND CUT DOWN ON THE CLICHES. DO NOT EXCEED 150 CHARACTERS IN LENGTH`;

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
  const prompt = `Provide a single sentence fun fact about a notable aspect of culture from ${countryName}. Do not make it about food, but maybe a fun fact about a citizen's lifestyle. BUT KEEP IT LIGHTHEARTED BUT NOT CORNY AND CUT DOWN ON THE CLICHES DO NOT EXCEED 150 CHARACTERS IN LENGTH`;

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

export async function genPoliticsFunFact(countryName) {
  const prompt = `Provide a single sentence fun fact about the politics of ${countryName}. Maybe it's about current events or an important event in history. BUT KEEP IT LIGHTHEARTED BUT NOT CORNY AND CUT DOWN ON THE CLICHES. DO NOT EXCEED 150 CHARACTERS IN LENGTH`;

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

    const politicsFunFact = completion.choices[0].message.content.trim();
    return politicsFunFact;
  } catch (error) {
    console.error('Error generating politics fun fact:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function genLanguageFunFact(countryName) {
  const prompt = `Provide a single sentence fun fact about the official language of ${countryName}. BUT KEEP IT LIGHTHEARTED BUT NOT CORNY AND CUT DOWN ON THE CLICHES. DO NOT EXCEED 150 CHARACTERS IN LENGTH`;

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

    const languageFunFact = completion.choices[0].message.content.trim();
    return languageFunFact;
  } catch (error) {
    console.error('Error generating language fun fact:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function genLandmarkFunFact(countryName) {
  const prompt = `Provide a single sentence fun fact about a notable landmark of ${countryName}. BUT KEEP IT LIGHTHEARTED BUT NOT CORNY AND CUT DOWN ON THE CLICHES. DO NOT EXCEED 150 CHARACTERS IN LENGTH`;

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

    const landmarkFunFact = completion.choices[0].message.content.trim();
    return landmarkFunFact;
  } catch (error) {
    console.error('Error generating landmark fun fact:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function genHistoryFunFact(countryName) {
  const prompt = `Provide a single sentence fun fact about the history of ${countryName}. BUT KEEP IT LIGHTHEARTED BUT NOT CORNY AND CUT DOWN ON THE CLICHES. DO NOT EXCEED 150 CHARACTERS IN LENGTH`;

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

    const historyFunFact = completion.choices[0].message.content.trim();
    return historyFunFact;
  } catch (error) {
    console.error('Error generating history fun fact:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}
