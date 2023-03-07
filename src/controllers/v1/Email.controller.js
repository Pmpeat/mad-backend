const bcrypt = require('bcrypt');
const _ = require('lodash');
const nodemailer = require("nodemailer");
const BaseController = require('./Base.controller');
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
  static async sendMail(req, res) {
    try {
      const data = req.body;

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASSWORD_EMAIL,
        },
      });



      let mailOptions = {
        from: 'immtrip.app@gmail.com',
        to: `${data.email}`,
        subject: `IMMTRIP APPLICATION รหัสผ่านใหม่ของท่าน`,
        html: `<div>
        <h1 style="text-align: center">นี่คือข้อความตอบกลับจาก IMMTRIP APPLICATION</h1>
        <p style="text-align: center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;จากการรีเซ็ทรหัสผ่านของท่าน ระบบได้ทำการเปลี่ยนเเละส่งรหัสผ่านใหม่ให้ท่าน<br/>เพื่อให้ท่านสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันทีและสามารถเปลี่ยนรหัสผ่านได้ด้วยตัวเอง</p>
        <div style="text-align: center">
        รหัสผ่านใหม่ของท่านคือ <span style="color:red">${randomstring}</span>
        </div>
        <p style="text-align: center">&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red">****</span>เพื่อความปลอดภัยหลังจากได้รับรหัสผ่านใหม่แล้ว กรุณาเปลี่ยนรหัสด้วยตัวท่านเองทันที<span style="color:red">****</span></p>
        <p style="text-align: center">&nbsp;&nbsp;&nbsp;&nbsp;ขอบคุณสำหรับการใช้งานแอปพลิเคชัน อิ่มทริป</p>
        </div>`,
      };

      if (!_.isNull(updatePasswordUser)) {
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