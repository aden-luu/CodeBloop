import { Schema } from 'mongoose';
/**
 * Mongoose schema for the chatroom.
 *
 * This schema defines the structure for a chatroom in the database.
 * Each chatroom includes the following fields:
 * - `name`: The name of the chatroom.
 * - `users`: The usernames of the users who are in the chatroom.
 * - `chats`: Chats that are in the chatroom.
 * - `createDateTime`: The DateTime when the room is created.
 */
const roomSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    users: [{ type: String }],
    chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
    createDateTime: { type: Date },
  },
  { collection: 'Room' },
);

export default roomSchema;
