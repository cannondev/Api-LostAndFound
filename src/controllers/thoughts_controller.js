import fetch from 'node-fetch';
import svgPathBounds from 'svg-path-bounds';
import countryList, { getCode, getName } from 'country-list';
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

    const allCountryCodes = countryList.getCodes();
    const filteredCountries = allCountryCodes.filter(
      (countryCode) => { return countryCode !== originatingCountryCode; },
    );

    if (filteredCountries.length === 0) {
      throw new Error('No valid destination countries available');
    }

    // Select a random destination country code
    const randomCountryCode = filteredCountries[Math.floor(Math.random() * filteredCountries.length)];

    if (!randomCountryCode) {
      throw new Error('Random country selection failed: No valid country was picked.');
    }

    if (typeof randomCountryCode !== 'string') {
      throw new Error(`Invalid type for randomCountryCode: ${typeof randomCountryCode}`);
    }

    // Convert to lowercase safely
    const lowercaseCountryCode = randomCountryCode.toLowerCase();

    // Fetch the SVG path for the selected country
    const countrySvgUrl = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${lowercaseCountryCode}/vector.svg`;
    // Fetch the SVG path from the URL
    const response = await fetch(countrySvgUrl);
    if (!response.ok) throw new Error(`Failed to fetch SVG for ${randomCountryCode}`);

    const svgText = await response.text();

    // Extract the <path> from the SVG file
    const pathMatch = svgText.match(/<path[^>]*d="([^"]+)"/);
    if (!pathMatch) throw new Error(`No valid <path> found in SVG for ${randomCountryCode}`);

    const countryShapePath = pathMatch[1]; // Extracted `d` path
    console.log(' Extracted Country Shape Path:', countryShapePath);

    // Extract bounding box from the path
    const [minX, minY, maxX, maxY] = svgPathBounds(countryShapePath);

    if (!minX || !minY || !maxX || !maxY) {
      throw new Error(` Bounding box extraction failed for ${randomCountryCode}`);
    }

    console.log('Extracted Bounding Box:', {
      minX, minY, maxX, maxY,
    });

    // Generate random coordinates within the bounding box
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;

    console.log('Generated Random Coordinates:', { randomX, randomY });

    // Extract viewBox dimensions from the SVG
    const viewBoxMatch = svgText.match(/viewBox="([\d.\s-]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1].split(' ').map(Number) : [0, 0, 1024, 1024];

    const [minSvgX, minSvgY, maxSvgX, maxSvgY] = viewBox;

    // **Normalize coordinates relative to viewBox**
    const normalizedX = ((randomX - minX) / (maxX - minX)) * (maxSvgX - minSvgX) + minSvgX;
    const normalizedY = ((randomY - minY) / (maxY - minY)) * (maxSvgY - minSvgY) + minSvgY;

    console.log('Normalized Coordinates:', { normalizedX, normalizedY });

    const randomCountryName = getName(randomCountryCode);

    // Save the thought with coordinates and SVG URL
    const thought = new Thought({
      user: User._id, // ✅ Set the authenticated user
      content: thoughtFields.content,
      stamp: thoughtFields.stamp,
      countryOriginated: thoughtFields.countryOriginated,
      countrySentTo: randomCountryName,
      xCoordinate: normalizedX,
      yCoordinate: normalizedY,
      svgUrl: countrySvgUrl, // Store SVG URL for frontend use
      viewBox: {
        minSvgX, minSvgY, maxSvgX, maxSvgY,
      },
    });

    const savedThought = await thought.save();
    console.log('Thought Successfully Saved with viewBox:', savedThought);
    return savedThought;
  } catch (error) {
    throw new Error(`Create thought error: ${error.message}`);
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

export async function getCountryThoughts(countryName) {
  try {
    const thoughts = await Thought.find({ countrySentTo: countryName });
    return thoughts;
  } catch (error) {
    throw new Error(`Get country thoughts error: ${error.message}`);
  }
}

// Delete a single thought by ID
export async function deleteThoughtById(id) {
  try {
    const deletedThought = await Thought.findByIdAndDelete(id);
    if (!deletedThought) {
      throw new Error(`Thought with ID ${id} not found.`);
    }
    return { message: `Thought with ID ${id} deleted successfully.` };
  } catch (error) {
    throw new Error(`Delete thought error: ${error.message}`);
  }
}

// Delete all thoughts (optional)
export async function deleteAllThoughts() {
  try {
    await Thought.deleteMany({});
    return { message: 'All thoughts deleted successfully.' };
  } catch (error) {
    throw new Error(`Delete all thoughts error: ${error.message}`);
  }
}
