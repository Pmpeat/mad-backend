const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const BaseController = require('./Base.controller');
const RequestHandler = require('../../utils/RequestHandler');
const Logger = require('../../utils/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const config = require('../../config/appconfig');

class RepairController extends BaseController {

  static async createUserRequestRepair (req,res) {
    try {
        
        const data = req.body;
          const userRepairData = {
            lineId:data.lineId,
            detail:data.detail,
            urgency:data.urgency,
            status: "รอการตรวจสอบ"
          }

          const result = await super.create(req, 'request_repairs', userRepairData);
          if (!_.isNull(result)) {
            return "success";
          } else {
            return "false";
          }
    } catch(err) {
        console.log(err);
    }
  }

    static async getAllRepair (req,res) {
        try {
            const data = req.body;
            const options = {
                where : {status:data.status}
              };
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

            if (!_.isNull(updateRepairStatus)) {
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