import { Schema } from 'mongoose';
/**
 * Mongoose schema for the chat.
 *
 * This schema defines the structure for a chat in the database.
 * Each chat includes the following fields:
 * - `text`: The content of the chat.
 * - `typedBy`: The user who typed the chat.
 * - `room`: The room the chat is in.
 * - 'chatDateTime: The time the chat was sent
 */
const chatSchema: Schema = new Schema(
  {
    text: {
      type: String,
    },
    typedBy: { type: String },
    chatDateTime: {
      type: Date,
    },
  },
  { collection: 'Chat' },
);

export default chatSchema;
