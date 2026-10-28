const { MongoClient } = require('mongodb');
const { data } = require('./cdprGameData');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'cdpr_worlds_2026';

async function main() {
  await client.connect();
  const collection = client.db(dbName).collection('cdpr_games');
  const existing = await collection.countDocuments();
  if (existing === 0) {
    const result = await collection.insertMany(data);
    console.log('Seeded CDPR games:', result.insertedCount);
  } else {
    console.log('CDPR games already seeded:', existing);
  }
  console.log('Catalog count:', await collection.countDocuments());
}

main().catch(console.error).finally(() => client.close());
