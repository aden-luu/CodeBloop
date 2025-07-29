import mongoose, { Model } from 'mongoose';
import { Collection } from '../types';
import collectionSchema from './schema/collection';

/**
 * Mongoose model for the `Collection` collection.
 *
 * This model is created using the `Collection` interface and the `collectionSchema`, representing the
 * `Collection` collection in the MongoDB database, and provides an interface for interacting with
 * the stored collection.
 *
 * @type {Model<Collection>}
 */
const CollectionModel: Model<Collection> = mongoose.model<Collection>(
  'Collection',
  collectionSchema,
);

export default CollectionModel;
