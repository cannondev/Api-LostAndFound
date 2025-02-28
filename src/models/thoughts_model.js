/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { Schema } from 'mongoose';

const ThoughtSchema = new Schema({
  user: String,
  content: String,
  stamp: String,
  countryOriginated: String,
  countrySentTo: String,
  xCoordinate: Number,
  yCoordinate: Number,
  viewBox: {
    minSvgX: Number,
    minSvgY: Number,
    maxSvgX: Number,
    maxSvgY: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

const ThoughtModel = mongoose.model('Thought', ThoughtSchema);
export default ThoughtModel;
