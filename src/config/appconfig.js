require('dotenv').config();

module.exports = {
  app: {
    port: process.env.DEV_APP_PORT || 3001,
    appName: process.env.APP_NAME || 'IMMTRIP',
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'immtrip_database',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  },
  winston: {
    logpath: 'immtrip/logs/',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    saltRounds: process.env.SALT_ROUND || 10,
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET || 'uhwLE3mY6f8SrQuCrBs9R5==',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '2d',
  },
};
