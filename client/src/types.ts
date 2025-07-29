import { Socket } from 'socket.io-client';

export type FakeSOSocket = Socket<ServerToClientEvents>;

/**
 * Represents a user in the application.
 */
export interface User {
  _id?: string;
  username: string;
  email: string;
  bio: string;
  pfp: string;
}

/**
 * Enum representing the possible ordering options for questions.
 * and their display names.
 */
export const orderTypeDisplayName = {
  newest: 'Newest',
  unanswered: 'Unanswered',
  active: 'Active',
  mostViewed: 'Most Viewed',
} as const;

/**
 * Type representing the keys of the orderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type OrderType = keyof typeof orderTypeDisplayName;

/**
 * Enum representing the possible ordering options for collections.
 * and their display names.
 */
export const collectionOrderTypeDisplayName = {
  newest: 'Newest',
  mostQuestions: 'Most Questions',
} as const;

/**
 * Type representing the keys of the collectionOrderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type CollectionOrderType = keyof typeof collectionOrderTypeDisplayName;

/**
 * Enum representing the possible ordering options for rooms.
 * and their display names.
 */
export const roomOrderTypeDisplayName = {
  newest: 'Newest',
  mostUsers: 'Most Users',
} as const;

/**
 * Type representing the keys of the roomOrderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type RoomOrderType = keyof typeof roomOrderTypeDisplayName;

/**
 * Interface represents a comment.
 *
 * text - The text of the comment.
 * commentBy - Username of the author of the comment.
 * commentDateTime - Time at which the comment was created.
 */
export interface Comment {
  _id?: string;
  text: string;
  commentBy: string;
  commentDateTime: Date;
  qid: string;
}

/**
 * Interface representing a tag associated with a question.
 *
 * @property name - The name of the tag.
 * @property description - A description of the tag.
 */
export interface Tag {
  _id?: string;
  name: string;
  description: string;
}

/**
 * Interface represents the data for a tag.
 *
 * name - The name of the tag.
 * qcnt - The number of questions associated with the tag.
 */
export interface TagData {
  name: string;
  qcnt: number;
}

/**
 * Interface representing the voting data for a question, which contains:
 * - qid - The ID of the question being voted on
 * - upVotes - An array of user IDs who upvoted the question
 * - downVotes - An array of user IDs who downvoted the question
 */
export interface VoteData {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Comments associated with the answer.
 */
export interface Answer {
  _id?: string;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[];
  qid: string;
}

/**
 * Interface representing the structure of a Question object.
 *
 * - _id - The unique identifier for the question.
 * - tags - An array of tags associated with the question, each containing a name and description.
 * - answers - An array of answers to the question
 * - title - The title of the question.
 * - views - An array of usernames who viewed the question.
 * - text - The content of the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - The date and time when the question was asked.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 * - comments - Comments associated with the question.
 */
export interface Question {
  _id?: string;
  tags: Tag[];
  answers: Answer[];
  title: string;
  views: string[];
  text: string;
  askedBy: string;
  askDateTime: Date;
  upVotes: string[];
  downVotes: string[];
  comments: Comment[];
}

/**
 * Interface representing a Chat, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - `text`: The content of the chat.
 * - `typedBy`: The user who typed the chat.
 * - 'chatDateTime: The time the chat was sent
 *
 */
export interface Chat {
  _id?: string;
  text: string;
  typedBy: string;
  chatDateTime: Date;
}

/**
 * Interface represents a Room.
 *
 * name - The name of the chat room.
 * users - The users of the chat room
 * chats - The chats in the chat room.
 * createDateTime - Time at which the room was created.
 */
export interface Room {
  _id?: string;
  name: string;
  users: string[];
  chats: Chat[];
  createDateTime: Date;
}

/**
 * Interface representing the payload for a vote update socket event.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for an answer update socket event.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: Answer;
}

/**
 * Interface representing the payload for a comment update socket event.
 */
export interface CommentUpdatePayload {
  result: Question | Answer;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a chat update socket event.
 */
export interface ChatUpdatePayload {
  result: Room;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: Question) => void;
  answerUpdate: (update: AnswerUpdatePayload) => void;
  viewsUpdate: (question: Question) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (update: CommentUpdatePayload) => void;
  roomUpdate: (room: Room) => void;
  chatUpdate: (chat: ChatUpdatePayload) => void;
  collectionUpdate: (collection: Collection) => void;
  collectionListUpdate: (collections: Collection[]) => void;
}

/**
 * Interface representing a Collection, which contains:
 * - _id - The unique identifier for the collection. Optional field.
 * - `name`: The name of the collection.
 * - 'user: The username of the owner of the collection
 * - questions - Questions that are in the collection.
 * - createdAt - The date and time when the collection was created.
 */
export interface Collection {
  _id?: string;
  name: string;
  user: string;
  questions: Question[];
  createdAt: Date;
}

/**
 * Interface representing the payload for a collection update socket event.
 */
export interface CollectionUpdatePayload {
  result: Collection;
}
