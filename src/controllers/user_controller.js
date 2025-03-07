import jwt from 'jsonwebtoken';
import User from '../models/user_model';

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

export const signin = (user) => {
  return {
    token: tokenForUser(user), id: user.id, email: user.email, homeCountry: user.homeCountry, fullName: user.fullName,
  };
};

export const signup = async ({
  email, password, homeCountry, fullName,
}) => {
  if (!email || !password || !homeCountry || !fullName) {
    throw new Error('You must provide email, password, and home country');
  }

  const normalizedHomeCountry = normalizeCountryName(homeCountry);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email is in use');
  }

  const user = new User({
    email, password, homeCountry: normalizedHomeCountry, fullName, unlockedCountries: [normalizedHomeCountry],
  });
  await user.save();

  return {
    token: tokenForUser(user), id: user.id, email: user.email, homeCountry: user.homeCountry, fullName: user.fullName,
  };
};

export const getUserInfoById = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const user = await User.findById(userId).select('fullName homeCountry');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

function normalizeCountryName(countryName) {
  const mappings = {
    'United States': 'United States of America',
    USA: 'United States of America',
    'U.S.A.': 'United States of America',
    America: 'United States of America',
    'Russian Federation': 'Russia',
    Türkiye: 'Turkey',
    'Korea, Republic of': 'South Korea',
    'Korea, Democratic People\'s Republic of': 'North Korea',
    'United States of America': 'United States',
    'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
    'Côte d\'Ivoire': 'Ivory Coast',
    'Tanzania, United Republic of': 'Tanzania',
  };
  return mappings[countryName] || countryName;
}

