const Joi = require('joi');
const bcrypt = require('bcrypt');
const axios = require('axios');
const _ = require('lodash');
const BaseController = require('./Base.controller');
const RequestHandler = require('../../utils/RequestHandler');
const Logger = require('../../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

const dialogflow = require('dialogflow');
const line = require('@line/bot-sdk');

const dialogflowConfig = {
    googleProjectId: process.env.GOOGLE_PROJECT_ID,
    googlePrivateKeyId: process.env.GOOGLE_PRIVATE_KEY_ID,
    googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
}

const lineConfig = {
    channelAccessToken : process.env.LINE_ACCESS_TOKEN,
    channelSecret : process.env.LINE_SECRET_TOKEN
}

const client = new line.Client(lineConfig);



const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
const googleProjectId = process.env.GOOGLE_PROJECT_ID;
const dialogFlowSessionId = process.env.DIALOG_FLOW_SESSION_ID;
const dialogFlowLanguageCode = process.env.DIALOG_FLOW_SESSION_LANGUAGE_CODE;
const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: googlePrivateKey,
}

// Create a new session
const sessionClient = new dialogflow.SessionsClient({googleProjectId,credentials});
// const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const richMenuObjectA = () => ({
    size: {
      width: 2500,
      height: 1686
    },
    selected: false,
    name: "richmenu-a",
    chatBarText: "Tap to open",
    areas: [
      {
        bounds: {
          x: 0,
          y: 0,
          width: 1250,
          height: 1686
        },
        action: {
          type: "uri",
          uri: "https://www.line-community.me/"
        }
      },
      {
        bounds: {
          x: 1251,
          y: 0,
          width: 1250,
          height: 1686
        },
        action: {
          type: "richmenuswitch",
          richMenuAliasId: "richmenu-alias-b",
          data: "richmenu-changed-to-b"
        }
      }
    ]
  });
  
  const richMenuObjectB = () => ({
    size: {
      width: 2500,
      height: 1686
    },
    selected: false,
    name: "richmenu-b",
    chatBarText: "Tap to open",
    areas: [
      {
        bounds: {
          x: 0,
          y: 0,
          width: 1250,
          height: 1686
        },
        action: {
          type: "richmenuswitch",
          richMenuAliasId: "richmenu-alias-a",
          data: "richmenu-changed-to-a"
        }
      },
        {
        bounds: {
          x: 1251,
          y: 0,
          width: 1250,
          height: 1686
        },
        action: {
          type: "uri",
          uri: "https://www.line-community.me/"
        }
      }
    ]
  });

class RichMenu extends BaseController {

 static async createRishMenu () {
    const richMenuAId = await client.createRichMenu(
        richMenuObjectA()
    );
    const richMenuBId = await client.createRichMenu(
        richMenuObjectB()
    );
    await client.createRichMenuAlias(richMenuAId, 'richmenu-alias-a');
    await client.createRichMenuAlias(richMenuBId, 'richmenu-alias-b');
    client.setDefaultRichMenu("richmenu-alias-a");
 }

  
}

module.exports = RichMenu;
