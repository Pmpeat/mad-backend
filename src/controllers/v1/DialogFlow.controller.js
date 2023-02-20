const BaseController = require('./Base.controller');
const RequestHandler = require('../../utils/RequestHandler');
const Logger = require('../../utils/logger');
const line = require('@line/bot-sdk');

const lineConfig = {
    channelAccessToken : process.env.LINE_ACCESS_TOKEN,
    channelSecret : process.env.LINE_SECRET_TOKEN
}

const client = new line.Client(lineConfig);
const logger = new Logger();
const requestHandler = new RequestHandler(logger);

class DialogFlow extends BaseController {

  static async handleEvent (event) {
    return client.replyMessage(event.replyToken,{type:'text',text:'Test'});
  }
}

module.exports = DialogFlow;
