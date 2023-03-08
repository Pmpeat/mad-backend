const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const BaseController = require('./Base.controller');
const HelperController = require('./Helper.controller');
const EmailController = require('./Email.controller');
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
              const userVacationData = {
                lineId:data.lineId,
                type:data.type,
                reason:data.reason,
                from:data.from,
                to:data.to,
                days:diffDays,
                approveStatus:"pending"
              }

              const result = await super.create(req, 'request_vacations', userVacationData);
              if (!_.isNull(result)) {
                const sendMail = await EmailController.sendMail(req,res,result.dataValues.id);
                
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
              const updateRequestStatus = {
                approveStatus:data.status === "approve"? "approve":"reject" 
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
                    remain = parseInt(vacationData[0].dataValues.vacationLeave) - parseInt(reqVacationData[0].dataValues.days);
                    dataRemain = {
                      vacationLeave : remain
                    }
                    break;
                  case "sick":
                    remain = parseInt(vacationData[0].dataValues.sickLeave) - parseInt(reqVacationData[0].dataValues.days);
                    dataRemain = {
                      sickLeave : remain
                    }
                    break;
                  case "personal":
                    remain = parseInt(vacationData[0].dataValues.personalLeave) - parseInt(reqVacationData[0].dataValues.days);
                    dataRemain = {
                      personalLeave : remain
                    }
                    break;
                  case "withoutpay":
                    remain = parseInt(vacationData[0].dataValues.personalLeave) + parseInt(reqVacationData[0].dataValues.days);
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
                  approveStatus : data.status,
                  from:reqVacationData[0].dataValues.from,
                  to:reqVacationData[0].dataValues.to,
                  reason:reqVacationData[0].dataValues.reason
                }

                const pushMessage = await HelperController.pushMessageUpdateStatusVacation(dataMessage);

                requestHandler.sendSuccess(
                  res,
                  'successfully create user vacation',
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

}


module.exports = VacationController;