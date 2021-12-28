const express = require("express");
const { requireSignin } = require("../common-middleware");
const { initialData } = require("../controllers/initialdataController");
const { clientinitialData } = require("../controllers/initialdataController");
const router = express.Router();
router.post("/initialdata", requireSignin, initialData);
router.get("/clientinitialdata", clientinitialData);

module.exports = router;
