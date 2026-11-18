const mongoose = require('mongoose');
const cdprGameSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  gameId: { type: String, required: true, unique: true, match: /^[a-z0-9-]+$/ },
  world: String, cover: String, desc: String, year: Number,
  tag: String, subtitle: String, detail: String, facts: [String],
  created: { type: Date, default: Date.now }
}, { collection: 'cdpr_games' });
cdprGameSchema.methods.describe = function() { return this.title + ' — игра из мира CD PROJEKT RED'; };
module.exports.CDPRGame = mongoose.model('CDPRGame', cdprGameSchema);
