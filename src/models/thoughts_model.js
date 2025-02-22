/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { Schema } from 'mongoose';

const ThoughtSchema = new Schema({
  user: String,
  content: String,
  stamp: String,
  countryOriginated: String,
  countrySentTo: String,
  createdAt: { type: Date, default: Date.now },
});

const ThoughtModel = mongoose.model('Thought', ThoughtSchema);
export default ThoughtModel;
