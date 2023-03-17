const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const _ = require('lodash');
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

class OrderController extends BaseController {

  static async createUserRequestOrder (req,res) {
    try {
      const data = req.body;
      const checkUser = await HelperController.checkUserLineId(req,res,data.lineId);
      
      if(checkUser === "success"){
        
          const userOrderData = {
            lineId:data.lineId,
            detail:data.detail,
            urgency:data.urgency,
            status: "รอการตรวจสอบ"
          }

          const result = await super.create(req, 'request_orders', userOrderData);
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

    static async getAllOrderr (req,res) {
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
                        'lineId': {[Op.eq]: Sequelize.col('request_orders.lineId')}
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
                        'lineId': {[Op.eq]: Sequelize.col('request_orders.lineId')}
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
                        'lineId': {[Op.eq]: Sequelize.col('request_orders.lineId')}
                      }
                    }
                  ],
                  order : [['id' ,'desc']]
                };
                break;
            }

              const result = await super.getList(req, 'request_orders',options);
              if (!_.isNull(result)) {
                requestHandler.sendSuccess(
                  res,
                  'successfully get all order',
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
     * It's a function that update order status.
     */
     static async updateOrderStatus(req, res) {
        try {
            const data = req.body;
            const schema = Joi.object({
                orderId: Joi.string().required(),
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
                  id : data.orderId
                }
              }
              const updateOrderStatus = await super.updateByCustomWhere(req, 'request_orders', data ,option);
              const getResult = await super.getList(req, 'request_orders',option);
            if (!_.isNull(updateOrderStatus)) {
              const helper = HelperController.pushMessageUpdateStatusText(getResult[0].dataValues,"คำสั่งซื้อ");
                requestHandler.sendSuccess(
                    res,
                    'successfully updated order status',
                    201
                )(updateOrderStatus);
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


module.exports = OrderController;