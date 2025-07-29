import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { FakeSOSocket, AddChatRequest, Chat } from '../types';
import { addChat, populateRoomDocument, saveChat } from '../models/application';

const chatController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided chat request contains the required fields.
   *
   * @param req The request object containing the chat data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddChatRequest): boolean =>
    !!req.body.id &&
    !!req.body.room &&
    !!req.body.chat &&
    req.body.chat.text !== undefined &&
    req.body.chat.typedBy !== undefined &&
    req.body.chat.chatDateTime !== undefined;

  /**
   * Validates the chat object to ensure it is not empty.
   *
   * @param chat The chat to validate.
   *
   * @returns `true` if the chat is valid, otherwise `false`.
   */
  const isChatValid = (chat: Chat): boolean =>
    chat.text !== undefined &&
    chat.text !== '' &&
    chat.typedBy !== undefined &&
    chat.typedBy !== '' &&
    chat.chatDateTime !== undefined &&
    chat.chatDateTime !== null;

  /**
   * Handles adding a new chat to the specified chat room. The chat is first validated and then saved.
   * If the chat is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddChatRequest object containing the chat data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addChatRoute = async (req: AddChatRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const id = req.body.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    const { chat, room } = req.body;

    if (!isChatValid(chat)) {
      res.status(400).send('Invalid chat body');
      return;
    }

    try {
      const chatFromDb = await saveChat(chat);

      if ('error' in chatFromDb) {
        throw new Error(chatFromDb.error);
      }

      const status = await addChat(id, room, chatFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error);
      }

      // Populates the fields of the room that this chat
      // was added to, and emits the updated object
      const populatedDoc = await populateRoomDocument(id);

      if (populatedDoc && 'error' in populatedDoc) {
        throw new Error(populatedDoc.error);
      }

      socket.emit('chatUpdate', {
        result: populatedDoc,
      });
      res.json(chatFromDb);
    } catch (err: unknown) {
      res.status(500).send(`Error when adding chat: ${(err as Error).message}`);
    }
  };

  router.post('/addChat', addChatRoute);

  return router;
};

export default chatController;
