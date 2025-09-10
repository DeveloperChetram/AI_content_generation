const express = require('express');
const { verifyTokenController } = require('../controllers/index.controller');

const verifyRouter = express.Router();

verifyRouter.get('/', verifyTokenController);

module.exports = verifyRouter;