const router = require('express').Router()

router.use('/cnh', require('./routes/cnhRoutes'))
router.use('/birth', require('./routes/birthRoutes'))
router.use('/marriage', require('./routes/marriageRoutes'))
router.use('/death', require('./routes/deathRoutes'))

module.exports = router
