const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const api = require('../routes');
const Logger = require('../utils/logger.js');
const logger = new Logger();
const line = require('@line/bot-sdk');

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

const lineConfig = {
    channelAccessToken : process.env.LINE_ACCESS_TOKEN,
    channelSecret : process.env.LINE_SECRET_TOKEN
}
app.get('/register', function (req, res)
{
    res.render('register.html');
});

app.get('/success-reject', function (req, res)
{
    res.render('successReject.html');
});

app.get('/false-reject', function (req, res)
{
    res.render('falseReject.html');
});

app.get('/reject-vacation', function (req, res)
{
    res.render('rejectVacation.html');
});

app.get('/success-request', function (req, res)
{
    res.render('successRequest.html');
});

app.get('/approve-vacation', function (req, res)
{
    res.render('approveVacation.html');
});

app.get('/false-line-id', function (req, res)
{
    res.render('falseLineId.html');
});

app.get('/false-remain', function (req, res)
{
    res.render('falseRemain.html');
});

app.get('/false-request', function (req, res)
{
    res.render('falseRequest.html');
});

app.get('/request-order', function (req, res)
{
    res.render('requestOrder.html');
});

app.get('/request-repair', function (req, res)
{
    res.render('requestRepair.html');
});

app.get('/request-vacation', async (req, res) => {
    res.render('requestVacation.html');
});

app.use('/webhook', line.middleware(lineConfig));

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

app.use((req, res, next) => {
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
