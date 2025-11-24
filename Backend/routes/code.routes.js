const router = require('express').Router();
const codeController = require('../controllers/code.controller');

router.post("/", codeController.runCode);

module.exports = router;