const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const api = require('../routes');
const Logger = require('../utils/logger.js');
const logger = new Logger();

const line = require('@line/bot-sdk');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

const lineConfig = {
    channelAccessToken : env.LINE_ACCESS_TOKEN,
    channelSecret : env.LINE_SECRET_TOKEN
}

const client = new line.Client(lineConfig);

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(compression());
app.use(cors({ credentials: true, origin: true, exposedHeaders: '*' }));

// Default
app.get('/', (req, res) => {
  res.send('OK');
});

// Api
app.use(api);

// db connection
app.set('db', require('../models/index'));

// line test
app.get('/test', line.middleware(lineConfig),async (req ,res) => {
  try {
      
      return res.status(200).send("OK")
  } catch (err) {
      res.status(500).end();
  }
});

app.post('/webhook', line.middleware(lineConfig), async (req ,res) => {
  try {
      const events = req.body.events;
      console.log('event = >>>',events);
      return events.length > 0 ? await events.map(item => handleEvent(item)):res.status(200).send("OK")
  } catch (err) {
      res.status(500).end();
  }
});

const handleEvent = async (event) => {
  console.log(event);
  return client.replyMessage(event.replyToken,{type:'text',text:'Test'});
}

app.use((req, res, next) => {
  console.log(req.get("host")+req.originalUrl);
  logger.log(
    'the url you are trying to reach is not hosted on our server',
    'error'
  );
  const err = new Error('Not Found');
  err.status = 404;
  res.status(err.status).json({
    type: 'error',
    message: 'the url you are trying to reach is not hosted on our server',
  });
  next(err);
});





module.exports = app;
