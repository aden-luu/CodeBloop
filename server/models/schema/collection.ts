import { Schema } from 'mongoose';
/**
 * Mongoose schema for the collection.
 *
 * This schema defines the structure for a collection in the database.
 * Each collection includes the following fields:
 * - `name`: The name of the collection.
 * - `users`: The usernames of the users who are in the collection.
 * - `questions`: Questions that are in the collection.
 * - `createdAt`: The DateTime when the collection is created.
 */
const collectionSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    user: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    createdAt: { type: Date },
  },
  { collection: 'Collection' },
);

export default collectionSchema;
