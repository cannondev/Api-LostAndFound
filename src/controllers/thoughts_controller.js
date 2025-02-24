// kiwi: make sure it cant be sent back to the same country
import Thought from '../models/thoughts_model';

export async function createThought(thoughtFields) {
  try {
    const countries = [
      'USA', 'Canada', 'Japan', 'Germany', 'France', 'Australia', 'Italy', 'Brazil', 'India', 'Mexico',
      'UK', 'Russia', 'China', 'South Africa', 'Argentina', 'New Zealand', 'Spain', 'South Korea', 'Egypt',
      'Netherlands', 'Turkey',
    ];

    const filteredCountries = countries.filter((country) => { return country !== thoughtFields.countryOriginated; });

    const randomCountry = filteredCountries[Math.floor(Math.random() * filteredCountries.length)];
    const thought = new Thought({
      ...thoughtFields,
      countrySentTo: randomCountry,
    });

    const savedThought = await thought.save();
    return savedThought;
  } catch (error) {
    throw new Error(`Create thought error: ${error}`);
  }
}

export async function getThought(id) {
  try {
    const thought = await Thought.findById(id);
    return thought;
  } catch (error) {
    throw new Error(`Get thought error: ${error}`);
  }
}

export const getAllThoughts = async () => {
  const allThoughts = await Thought.find({});
  return allThoughts;
};
