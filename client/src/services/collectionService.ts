import api from './config';
import { Collection, Question } from '../types';

const COLLECTION_API_URL = `${process.env.REACT_APP_SERVER_URL}/collection`;

/**
 * Function to get collections by filter.
 *
 * @param order - The order in which to fetch collections. Default is 'newest'.
 * @param user - The username of the author of the collections. Default is an empty string.
 * @throws Error if there is an issue fetching or filtering collections.
 */
const getCollectionsByFilter = async (
  order: string = 'newest',
  user: string = '',
): Promise<Collection[]> => {
  const res = await api.get(`${COLLECTION_API_URL}/getCollection?order=${order}&user=${user}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering collections');
  }
  return res.data;
};

/**
 * Function to get a collection by its ID.
 *
 * @param cid - The ID of the collection to retrieve.
 *
 * @throws Error if there is an issue fetching the collection by ID.
 */
const getCollectionById = async (cid: string): Promise<Collection> => {
  const res = await api.get(`${COLLECTION_API_URL}/getCollectionById/${cid}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching question by id');
  }
  return res.data;
};

/**
 * Function to add a new collection.
 *
 * @param c - The collection object to add.
 * @throws Error if there is an issue creating the new collection.
 */
const addCollection = async (c: Collection): Promise<Collection> => {
  const res = await api.post(`${COLLECTION_API_URL}/addCollection`, c);

  if (res.status !== 200) {
    throw new Error('Error while creating a new collection');
  }

  return res.data;
};

/**
 * Function to add a question to a collection.
 *
 * @param cid - The id of the collection to add the question to.
 * @throws Error if there is an issue adding the question to collection.
 */
const addQuestionToCollection = async (cid: string, question: Question): Promise<Collection> => {
  const res = await api.post(`${COLLECTION_API_URL}/addQuestionToCollection`, { cid, question });

  if (res.status !== 200) {
    throw new Error('Error while adding a question to collection');
  }

  return res.data;
};

/**
 * Function to remove a question to a collection.
 *
 * @param cid - The id of the collection to remove the question from.
 * @throws Error if there is an issue removing the question to collection.
 */
const removeQuestionFromCollection = async (
  cid: string,
  question: Question,
): Promise<Collection> => {
  const res = await api.post(`${COLLECTION_API_URL}/removeQuestionFromCollection`, {
    cid,
    question,
  });

  if (res.status !== 200) {
    throw new Error('Error while removing a question to collection');
  }

  return res.data;
};

/**
 * Function to rename a collection.
 *
 * @param cid - The ID of the collection to rename.
 * @param newName - The new name of the collection.
 *
 * @returns The updated collection.
 */
const renameCollection = async (cid: string, newName: string): Promise<Collection> => {
  const res = await api.post(`${COLLECTION_API_URL}/renameCollection`, { cid, newName });
  if (res.status !== 200) {
    throw new Error('Error renaming collection');
  }
  return res.data;
};

/**
 * Function to delete a collection.
 *
 * @param cid - The ID of the collection to delete.
 * @param order - The order in which to fetch collections. Default is 'newest'.
 * @param user - The username of the author of the collections. Default is an empty string.
 * @returns The result of the deletion.
 */
const deleteCollection = async (cid: string, user: string): Promise<Collection[]> => {
  const res = await api.post(`${COLLECTION_API_URL}/deleteCollection/${cid}`, { user });
  if (res.status !== 200) {
    throw new Error('Error deleting collection');
  }
  return res.data;
};

export {
  getCollectionsByFilter,
  getCollectionById,
  addCollection,
  addQuestionToCollection,
  removeQuestionFromCollection,
  renameCollection,
  deleteCollection,
};
