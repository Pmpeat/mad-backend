const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const BaseController = require('./Base.controller');
const RequestHandler = require('../../utils/RequestHandler');
const Logger = require('../../utils/logger');
const Sequelize = require('sequelize');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const config = require('../../config/appconfig');
const { sum } = require('lodash');

class ReviewController extends BaseController {

  /**
   * It's a function that creates a review.
   */
   static async createReviewApplicant(req, res) {
    try {
      const data = req.body;
      const schema = Joi.object({
        userId: Joi.string().allow("",null),
        applicantId: Joi.string().allow("",null),
        workSkillRate: Joi.string().allow("",null),
        attitudeRate: Joi.string().allow("",null),
        professionalismRate: Joi.string().allow("",null),
        leadershipRate: Joi.string().allow("",null),
        socialSkillRate: Joi.string().allow("",null),
        academicScoreRate: Joi.string().allow("",null),
        otherSkillRate: Joi.string().allow("",null),
        comment: Joi.string().allow("",null),
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

      const createNewReviewApplicants = await super.create(req, 'review_applicants');

      let resultScore = null;
      let updateApplicantRate = null;

      if(!_.isNull(createNewReviewApplicants)){
        const options = {
          where: {"applicantId" : data.applicantId},
          attributes: [
            [Sequelize.fn('AVG', Sequelize.col('review_applicants.workSkillRate')), 'avgRatingWork'],
            [Sequelize.fn('AVG', Sequelize.col('review_applicants.attitudeRate')), 'avgRatingAttitude'],
            [Sequelize.fn('AVG', Sequelize.col('review_applicants.professionalismRate')), 'avgRatingProfessional'],
            [Sequelize.fn('AVG', Sequelize.col('review_applicants.leadershipRate')), 'avgRatingLeadershipRate'],
            [Sequelize.fn('AVG', Sequelize.col('review_applicants.socialSkillRate')), 'avgRatingSocial'],
            [Sequelize.fn('AVG', Sequelize.col('review_applicants.academicScoreRate')), 'avgRatingAcademic'],
            [Sequelize.fn('AVG', Sequelize.col('review_applicants.otherSkillRate')), 'avgRatingOther'],
          ],
          order: [['id', 'asc']],
        };
        resultScore = await super.getList(req, 'review_applicants', options);
        const sumAvg = parseFloat(resultScore[0].dataValues.avgRatingWork) + 
                      parseFloat(resultScore[0].dataValues.avgRatingAttitude) + 
                      parseFloat(resultScore[0].dataValues.avgRatingProfessional) +
                      parseFloat(resultScore[0].dataValues.avgRatingLeadershipRate) +
                      parseFloat(resultScore[0].dataValues.avgRatingSocial) +
                      parseFloat(resultScore[0].dataValues.avgRatingAcademic) +
                      parseFloat(resultScore[0].dataValues.avgRatingOther)
                      ;
          console.log(sumAvg);
        const avgRate = (sumAvg / 7);
        const optionUpdateApplicant = {
          where : {
            id : data.applicantId
          }
        }
  
        const updateApplicantRateData = {
          "avgRate" : avgRate
        }
        updateApplicantRate = await super.updateByCustomWhere(req, 'applicants', updateApplicantRateData ,optionUpdateApplicant);
      }
      

      if (!_.isNull(createNewReviewApplicants)) {
        requestHandler.sendSuccess(
          res,
          'successfully created new users',
          201
        )(createNewReviewApplicants);
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
  static async getReviewAllByApplicantId(req, res) {
    try {
        const applicantId = req.params.applicantId;
        const options = {
            where : { "applicantId" : applicantId},
          order: [['id', 'asc']],
        };
        const result = await super.getList(req, 'review_applicants', options);
        requestHandler.sendSuccess(
          res,
          'Getting all reivew applicants successfully!',
        )({result});
      } catch (err) {
        requestHandler.sendError(req, res, err);
      }
  }

   /**
   * It's a function that get all applicant
   */
   static async getReviewApplicantByUserId(req, res) {
    try {
      const userId = req.params.userId;
        const applicantId = req.params.applicantId;
        const options = {
            where : { "applicantId" : applicantId,"userId" : userId},
          order: [['id', 'asc']],
        };
        const result = await super.getList(req, 'review_applicants', options);
        requestHandler.sendSuccess(
          res,
          'Getting all reivew applicants successfully!',
        )({result});
      } catch (err) {
        requestHandler.sendError(req, res, err);
      }
  }

}


module.exports = ReviewController;