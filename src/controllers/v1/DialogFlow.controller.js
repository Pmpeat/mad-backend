const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const BaseController = require('./Base.controller');
const RichController = require('./RichMenu.controller');
const HelperController = require('./Helper.controller');
const UserController = require('./User.controller');
const {
  requestNotiToMadIT
} = require("./Line.controller");
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
        let updatedLinkUser;

        if(response[0].queryResult.intent.displayName === "Register - email"){
          
          updatedLinkUser = await UserController.linkUserLineId(req,res,event);
          console.log(updatedLinkUser);
          if(updatedLinkUser === "success"){
              return client.replyMessage(event.replyToken,{type:'text',text:response[0].queryResult.fulfillmentText});
          } else {
              return client.replyMessage(event.replyToken,{type:'text',text:updatedLinkUser});
          }
      }


        if(response[0].queryResult.intent.displayName === "RequestRepair - problem"){
            const data = {
                lineId: event.source.userId,
                detail: event.message.text,
                status: "รอการตรวจสอบ"
            };
            createNewProblem = await super.create(req, 'request_repairs',data);

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
            createNewOrder = await super.create(req, 'request_orders',data);

            if(!_.isNull(createNewOrder)){
                return client.replyMessage(event.replyToken,{type:'text',text:response[0].queryResult.fulfillmentText});
            } else {
                return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
            }
        }

        // repair check
        if(event.message.text === "ตรวจสอบสถานะการสั่งซ่อม : ไม่รับคำร้อง"){
            const result = await HelperController.findRepair(event.source.userId,"ไม่รับคำร้อง",req,res);
            let texts;
            const dataToMsg = [];
            if(result.length > 0){
                await result.map((element) => { 
                    const arrayData = {
                        "type": "bubble",
                        "direction": "ltr",
                        "header": {
                          "type": "box",
                          "layout": "vertical",
                          "height": "100px",
                          "backgroundColor": "#F73000FF",
                          "contents": [
                            {
                              "type": "box",
                              "layout": "vertical",
                              "flex": 1,
                              "contents": [
                                {
                                  "type": "text",
                                  "text": element.status,
                                  "size": "xl",
                                  "color": "#FFFFFFFF",
                                  "flex": 1,
                                  "align": "center",
                                  "gravity": "center",
                                  "contents": []
                                }
                              ]
                            }
                          ]
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "paddingTop": "20px",
                          "paddingBottom": "30px",
                          "contents": [
                            {
                              "type": "text",
                              "text": element.detail,
                              "align": "center",
                              "contents": []
                            }
                          ]
                        }
                      };
                      dataToMsg.push(arrayData);
                 });

                    texts = {
                        "type": "flex",
                        "altText": "this is a flex message",
                        "contents": {
                            "type": "carousel",
                            "contents": [
                              ...dataToMsg
                            ]
                          }
                      }

                 if(!_.isNull(result)){
                    return client.pushMessage(event.source.userId,texts);
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {
                texts = `ไม่พบคำร้องที่อยู่ในสถานะนี้`;
                return client.replyMessage(event.replyToken,{type:'text',text:texts});
            }
        }
        if(event.message.text === "ตรวจสอบสถานะการสั่งซ่อม : รอการตรวจสอบ"){
            const result = await HelperController.findRepair(event.source.userId,"รอการตรวจสอบ",req,res);
            let texts;
            const dataToMsg = [];
            if(result.length > 0){
                await result.map((element) => { 
                    const arrayData = {
                        "type": "bubble",
                        "direction": "ltr",
                        "header": {
                          "type": "box",
                          "layout": "vertical",
                          "height": "100px",
                          "backgroundColor": "#F7B600FF",
                          "contents": [
                            {
                              "type": "box",
                              "layout": "vertical",
                              "flex": 1,
                              "contents": [
                                {
                                  "type": "text",
                                  "text": element.status,
                                  "size": "xl",
                                  "color": "#FFFFFFFF",
                                  "flex": 1,
                                  "align": "center",
                                  "gravity": "center",
                                  "contents": []
                                }
                              ]
                            }
                          ]
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "paddingTop": "20px",
                          "paddingBottom": "30px",
                          "contents": [
                            {
                              "type": "text",
                              "text": element.detail,
                              "align": "center",
                              "contents": []
                            }
                          ]
                        }
                      };
                      dataToMsg.push(arrayData);
                 });

                    texts = {
                        "type": "flex",
                        "altText": "this is a flex message",
                        "contents": {
                            "type": "carousel",
                            "contents": [
                              ...dataToMsg
                            ]
                          }
                      }

                 if(!_.isNull(result)){
                    return client.pushMessage(event.source.userId,texts);
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {
                texts = `ไม่พบคำร้องที่อยู่ในสถานะนี้`;
                return client.replyMessage(event.replyToken,{type:'text',text:texts});
            }
        }
        if(event.message.text === "ตรวจสอบสถานะการสั่งซ่อม : แก้ไขแล้ว"){
            const result = await HelperController.findRepair(event.source.userId,"แก้ไขแล้ว",req,res);
            let texts;
            const dataToMsg = [];
            if(result.length > 0){
                await result.map((element) => { 
                    const arrayData = {
                        "type": "bubble",
                        "direction": "ltr",
                        "header": {
                          "type": "box",
                          "layout": "vertical",
                          "height": "100px",
                          "backgroundColor": "#3BC001FF",
                          "contents": [
                            {
                              "type": "box",
                              "layout": "vertical",
                              "flex": 1,
                              "contents": [
                                {
                                  "type": "text",
                                  "text": element.status,
                                  "size": "xl",
                                  "color": "#FFFFFFFF",
                                  "flex": 1,
                                  "align": "center",
                                  "gravity": "center",
                                  "contents": []
                                }
                              ]
                            }
                          ]
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "paddingTop": "20px",
                          "paddingBottom": "30px",
                          "contents": [
                            {
                              "type": "text",
                              "text": element.detail,
                              "align": "center",
                              "contents": []
                            }
                          ]
                        }
                      };
                      dataToMsg.push(arrayData);
                 });

                    texts = {
                        "type": "flex",
                        "altText": "this is a flex message",
                        "contents": {
                            "type": "carousel",
                            "contents": [
                              ...dataToMsg
                            ]
                          }
                      }

                 if(!_.isNull(result)){
                    return client.pushMessage(event.source.userId,texts);
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
            const result = await HelperController.findOrder(event.source.userId,"ไม่รับคำร้อง",req,res);
            let texts;
            const dataToMsg = [];
            if(result.length > 0){
                await result.map((element) => { 
                    const arrayData = {
                        "type": "bubble",
                        "direction": "ltr",
                        "header": {
                          "type": "box",
                          "layout": "vertical",
                          "height": "100px",
                          "backgroundColor": "#F73000FF",
                          "contents": [
                            {
                              "type": "box",
                              "layout": "vertical",
                              "flex": 1,
                              "contents": [
                                {
                                  "type": "text",
                                  "text": element.status,
                                  "size": "xl",
                                  "color": "#FFFFFFFF",
                                  "flex": 1,
                                  "align": "center",
                                  "gravity": "center",
                                  "contents": []
                                }
                              ]
                            }
                          ]
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "paddingTop": "20px",
                          "paddingBottom": "30px",
                          "contents": [
                            {
                              "type": "text",
                              "text": element.detail,
                              "align": "center",
                              "contents": []
                            }
                          ]
                        }
                      };
                      dataToMsg.push(arrayData);
                 });

                    texts = {
                        "type": "flex",
                        "altText": "this is a flex message",
                        "contents": {
                            "type": "carousel",
                            "contents": [
                              ...dataToMsg
                            ]
                          }
                      }

                 if(!_.isNull(result)){
                    return client.pushMessage(event.source.userId,texts);
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {
                texts = `ไม่พบคำร้องที่อยู่ในสถานะนี้`;
                return client.replyMessage(event.replyToken,{type:'text',text:texts});
            }
        }
        if(event.message.text === "ตรวจสอบสถานะการสั่งซื้อ : รอการตรวจสอบ"){
            const result = await HelperController.findOrder(event.source.userId,"รอการตรวจสอบ",req,res);
            let texts;
            const dataToMsg = [];
            if(result.length > 0){
                await result.map((element) => { 
                    const arrayData = {
                        "type": "bubble",
                        "direction": "ltr",
                        "header": {
                          "type": "box",
                          "layout": "vertical",
                          "height": "100px",
                          "backgroundColor": "#F7B600FF",
                          "contents": [
                            {
                              "type": "box",
                              "layout": "vertical",
                              "flex": 1,
                              "contents": [
                                {
                                  "type": "text",
                                  "text": element.status,
                                  "size": "xl",
                                  "color": "#FFFFFFFF",
                                  "flex": 1,
                                  "align": "center",
                                  "gravity": "center",
                                  "contents": []
                                }
                              ]
                            }
                          ]
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "paddingTop": "20px",
                          "paddingBottom": "30px",
                          "contents": [
                            {
                              "type": "text",
                              "text": element.detail,
                              "align": "center",
                              "contents": []
                            }
                          ]
                        }
                      };
                      dataToMsg.push(arrayData);
                 });

                    texts = {
                        "type": "flex",
                        "altText": "this is a flex message",
                        "contents": {
                            "type": "carousel",
                            "contents": [
                              ...dataToMsg
                            ]
                          }
                      }

                 if(!_.isNull(result)){
                    return client.pushMessage(event.source.userId,texts);
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {
                texts = `ไม่พบคำร้องที่อยู่ในสถานะนี้`;
                return client.replyMessage(event.replyToken,{type:'text',text:texts});
            }
        }
        if(event.message.text === "ตรวจสอบสถานะการสั่งซื้อ: สั่งซื้อแล้ว"){
            const result = await HelperController.findOrder(event.source.userId,"สั่งซื้อแล้ว",req,res);
            let texts;
            const dataToMsg = [];
            if(result.length > 0){
                await result.map((element) => { 
                    const arrayData = {
                        "type": "bubble",
                        "direction": "ltr",
                        "header": {
                          "type": "box",
                          "layout": "vertical",
                          "height": "100px",
                          "backgroundColor": "#3BC001FF",
                          "contents": [
                            {
                              "type": "box",
                              "layout": "vertical",
                              "flex": 1,
                              "contents": [
                                {
                                  "type": "text",
                                  "text": element.status,
                                  "size": "xl",
                                  "color": "#FFFFFFFF",
                                  "flex": 1,
                                  "align": "center",
                                  "gravity": "center",
                                  "contents": []
                                }
                              ]
                            }
                          ]
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "paddingTop": "20px",
                          "paddingBottom": "30px",
                          "contents": [
                            {
                              "type": "text",
                              "text": element.detail,
                              "align": "center",
                              "contents": []
                            }
                          ]
                        }
                      };
                      dataToMsg.push(arrayData);
                 });

                    texts = {
                        "type": "flex",
                        "altText": "this is a flex message",
                        "contents": {
                            "type": "carousel",
                            "contents": [
                              ...dataToMsg
                            ]
                          }
                      }

                 if(!_.isNull(result)){
                    return client.pushMessage(event.source.userId,texts);
                } else {
                    return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
                }
                
            } else {
                texts = `ไม่พบคำร้องที่อยู่ในสถานะนี้`;
                return client.replyMessage(event.replyToken,{type:'text',text:texts});
            }
        }
        // order check

        // vacation
        if(event.message.text === "เช็ควันลา"){
          const result = await HelperController.findUserVacation(req,res,event);
          const texts = {
            "type": "flex",
            "altText": "วันลาทั้งหมดของคุณ",
            "contents": {
                "type": "carousel",
                "contents": [
                  {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                      "type": "box",
                      "layout": "vertical",
                      "flex": 1,
                      "height": "80px",
                      "backgroundColor": "#FFFFFFFF",
                      "contents": [
                        {
                          "type": "text",
                          "text": "วันลาทั้งหมดของคุณ",
                          "weight": "bold",
                          "size": "lg",
                          "color": "#000000FF",
                          "flex": 1,
                          "align": "center",
                          "gravity": "center",
                          "contents": []
                        },
                        {
                          "type": "text",
                          "text": "รายละเอียด",
                          "flex": 1,
                          "align": "center",
                          "gravity": "center",
                          "contents": []
                        }
                      ]
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": `ลาพักร้อน`,
                          "align": "start",
                          "gravity": "center",
                          "contents": [
                            {
                              "type": "span",
                              "text": "ลาพักร้อน คงเหลือ"
                            },
                            {
                              "type": "span",
                              "text": " : "
                            },
                            {
                              "type": "span",
                              "text": `${result[0].dataValues.vacationLeave} `,
                              "color": "#39BA00FF"
                            },
                            {
                              "type": "span",
                              "text": "วัน"
                            }
                          ]
                        },
                        {
                          "type": "text",
                          "text": `ลาป่วย`,
                          "align": "start",
                          "gravity": "center",
                          "contents": [
                            {
                              "type": "span",
                              "text": `ลาป่วย คงเหลือ`
                            },
                            {
                              "type": "span",
                              "text": " : "
                            },
                            {
                              "type": "span",
                              "text": `${result[0].dataValues.sickLeave} `,
                              "color": "#39BA00FF"
                            },
                            {
                              "type": "span",
                              "text": "วัน"
                            }
                          ]
                        },
                        {
                          "type": "text",
                          "text": "ลากิจ",
                          "align": "start",
                          "gravity": "center",
                          "contents": [
                            {
                              "type": "span",
                              "text": `ลากิจ คงเหลือ`
                            },
                            {
                              "type": "span",
                              "text": " : "
                            },
                            {
                              "type": "span",
                              "text": `${result[0].dataValues.personalLeave} `,
                              "color": "#39BA00FF"
                            },
                            {
                              "type": "span",
                              "text": "วัน"
                            }
                          ]
                        },
                        {
                          "type": "text",
                          "text": `ลาไม่รับเงิน`,
                          "align": "start",
                          "gravity": "center",
                          "contents": [
                            {
                              "type": "span",
                              "text": "ลาไม่รับเงิน ใช้ไปแล้ว"
                            },
                            {
                              "type": "span",
                              "text": " : "
                            },
                            {
                              "type": "span",
                              "text": `${result[0].dataValues.leaveWithoutPayment} `,
                              "color": "#F73000FF"
                            },
                            {
                              "type": "span",
                              "text": "วัน"
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              }
          }

          if(!_.isNull(result)){
              return client.pushMessage(event.source.userId,texts);
          } else {
              return client.replyMessage(event.replyToken,{type:'text',text:"ระบบขัดข้อง กรุณาติดต่อฝ่าย it"});
          }
        }
        // vacation

        let resultRichMenu = "default";

        if(event.message.text === "ไปยังหน้า IT" || event.message.text === "ย้อนกลับหน้า IT"){
          resultRichMenu = await RichController.pageMainIt(event.source.userId);
        }

        if(event.message.text === "ไปยังหน้า การลา"){
          resultRichMenu = await RichController.pageMainVacation(event.source.userId);
        }

        if(event.message.text === "ตรวจสอบสถานะการสั่งซ่อม"){
            resultRichMenu = await RichController.pageCheckRepair(event.source.userId);
        }

        if(event.message.text === "ตรวจสอบสถานะการสั่งซื้อ"){
            resultRichMenu = await RichController.pageCheckOrder(event.source.userId);
        }

        if(event.message.text === "ย้อนกลับ"){
          resultRichMenu = await RichController.pageMainMenu(event.source.userId);
        }

       

         if (response[0].queryResult.intent.displayName === "Default Fallback Intent" && resultRichMenu !== "changeScene"
            || response[0].queryResult.intent.displayName === "RequestOrder" && resultRichMenu !== "changeScene"
            || response[0].queryResult.intent.displayName === "RequestRepair" && resultRichMenu !== "changeScene"
            || response[0].queryResult.intent.displayName === "Joke" && resultRichMenu !== "changeScene"
            || response[0].queryResult.intent.displayName === "Default Welcome Intent" && resultRichMenu !== "changeScene"
            || response[0].queryResult.intent.displayName === "Register" && resultRichMenu !== "changeScene"
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

  static async pushMessageTest (data) {
    texts = {
      "type": "flex",
      "altText": "this is a flex message",
      "contents": {
          "type": "carousel",
          "contents": [
            {
              "type": "bubble",
              "direction": "ltr",
              "header": {
                "type": "box",
                "layout": "vertical",
                "flex": 1,
                "height": "100px",
                "backgroundColor": "#58C339FF",
                "contents": [
                  {
                    "type": "text",
                    "text": "คำร้องของคุณ",
                    "weight": "bold",
                    "size": "lg",
                    "flex": 1,
                    "align": "center",
                    "gravity": "center",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "ได้รับการเปลี่ยนสถานะ",
                    "flex": 1,
                    "align": "center",
                    "gravity": "center",
                    "contents": []
                  }
                ]
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "รายละเอียดคำร้อง :",
                    "align": "start",
                    "gravity": "center",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "สถานะล่าสุด :",
                    "contents": []
                  }
                ]
              }
            }
          ]
        }
    }

    return client.pushMessage(data.lineUserId,texts);
  }

  
}

module.exports = DialogFlow;
