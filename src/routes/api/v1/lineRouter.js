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

const client = new line.Client(lineConfig);


router.use('/webhook', line.middleware(lineConfig))


/**
 * /api/v1/line/handle-event
 * */
router.post('/webhook', line.middleware(lineConfig), async (req ,res) => {
    try {
        const events = req.body.events;
        console.log('event = >>>',events);
        return events.length > 0 ? await events.map(item => handleEvent(item)):res.status(200).send("OK")
    } catch (err) {
        res.status(500).end();
    }
});

const handleEvent = async (event) => {
    console.log(event);
    return client.replyMessage(event.replyToken,{type:'text',text:'Test'});
}


module.exports = router;
