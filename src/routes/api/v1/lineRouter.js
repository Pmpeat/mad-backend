const router = require('express').Router();
const dialogFlowController = require('../../../controllers/v1/DialogFlow.controller');
const auth = require('../../../utils/auth');
const line = require('@line/bot-sdk');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

const lineConfig = {
    channelAccessToken : env.LINE_ACCESS_TOKEN,
    channelSecret : env.LINE_SECRET_TOKEN
}

/**
 * /api/v1/line/handle-event
 * */
router.post('/handle-event', line.middleware(lineConfig), async (req ,res) => {
    try {
        const events = req.body.events;
        console.log('event = >>>',events);
        return events.length > 0 ? await events.map(item => dialogFlowController.handleEvent(item)):res.status(200).send("OK")
    } catch (err) {
        requestHandler.sendError(req, res, err);
    }
});


module.exports = router;
