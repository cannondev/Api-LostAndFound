/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
import { Router } from 'express';
import mongoose from 'mongoose';
import * as Thoughts from './controllers/thoughts_controller';
import {
  addFunFact, getCountryDetails, getCountryFacts, getCountryThoughts, getUnlockedCountries, unlockCountry, getAllCountries,
  getThoughtCoordinates,
  getAllCountriesWithThoughts,
} from './controllers/country_controller';

import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';
import User from './models/user_model';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Lost & Found API!' });
});

// Thought Routes
router.route('/thought')
  .get(async (req, res) => {
    try {
      const thoughts = await Thoughts.getAllThoughts();
      res.json(thoughts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(requireAuth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.homeCountry) {
        return res.status(400).json({ error: 'User homeCountry is missing' });
      }

      const newThought = await Thoughts.createThought({
        content: req.body.content,
        countryOriginated: user.homeCountry,
      });

      res.json(newThought);
    } catch (error) {
      res.status(500).json({ error: `Create thought error: ${error.message}` });
    }
  });

router.route('/thought/:id')
  .get(async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      const thought = await Thoughts.getThought(req.params.id);
      if (!thought || !req.params.id) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      res.json(thought);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/thought/user/:userId', async (req, res) => {
  try {
    const userThoughts = await Thoughts.getThoughtsByUser(req.params.userId);
    res.status(200).json(userThoughts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route('/countries/:countryName/unlock')
  .post(requireAuth, async (req, res) => {
    try {
      const { countryName } = req.params;
      const unlockedCountry = await unlockCountry(countryName); // unlock the country
      res.status(200).json({ message: `${countryName} unlocked successfully`, country: unlockedCountry });
    } catch (error) {
      res.status(500).json({ error: `Server error: ${error.message}` });
    }
  });

// Get all the countries that have thoughts on them
router.route('/countries/with-thoughts')
  .get(async (req, res) => {
    try {
      const countries = await getAllCountriesWithThoughts();
      res.status(200).json({ message: 'Successfully retrieved countries with thoughts', countries });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

// Get details of a country
router.route('/countries/:countryName')
  .get(async (req, res) => {
    try {
      const { countryName } = req.params;
      const countryDetail = await getCountryDetails(countryName);
      res.status(200).json({ message: `Successfully got details about ${countryName}`, country: countryDetail });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

// Add fun fact to a country
router.route('/countries/:countryName/funfact')
  .post(requireAuth, async (req, res) => {
    try {
      const { countryName } = req.params;
      const { fact } = req.body;
      const updatedCountry = await addFunFact(countryName, fact);
      res.status(200).json({ message: `Successfully added new fact to ${countryName}`, country: updatedCountry });
    } catch (error) {
      res.status(400).json({ error: `${error.message}` });
    }
  });

// Get all unlocked countries
router.route('/countries/unlocked/all')
  .get(async (req, res) => {
    try {
      const allUnlocked = await getUnlockedCountries();
      res.status(200).json({ message: 'Successfully retrieve all unlocked countries', countries: allUnlocked });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

// Get all thoughts for a country
router.route('/countries/:countryName/thoughts')
  .get(async (req, res) => {
    try {
      const { countryName } = req.params;
      const allThoughts = await getCountryThoughts(countryName);
      res.status(200).json({ message: 'Successfully retrieved all country thoughts', country: allThoughts });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

router.get('/thoughts/my-thoughts', requireAuth, async (req, res) => {
  try {
    const userThoughts = await Thoughts.getThoughtsByUser(req.user);
    res.status(200).json(userThoughts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all facts of a country
router.route('/countries/:countryName/funFacts')
  .get(async (req, res) => {
    try {
      const { countryName } = req.params;
      const allFacts = await getCountryFacts(countryName);
      res.status(200).json({ message: 'Successfully retrieve all country facts', funFacts: allFacts });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

// Get all countries
router.route('/countries')
  .get(async (req, res) => {
    try {
      const allCountries = await getAllCountries();
      res.status(200).json({ message: 'Successfully retrieved all countries', countries: allCountries });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

// Get coordinates of a thought
router.route('/countries/:countryName/thought-coordinates')
  .get(async (req, res) => {
    try {
      const { countryName } = req.params;
      const coordinates = await getThoughtCoordinates(countryName);
      res.status(200).json({ message: `Successfully retrieved thought coordinates for ${countryName}`, coordinates });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

// auth in routes
router.post('/signin', requireSignin, async (req, res) => {
  try {
    const { token, email, homeCountry } = UserController.signin(req.user);
    res.json({ token, email, homeCountry });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { token, email, homeCountry } = await UserController.signup(req.body);
    res.json({ token, email, homeCountry });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

export default router;
