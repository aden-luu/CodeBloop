import { Schema } from 'mongoose';

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each user includes the following fields:
 * - `username`: The name of the user. This field is required.
 * - `uid`: The firebase uid of this user. This field is required.
 */
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pfp: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
  },
  { collection: 'User' },
);

export default userSchema;
