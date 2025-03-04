/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { Schema } from 'mongoose';

const ThoughtSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  stamp: String,
  countryOriginated: String,
  countrySentTo: String,
  xCoordinate: Number,
  yCoordinate: Number,
  createdAt: { type: Date, default: Date.now },
});

const ThoughtModel = mongoose.model('Thought', ThoughtSchema);
export default ThoughtModel;
