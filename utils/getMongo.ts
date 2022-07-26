import { MongoClient } from 'mongodb';

function getMongo() {
  if (!process.env.MONGO_URL) throw new Error(
    'Server cannot connect to database');
  const mongoClient = new MongoClient(process.env.MONGO_URL);
  return mongoClient.db('picktime');
}

export default getMongo;
