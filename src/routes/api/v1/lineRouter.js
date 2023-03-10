const router = require('express').Router();
const dialogFlowController = require('../../../controllers/v1/DialogFlow.controller');
const auth = require('../../../utils/auth');
const line = require('@line/bot-sdk');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

const lineConfig = {
    channelAccessToken : process.env.LINE_ACCESS_TOKEN,
    channelSecret : process.env.LINE_SECRET_TOKEN
}

const client = new line.Client(lineConfig);

/**
 * /api/v1/line/handle-event
 * */
router.post('/webhook', async (req ,res) => {
    try {
        const events = req.body.events;
        console.log('event = >>>',events);
        return events.length > 0 ? await events.map(item => dialogFlowController.handleEvent(req ,res,item)):res.status(200).send("OK")
    } catch (err) {
        res.status(500).end();
    }
});

/**
 * /api/v1/line/text_query
 * */
router.post('/text-query', async (req ,res) => {
    try {
        const {text,userId} = req.body;
        const resultQuery = await dialogFlowController.textQuery(text,userId);
        console.log('dialogFlow = >>>',resultQuery[0].queryResult.intent);
        res.send(resultQuery[0].queryResult.fulfillmentText);
    } catch (err) {
        res.status(500).end();
    }
});

/**
 * /api/v1/line/text_query
 * */
// router.post('/push-message', async (req ,res) => {
//     try {
//         const resultQuery = await dialogFlowController.pushMessage(req,res);
//         res.send(resultQuery);
//     } catch (err) {
//         res.status(500).end();
//     }
// });

// const handleEvent = async (event) => {
//     return client.replyMessage(event.replyToken,{type:'text',text:'Test'});
// }


module.exports = router;
