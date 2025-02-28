import countryShapes from 'world-map-country-shapes';
import svgPathBounds from 'svg-path-bounds';
import { getCode, getName } from 'country-list';
import Thought from '../models/thoughts_model';
import User from '../models/user_model';

export async function createThought(thoughtFields) {
  try {
    if (!User) {
      throw new Error('Unauthorized: User is required.');
    }

    if (!thoughtFields.countryOriginated) {
      throw new Error('Missing required field: countryOriginated');
    }

    // Convert country name to ISO code
    const originatingCountryCode = getCode(thoughtFields.countryOriginated);

    if (!originatingCountryCode) {
      throw new Error(`Invalid country name provided: ${thoughtFields.countryOriginated}`);
    }

    // Filter out the originating country
    const allCountryCodes = countryShapes.map((country) => { return country.id; });
    const filteredCountries = allCountryCodes.filter(
      (countryCode) => { return countryCode !== originatingCountryCode; },
    );
    // Select a random destination country code
    const randomCountryCode = filteredCountries[Math.floor(Math.random() * filteredCountries.length)];
    // Get the SVG path for the selected country
    const countryShapeData = countryShapes.find((c) => { return c.id === randomCountryCode; });
    if (!countryShapeData) {
      throw new Error(`Shape not found for country code: ${randomCountryCode}`);
    }
    // Convert random country code back to country name
    const randomCountryName = getName(randomCountryCode);
    // Extract the bounding box from the SVG path
    const [minX, minY, maxX, maxY] = svgPathBounds(countryShapeData.shape);
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;

    const thought = new Thought({
      user: User._id, // ✅ Set the authenticated user
      content: thoughtFields.content,
      stamp: thoughtFields.stamp,
      countryOriginated: thoughtFields.countryOriginated,
      countrySentTo: randomCountryName,
      xCoordinate: randomX,
      yCoordinate: randomY,
    });

    const savedThought = await thought.save();
    return savedThought;
  } catch (error) {
    throw new Error(`Create thought error: ${error}`);
  }
}

export async function getThoughtsByUser(userId) {
  try {
    if (!User) {
      throw new Error('Unauthorized: User is required.');
    }
    const userThoughts = await Thought.find({ user: User._id });
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
