const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const BaseController = require('./Base.controller');
const RequestHandler = require('../../utils/RequestHandler');
const Logger = require('../../utils/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const config = require('../../config/appconfig');

class SheetController extends BaseController {

  /**
   * It's a function that creates a tags.
   */
   static async createApplicant(req, res) {
    try {
      const data = req.body;
      const schema = Joi.object({
        jobApplicationType: Joi.string().allow("",null),
        gender: Joi.string().allow("",null),
        name: Joi.string().allow("",null),
        idCode: Joi.string().allow("",null),
        dateOfBirth: Joi.string().allow("",null),
        status: Joi.string().allow("",null),
        address: Joi.string().allow("",null),
        congenitalDisease: Joi.string().allow("",null),
        mobile: Joi.string().allow("",null),
        emergencyContact: Joi.string().allow("",null),
        refEmployee: Joi.string().allow("",null),
        portfolio: Joi.string().allow("",null),
        portfolioFile: Joi.string().allow("",null),
        portfolioLink: Joi.string().allow("",null),
        military: Joi.string().allow("",null),
        talent: Joi.string().allow("",null),
        drivingAbility: Joi.string().allow("",null),
        motorcycle: Joi.string().allow("",null),
        thai: Joi.string().allow("",null),
        eng: Joi.string().allow("",null),
        iosSystem: Joi.string().allow("",null),
        pcSystem: Joi.string().allow("",null),
        officeEquipment: Joi.string().allow("",null),
        workInOther: Joi.string().allow("",null),
        position: Joi.string().allow("",null),
        expectedSalary: Joi.string().allow("",null),
        expectedIncome: Joi.string().allow("",null),
        target: Joi.string().allow("",null),
        successPride: Joi.string().allow("",null),
        peopleDontKnow: Joi.string().allow("",null),
        interest: Joi.string().allow("",null),
        newsFrom: Joi.string().allow("",null),
        aboutYou: Joi.string().allow("",null),
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
      // const options = { where: { email: data.email } };

      // let getTableData = await super.getByCustomOptions(req, 'applicants', options);
    

      // if (getTableData) {
      //   requestHandler.throwError(
      //     400,
      //     'bad request',
      //     'invalid email, email already existed'
      //   )();
      // }

    //   const hashedPassword = bcrypt.hashSync(
    //     data.password,
    //     parseInt(config.auth.saltRounds)
    //   );
    //   data.password = hashedPassword;

      const createNewApplicants = await super.create(req, 'applicants');

    //   const id = await createNewUser.dataValues.id;

    //     const roleData = {
    //       userId: id,
    //       roleId: data.roleId
    //     }

    //     const createdRole = await super.create(req, 'user_roles', roleData);


      if (!_.isNull(createNewApplicants)) {
        requestHandler.sendSuccess(
          res,
          'successfully created new users',
          201
        )(createNewApplicants);
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

  /**
   * It's a function that get all applicant
   */
  static async getApplicantList(req, res) {
    try {
        const options = {
          order: [['id', 'asc']],
        };
        const result = await super.getList(req, 'applicants', options);
        requestHandler.sendSuccess(
          res,
          'Getting all applicants successfully!',
        )({result});
      } catch (err) {
        requestHandler.sendError(req, res, err);
      }
  }

}


module.exports = SheetController;