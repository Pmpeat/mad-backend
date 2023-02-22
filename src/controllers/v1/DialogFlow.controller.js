const Joi = require('joi');
const bcrypt = require('bcrypt');
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

class DialogFlow extends BaseController {
    
  static async handleEvent (req ,res,event) {
    if(event.type !== 'message'|| event.message.type !== 'text'){
        return null;
    } else if (event.type === 'message') {
        const response = await this.textQuery(event.message.text,'madoffice-clsc');

        let createNewProblem;
        if(response[0].queryResult.intent.displayName === "RequestRepair - problem"){
            const data = {
                lineId: event.source.userId,
                detail: event.message.text
            };
            createNewProblem = await super.create(req, 'request_repair',data);

            if(!_.isNull(createNewProblem)){
                return client.replyMessage(event.replyToken,{type:'text',text:response[0].queryResult.fulfillmentText});
            } else {
                return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
            }
        }
        let createNewOrder;
        if(response[0].queryResult.intent.displayName === "RequestOrder - order"){
            const data = {
                lineId: event.source.userId,
                detail: event.message.text
            };
            createNewOrder = await super.create(req, 'request_order',data);

            if(!_.isNull(createNewOrder)){
                return client.replyMessage(event.replyToken,{type:'text',text:response[0].queryResult.fulfillmentText});
            } else {
                return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
            }
        }

        if(response[0].queryResult.intent.displayName === "CheckRepair"){
            const result = this.findRepair(event.source.userId,req,res);
            console.log(result);
            let texts;
            if(result.length > 0){
                texts = `ผู้ใช้รหัส : ${result[0].lineId}`;
                // result.map((element) => { 
                //     texts += `/nปัญหาที่ยังไม่ได้รับการแก้ไข : /n${element.detail}`;
                //     texts += `/nสถานะ: ${element.detail}`;
                //  });

                 if(!_.isNull(result)){
                    return client.replyMessage(event.replyToken,{type:'text',text:texts});
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {

            }
        }

        
    }
    
  }

  static async textQuery (userText,userId) {
    const sessionPath = sessionClient.sessionPath(googleProjectId, dialogFlowSessionId+userId);
    const request = {
        session: sessionPath,
        queryInput:{
            text:{
                text:userText,
                languageCode:dialogFlowLanguageCode
            }
        }
    }

    try {
        const response = await sessionClient.detectIntent(request);
        return response;
    } catch(err) {
        console.log(err);
    }
  }

  static async findRepair (userId,req,res) {
    try {
        const options = {
            where : {lineId:userId}
          };
          const result = await super.getList(req, 'request_repair', options);
       return result;
    } catch(err) {
        console.log(err);
    }
  }
}

module.exports = DialogFlow;
