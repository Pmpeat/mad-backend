const BaseController = require('./Base.controller');
const RequestHandler = require('../../utils/RequestHandler');
const Logger = require('../../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

class DialogFlow extends BaseController {

  static async handleEvent (event) {
    return client.replyMessage(event.replyToken,{type:'text',text:'Test'});
  }
}

module.exports = DialogFlow;
