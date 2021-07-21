const router = require('express').Router()
const container = require('../config/scannerTreatmentDI')
const marriageManagerController = container.get('marriageManager.controller')

router.use('/marriage-reader', async (req, res) => {
  try {
    return res.json(
      await marriageManagerController.marriageReader(req.body.idPath)
    )
  } catch (error) {
    res.status(500).send({ msg: `Ocr Failed!`, error: error.message })
  }
})

module.exports = router
