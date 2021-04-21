const express = require("express");
const { initialData } = require("../controllers/initialdataController");
const router = express.Router();
router.post("/initialdata", initialData);
module.exports = router;
