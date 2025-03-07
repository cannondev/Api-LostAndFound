import ThoughtModel from '../models/thoughts_model';
import CountryModel from '../models/country_model';
import User from '../models/user_model';
import {
  genCountryDescription, genFoodFunFact, genCultureFunFact, genPoliticsFunFact, genLanguageFunFact, genLandmarkFunFact, genHistoryFunFact,
} from './openai_controller';

// country_controller.js
function normalizeCountryName(countryName) {
  const mappings = {
    'Russian Federation': 'Russia',
    Türkiye: 'Turkey',
    'Korea, Republic of': 'South Korea',
    'Korea, Democratic People\'s Republic of': 'North Korea',
    'United States of America': 'United States',
    USA: 'United States',
    'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
    'Côte d\'Ivoire': 'Ivory Coast',
    'Tanzania, United Republic of': 'Tanzania',
    // Add any additional mappings as needed
  };
  return mappings[countryName] || countryName;
}

export async function unlockCountry(countryName) {
  try {
    const normalizedName = normalizeCountryName(countryName);
    const country = await CountryModel.findOne({ countryName: normalizedName });
    if (!country) {
      throw new Error(`Country not found: ${countryName}`);
    }
    if (country.isUnlocked) {
      throw new Error('Country is already unlocked');
    }
    country.isUnlocked = true;
    country.unlockDate = new Date();
    await country.save();
    return country;
  } catch (error) {
    throw new Error(`Unlock country error: ${error.message}`);
  }
}

export async function getCountryDetails(countryName) {
  try {
    const normalizedName = normalizeCountryName(countryName);
    console.log(`Normalized Country Name: ${normalizedName}`);
    const country = await CountryModel.findOne({ countryName: normalizedName });
    if (!country) {
      throw new Error(`Country not found: ${countryName}`);
    }
    return country;
  } catch (error) {
    throw new Error(`Get country details error: ${error.message}`);
  }
}

export async function generateCountryData(req, res) {
  try {
    const { countryName } = req.params;
    const normalizedName = normalizeCountryName(countryName);
    const country = await CountryModel.findOne({ countryName: normalizedName });
    if (!country) {
      return res.status(404).json({ error: `Country ${countryName} not found` });
    }

    // these functions are in openai_controller.js
    const description = await genCountryDescription(countryName);
    const foodFunFact = await genFoodFunFact(countryName);
    const cultureFunFact = await genCultureFunFact(countryName);
    const politicsFunFact = await genPoliticsFunFact(countryName);
    const languageFunFact = await genLanguageFunFact(countryName);
    const landmarkFunFact = await genLandmarkFunFact(countryName);
    const historyFunFact = await genHistoryFunFact(countryName);

    country.description = description;
    country.foodFunFact = foodFunFact;
    country.cultureFunFact = cultureFunFact;
    country.politicsFunFact = politicsFunFact;
    country.languageFunFact = languageFunFact;
    country.landmarkFunFact = landmarkFunFact;
    country.historyFunFact = historyFunFact;

    await country.save();

    return res.status(200).json({ message: 'Country data generated successfully', country });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function addUserFunFact(countryName, fact) {
  try {
    const normalizedName = normalizeCountryName(countryName);
    const country = await CountryModel.findOne({ countryName: normalizedName });
    if (!country) {
      throw new Error(`Country not found: ${countryName}`);
    }
    country.userFunFacts.push(fact);
    await country.save();
    return country;
  } catch (error) {
    throw new Error(`Add fun fact error: ${error.message}`);
  }
}

export async function getUnlockedCountries() {
  try {
    const countries = await CountryModel.find({ isUnlocked: true }).sort({ unlockDate: -1 });
    return countries;
  } catch (error) {
    throw new Error(`Get unlocked countries error: ${error.message}`);
  }
}

export async function getCountryThoughts(countryName) {
  try {
    const thoughts = await ThoughtModel.find({ countrySentTo: countryName });
    if (!countryName) {
      throw new Error(`Country not found: ${countryName}`);
    }
    return thoughts;
  } catch (error) {
    throw new Error(`Get country thoughts error: ${error.message}`);
  }
}

export async function getCountryUserFacts(countryName) {
  try {
    const country = await CountryModel.findOne({ countryName }, 'funFacts');
    if (!countryName) {
      throw new Error(`Country not found: ${countryName}`);
    }
    return country.userFunFacts;
  } catch (error) {
    throw new Error(`Get country facts error: ${error.message}`);
  }
}

export async function getAllCountries() {
  try {
    const countries = await CountryModel.find().sort({ countryName: 1 });
    return countries;
  } catch (error) {
    throw new Error(`Get all countries error: ${error.mesasge}`);
  }
}

export async function getThoughtCoordinates(countryName) {
  try {
    const thoughts = await ThoughtModel.find({ countrySentTo: countryName }, 'xCoordinate yCoordinate _id');
    if (!thoughts) {
      throw new Error(`No thoughts found for: ${countryName}`);
    }

    const coordinates = thoughts.map((thought) => {
      return {
        thoughtId: thought._id,
        xCoordinate: thought.xCoordinate,
        yCoordinate: thought.yCoordinate,
      };
    });

    return coordinates;
  } catch (error) {
    throw new Error(`Get country thought coordinates error: ${error.message}`);
  }
}

export async function getAllCountriesWithThoughts() {
  try {
    const countries = await ThoughtModel.distinct('countrySentTo');
    return countries;
  } catch (error) {
    throw new Error(`Get countries with thoughts error: ${error.message}`);
  }
}

export async function getScratchDataForUser(userId, countryName) {
  try {
    const normalizedName = normalizeCountryName(countryName);
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    // Use the Map API to get scratch paths for this country; if none, return an empty array.
    const paths = user.scratchPaths.get(normalizedName) || [];
    return { paths };
  } catch (error) {
    throw new Error(`Get scratch data error: ${error.message}`);
  }
}

export async function saveScratchDataForUser(userId, countryName, scratchPath) {
  try {
    const normalizedName = normalizeCountryName(countryName);
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    // Get existing paths (or an empty array), then add the new scratch path.
    let paths = user.scratchPaths.get(normalizedName);
    if (!paths) {
      paths = [];
    }
    paths.push(scratchPath);
    user.scratchPaths.set(normalizedName, paths);
    await user.save();
    return scratchPath;
  } catch (error) {
    throw new Error(`Save scratch data error: ${error.message}`);
  }
}
