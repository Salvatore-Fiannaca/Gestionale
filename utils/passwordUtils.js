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

const tmpPass = () => {
  let length = 10,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*-/+",
    retVal = "";

  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.tmpPass = tmpPass;
