// Routes here do require server-side state (the session), but the usage is simple and well-defined right now.

var express = require('express');

var openAI = require('../services/openai');
var Session = require('../models/session');

var router = express.Router();

// GET /api/messages
// Would get historical messages for the current session
// Can't be bothered

// POST /api/message
router.post('/message', async (req, res, next) => {
    try {
        const message = req.body.message;

        // Create an OpenAI client
        const openAIClient = await openAI.createClient();

        // Get the thread ID from the session
        const threadID = req.session.openAIThreadID;

        // Get the assistant ID
        const assistantID = openAI.getAssistantID();

        // Query the bot
        const assistantResponse = await openAI.queryBot(openAIClient, threadID, assistantID, message);

        const responseMessage = JSON.parse(assistantResponse.textContent)

        console.log(assistantResponse.run.usage)

        // Create a mapping of the response
        const response = {
            message: responseMessage,
            usage: assistantResponse.run.usage,
        };

        res.send(response);
    } catch(e) {
        // Send a 500 error
        res.status(500)
        res.json({error: e.message});
    }
});

module.exports = router;