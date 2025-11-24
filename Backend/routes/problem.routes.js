const router = require("express").Router();
const problemController = require("../controllers/problem.controller");

router.get("/", problemController.getAllProblems);
router.get("/:name", problemController.getProblemByName);

module.exports = router;