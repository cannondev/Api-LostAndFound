// Updated version of seedCountries by PeiPei Soeung to initalize country schemas for deployed web app
// Updated by Thomas Clark and chatGPT for deployment

/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import fetch from 'node-fetch';
// eslint-disable-next-line import/extensions
import CountryModel from '../models/country_model.js';

// honestly not sure if this is needed
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lostandfound_db';
mongoose.connect(mongoURI);

export default async function seedCountriesFromAPI() {
  try {
    // get all country names from the REST countries API
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    // Clear collection before inserting to prevent duplicates
    await CountryModel.deleteMany({});

    const uniqueCountries = [];
    const countrySet = new Set();

    // initalize empty schemas for each country
    // crucial for these to be initialized before the user can call on them
    data.forEach((country) => {
      const countryName = country.name.common;
      if (!countrySet.has(countryName)) {
        countrySet.add(countryName);
        // Country Model fields defined by schema
        uniqueCountries.push({
          countryName,
          isUnlocked: false,
          unlockDate: null,
          description: '', // empty fields to be filled in later by openAI API
          foodFunFact: '',
          cultureFunFact: '',
          politicsFunFact: '',
          languageFunFact: '',
          landmarkFunFact: '',
          historyFunFact: '',
          userFunFacts: [], // not currently used, maybe for future development
        });
      }
    });

    await CountryModel.insertMany(uniqueCountries);
    console.log('All countries added from REST API!');
  } catch (error) {
    console.error('Error seeding from API:', error);
  }
}
