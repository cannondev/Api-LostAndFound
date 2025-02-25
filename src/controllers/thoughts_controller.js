import countryBoundaries from '../data/bounding-boxes.json';
import Thought from '../models/thoughts_model';

export async function createThought(thoughtFields) {
  try {
    const allCountryCodes = Object.keys(countryBoundaries);

    const filteredCountries = allCountryCodes.filter(
      (countryCode) => { return countryCode !== thoughtFields.countryOriginated; },
    );

    // Select a random country
    const randomCountryCode = filteredCountries[Math.floor(Math.random() * filteredCountries.length)];
    const [countryName, [minLng, minLat, maxLng, maxLat]] = countryBoundaries[randomCountryCode];

    const randomLng = Math.random() * (maxLng - minLng) + minLng;
    const randomLat = Math.random() * (maxLat - minLat) + minLat;

    const thought = new Thought({
      ...thoughtFields,
      countrySentTo: countryName,
      xCoordinate: randomLng,
      yCoordinate: randomLat,
    });

    const savedThought = await thought.save();
    return savedThought;
  } catch (error) {
    throw new Error(`Create thought error: ${error}`);
  }
}

export async function getThoughtsByUser(userId) {
  try {
    const userThoughts = await Thought.find({ user: userId });
    return userThoughts;
  } catch (error) {
    throw new Error(`Get thoughts by user error: ${error}`);
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
