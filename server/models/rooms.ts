import mongoose, { Model } from 'mongoose';
import { Room } from '../types';
import roomSchema from './schema/room';

/**
 * Mongoose model for the `Room` collection.
 *
 * This model is created using the `Room` interface and the `roomSchema`, representing the
 * `Room` collection in the MongoDB database, and provides an interface for interacting with
 * the stored chatrooms.
 *
 * @type {Model<Room>}
 */
const RoomModel: Model<Room> = mongoose.model<Room>('Room', roomSchema);

export default RoomModel;
