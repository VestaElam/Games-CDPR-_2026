const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'cdpr_worlds_2026';
const data = require('./cdprGameData').data;

async function main() {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('cdpr_games_demo');
  const result = await collection.insertMany([
    { id: 'cyberpunk', name: 'Cyberpunk 2077', world: 'cyberpunk' },
    { id: 'witcher3', name: 'Ведьмак 3: Дикая Охота', world: 'witcher' },
    { id: 'gwent', name: 'ГВИНТ: Ведьмак. Карточная игра', world: 'witcher' }
  ]);
  console.log('Connected successfully to MongoDB');
  console.log('Inserted CDPR demo documents:', result.insertedCount);
  console.log('Database:', dbName, 'Collection:', collection.collectionName);
}

main().catch(console.error).finally(() => client.close());

