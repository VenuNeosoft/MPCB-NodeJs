const express = require('express');

const getUsers = require('../controllers/loginUserController');
const router = express.Router();

router.post('/login', getUsers);

module.exports = router;
