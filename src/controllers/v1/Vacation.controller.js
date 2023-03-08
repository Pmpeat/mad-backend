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
                approveStatus:false
              }

              const result = await super.create(req, 'request_vacations', userVacationData);
              if (!_.isNull(result)) {
                if(data.type !== "sick"){
                  const sendMail = await EmailController.sendMail(req,res,result.dataValues.id);
                }
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

}


module.exports = VacationController;