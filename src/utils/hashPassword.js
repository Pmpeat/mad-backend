const bcrypt = require('bcrypt');
const config = require('../config/appconfig');
let password = '';

const hashPassword = (pass) => {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  password = bcrypt.hashSync(pass, parseInt(config.auth.saltRounds));
  return password;
};

module.exports = hashPassword;