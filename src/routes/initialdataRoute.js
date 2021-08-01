const express = require("express");
const { requireSignin } = require("../common-middleware");
const { initialData } = require("../controllers/initialdataController");
const router = express.Router();
router.post("/initialdata", requireSignin, initialData);
module.exports = router;
