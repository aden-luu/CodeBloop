/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  deleteCollection,
  getCollectionsByOrder,
  fetchCollectionById,
  saveCollection,
  populateCollectionDocument,
  addQuestionToCollection,
  renameCollection,
  removeQuestionFromCollection,
} from '../models/application';
import {
  AddCollectionRequest,
  Collection,
  DeleteCollectionRequest,
  FindCollectionByIdRequest,
  FindCollectionRequest,
  ModifyQuestionInCollectionRequest,
  Question,
  RenameCollectionRequest,
} from '../types';

const collectionController = (socket: any) => {
  const router = express.Router();

  /**
   * Retrieves a list of collections ordered by a specified criterion.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindCollectionRequest object containing the query parameter `order`.
   * @param res The HTTP response object used to send back the filtered list of collections.
   *
   * @returns A Promise that resolves to void.
   */
  const getCollectionsByFilter = async (
    req: FindCollectionRequest,
    res: Response,
  ): Promise<void> => {
    const { order, user } = req.query;

    if (user === undefined || user === '') {
      res.status(400).send('Invalid username');
      return;
    }

    try {
      const clist: Collection[] = await getCollectionsByOrder(order, user);
      res.json(clist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching rooms by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching rooms by filter`);
      }
    }
  };

  /**
   * Retrieves a collection by its unique ID.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindCollectionByIdRequest object containing the room ID as a parameter.
   * @param res The HTTP response object used to send back the room details.
   *
   * @returns A Promise that resolves to void.
   */
  const getCollectionById = async (
    req: FindCollectionByIdRequest,
    res: Response,
  ): Promise<void> => {
    const { cid } = req.params;

    if (!ObjectId.isValid(cid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const c = await fetchCollectionById(cid);

      if (c && !('error' in c)) {
        res.json(c);
        return;
      }

      throw new Error('Error while fetching collection by id');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching collection by id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching collection by id`);
      }
    }
  };

  /**
   * Validates the collection object to ensure it contains all the necessary fields.
   *
   * @param collection The collection object to validate.
   *
   * @returns `true` if the collection is valid, otherwise `false`.
   */
  const isCollectionBodyValid = (collection: Collection): boolean =>
    collection.name !== undefined &&
    collection.name !== '' &&
    collection.user !== undefined &&
    collection.user !== '' &&
    collection.questions !== undefined &&
    collection.createdAt !== undefined &&
    collection.createdAt !== null;

  /**
   * Adds a new collection to the database. The collection is first validated and then saved.
   * If saving the collection fails, the HTTP response status is updated.
   *
   * @param req The AddCollectionRequest object containing the collection data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addCollection = async (req: AddCollectionRequest, res: Response): Promise<void> => {
    if (!isCollectionBodyValid(req.body)) {
      res.status(400).send('Invalid collection body');
      return;
    }
    const collection: Collection = req.body;
    try {
      const result = await saveCollection(collection);
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populates the fields of the room that was added, and emits the new object
      const populatedCollection = await populateCollectionDocument(result._id?.toString());

      if (populatedCollection && 'error' in populatedCollection) {
        throw new Error(populatedCollection.error);
      }

      socket.emit('collectionUpdate', populatedCollection as Collection);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving collection: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving collection`);
      }
    }
  };

  /**
   * Validates the question object to ensure it contains all the necessary fields.
   *
   * @param question The question object to validate.
   *
   * @returns `true` if the question is valid, otherwise `false`.
   */
  const isQuestionBodyValid = (question: Question): boolean =>
    question.title !== undefined &&
    question.title !== '' &&
    question.text !== undefined &&
    question.text !== '' &&
    question.tags !== undefined &&
    question.tags.length > 0 &&
    question.askedBy !== undefined &&
    question.askedBy !== '' &&
    question.askDateTime !== undefined &&
    question.askDateTime !== null;

  /**
   * Adds a question to a collection to the database. The user is first validated and then saved.
   * If the question is invalid or adding the question fails, the HTTP response status is updated.
   *
   * @param req The AddQuestionToCollectionRequest object containing the collection and question data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addQuestion = async (
    req: ModifyQuestionInCollectionRequest,
    res: Response,
  ): Promise<void> => {
    const { cid, question } = req.body;

    if (!isQuestionBodyValid(question)) {
      res.status(400).send('Invalid question body');
      return;
    }

    try {
      const result = await addQuestionToCollection(cid, question);
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populates the fields of the collection that was added, and emits the new object
      const populatedCollection = await populateCollectionDocument(result._id?.toString());

      if (populatedCollection && 'error' in populatedCollection) {
        throw new Error(populatedCollection.error);
      }

      socket.emit('collectionUpdate', populatedCollection as Collection);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving collection: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving collection`);
      }
    }
  };

  /**
   * Renames the collection to the database.
   * If renaming the collection fails, the HTTP response status is updated.
   *
   * @param req The RenameCollectionRequest object containing the collection and new name data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const changeName = async (req: RenameCollectionRequest, res: Response): Promise<void> => {
    const { cid, newName } = req.body;

    if (newName === undefined || newName === '') {
      res.status(400).send('Invalid new name for collection');
      return;
    }

    try {
      const result = await renameCollection(cid, newName);
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populates the fields of the collection that was added, and emits the new object
      const populatedCollection = await populateCollectionDocument(result._id?.toString());

      if (populatedCollection && 'error' in populatedCollection) {
        throw new Error(populatedCollection.error);
      }

      socket.emit('collectionUpdate', populatedCollection as Collection);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when renaming collection: ${err.message}`);
      } else {
        res.status(500).send(`Error when renaming collection`);
      }
    }
  };

  /**
   * Removes a question from the collection to the database.
   * If removing the collection fails, the HTTP response status is updated.
   *
   * @param req The RenameCollectionRequest object containing the collection and new name data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const removeQuestion = async (
    req: ModifyQuestionInCollectionRequest,
    res: Response,
  ): Promise<void> => {
    const { cid, question } = req.body;

    if (!isQuestionBodyValid(question)) {
      res.status(400).send('Invalid question body');
      return;
    }

    try {
      const result = await removeQuestionFromCollection(cid, question);
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populates the fields of the collection that the question was removed from, and emits the new object
      const populatedCollection = await populateCollectionDocument(result._id?.toString());

      if (populatedCollection && 'error' in populatedCollection) {
        throw new Error(populatedCollection.error);
      }

      socket.emit('collectionUpdate', populatedCollection as Collection);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when removing question from collection: ${err.message}`);
      } else {
        res.status(500).send(`Error when removing question from collection`);
      }
    }
  };

  /**
   * Deletes a collection.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindCollectionRequest object containing the query parameter `order`.
   * @param res The HTTP response object used to send back the filtered list of collections.
   *
   * @returns A Promise that resolves to void.
   */
  const deleteCollectionAndUpdateList = async (
    req: DeleteCollectionRequest,
    res: Response,
  ): Promise<void> => {
    const { user } = req.body;
    const { cid } = req.params;

    if (!ObjectId.isValid(cid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    if (user === undefined || user === '') {
      res.status(400).send('Invalid username');
      return;
    }

    try {
      const result = await deleteCollection(cid, user);
      if ('error' in result) {
        throw new Error(result.error);
      }

      socket.emit('collectionListUpdate', result as Collection[]);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when deleting collection: ${err.message}`);
      } else {
        res.status(500).send(`Error when deleting collection`);
      }
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router
  router.get('/getCollection', getCollectionsByFilter);
  router.get('/getCollectionById/:cid', getCollectionById);
  router.post('/addCollection', addCollection);
  router.post('/addQuestionToCollection', addQuestion);
  router.post('/removeQuestionFromCollection', removeQuestion);
  router.post('/renameCollection', changeName);
  router.post('/deleteCollection/:cid', deleteCollectionAndUpdateList);

  return router;
};

export default collectionController;
