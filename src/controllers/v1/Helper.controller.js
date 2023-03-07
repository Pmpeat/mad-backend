const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const BaseController = require('./Base.controller');
const RequestHandler = require('../../utils/RequestHandler');
const Logger = require('../../utils/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const { Op } = require('sequelize');
const config = require('../../config/appconfig');
const line = require('@line/bot-sdk');

const lineConfig = {
    channelAccessToken : process.env.LINE_ACCESS_TOKEN,
    channelSecret : process.env.LINE_SECRET_TOKEN
}

const client = new line.Client(lineConfig);

class HelperController extends BaseController {

    
  /**
   * It's a function that get all user
   */
  static async checkUserLineId(req,res,lineId) {
    try {
        const options = {
          where:{'lineId':lineId},
          order: [['id', 'asc']],
        };
        const result = await super.getList(req, 'users', options);
       if(result.length > 0){
        return "success";
       } else {
        return "error"
       }
      } catch (err) {
        requestHandler.sendError(req, res, err);
      }
  }

   /**
   * It's a function that get all roles
   */
   static async checkVacation(req,res,userId) {
    try {
        const options = {
        where:{'userId':userId},
          order: [['id', 'asc']],
        };
        const result = await super.getList(req, 'roles', options);
        if(result.length > 0){
            return "success";
           } else {
            return "error"
           }
      } catch (err) {
        requestHandler.sendError(req, res, err);
      }
  }

  static async findRepair (userId,state,req,res) {
    try {
        const options = {
            where : {lineId:userId,status:state},
            limit : 4,
            order: [['id', 'desc']],
          };
          const result = await super.getList(req, 'request_repairs', options);
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
          const result = await super.getList(req, 'request_orders', options);
       return result;
    } catch(err) {
        console.log(err);
    }
  }

  static async pushMessageUpdateStatusText (data) {
    let color = "#000";
    switch (data.status) {
        case "ไม่รับคำร้อง":
            color = "#F73000FF";
            break;
        case "รอการตรวจสอบ":
            color = "#F7B600FF";
            break;
        case "กำลังตรวจสอบ":
            color = "#F7B600FF";
            break;
        case "แก้ไขแล้ว":
            color = "#3BC001FF";
            break;
        case "สั่งซื้อแล้ว":
            color = "#3BC001FF";
            break;
        default:
            break;
    }
    const texts = {
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
                "backgroundColor": `${color}`,
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
                    "text": `รายละเอียดคำร้อง : ${data.detail}`,
                    "align": "start",
                    "gravity": "center",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": `สถานะล่าสุด : ${data.status}`,
                    "color":  `${color}`,
                    "contents": []
                  }
                ]
              }
            }
          ]
        }
    }

    return client.pushMessage(data.lineId,texts);
  }


}


module.exports = HelperController;