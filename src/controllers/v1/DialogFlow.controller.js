const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const BaseController = require('./Base.controller');
const RichController = require('./RichMenu.controller');
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
        let createNewOrder;

        if(response[0].queryResult.intent.displayName === "RequestRepair - problem"){
            const data = {
                lineId: event.source.userId,
                detail: event.message.text,
                status: "รอการตรวจสอบ"
            };
            createNewProblem = await super.create(req, 'request_repair',data);

            if(!_.isNull(createNewProblem)){
                return client.replyMessage(event.replyToken,{type:'text',text:response[0].queryResult.fulfillmentText});
            } else {
                return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
            }
        }
        
        if(response[0].queryResult.intent.displayName === "RequestOrder - order"){
            const data = {
                lineId: event.source.userId,
                detail: event.message.text,
                status: "รอการตรวจสอบ"
            };
            createNewOrder = await super.create(req, 'request_order',data);

            if(!_.isNull(createNewOrder)){
                return client.replyMessage(event.replyToken,{type:'text',text:response[0].queryResult.fulfillmentText});
            } else {
                return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
            }
        }

        // repair check
        if(event.message.text === "ตรวจสอบสถานะการสั่งซ่อม : ไม่รับคำร้อง"){
            const result = await this.findRepair(event.source.userId,"ไม่รับคำร้อง",req,res);
            let texts;
            if(result.length > 0){
                texts = `ผู้ใช้รหัส : ${result[0].lineId}\n`;
                result.map((element) => { 
                    texts += `\nปัญหา : \n${element.detail}`;
                    texts += `\nสถานะ: ${element.status}`;
                 });

                 if(!_.isNull(result)){
                    return client.replyMessage(event.replyToken,{type:'text',text:texts});
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {
                texts = `ไม่พบคำร้องที่อยู่ในสถานะนี้`;
                return client.replyMessage(event.replyToken,{type:'text',text:texts});
            }
        }

        if(event.message.text === "ตรวจสอบสถานะการสั่งซ่อม : รอการตรวจสอบ"){
            const result = await this.findRepair(event.source.userId,"รอการตรวจสอบ",req,res);
            let texts;
            if(result.length > 0){
                texts = `ผู้ใช้รหัส : ${result[0].lineId}\n`;
                result.map((element) => { 
                    texts += `\nปัญหา : \n${element.detail}`;
                    texts += `\nสถานะ: ${element.status}`;
                 });

                 if(!_.isNull(result)){
                    return client.replyMessage(event.replyToken,{type:'text',text:texts});
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {
                texts = `ไม่พบคำร้องที่อยู่ในสถานะนี้`;
                return client.replyMessage(event.replyToken,{type:'text',text:texts});
            }
        }

        if(event.message.text === "ตรวจสอบสถานะการสั่งซ่อม : แก้ไขแล้ว"){
            const result = await this.findRepair(event.source.userId,"แก้ไขแล้ว",req,res);
            let texts;
            if(result.length > 0){
                texts = `ผู้ใช้รหัส : ${result[0].lineId}\n`;
                result.map((element) => { 
                    texts += `\nปัญหา : \n${element.detail}`;
                    texts += `\nสถานะ: ${element.status}`;
                 });

                 if(!_.isNull(result)){
                    return client.replyMessage(event.replyToken,{type:'text',text:texts});
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {
                texts = `ไม่พบคำร้องที่อยู่ในสถานะนี้`;
                return client.replyMessage(event.replyToken,{type:'text',text:texts});
            }
        }

        
        // repair check

        // order check
        if(event.message.text === "ตรวจสอบสถานะการสั่งซื้อ : ไม่รับคำร้อง"){
            const result = await this.findOrder(event.source.userId,"ไม่รับคำร้อง",req,res);
            let texts;
            if(result.length > 0){
                texts = `ผู้ใช้รหัส : ${result[0].lineId}\n`;
                result.map((element) => { 
                    texts += `\nคำสั่งซื้อ : \n${element.detail}`;
                    texts += `\nสถานะ: ${element.status}`;
                 });

                 if(!_.isNull(result)){
                    return client.replyMessage(event.replyToken,{type:'text',text:texts});
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {
                texts = `ไม่พบคำร้องที่อยู่ในสถานะนี้`;
                return client.replyMessage(event.replyToken,{type:'text',text:texts});
            }
        }
        if(event.message.text === "ตรวจสอบสถานะการสั่งซื้อ : รอการตรวจสอบ"){
            const result = await this.findOrder(event.source.userId,"รอการตรวจสอบ",req,res);
            let texts;
            if(result.length > 0){
                texts = `ผู้ใช้รหัส : ${result[0].lineId}\n`;
                result.map((element) => { 
                    texts += `\nคำสั่งซื้อ : \n${element.detail}`;
                    texts += `\nสถานะ: ${element.status}`;
                 });

                 if(!_.isNull(result)){
                    return client.replyMessage(event.replyToken,{type:'text',text:texts});
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {
                texts = `ไม่พบคำร้องที่อยู่ในสถานะนี้`;
                return client.replyMessage(event.replyToken,{type:'text',text:texts});
            }
        }
        if(event.message.text === "ตรวจสอบสถานะการสั่งซื้อ: สั่งซื้อแล้ว"){
            const result = await this.findOrder(event.source.userId,"สั่งซื้อแล้ว",req,res);
            let texts;
            if(result.length > 0){
                texts = `ผู้ใช้รหัส : ${result[0].lineId}\n`;
                result.map((element) => { 
                    texts += `\nคำสั่งซื้อ : \n${element.detail}`;
                    texts += `\nสถานะ: ${element.status}`;
                 });

                 if(!_.isNull(result)){
                    return client.replyMessage(event.replyToken,{type:'text',text:texts});
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {
                texts = `ไม่พบคำร้องที่อยู่ในสถานะนี้`;
                return client.replyMessage(event.replyToken,{type:'text',text:texts});
            }
        }

        // order check

        let resultRichMenu = "default";

        if(event.message.text === "ตรวจสอบสถานะการสั่งซ่อม"){
            resultRichMenu = await RichController.nextCheckRepair(event.source.userId);
        }

        if(event.message.text === "ตรวจสอบสถานะการสั่งซื้อ"){
            resultRichMenu = await RichController.nextCheckOrder(event.source.userId);
        }

        if(event.message.text === "ย้อนกลับ"){
            resultRichMenu = await RichController.backCheckRepair(event.source.userId);
        }
        console.log(resultRichMenu);
         if (response[0].queryResult.intent.displayName === "Default Fallback Intent" && resultRichMenu !== "changeScene"
            || response[0].queryResult.intent.displayName === "RequestOrder" && resultRichMenu !== "changeScene"
            || response[0].queryResult.intent.displayName === "RequestRepair" && resultRichMenu !== "changeScene"
            || response[0].queryResult.intent.displayName === "Joke" && resultRichMenu !== "changeScene"
            || response[0].queryResult.intent.displayName === "Default Welcome Intent" && resultRichMenu !== "changeScene"
         ) {
            return client.replyMessage(event.replyToken,{type:'text',text:response[0].queryResult.fulfillmentText});
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

  static async findRepair (userId,state,req,res) {
    try {
        const options = {
            where : {lineId:userId,status:state},
            limit : 4,
            order: [['id', 'desc']],
          };
          const result = await super.getList(req, 'request_repair', options);
       return result;
    } catch(err) {
        console.log(err);
    }
  }

  static async findOrder (userId,state,req,res) {
    try {
        const options = {
            where : {lineId:userId,status:state},
            limit : 4,
            order: [['id', 'desc']],
          };
          const result = await super.getList(req, 'request_order', options);
       return result;
    } catch(err) {
        console.log(err);
    }
  }

  
}

module.exports = DialogFlow;
