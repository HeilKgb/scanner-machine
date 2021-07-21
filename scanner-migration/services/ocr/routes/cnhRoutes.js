const router = require('express').Router()
const container = require('../config/scannerTreatmentDI')
const cnhManagerController = container.get('cnhManager.controller')

router.post('/cnh-reader', async (req, res) => {
  try {
    return res.json(await cnhManagerController.cnhReader(req.body.idPath))
  } catch (error) {
    res.status(500).send({ msg: `Ocr Failed!`, error: error.message })
  }
})

module.exports = router
