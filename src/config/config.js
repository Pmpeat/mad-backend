require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: null,
    database: 'mad_database',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: true,
  },
  test: {
    username: 'root',
    password: null,
    database: 'mad_database',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: true,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
};
