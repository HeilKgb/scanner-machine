const { ContainerBuilder, Reference } = require('node-dependency-injection')
const StorageController = require('../controllers/storageController')
const StorageService = require('../providers/storageService')

const { Storage } = require('@google-cloud/storage')
const storage = new Storage()
const fs = require('fs')
const { yup, validate } = require('../../../utils/yup-validator')
const debug = require('../../../utils/debug')

const container = new ContainerBuilder()

container
  .register('storage.service', StorageService)
  .addArgument(storage)
  .addArgument(fs)
  .addArgument(debug)

container
  .register('storage.controller', StorageController)
  .addArgument(new Reference(`storage.service`))
  .addArgument(yup)
  .addArgument(validate)
  .addArgument(debug)

module.exports = container
