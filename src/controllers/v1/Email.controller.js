const bcrypt = require('bcrypt');
const _ = require('lodash');
const nodemailer = require("nodemailer");
const BaseController = require('./Base.controller');
const HelperController = require('./Helper.controller');
const RequestHandler = require('../../utils/RequestHandler');
const config = require('../../config/appconfig');
const Logger = require('../../utils/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const { Op } = require('sequelize');

class EmailController extends BaseController {

  /**
   * It's a function that send mail
   */
  static async sendMail(req, res,requestId) {
    try {
      const data = req.body;
      const userData = await HelperController.getUserFromLineId(req,res,data.lineId);
      let typeText = "";
      switch (data.type) {
        case "vacation":
          typeText = "ลาพักร้อน";
          break;
        case "sick":
          typeText = "ลาป่วย";
          break;
        case "personal":
          typeText = "ลากิจ";
          break;
        case "withoutpay":
          typeText = "ลาไม่รับเงิน";
          break;
      }
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASSWORD_EMAIL,
        },
      });

      
      // const maillist = ["patiphan.work@gmail.com",];
      

      let mailOptions = {
        from: 'emailmadaraid@gmail.com',
        to: 'kanyanut@mad-arai-d.com',
        subject: `ขออนุมัติการลา`,
        html: `<div style="width:100%">
        <h1 style="text-align: center">คำร้องขออนุมัติการลา</h1>
        <p style="text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;คำร้องการลาจากคุณ : ${userData[0].dataValues.firstName} ${userData[0].dataValues.lastName}</p>
        <p style="text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ประเภทการลา : ${typeText}</p>
        <p style="text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ตั้งเเต่วันที่ : ${data.from} ถึง : ${data.to}</p>
        <p style="text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;เหตุผล : ${data.reason}</p>
        <p style="text-align: center">&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red">****</span>กรุณาคลิกที่นี่เพื่อเลือก อนุมัติ หรือ ไม่อนุมัติ<span style="color:red">****</span></p>
        <div style="display:flex;height:5%">
          <div style="width:25%"><p> </p></div>
          <div style="width:20%">
            <a href="https://hr-project.madtypes.com/approve-vacation?request=${requestId}&status=reject" style="text-decoration : none ;font-size : 14px ;font-weight : bold ;
            color : #c7384a ;letter-spacing : 2px ;">
            <div style="box-sizing : border-box ;border-radius : 300px ;border : solid 3px #c7384a;height: 100%;width:100%;text-align: center;">
                <span>
                    ไม่อนุมัติ
                </span>
            </div>
          </a>
         </div>
         <div style="width:10%"><p> </p></div>
         <div style="width:20%">
            <a href="https://hr-project.madtypes.com/approve-vacation?request=${requestId}&status=approve" style="text-decoration : none ;font-size : 14px ;font-weight : bold ;
            color : #4ab847 ;letter-spacing : 2px ;">
            <div style="box-sizing : border-box ;border-radius : 300px ;border : solid 3px #4ab847;height: 100%;width:100%;text-align: center;">
                <span>
                    อนุมัติ
                </span>
            </div>
          </a>
         </div>
         <div style="width:25%"><p> </p></div>
        </div>
        <p style="text-align: center">ขอบคุณสำหรับตอบกลับ</p>
        </div>`,
      };

      if (!_.isNull(userData)) {
        transporter.sendMail(mailOptions, function (err, info) {
          console.log();
          if (err) {
            requestHandler.throwError(
              422,
              'Unprocessable Entity',
              'Unable to process the contained instructions'
            );
          } else {
            requestHandler.sendSuccess(
              res,
              'successfully send forget password',
              201
            )("done");
          }
        });
      } else {
        requestHandler.throwError(
          422,
          'Unprocessable Entity',
          'Unable to process the contained instructions'
        );
      }

    } catch (err) {
      requestHandler.sendError(req, res, err);
    }

  }


}

module.exports = EmailController;