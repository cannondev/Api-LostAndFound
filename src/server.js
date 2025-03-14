import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import router from './router';
import seedCountriesFromAPI from './data/newSeedCountries';
import CountryModel from './models/country_model';

const app = express();

// from previous labs' server set up
app.use(cors());
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.set('views', path.join(__dirname, '../src/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('hello world');
});

// chatGPT function to initialize country structures in database. Necessary flow or deployment on render/transitioning from localhost
async function initializeCountries() {
  try {
    // check for existing country schemas in database, if none then reinitialize
    const count = await CountryModel.countDocuments();
    if (count === 0) {
      console.log('No countries found. Seeding database...');
      await seedCountriesFromAPI(); // from newSeedCountries
      console.log('Seeding complete.');
    } else {
      console.log(`Database already has ${count} countries.`); // shows if database was already initialized
    }
  } catch (error) {
    console.error('Error checking/initializing countries:', error);
  }
}

// start server as usual
async function startServer() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/lostandfound_db';
    await mongoose.connect(mongoURI);
    console.log(`Mongoose connected to: ${mongoURI}`);

    // Initialize countries if needed
    await initializeCountries();

    const port = process.env.PORT || 9090;
    app.listen(port);
    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
}

console.log(listEndpoints(app));
startServer();
