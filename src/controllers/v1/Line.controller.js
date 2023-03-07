const request = require("request");

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


