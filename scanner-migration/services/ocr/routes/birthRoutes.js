const router = require('express').Router()
const container = require('../config/scannerTreatmentDI')
const birthManagerController = container.get('birthManager.controller')

router.use('/birth-reader', async (req, res) => {
  try {
    return res.json(await birthManagerController.birthReader(req.body.idPath))
  } catch (error) {
    res.status(500).send({ msg: `Ocr Failed!`, error: error.message })
  }
})

module.exports = router
