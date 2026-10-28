const mongoose = require('mongoose');

const mongoUrl = 'mongodb://127.0.0.1:27017/cdpr_worlds_2026';
const connection = mongoose.connect(mongoUrl);
const CDPRGame = mongoose.model('CDPRGame', { title: String });

async function main() {
  await connection;
  const game = new CDPRGame({ title: 'Cyberpunk 2077' });
  await game.save();
  console.log('Mongoose CDPR model saved:', game.title);
}

main().catch(console.error).finally(() => mongoose.disconnect());
