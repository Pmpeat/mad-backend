const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const liff = require('@line/liff');
const BaseController = require('./Base.controller');
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
            console.log("requestVacation =>>> ",data);
            const types = req.params.type;
              const userVacationData = {
                lineId:data.lineId,
                type:data.type,
                reason:data.reason,
                from:data.from,
                to:data.to,
              }

              const result = await super.create(req, 'request_vacations', userVacationData);
              if (!_.isNull(result)) {
                liff.closeWindow();
                requestHandler.sendSuccess(
                  res,
                  'successfully create user request vacation',
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

}


module.exports = VacationController;