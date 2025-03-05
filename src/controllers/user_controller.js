import jwt from 'jsonwebtoken';
import User from '../models/user_model';

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

// export const signin = (user) => {
//   return {
//     token: tokenForUser(user), email: user.email, homeCountry: user.homeCountry, fullName: user.fullName,
//   };
// };

// export const signup = async ({
//   email, password, homeCountry, fullName,
// }) => {
//   if (!email || !password || !homeCountry || !fullName) {
//     throw new Error('You must provide email, password, and home country');
//   }

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     throw new Error('Email is in use');
//   }

//   const user = new User({
//     email, password, homeCountry, fullName,
//   });
//   await user.save();

//   return {
//     token: tokenForUser(user), email: user.email, homeCountry: user.homeCountry, fullName: user.fullName,
//   };
// };

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

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email is in use');
  }

  const user = new User({
    email, password, homeCountry, fullName, unlockedCountries: [homeCountry],
  });
  await user.save();

  return {
    token: tokenForUser(user), id: user.id, email: user.email, homeCountry: user.homeCountry, fullName: user.fullName,
  };
};
