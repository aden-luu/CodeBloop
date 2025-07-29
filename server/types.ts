import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ServerToClientEvents>;

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'unanswered' | 'active' | 'mostViewed';

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Object IDs of comments that have been added to the answer by users, or comments themselves if populated
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[] | ObjectId[];
  qid: string;
}

/**
 * Interface extending the request body when adding an answer to a question, which contains:
 * - qid - The unique identifier of the question being answered
 * - ans - The answer being added
 */
export interface AnswerRequest extends Request {
  body: {
    qid: string;
    ans: Answer;
  };
}

/**
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
 */
export interface Tag {
  _id?: ObjectId;
  name: string;
  description: string;
}

/**
 * Interface representing a Question document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - title - The title of the question.
 * - text - The detailed content of the question.
 * - tags - An array of tags associated with the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - he date and time when the question was asked.
 * - answers - Object IDs of answers that have been added to the question by users, or answers themselves if populated.
 * - views - An array of usernames that have viewed the question.
 * - upVotes - An array of usernames that have upvoted the question.
 * - downVotes - An array of usernames that have downvoted the question.
 * - comments - Object IDs of comments that have been added to the question by users, or comments themselves if populated.
 */
export interface Question {
  _id?: ObjectId;
  title: string;
  text: string;
  tags: Tag[];
  askedBy: string;
  askDateTime: Date;
  answers: Answer[] | ObjectId[];
  views: string[];
  upVotes: string[];
  downVotes: string[];
  comments: Comment[] | ObjectId[];
}

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

/**
 * Type representing the possible responses for a User-related operation.
 */
export type UserResponse = User | { error: string };

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 * - askedBy - The username of the user who asked the question
 */
export interface FindQuestionRequest extends Request {
  query: {
    order: OrderType;
    search: string;
    askedBy: string;
  };
}

/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request query to find a user by a username.
 */
export interface FindUserByUsername extends Request {
  query: {
    username: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 * - body - The question being added.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}

/**
 * Interface for the request body when adding a new question.
 * - body - The user being added.
 */
export interface AddUserRequest extends Request {
  body: User;
}

/**
 * Interface for the request body when upvoting or downvoting a question.
 * - body - The question ID and the username of the user voting.
 *  - qid - The unique identifier of the question.
 *  - username - The username of the user voting.
 */
export interface VoteRequest extends Request {
  body: {
    qid: string;
    username: string;
  };
}

/**
 * Interface for the request body when adding a new chat room.
 * - body - The chat room being added.
 */
export interface AddRoomRequest extends Request {
  body: Room;
}

/**
 * Interface for the request body when adding a user to a chat room.
 * - body - The room and the user to be added to the room.
 *  - rid - The unique identifier of the room.
 *  - user - The user to be added to the chat room.
 */
export interface AddUserToRoomRequest extends Request {
  body: {
    rid: string;
    user: User;
  };
}

/**
 * Interface representing a Comment, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - text - The content of the comment.
 * - commentBy - The username of the user who commented.
 * - commentDateTime - The date and time when the comment was posted.
 *
 */
export interface Comment {
  _id?: ObjectId;
  text: string;
  commentBy: string;
  commentDateTime: Date;
  qid: string;
}

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
export interface AddCommentRequest extends Request {
  body: {
    id: string;
    type: 'question' | 'answer';
    comment: Comment;
  };
}

/**
 * Type representing the possible responses for a Comment-related operation.
 */
export type CommentResponse = Comment | { error: string };

/**
 * Interface representing the payload for a comment update event, which contains:
 * - result - The updated question or answer.
 * - type - The type of the updated item, either 'question' or 'answer'.
 */
export interface CommentUpdatePayload {
  result: AnswerResponse | QuestionResponse | null;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a vote update event, which contains:
 * - qid - The unique identifier of the question.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for an answer update event, which contains:
 * - qid - The unique identifier of the question.
 * - answer - The updated answer.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: AnswerResponse;
}

/**
 * Interface representing a user profile, which contains:
 * - _id - The unique identifier for the user. Optional field.
 * - username - The username of the user.
 * - email - The email of the user.
 * - pfp - The profile picture of the user.
 * - bio - The bio of the user.
 */
export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  pfp: string;
  bio: string;
}

/**
 * Type representing the possible ordering options for rooms.
 */
export type RoomOrderType = 'newest' | 'mostUsers';

/**
 * Interface representing a chatroom, which contains:
 * - _id - The unique identifier for the chatroom. Optional field.
 * - name - The name of the chatroom.
 * - users - The users who are in the chatroom.
 * - chats - Chats that are in the chatroom.
 * - createDateTime - the date and time when the room was created.
 */
