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
const richMenuMain = process.env.RICH_MENU_ID_MAIN;
const richMenuMainIT = process.env.RICH_MENU_ID_MAIN_IT;
const richMenuRepair = process.env.RICH_MENU_ID_REPAIR;
const richMenuOrder = process.env.RICH_MENU_ID_ORDER;
// Create a new session
const sessionClient = new dialogflow.SessionsClient({googleProjectId,credentials});
// const sessionPath = sessionClient.sessionPath(projectId, sessionId);


class RichMenu extends BaseController {

    static async pageMainIt (userId) {
    try {
        const response = await client.linkRichMenuToUser(userId,richMenuMainIT);
        return "changeScene";
    } catch (err) {
        console.log(err);
    }
    }

    static async pageCheckRepair (userId) {
        try {
        const response = await client.linkRichMenuToUser(userId,richMenuRepair);
        return "changeScene";
        } catch (err) {
            console.log(err);
        }
    }

    static async pageCheckOrder (userId) {
        try {
        const response = await client.linkRichMenuToUser(userId,richMenuOrder);
        return "changeScene";
        } catch (err) {
            console.log(err);
        }
    }

    static async pageMainMenu (userId) {
        try {
            const response = await client.unlinkRichMenuFromUser(userId,richMenuMain);
            return "changeScene";
        } catch (err) {
            console.log(err);
        }
    }

  
}

module.exports = RichMenu;
