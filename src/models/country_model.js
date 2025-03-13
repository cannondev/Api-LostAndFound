/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { Schema } from 'mongoose';

const CountrySchema = new Schema({
  countryName: { type: String, required: true, unique: true },
  isUnlocked: { type: Boolean, default: false },
  unlockDate: { type: Date },
  description: { type: String },
  foodFunFact: { type: String },
  cultureFunFact: { type: String },
  politicsFunFact: { type: String },
  languageFunFact: { type: String },
  landmarkFunFact: { type: String },
  historyFunFact: { type: String },
  userFunFacts: [{ type: String }],
  thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }], // References to Thought schemas
  scratchPaths: { type: Array, default: [] },
});

const CountryModel = mongoose.model('Country', CountrySchema);
export default CountryModel;
