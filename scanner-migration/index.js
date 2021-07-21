const express = require('express')
const app = express()

require('dotenv').config()

const pkg = require('./package.json')
const server_port = process.env.SERVER_PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({
    name: pkg.name,
    version: pkg.version,
  })
})

app.listen(server_port, () => {
  console.log(
    `INFO: ${pkg.name} microservice is listening on port ${server_port}`
  )
})

app.use('/v1/scanner', require('./services/ocr/routes'))
app.use('/v1/storage', require('./services/storage/routes'))
