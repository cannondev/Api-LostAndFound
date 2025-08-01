/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
  {
    email: {
      type: String, unique: true, lowercase: true, required: true,
    },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    homeCountry: { type: String, required: true },
    unlockedCountries: { type: [String], default: [] },
    thoughts: { type: [String], default: [] },
    scratchPaths: {
      type: Map,
      of: Array,
      default: {},
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  },
);

UserSchema.pre('save', async function beforeUserSave(next) {
  // get access to the user model
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    // salt, hash, then set password to hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
