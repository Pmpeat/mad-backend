const router = require('express').Router();
const reviewController = require('../../../controllers/v1/Review.controller');


/**
 * /api/v1/review/create-review
 * */
router.post('/create-review', reviewController.createReviewApplicant);


/**
 * /api/v1/review/review-applicants/{applicantId}
 * */
router.get("/review-applicants/:applicantId", reviewController.getReviewAllByApplicantId);


/**
 * /api/v1/review/review-applicants/{applicantId}/{userId}
 * */
router.get("/review-applicants/:applicantId/:userId", reviewController.getReviewApplicantByUserId);

module.exports = router;
