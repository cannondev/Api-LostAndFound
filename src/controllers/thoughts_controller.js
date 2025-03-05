import fetch from 'node-fetch';
import { createCanvas, loadImage } from 'canvas';
import sharp from 'sharp';
import countryList, { getCode, getName } from 'country-list';
import Thought from '../models/thoughts_model';
import User from '../models/user_model';

async function isPointInsideImage(x, y, imageBuffer) {
  const canvas = createCanvas(768, 768); // Adjust size as needed
  const ctx = canvas.getContext('2d');

  // Load the SVG-rendered image
  const image = await loadImage(imageBuffer);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Get pixel data at (x, y)
  const pixelData = ctx.getImageData(x, y, 1, 1).data;

  // Check if pixel is NOT transparent
  return pixelData[3] > 0; // Alpha > 0 means it’s inside the shape
}
function findValidCoordinates(pngBuffer) {
  return new Promise((resolve, reject) => {
    function attempt() {
      const randomX = Math.floor(Math.random() * 768);
      const randomY = Math.floor(Math.random() * 768);

      isPointInsideImage(randomX, randomY, pngBuffer)
        .then((isInside) => {
          if (isInside) {
            resolve({ x: randomX, y: randomY }); // Found valid point
          } else {
            attempt(); // Retry if outside
          }
        })
        .catch(reject); // Handle errors
    }
    attempt(); // Start first attempt
  });
}
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

    const sovereignCountries = new Set([
      'AF', 'AL', 'DZ', 'AD', 'AO', 'AG', 'AR', 'AM', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BT', 'BO', 'BA', 'BW', 'BR', 'BN', 'BG', 'BF', 'BI', 'CV', 'KH', 'CM', 'CA', 'CF', 'TD', 'CL', 'CN', 'CO', 'KM', 'CD', 'CG', 'CR', 'HR', 'CU', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FJ', 'FI', 'FR', 'GA', 'GM', 'GE', 'DE', 'GH', 'GR', 'GD', 'GT', 'GN', 'GW', 'GY', 'HT', 'HN', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IL', 'IT', 'CI', 'JM', 'JP', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MR', 'MU', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NZ', 'NI', 'NE', 'NG', 'MK', 'NO', 'OM', 'PK', 'PW', 'PA', 'PG', 'PY', 'PE', 'PH', 'PL', 'PT', 'QA', 'RO', 'RU', 'RW', 'KN', 'LC', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'SS', 'ES', 'LK', 'SD', 'SR', 'SE', 'CH', 'SY', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TO', 'TT', 'TN', 'TR', 'TM', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UY', 'UZ', 'VU', 'VA', 'VE', 'VN', 'YE', 'ZM', 'ZW',
    ]);

    const allCountryCodes = countryList.getCodes().filter((code) => { return sovereignCountries.has(code); });
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

    const svgBuffer = await response.buffer();

    // Convert SVG to PNG
    const pngBuffer = await sharp(svgBuffer).resize(768, 768).png().toBuffer();

    // Use Promise-based function to get valid coordinates
    const { x: randomX, y: randomY } = await findValidCoordinates(pngBuffer);

    console.log(`Valid coordinates found: (${randomX}, ${randomY})`);

    const randomCountryName = getName(randomCountryCode);

    // Save thought with valid coordinates
    const thought = new Thought({
      user: User._id,
      content: thoughtFields.content,
      stamp: thoughtFields.stamp,
      countryOriginated: thoughtFields.countryOriginated,
      countrySentTo: randomCountryName,
      xCoordinate: randomX,
      yCoordinate: randomY,
      svgUrl: countrySvgUrl,
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
