// ChatGPT updated version of seedCountries by PeiPei to initalize country schemas

/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import fetch from 'node-fetch';
// eslint-disable-next-line import/extensions
import CountryModel from '../models/country_model.js';

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lostandfound_db';
mongoose.connect(mongoURI);

export default async function seedCountriesFromAPI() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    // Clear collection before inserting to prevent duplicates
    await CountryModel.deleteMany({});

    const uniqueCountries = [];
    const countrySet = new Set();

    data.forEach((country) => {
      const countryName = country.name.common;
      if (!countrySet.has(countryName)) {
        countrySet.add(countryName);
        uniqueCountries.push({
          countryName,
          isUnlocked: false,
          unlockDate: null,
          description: '', // Empty description
          foodFunFact: '', // Empty fun fact fields
          cultureFunFact: '',
          politicsFunFact: '',
          languageFunFact: '',
          landmarkFunFact: '',
          historyFunFact: '',
          userFunFacts: [], // Empty array for user fun facts
        });
      }
    });

    await CountryModel.insertMany(uniqueCountries);
    console.log('All countries added from REST API!');
  } catch (error) {
    console.error('Error seeding from API:', error);
  }
}
