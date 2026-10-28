const mongoose = require('mongoose');

const mongoUrl = 'mongodb://127.0.0.1:27017/cdpr_worlds_2026';
const connection = mongoose.connect(mongoUrl);
const cdprGameSchema = new mongoose.Schema({ title: String });
cdprGameSchema.methods.describe = function() {
  return this.title + ' — игра из мира CD PROJEKT RED';
};
const CDPRGame = mongoose.model('CDPRGame', cdprGameSchema);

async function main() {
  await connection;
  const game = new CDPRGame({ title: 'Ведьмак 3: Дикая Охота' });
  console.log(game.describe());
  await game.save();
}

main().catch(console.error).finally(() => mongoose.disconnect());
