const router = require("express").Router();

router.use("/files", require("./routes/storage"));

module.exports = router;
