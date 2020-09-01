//const crypto = require('crypto');
const bcrypt = require("bcryptjs");

const genPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const validPassword = async (password, hash) => {
  const hashVerify = await bcrypt.compare(password, hash);
  return hashVerify;
};

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
