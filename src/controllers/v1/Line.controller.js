const request = require("request");
const HelperController = require('./Helper.controller');

exports.requestNotiToMadIT = async (req,res,detail) => {
    const message = "มีการแจ้งปัญหาเข้ามาใหม่ไอดีที่ : " + detail + " โปรดตรวจสอบ";
    request(
      {
        method: "POST",
        uri: "https://notify-api.line.me/api/notify",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          bearer: process.env.LINE_NOTIFY_TOKEN,
        },
        form: {
          message: message,
        },
      },
      (err, httpResponse, body) => {
        if (err) {
          console.log(err);
        } else {
        //   res.json({
        //     httpResponse: httpResponse,
        //     body: body,
        //   });
        }
      }
    );
  };

  exports.requestNotiVacationToMadIT = async (req,res,result) => {
    const data = req.body;
    const userData = await HelperController.getUserFromLineId(req,res,data.lineId);
    const reusltData = result;
    let typeText = "";
      switch (reusltData.dataValues.type) {
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
      let leaveTypeText = "";
      switch (reusltData.dataValues.leaveType) {
        case "fullday":
          leaveTypeText = "ลาเต็มวัน";
          break;
        case "halfdayMorning":
          leaveTypeText = "ลาครึ่งวันเช้า";
          break;
        case "halfdayAfternoon":
          leaveTypeText = "ลาครึ่งวันบ่าย";
          break;
      }

    let message = "มีคำขอลาเข้ามาใหม่\n";
    message += "จากคุณ : " + userData[0].dataValues.firstName + " " + userData[0].dataValues.lastName + "\n";
    message += "ลาแบบ : " + typeText + "\n";
    message += "----- : " + leaveTypeText + "\n";
    message += "ตั้งเเต่ : " + reusltData.dataValues.from;
    message += "ถึง : " + reusltData.dataValues.to;
    request(
      {
        method: "POST",
        uri: "https://notify-api.line.me/api/notify",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          bearer: process.env.LINE_NOTIFY_TOKEN,
        },
        form: {
          message: message,
        },
      },
      (err, httpResponse, body) => {
        if (err) {
          console.log(err);
        } else {
        //   res.json({
        //     httpResponse: httpResponse,
        //     body: body,
        //   });
        }
      }
    );
  };


