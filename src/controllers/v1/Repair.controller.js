const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Op } = require('sequelize');
const BaseController = require('./Base.controller');
const HelperController = require('./Helper.controller');
const {
  requestNotiToMadIT
} = require("./Line.controller");
const RequestHandler = require('../../utils/RequestHandler');
const Logger = require('../../utils/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const config = require('../../config/appconfig');
const { Sequelize } = require('../../models');

class RepairController extends BaseController {

  static async createUserRequestRepair (req,res) {
    try {
      const data = req.body;
      const checkUser = await HelperController.checkUserLineId(req,res,data.lineId);
      if(checkUser === "success"){
        
          const userRepairData = {
            lineId:data.lineId,
            detail:data.detail,
            urgency:data.urgency,
            status: "รอการตรวจสอบ"
          }

          const result = await super.create(req, 'request_repairs', userRepairData);
          
          if (!_.isNull(result)) {
            requestNotiToMadIT(req,res,result.dataValues.detail);
            return "success";
          } else {
            return "false";
          }
        } else {
          return "lineId";
        }
    } catch(err) {
        console.log(err);
    }
  }

    static async getAllRepair (req,res) {
        try {
            const data = req.body;
            const checkStatus = ["รอการตรวจสอบ","กำลังตรวจสอบ"];
            let options;

            switch (data.status) {
              case "all":
                options = {
                  include : [
                    {
                      model: req.app.get("db")["users"],
                      as : 'line',
                      on : {
                        'lineId': {[Op.eq]: Sequelize.col('request_repairs.lineId')}
                      }
                    }
                  ],
                  order : [['id' ,'desc']]
                };
                break;
              case "รอการตรวจสอบ":
                options = {
                  where : {status:{
                    [Op.in]: checkStatus,
                  }},
                  include : [
                    {
                      model: req.app.get("db")["users"],
                      as : 'line',
                      on : {
                        'lineId': {[Op.eq]: Sequelize.col('request_repairs.lineId')}
                      }
                    }
                  ],
                  order : [['id' ,'desc']]
                };
                break;
            
              default:
                options = {
                  where : {status:data.status},
                  include : [
                    {
                      model: req.app.get("db")["users"],
                      as : 'line',
                      on : {
                        'lineId': {[Op.eq]: Sequelize.col('request_repairs.lineId')}
                      }
                    }
                  ],
                  order : [['id' ,'desc']]
                };
                break;
            }

              const result = await super.getList(req, 'request_repairs',options);
              if (!_.isNull(result)) {
                requestHandler.sendSuccess(
                  res,
                  'successfully get all repair',
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

      /**
     * It's a function that update repair status.
     */
     static async updateRepairStatus(req, res) {
        try {
            const data = req.body;
            const schema = Joi.object({
                repairId: Joi.string().required(),
                status: Joi.string().required(),
            });

            const { error } = schema.validate(data);

            if (error) {
                requestHandler.validateJoi(
                    error,
                    400,
                    'bad request',
                    error ? error.details[0].message : ''
                );
            }

            const option = {
                where : {
                  id : data.repairId
                }
              }
              
              const updateRepairStatus = await super.updateByCustomWhere(req, 'request_repairs', data ,option);
              const getResult = await super.getList(req, 'request_repairs',option);
            if (!_.isNull(updateRepairStatus)) {
              const helper = HelperController.pushMessageUpdateStatusText(getResult[0].dataValues,"คำสั่งซ่อม");
                requestHandler.sendSuccess(
                    res,
                    'successfully updated repair status',
                    201
                )(updateRepairStatus);
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


module.exports = RepairController;