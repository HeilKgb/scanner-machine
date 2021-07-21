const router = require("express").Router();
const container = require("../config/storageDI");
const storageController = container.get("storage.controller");

router.post("/download", (...args) => storageController.getDownload(...args));

module.exports = router;
