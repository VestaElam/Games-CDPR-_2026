const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cdprGameSchema = new Schema({
  title: String,
  gameId: { type: String, unique: true, required: true },
  world: String,
  cover: String,
  desc: String,
  year: Number,
  facts: [String],
  created: { type: Date, default: Date.now }
});

module.exports.CDPRGame = mongoose.model('CDPRGame', cdprGameSchema);
