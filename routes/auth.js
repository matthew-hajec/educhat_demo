var express = require('express');
var bcrypt = require('bcrypt');
var crypto = require('crypto');

var openAI = require('../services/openai');
var Session = require('../models/session');

var router = express.Router();

// GET /auth
router.get('/', (req, res, next) => {
  res.render('auth', { title: 'Authorization' });
});

// POST /auth
router.post('/', async (req, res, next) => {
  try {
    const password = req.body.password;
    
    // Hardcoded password hash, why not? I'd like to see them try
    const passwordHash = '$2b$12$C761s.cBMtO.r04w8PGuousp.4GMo22VkIEPEj7mk1.YjzXjOB7Ey';

    // Check if the password is correct
    const isCorrect = await new Promise((resolve, reject) => {
      bcrypt.compare(password, passwordHash, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (!isCorrect) {
      res.status(401);
      res.send('You are not authenticated');
      return;
    }

    // Generate a big, cryptographically secure random number
    const randomNumber = crypto.randomBytes(32).toString('hex');
    
    // First, create an OpenAI client
    const openAIClient = await openAI.createClient();

    // Now create a thread
    const threadID = await openAI.createThread(openAIClient);

    // Finally, create a session
    await Session.create({
      sessionID: randomNumber,
      openAIThreadID: threadID
    });

    // Give the user their session ID as a secure cookie
    res.cookie('sessionID', randomNumber, { httpOnly: true, secure: true });
    res.redirect('/');
  } catch(e) {
    // Send errors to the default error handler
    next(e);
  }
})

// POST /auth/logout
router.post('/logout', async (req, res, next) => {
  try {
    // Delete the session
    await Session.destroy({
      where: {
        sessionID: req.cookies.sessionID
      }
    });

    // Clear the session cookie
    res.clearCookie('sessionID');
    res.redirect('/auth');
  } catch(e) {
    // Send errors to the default error handler
    next(e);
  }
});

module.exports = router;