export interface Room {
  _id?: ObjectId;
  name: string;
  users: string[];
  chats: Chat[] | ObjectId[];
  createDateTime: Date;
}

/**
 * Interface for the request query to find rooms using a search string, which contains:
 * - order - The order in which to sort the rooms
 * - search - The keyword to be searched in room names
 */
export interface FindRoomRequest extends Request {
  query: {
    order: RoomOrderType;
    search: string;
  };
}

/**
 * Interface for the request parameters when finding a room by its ID.
 * - rid - The unique identifier of the room.
 */
export interface FindRoomByIdRequest extends Request {
  params: {
    rid: string;
  };
}

/**
 * Type representing the possible responses for a room-related operation.
 */
export type RoomResponse = Room | { error: string };

/**
 * Interface representing a Chat, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - `text`: The content of the chat.
 * - `typedBy`: The user who typed the chat.
 * - 'chatDateTime: The time the chat was sent
 *
 */
export interface Chat {
  _id?: ObjectId;
  text: string;
  typedBy: string;
  chatDateTime: Date;
}

/**
 * Interface extending the request body when adding a chat to a chatroom, which contains:
 * - id - The unique identifier of the chat room being added on.
 * - room - The chatroom the chat is being added to.
 * - chat - The chat being added.
 */
export interface AddChatRequest extends Request {
  body: {
    id: string;
    room: Room;
    chat: Chat;
  };
}

/**
 * Type representing the possible responses for a chat-related operation.
 */
export type ChatResponse = Chat | { error: string };

/**
 * Interface representing the payload for a chat update event, which contains:
 * - result - The updated chatroom.
 */
export interface ChatUpdatePayload {
  result: RoomResponse | null;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
  userUpdate: (user: UserResponse) => void;
  roomUpdate: (room: RoomResponse) => void;
  chatUpdate: (chat: ChatUpdatePayload) => void;
  collectionUpdate: (collection: CollectionResponse) => void;
  collectionListUpdate: (collections: UserCollectionsResponse) => void;
}

/**
 * Type representing the possible ordering options for collections.
 */
export type CollectionOrderType = 'newest' | 'mostQuestions';

/**
 * Interface representing a Collection, which contains:
 * - _id - The unique identifier for the collection. Optional field.
 * - `name`: The name of the collection.
 * - 'user: The username of the owner of the collection
 * - questions - Questions that are in the collection.
 * - createdAt - The date and time when the collection was created.
 */
export interface Collection {
  _id?: ObjectId;
  name: string;
  user: string;
  questions: ObjectId[] | Question[];
  createdAt: Date;
}

/**
 * Interface for the request query to find collections using a search string, which contains:
 * - order - The order in which to sort the collections
 * - search - The keyword to be searched in collection names
 * - user - The user of the collection(s)
 */
export interface FindCollectionRequest extends Request {
  query: {
    order: CollectionOrderType;
    user: string;
  };
}

/**
 * Interface for the request parameters when finding a collection by its ID.
 * - cid - The unique identifier of the collection.
 */
export interface FindCollectionByIdRequest extends Request {
  params: {
    cid: string;
  };
}

/**
 * Type representing the possible responses for a Collection-related operation.
 */
export type CollectionResponse = Collection | { error: string };

/**
 * Type representing the possible responses for a Collection-related operation.
 */
export type UserCollectionsResponse = Collection[] | { error: string };

/**
 * Interface for the request body when adding a new collection.
 * - body - The collection being added.
 */
export interface AddCollectionRequest extends Request {
  body: Collection;
}

/**
 * Interface for the request body when adding/removing a question to a collection.
 * - body - The collection and the question to be added/removed to/from the collection.
 *  - cid - The unique identifier of the collection.
 *  - question - The question to be added/removed to/from the collection.
 */
export interface ModifyQuestionInCollectionRequest extends Request {
  body: {
    cid: string;
    question: Question;
  };
}

/**
 * Interface for the request body when renaming a collection.
 * - body - The collection and the question to be added to the room.
 *  - cid - The unique identifier of the collection.
 *  - newName - The name the collection will be renamed as.
 */
export interface RenameCollectionRequest extends Request {
  body: {
    cid: string;
    newName: string;
  };
}

/**
 * Interface for the request query to find collections using a search string, which contains:
 * - order - The order in which to sort the collections
 * - user - The user of the collection(s)
 *
 * Interface for the request parameters when finding a collection by its ID.
 * - cid - The unique identifier of the collection.
 */
export interface DeleteCollectionRequest extends Request {
  body: {
    user: string;
  };
  params: {
    cid: string;
  };
}
