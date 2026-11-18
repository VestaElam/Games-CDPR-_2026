const mongoose = require('mongoose');
const crypto = require('node:crypto');
const playerSchema = new mongoose.Schema({
  username: {type:String, unique:true, required:true, trim:true, minlength:2, maxlength:40,
    match:/^[\p{L}\p{N}_. -]+$/u},
  hashedPassword: {type:String, required:true, select:false},
  salt: {type:String, required:true, select:false},
  created: {type:Date, default:Date.now}
}, {collection:'cdpr_players'});
// Виртуальное поле запускает хеширование; открытый пароль в документ не попадает.
playerSchema.virtual('password').set(function(password) {
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    this.invalidate('password', 'Пароль должен содержать от 8 до 128 символов');
    return;
  }
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hashedPassword = this.encryptPassword(password);
});
playerSchema.methods.encryptPassword = function(password) {
  return crypto.scryptSync(password, this.salt, 64).toString('hex');
};
playerSchema.methods.checkPassword = function(password) {
  if (typeof password !== 'string' || password.length > 128 || !this.salt || !this.hashedPassword) return false;
  const actual = Buffer.from(this.encryptPassword(password), 'hex');
  const expected = Buffer.from(this.hashedPassword, 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
};
playerSchema.set('toJSON', {transform:(_doc,ret) => {delete ret.hashedPassword;delete ret.salt;return ret;}});
module.exports.CDPRPlayer = mongoose.model('CDPRPlayer', playerSchema);
