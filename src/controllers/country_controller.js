import ThoughtModel from '../models/thoughts_model';
import CountryModel from '../models/country_model';

// country_controller.js
function normalizeCountryName(countryName) {
  const mappings = {
    'Russian Federation': 'Russia',
    Türkiye: 'Turkey',
    'Korea, Republic of': 'South Korea',
    'United States of America': 'United States',
    'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
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
    const country = await CountryModel.findOne({ countryName: normalizedName });
    if (!country) {
      throw new Error(`Country not found: ${countryName}`);
    }
    return country;
  } catch (error) {
    throw new Error(`Get country details error: ${error.message}`);
  }
}

export async function addFunFact(countryName, fact) {
  try {
    const normalizedName = normalizeCountryName(countryName);
    const country = await CountryModel.findOne({ countryName: normalizedName });
    if (!country) {
      throw new Error(`Country not found: ${countryName}`);
    }
    country.funFacts.push(fact);
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

export async function getCountryFacts(countryName) {
  try {
    const country = await CountryModel.findOne({ countryName }, 'funFacts');
    if (!countryName) {
      throw new Error(`Country not found: ${countryName}`);
    }
    return country.funFacts;
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

export async function getScratchData(countryName) {
  try {
    const normalizedName = normalizeCountryName(countryName);
    const country = await CountryModel.findOne({ countryName: normalizedName });
    if (!country) {
      throw new Error(`Country not found: ${countryName}`);
    }
    // Return scratchPaths or an empty array if not defined
    return { paths: country.scratchPaths || [] };
  } catch (error) {
    throw new Error(`Get scratch data error: ${error.message}`);
  }
}

export async function saveScratchData(countryName, scratchPath) {
  try {
    const normalizedName = normalizeCountryName(countryName);
    const country = await CountryModel.findOne({ countryName: normalizedName });
    if (!country) {
      throw new Error(`Country not found: ${countryName}`);
    }
    // Initialize scratchPaths if necessary and add the new scratchPath
    if (!country.scratchPaths) {
      country.scratchPaths = [];
    }
    country.scratchPaths.push(scratchPath);
    await country.save();
    return scratchPath;
  } catch (error) {
    throw new Error(`Save scratch data error: ${error.message}`);
  }
}
