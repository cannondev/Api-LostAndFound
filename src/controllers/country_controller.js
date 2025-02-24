import ThoughtModel from '../models/thoughts_model';
import CountryModel from '../models/country_model';

export async function unlockCountry(countryName) {
  try {
    const country = await CountryModel.findOne({ countryName });
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
    const country = await CountryModel.findOne({ countryName });
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
    const country = await CountryModel.findOne({ countryName });
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
