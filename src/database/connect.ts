import { MongoClient } from 'mongodb';
// const { MONGO_URI } = process.env;

export const client = new MongoClient('mongodb://0.0.0.0:27017/todos');

export const db = client.db();
