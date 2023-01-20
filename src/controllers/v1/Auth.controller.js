const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const BaseController = require('./Base.controller');
const config = require('../../config/appconfig');
const auth = require('../../utils/auth');
const RequestHandler = require('../../utils/RequestHandler');
const Logger = require('../../utils/logger');
const { app } = require('../../config/appconfig');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const tokenList = {};

class AuthController extends BaseController {

  static async login(req, res) {
    try {
      const data = req.body;

      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        fcmToken: Joi.string().allow(null, ''),
        platform: Joi.string().valid('ios', 'android', 'web'),
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
      let user;

        const optionsUser = {
          where: { email: data.email },
          attributes: { exclude: ['createdByUserId', 'createdAt', 'updatedAt'] }
          ,
          include: [{
            model: req.app.get('db')['roles'],
            attributes: { exclude: ['createdByUserId', 'createdAt', 'updatedAt'] },
            through: {
              attributes: { exclude: ['createdByUserId', 'createdAt', 'updatedAt'] },
            },
          }]
        };

        user = await super.getByCustomOptions(req, 'users', optionsUser);
      
      if (!user) {
        requestHandler.throwError(
          400,
          'bad request',
          'invalid email address'
        )();
      }

      const payload = _.omit(user.dataValues, [
        'createdAt',
        'updatedAt',
        'password',
        'mobileNumber',
      ]);

      const token = jwt.sign({ payload }, config.auth.jwtSecret, {
        expiresIn: config.auth.jwtExpiresIn,
        algorithm: 'HS512',
      });

      const refreshToken = jwt.sign(
        { payload },
        config.auth.refreshTokenSecret,
        { expiresIn: config.auth.refreshTokenExpiresIn }
      );

      if (req.headers.fcmtoken && req.headers.platform) {
        let options;

          options = {
            where: {
              userId: user.id,
            }
          };

        const fcmToken = await super.getByCustomOptions(
          req,
          'access_tokens',
          options
        );

        let datata;

          datata = {
            userId: user.id,
            fcmToken: token,
            platform: req.headers.platform,
          };
        

        if (fcmToken) {
          req.params.id = fcmToken.id;
          await super.updateById(req, 'access_tokens', datata);
        } else {
          await super.create(req, 'access_tokens', datata);
        }
      } else {
        requestHandler.throwError(
          400,
          'bad request',
          'please provide all required headers'
        )();
      }

      await bcrypt.compare(req.body.password, user.password).then(
        requestHandler.throwIf(
          (r) => !r,
          400,
          'incorrect',
          'failed to login bad credentials'
        ),
        requestHandler.throwError(500, 'bcrypt error')
      );

      // update last login date
      const latestDate = {
        lastLogin: new Date(),
      };
      req.params.id = user.id;

        await super.updateById(req, 'users', latestDate);
      

      const response = { status: 'success', token, refreshToken };

      tokenList[refreshToken] = response;

      requestHandler.sendSuccess(
        res,
        'User logged in Successfully!'
      )({ token, refreshToken });
    } catch (err) {
      requestHandler.sendError(req, res, err);
    }
  }


  static async logout(req, res) {
    try {
      const tokenFromHeader = auth.getJwtToken(req);
      const schema = Joi.object({
        platform: Joi.string().valid('ios', 'android', 'web'),
        fcmToken: Joi.string(),
      });
      const { error } = schema.validate({
        platform: req.headers.platform,
        fcmToken: tokenFromHeader,
      });

      if (error) {
        requestHandler.validateJoi(
          error,
          400,
          'bad request',
          error ? error.details[0].message : ''
        );
      }

      const user = jwt.decode(tokenFromHeader);
      let userId;
      if (typeof user.payload !== 'undefined') {
        userId = user.payload.id;
      } else {
        userId = user.user.payload.id;
      }
      let options;

        options = {
            where: {
            fcmToken: tokenFromHeader,
            platform: req.headers.platform,
            userId: userId,
            },
        };


      const fcmToken = await super.getByCustomOptions(
        req,
        'access_tokens',
        options
      );
      req.params.id = fcmToken.dataValues.id;

      const deleteFcm = await super.deleteById(req, 'access_tokens');

      if (deleteFcm === 1) {
        requestHandler.sendSuccess(res, 'User Logged out Successfully')();
      } else {
        requestHandler.throwError(
          400,
          'bad request',
          'User already logged out.'
        );
      }
    } catch (err) {
      console.log('here ????')
      requestHandler.sendError(req, res, err);
    }
  }
}

module.exports = AuthController;
