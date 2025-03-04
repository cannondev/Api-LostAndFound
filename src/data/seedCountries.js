/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import fetch from 'node-fetch';
// eslint-disable-next-line import/extensions
import IndividualModel from '../models/country_model.js';

mongoose.connect('mongodb://localhost:27017/lostandfound_db');

async function seedCountriesFromAPI() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    // Clear collection before inserting to prevent duplicates
    await IndividualModel.deleteMany({});
    // Filter duplicates

    const uniqueCountries = [];
    const countrySet = new Set();

    data.forEach((country) => {
      if (!countrySet.has(country.name.common)) {
        countrySet.add(country.name.common);
        uniqueCountries.push({
          countryName: country.name.common,
          capital: country.capital ? country.capital[0] : 'N/A',
          region: country.region,
          population: country.population,
          flagUrl: country.flags.png,
          isUnlocked: false,
          unlockDate: null,
          funFacts: [],
          messages: [],
        });
      }
    });

    await IndividualModel.insertMany(uniqueCountries);
    console.log('All countries added from REST API!');
  } catch (error) {
    console.error('Error seeding from API:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedCountriesFromAPI();
