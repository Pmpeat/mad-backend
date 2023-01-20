const router = require('express').Router();
// const excelController = require('../../../controllers/v1/Excel.controller');
const sheetController = require('../../../controllers/v1/Sheet.controller');
const upload = require("../../../middlewares/upload");

/**
 * /api/v1/applicant/uploads
 * */
// router.post('/uploads', upload.single("file"),excelController.upload);

/**
 * /api/v1/applicant//create-applicant
 * */
router.post('/create-applicant', sheetController.createApplicant);


/**
 * /api/v1/applicant/applicants
 * */
router.get("/applicants", sheetController.getApplicantList);


module.exports = router;
