const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Op } = require('sequelize');
const { Sequelize } = require('../../models');
const BaseController = require('./Base.controller');
const HelperController = require('./Helper.controller');
const EmailController = require('./Email.controller');
const {
  requestNotiVacationToMadIT
} = require("./Line.controller");
const RequestHandler = require('../../utils/RequestHandler');
const Logger = require('../../utils/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const config = require('../../config/appconfig');

class VacationController extends BaseController {

    static async findUserVacation (req,res,event) {
        try {
            const options = {
                where : {lineId:event.source.userId}
              };
              const resultUser = await super.getList(req, 'users',options);
              const userId = await resultUser.dataValues.id;
              const optionVacation = {
                where : {userId : userId}
              }
              const result = await super.getList(req, 'vacations',optionVacation);
              if (!_.isNull(result)) {
                requestHandler.sendSuccess(
                  res,
                  'successfully find user vacation',
                  201
                )(result);
              } else {
                requestHandler.throwError(
                  422,
                  'Unprocessable Entity',
                  'Unable to process the contained instructions'
                );
              }
        } catch(err) {
            console.log(err);
        }
      }

      static async getRequestVacation (req,res) {
        try {
            const data = req.body;
            let options;
            if (data.status === "all") {
              options = {
                include : [
                  {
                    model: req.app.get("db")["users"],
                    as : 'line',
                    on : {
                      'lineId': {[Op.eq]: Sequelize.col('request_vacations.lineId')}
                    }
                  }
                ],
                order : [['id' ,'desc']]
              };
            } else {
              options = {
                where : {approveStatus:data.status},
                include : [
                  {
                    model: req.app.get("db")["users"],
                    as : 'line',
                    on : {
                      'lineId': {[Op.eq]: Sequelize.col('request_vacations.lineId')}
                    }
                  }
                ],
                order : [['id' ,'desc']]
              };
            }
            
              const result = await super.getList(req, 'request_vacations',options);
              if (!_.isNull(result)) {
                requestHandler.sendSuccess(
                  res,
                  'successfully get user request vacation',
                  201
                )(result);
              } else {
                requestHandler.throwError(
                  422,
                  'Unprocessable Entity',
                  'Unable to process the contained instructions'
                );
              }
        } catch(err) {
            console.log(err);
        }
      }

      static async createUserVacation (req,res) {
        try {
            const data = req.body;

              const userVacationData = {
                userId:data.userId,
                lineId:data.lineId,
                vacationLeave:data.vacationLeave,
                sickLeave:data.sickLeave,
                personalLeave:data.personalLeave,
                leaveWithoutPayment:data.leaveWithoutPayment,
                createdByUserId:data.updateBy 
              }

              const result = await super.create(req, 'vacations', userVacationData);
              if (!_.isNull(result)) {
                requestHandler.sendSuccess(
                  res,
                  'successfully create user vacation',
                  201
                )(result);
              } else {
                requestHandler.throwError(
                  422,
                  'Unprocessable Entity',
                  'Unable to process the contained instructions'
                );
              }
        } catch(err) {
            console.log(err);
        }
      }

      static async updateUserVacation (req,res) {
        try {
            const data = req.body.data;
            console.log(data);
            const options = {
                where : {userId:data.userId}
              };

              const userVacationData = {
                vacationLeave:data.vacationLeave,
                sickLeave:data.sickLeave,
                personalLeave:data.personalLeave,
                leaveWithoutPayment:data.leaveWithoutPayment,
                createdByUserId:data.createdByUserId 
              }

              console.log(userVacationData);
              const result = await super.updateByCustomWhere(req, 'vacations', userVacationData ,options);
              console.log(result);
              if (!_.isNull(result)) {
                requestHandler.sendSuccess(
                  res,
                  'successfully update user vacation',
                  201
                )(result);
              } else {
                requestHandler.throwError(
                  422,
                  'Unprocessable Entity',
                  'Unable to process the contained instructions'
                );
              }
        } catch(err) {
            console.log(err);
        }
      }


      static async createUserRequestVacation (req,res) {
        try {
            
            const data = req.body;
           const checkUser = await HelperController.checkUserLineId(req,res,data.lineId);

           const oneDay = 24 * 60 * 60 * 1000; 
           const firstDate = new Date(data.from);
            const secondDate = new Date(data.to);
           const diffDays = Math.round(Math.abs(( firstDate - secondDate) / oneDay)) +1;
           
           if(checkUser === "success"){
            const checkVacation = await HelperController.checkVacation(req,res,data.lineId,data.type,diffDays);
            if(checkVacation === true){
              let userVacationData = {};
              if(data.leaveType === "fullday"){
                userVacationData = {
                  lineId:data.lineId,
                  leaveType:data.leaveType,
                  type:data.type,
                  reason:data.reason,
                  from:data.from,
                  to:data.to,
                  days:diffDays,
                  approveStatus:"pending"
                }
              } else {
                userVacationData = {
                  lineId:data.lineId,
                  leaveType:data.leaveType,
                  type:data.type,
                  reason:data.reason,
                  from:data.half,
                  to:data.half,
                  days:0.5,
                  approveStatus:"pending"
                }
              }
              

              const result = await super.create(req, 'request_vacations', userVacationData);

              if (!_.isNull(result)) {
                const sendMail = await EmailController.sendMail(req,res,result.dataValues.id);
                const noti = await requestNotiVacationToMadIT(req,res,result.dataValues.id);
                return "success";
              } else {
                return "false";
              }
            } else {
              return "remain"
            }
              
           } else {
            return "lineId";
           }
            
        } catch(err) {
            console.log(err);
        }
      }

      static async updateUserRequestVacationStatus (req,res) {
        try {
            
            const data = req.body;
            const options = {
              where : {id:data.requestId}
            };

            const reqVacationData = await super.getAllByIdWithOptions(req,'request_vacations',options);

            if(reqVacationData[0].dataValues.approveStatus === "pending"){
              let updateRequestStatus = {};

              if(data.status === "approve"){
                updateRequestStatus = {
                  approveStatus:"approve",
                  rejectReason:""
                }
              } else {
                updateRequestStatus = {
                  approveStatus:"reject" ,
                  rejectReason:data.reason
                }
              }
              

              const result = await super.updateByCustomWhere(req, 'request_vacations', updateRequestStatus,options);

              let resultUpdate;

              if (data.status === "approve") {
                const optionUser = {
                  where : {lineId:reqVacationData[0].dataValues.lineId}
                }
                const userData = await super.getAllByIdWithOptions(req,'users',optionUser);
                const optionVacation = {
                  where : {userId:userData[0].dataValues.id}
                }
                const vacationData = await super.getAllByIdWithOptions(req,'vacations',optionVacation);
                const optionUpdateRemain = {
                  where : {userId:userData[0].dataValues.id}
                };

                let dataRemain = {};
                let remain = 0;
                switch (reqVacationData[0].dataValues.type) {
                  case "vacation":
                    remain = parseFloat(vacationData[0].dataValues.vacationLeave) - parseFloat(reqVacationData[0].dataValues.days);
                    dataRemain = {
                      vacationLeave : remain
                    }
                    break;
                  case "sick":
                    remain = parseFloat(vacationData[0].dataValues.sickLeave) - parseFloat(reqVacationData[0].dataValues.days);
                    dataRemain = {
                      sickLeave : remain
                    }
                    break;
                  case "personal":
                    remain = parseFloat(vacationData[0].dataValues.personalLeave) - parseFloat(reqVacationData[0].dataValues.days);
                    dataRemain = {
                      personalLeave : remain
                    }
                    break;
                  case "withoutpay":
                    remain = parseFloat(vacationData[0].dataValues.personalLeave) + parseFloat(reqVacationData[0].dataValues.days);
                    dataRemain = {
                      leaveWithoutPayment : remain
                    }
                    break;
                
                  default:
                    break;
                }
                resultUpdate = await super.updateByCustomWhere(req, 'vacations', dataRemain,optionUpdateRemain);
              }

              if (!_.isNull(resultUpdate)) {
                const dataMessage = {
                  lineId : reqVacationData[0].dataValues.lineId,
                  type : reqVacationData[0].dataValues.type,
                  approveStatus : updateRequestStatus.approveStatus,
                  reasonReject : updateRequestStatus.rejectReason,
                  from:reqVacationData[0].dataValues.from,
                  to:reqVacationData[0].dataValues.to,
                  reason:reqVacationData[0].dataValues.reason
                }

                const pushMessage = await HelperController.pushMessageUpdateStatusVacation(dataMessage);

                requestHandler.sendSuccess(
                  res,
                  'successfully update vacation',
                  201
                )(resultUpdate);
              } else {
                requestHandler.throwError(
                  422,
                  'Unprocessable Entity',
                  'Unable to process the contained instructions'
                );
              }
            } else {
              requestHandler.sendSuccess(
                res,
                'updated',
                201
              )('updated');
            }
            
        } catch(err) {
            console.log(err);
        }
      }

      static async rejectRequestVacationStatus (req,res) {
        try {
            
            const data = req.body;
            const options = {
              where : {id:data.requestId}
            };

            const reqVacationData = await super.getAllByIdWithOptions(req,'request_vacations',options);

            if(reqVacationData[0].dataValues.approveStatus === "pending"){

                const updateRequestStatus = {
                  approveStatus:"reject" ,
                  rejectReason:data.reason
                }
              
              const result = await super.updateByCustomWhere(req, 'request_vacations', updateRequestStatus,options);

              let resultUpdate;

              if (!_.isNull(resultUpdate)) {
                const dataMessage = {
                  lineId : reqVacationData[0].dataValues.lineId,
                  type : reqVacationData[0].dataValues.type,
                  approveStatus : updateRequestStatus.approveStatus,
                  reasonReject : updateRequestStatus.rejectReason,
                  from:reqVacationData[0].dataValues.from,
                  to:reqVacationData[0].dataValues.to,
                  reason:reqVacationData[0].dataValues.reason
                }

                const pushMessage = await HelperController.pushMessageUpdateStatusVacation(dataMessage);

                return "success";
              } else {
                return "false";
              }
            } else {
              requestHandler.sendSuccess(
                res,
                'updated',
                201
              )('updated');
            }
            
        } catch(err) {
            console.log(err);
        }
      }

}


module.exports = VacationController;