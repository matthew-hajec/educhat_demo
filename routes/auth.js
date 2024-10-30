var express = require('express');
var bcrypt = require('bcrypt');

var router = express.Router();

// GET /auth
router.get('/', (req, res, next) => {
  res.render('auth', { title: 'Authorization' });
});

// POST /auth
router.post('/', async (req, res, next) => {
  const password = req.body.password;
  console.log(password);
  
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

  if (isCorrect) {
    res.send('You are authenticated');
  } else {
    res.send('You are not authenticated');
  }
})

module.exports = router;
