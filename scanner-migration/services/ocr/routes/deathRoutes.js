const router = require('express').Router()
const container = require('../config/scannerTreatmentDI')
const deathManagerController = container.get('deathManager.controller')

router.use('/death-reader', async (req, res) => {
  try {
    return res.json(await deathManagerController.deathReader(req.body.idPath))
  } catch (error) {
    res.status(500).send({ msg: `Ocr Failed!`, error: error.message })
  }
})

module.exports = router
