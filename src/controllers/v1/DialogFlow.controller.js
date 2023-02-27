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
            const dataToMsg = [];
            if(result.length > 0){
                await result.map((element) => { 
                    const arrayData = {
                        type: "bubble",
                        size: "nano",
                        header: {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "text",
                              text: element.status,
                              color: "#ffffff",
                              align: "start",
                              size: "md",
                              gravity: "center"
                            },
                            {
                              type: "text",
                              text: "100%",
                              color: "#ffffff",
                              align: "start",
                              size: "xs",
                              gravity: "center",
                              margin: "lg"
                            },
                            {
                              type: "box",
                              layout: "vertical",
                              contents: [
                                {
                                  type: "box",
                                  layout: "vertical",
                                  contents: [
                                    {
                                      type: "filler"
                                    }
                                  ],
                                  width: "0%",
                                  backgroundColor: "#DE5658",
                                  height: "6px"
                                }
                              ],
                              backgroundColor: "#FAD2A76E",
                              height: "6px",
                              margin: "sm"
                            }
                          ],
                          backgroundColor: "#FF6B6E",
                          paddingTop: "19px",
                          paddingAll: "12px",
                          paddingBottom: "16px"
                        },
                        body: {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "box",
                              layout: "horizontal",
                              contents: [
                                {
                                  type: "text",
                                  text: element.detail,
                                  color: "#8C8C8C",
                                  size: "sm",
                                  wrap: true
                                }
                              ],
                              flex: 1
                            }
                          ],
                          spacing: "md",
                          paddingAll: "12px"
                        },
                        styles: {
                          footer: {
                            separator: false
                          }
                        }
                      }
                      dataToMsg.push(arrayData);
                 });
                 texts = {
                    type: "carousel",
                    contents: [...dataToMsg]
                  }

                 if(!_.isNull(result)){
                    return client.replyMessage(event.replyToken,texts);
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
            const dataToMsg = [];
            if(result.length > 0){
                await result.map((element) => { 
                    const arrayData = {
                        "type": "bubble",
                        "size": "nano",
                        "header": {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "test",
                              "color": "#ffffff",
                              "align": "start",
                              "size": "md",
                              "gravity": "center"
                            },
                            {
                              "type": "text",
                              "text": "100%",
                              "color": "#ffffff",
                              "align": "start",
                              "size": "xs",
                              "gravity": "center",
                              "margin": "lg"
                            },
                            {
                              "type": "box",
                              "layout": "vertical",
                              "contents": [
                                {
                                  "type": "box",
                                  "layout": "vertical",
                                  "contents": [
                                    {
                                      "type": "filler"
                                    }
                                  ],
                                  "width": "70%",
                                  "backgroundColor": "#FAE089",
                                  "height": "6px"
                                }
                              ],
                              "backgroundColor": "#FAF4B8",
                              "height": "6px",
                              "margin": "sm"
                            }
                          ],
                          "backgroundColor": "#FDF97E",
                          "paddingTop": "19px",
                          "paddingAll": "12px",
                          "paddingBottom": "16px"
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "box",
                              "layout": "horizontal",
                              "contents": [
                                {
                                  "type": "text",
                                  "text": "test",
                                  "color": "#8C8C8C",
                                  "size": "sm",
                                  "wrap": true
                                }
                              ],
                              "flex": 1
                            }
                          ],
                          "spacing": "md",
                          "paddingAll": "12px"
                        },
                        "styles": {
                          "footer": {
                            "separator": false
                          }
                        }
                      }
                      dataToMsg.push(arrayData);
                 });
                //  texts = {
                //     "type": "carousel",
                //     "contents": [...dataToMsg]
                //   }

                texts = {
                    "type": "bubble",
                    "hero": {
                      "type": "image",
                      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
                      "size": "full",
                      "aspectRatio": "20:13",
                      "aspectMode": "cover",
                      "action": {
                        "type": "uri",
                        "uri": "http://linecorp.com/"
                      }
                    },
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "Brown Cafe",
                          "weight": "bold",
                          "size": "xl"
                        },
                        {
                          "type": "box",
                          "layout": "baseline",
                          "margin": "md",
                          "contents": [
                            {
                              "type": "icon",
                              "size": "sm",
                              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                            },
                            {
                              "type": "icon",
                              "size": "sm",
                              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                            },
                            {
                              "type": "icon",
                              "size": "sm",
                              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                            },
                            {
                              "type": "icon",
                              "size": "sm",
                              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                            },
                            {
                              "type": "icon",
                              "size": "sm",
                              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                            },
                            {
                              "type": "text",
                              "text": "4.0",
                              "size": "sm",
                              "color": "#999999",
                              "margin": "md",
                              "flex": 0
                            }
                          ]
                        },
                        {
                          "type": "box",
                          "layout": "vertical",
                          "margin": "lg",
                          "spacing": "sm",
                          "contents": [
                            {
                              "type": "box",
                              "layout": "baseline",
                              "spacing": "sm",
                              "contents": [
                                {
                                  "type": "text",
                                  "text": "Place",
                                  "color": "#aaaaaa",
                                  "size": "sm",
                                  "flex": 1
                                },
                                {
                                  "type": "text",
                                  "text": "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                                  "wrap": true,
                                  "color": "#666666",
                                  "size": "sm",
                                  "flex": 5
                                }
                              ]
                            },
                            {
                              "type": "box",
                              "layout": "baseline",
                              "spacing": "sm",
                              "contents": [
                                {
                                  "type": "text",
                                  "text": "Time",
                                  "color": "#aaaaaa",
                                  "size": "sm",
                                  "flex": 1
                                },
                                {
                                  "type": "text",
                                  "text": "10:00 - 23:00",
                                  "wrap": true,
                                  "color": "#666666",
                                  "size": "sm",
                                  "flex": 5
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    "footer": {
                      "type": "box",
                      "layout": "vertical",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "button",
                          "style": "link",
                          "height": "sm",
                          "action": {
                            "type": "uri",
                            "label": "CALL",
                            "uri": "https://linecorp.com"
                          }
                        },
                        {
                          "type": "button",
                          "style": "link",
                          "height": "sm",
                          "action": {
                            "type": "uri",
                            "label": "WEBSITE",
                            "uri": "https://linecorp.com"
                          }
                        },
                        {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [],
                          "margin": "sm"
                        }
                      ],
                      "flex": 0
                    }
                  }

                 if(!_.isNull(result)){
                    return client.replyMessage(event.replyToken,texts);
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
            const dataToMsg = [];
            if(result.length > 0){
                
                await result.map((element) => { 
                    const arrayData = {
                        type: "bubble",
                        size: "nano",
                        header: {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "text",
                              text: element.status,
                              color: "#ffffff",
                              align: "start",
                              size: "md",
                              gravity: "center"
                            },
                            {
                              type: "text",
                              text: "100%",
                              color: "#ffffff",
                              align: "start",
                              size: "xs",
                              gravity: "center",
                              margin: "lg"
                            },
                            {
                              type: "box",
                              layout: "vertical",
                              contents: [
                                {
                                  type: "box",
                                  layout: "vertical",
                                  contents: [
                                    {
                                      type: "filler"
                                    }
                                  ],
                                  width: "100%",
                                  backgroundColor: "#0D8186",
                                  height: "6px"
                                }
                              ],
                              backgroundColor: "#9FD8E36E",
                              height: "6px",
                              margin: "sm"
                            }
                          ],
                          backgroundColor: "#27ACB2",
                          paddingTop: "19px",
                          paddingAll: "12px",
                          paddingBottom: "16px"
                        },
                        body: {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "box",
                              layout: "horizontal",
                              contents: [
                                {
                                  type: "text",
                                  text: element.detail,
                                  color: "#8C8C8C",
                                  size: "sm",
                                  wrap: true
                                }
                              ],
                              flex: 1
                            }
                          ],
                          spacing: "md",
                          paddingAll: "12px"
                        },
                        styles: {
                          footer: {
                            separator: false
                          }
                        }
                      }
                      dataToMsg.push(arrayData);
                 });
                 texts = {
                    "type": "carousel",
                    "contents": [...dataToMsg]
                  }
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
            const dataToMsg = [];
            if(result.length > 0){
                await result.map((element) => { 
                    const arrayData = {
                        type: "bubble",
                        size: "nano",
                        header: {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "text",
                              text: element.status,
                              color: "#ffffff",
                              align: "start",
                              size: "md",
                              gravity: "center"
                            },
                            {
                              type: "text",
                              text: "100%",
                              color: "#ffffff",
                              align: "start",
                              size: "xs",
                              gravity: "center",
                              margin: "lg"
                            },
                            {
                              type: "box",
                              layout: "vertical",
                              contents: [
                                {
                                  type: "box",
                                  layout: "vertical",
                                  contents: [
                                    {
                                      type: "filler"
                                    }
                                  ],
                                  width: "0%",
                                  backgroundColor: "#DE5658",
                                  height: "6px"
                                }
                              ],
                              backgroundColor: "#FAD2A76E",
                              height: "6px",
                              margin: "sm"
                            }
                          ],
                          backgroundColor: "#FF6B6E",
                          paddingTop: "19px",
                          paddingAll: "12px",
                          paddingBottom: "16px"
                        },
                        body: {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "box",
                              layout: "horizontal",
                              contents: [
                                {
                                  type: "text",
                                  text: element.detail,
                                  color: "#8C8C8C",
                                  size: "sm",
                                  wrap: true
                                }
                              ],
                              flex: 1
                            }
                          ],
                          spacing: "md",
                          paddingAll: "12px"
                        },
                        styles: {
                          footer: {
                            separator: false
                          }
                        }
                      }
                      dataToMsg.push(arrayData);
                 });
                 texts = {
                    "type": "carousel",
                    "contents": [...dataToMsg]
                  }

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
            const dataToMsg = [];
            if(result.length > 0){
                await result.map((element) => { 
                    const arrayData = {
                        type: "bubble",
                        size: "nano",
                        header: {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "text",
                              text: element.status,
                              color: "#ffffff",
                              align: "start",
                              size: "md",
                              gravity: "center"
                            },
                            {
                              type: "text",
                              text: "100%",
                              color: "#ffffff",
                              align: "start",
                              size: "xs",
                              gravity: "center",
                              margin: "lg"
                            },
                            {
                              type: "box",
                              layout: "vertical",
                              contents: [
                                {
                                  type: "box",
                                  layout: "vertical",
                                  contents: [
                                    {
                                      type: "filler"
                                    }
                                  ],
                                  width: "70%",
                                  backgroundColor: "#FAE089",
                                  height: "6px"
                                }
                              ],
                              backgroundColor: "#FAF4B8",
                              height: "6px",
                              margin: "sm"
                            }
                          ],
                          backgroundColor: "#FDF97E",
                          paddingTop: "19px",
                          paddingAll: "12px",
                          paddingBottom: "16px"
                        },
                        body: {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "box",
                              layout: "horizontal",
                              contents: [
                                {
                                  type: "text",
                                  text: element.detail,
                                  color: "#8C8C8C",
                                  size: "sm",
                                  wrap: true
                                }
                              ],
                              flex: 1
                            }
                          ],
                          spacing: "md",
                          paddingAll: "12px"
                        },
                        styles: {
                          footer: {
                            separator: false
                          }
                        }
                      }
                      dataToMsg.push(arrayData);
                 });
                 texts = {
                    "type": "carousel",
                    "contents": [...dataToMsg]
                  }

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
            const dataToMsg = [];
            if(result.length > 0){
                await result.map((element) => { 
                    const arrayData = {
                        type: "bubble",
                        size: "nano",
                        header: {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "text",
                              text: element.status,
                              color: "#ffffff",
                              align: "start",
                              size: "md",
                              gravity: "center"
                            },
                            {
                              type: "text",
                              text: "100%",
                              color: "#ffffff",
                              align: "start",
                              size: "xs",
                              gravity: "center",
                              margin: "lg"
                            },
                            {
                              type: "box",
                              layout: "vertical",
                              contents: [
                                {
                                  type: "box",
                                  layout: "vertical",
                                  contents: [
                                    {
                                      type: "filler"
                                    }
                                  ],
                                  width: "100%",
                                  backgroundColor: "#0D8186",
                                  height: "6px"
                                }
                              ],
                              backgroundColor: "#9FD8E36E",
                              height: "6px",
                              margin: "sm"
                            }
                          ],
                          backgroundColor: "#27ACB2",
                          paddingTop: "19px",
                          paddingAll: "12px",
                          paddingBottom: "16px"
                        },
                        body: {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "box",
                              layout: "horizontal",
                              contents: [
                                {
                                  type: "text",
                                  text: element.detail,
                                  color: "#8C8C8C",
                                  size: "sm",
                                  wrap: true
                                }
                              ],
                              flex: 1
                            }
                          ],
                          spacing: "md",
                          paddingAll: "12px"
                        },
                        styles: {
                          footer: {
                            separator: false
                          }
                        }
                      }
                      dataToMsg.push(arrayData);
                 });
                 texts = {
                    "type": "carousel",
                    "contents": [...dataToMsg]
                  }

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

  static async pushMessage (req,res) {
    const data = req.body;
    console.log("innnnnnnnnnn");
    const arrayData = {
        type: "bubble",
        size: "nano",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "test",
              color: "#ffffff",
              align: "start",
              size: "md",
              gravity: "center"
            },
            {
              type: "text",
              text: "100%",
              color: "#ffffff",
              align: "start",
              size: "xs",
              gravity: "center",
              margin: "lg"
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "filler"
                    }
                  ],
                  width: "0%",
                  backgroundColor: "#DE5658",
                  height: "6px"
                }
              ],
              backgroundColor: "#FAD2A76E",
              height: "6px",
              margin: "sm"
            }
          ],
          backgroundColor: "#FF6B6E",
          paddingTop: "19px",
          paddingAll: "12px",
          paddingBottom: "16px"
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "test",
                  color: "#8C8C8C",
                  size: "sm",
                  wrap: true
                }
              ],
              flex: 1
            }
          ],
          spacing: "md",
          paddingAll: "12px"
        },
        styles: {
          footer: {
            separator: false
          }
        }
      }
    const texts = {
        type: "carousel",
        contents: [...arrayData]
    }

    return client.pushMessage(data.lineUserId,texts);
  }

  
}

module.exports = DialogFlow;
