const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const BaseController = require('./Base.controller');
const RequestHandler = require('../../utils/RequestHandler');
const Logger = require('../../utils/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const { Op } = require('sequelize');
const config = require('../../config/appconfig');

class UserController extends BaseController {

  /**
   * It's a function that creates a tags.
   */
   static async createUser(req, res) {
    try {
      const data = req.body.data;
      
      const schema = Joi.object({
        firstName: Joi.string().allow("",null),
        lastName: Joi.string().allow("",null),
        email: Joi.string().allow("",null),
        password: Joi.string().allow("",null),
        roleId: Joi.string().allow("",null),
        createdByUserId: Joi.string().allow("",null),
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
      const options = { where: { email: data.email } };

      let getTableData = await super.getByCustomOptions(req, 'users', options);
    

      if (getTableData) {
        requestHandler.throwError(
          400,
          'bad request',
          'invalid email, email already existed'
        )();
      }

      const hashedPassword = bcrypt.hashSync(
        data.password,
        parseInt(config.auth.saltRounds)
      );
      data.password = hashedPassword;

      const createNewUsers = await super.create(req, 'users',data);
      const id = await createNewUsers.dataValues.id;

      const userVacationData = {
        userId:id,
        vacationLeave:'0',
        sickLeave:'0',
        personalLeave:'0',
        leaveWithoutPayment:'0',
        createdByUserId:data.createdByUserId 
      }

      const vacationsResult = await super.create(req, 'vacations', userVacationData);

      if (!_.isNull(vacationsResult)) {
        
      } else {
        requestHandler.throwError(
            422,
            'Unprocessable Entity',
            'Unable to process the contained instructions role error'
        );
      }

        const roleData = {
          userId: id,
          roleId: data.roleId
        }

        const createdRole = await super.create(req, 'user_roles', roleData);

        if (!_.isNull(createdRole)) {
        
        } else {
          requestHandler.throwError(
              422,
              'Unprocessable Entity',
              'Unable to process the contained instructions role error'
          );
        }

      if (!_.isNull(createNewUsers)) {
        requestHandler.sendSuccess(
          res,
          'successfully created new users',
          201
        )(createNewUsers);
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

  static async updateUserEmail(req, res) {
    try {
      const idData = req.params.id;
      const data = req.body.data;
      const schema = Joi.object({
        email: Joi.string().allow(null,''),
      });

      const { error } = schema.validate(data);
      if (error) {
        requestHandler.validateJoi(
          error,
          400,
          "bad request",
          error ? error.details[0].message : ""
        );
      }

      const options = {
        where : {id : idData}
      }

      const result = await super.updateByCustomWhere(req, "users",data,options);

      if (result) {
        requestHandler.sendSuccess(res, "Successfully updated email user", 200)();
      } else {
        requestHandler.throwError(
          422,
          "Unprocessable Entity",
          "unable to process the contained instructions"
        )();
      }
    } catch (err) {
      requestHandler.sendError(req, res, err);
    }
  }

  /**
   * It's a function that get all user
   */
  static async getUserList(req, res) {
    try {
        const options = {
          include: [
            {
              model: req.app.get('db')['roles'],
            },
            {
              model: req.app.get('db')['vacations'],
            }
          ],
          order: [['id', 'asc']],
        };
        const result = await super.getList(req, 'users', options);
        requestHandler.sendSuccess(
          res,
          'Getting all users successfully!',
        )({result});
      } catch (err) {
        requestHandler.sendError(req, res, err);
      }
  }

   /**
   * It's a function that get all roles
   */
   static async getRoleList(req, res) {
    try {
        const options = {
          order: [['id', 'asc']],
        };
        const result = await super.getList(req, 'roles', options);
        requestHandler.sendSuccess(
          res,
          'Getting all roles successfully!',
        )({result});
      } catch (err) {
        requestHandler.sendError(req, res, err);
      }
  }

  /**
   * It's a function that link user lineId
   */
  static async linkUserLineId(req, res,event) {
    try {
        let updateUserLink;
        const options = {
          where: {email:event.message.text},
        };
        const result = await super.getList(req, 'users', options);
        if(result.length > 0){
          if(result[0].dataValues.lineId === null){
            const option = {
              where : {
                email : event.message.text
              }
            }
            const dataLine = {
              lineId : event.source.userId
            }
            updateUserLink = await super.updateByCustomWhere(req, 'users', dataLine ,option); 
            if (!_.isNull(updateUserLink)) {
              return "success";
            } else {
              return "ระบบขัดข้องกรุณาติดต่อฝ่าย IT";
            } 
          } else {
            return "อีเมลนี่ถูกผูกบัญชีกับระบบแล้ว";
          }
          
         
        } else {
          return "ไม่พบอีเมลในระบบ กรุณาลงทะเบียนใหม่อีกครั้ง"
        }
        
      } catch (err) {
        requestHandler.sendError(req, res, err);
      }
  }

   /**
   * Delete Customer Address
   */
   static async delUser(req, res) {
    try {
      const data = req.body;

      const optionsUserRole = {
        where: {
          userId: data.id,
        },
      };
      await super.deleteByIdWithOptions(req, "user_roles", optionsUserRole);

      const options = {
        where: {
          id: data.id,
        },
      };
      await super.deleteByIdWithOptions(req, "users", options);
      requestHandler.sendSuccess(
        res,
        "successfully deleted user",
        200
      )();
    } catch (err) {
      requestHandler.sendError(req, res, err);
    }
  }

}


module.exports = UserController;