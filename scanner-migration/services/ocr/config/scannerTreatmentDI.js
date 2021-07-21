const {
  ContainerBuilder,
  Reference,
  PackageReference,
} = require('node-dependency-injection')

const CnhImageTreatmentService = require('../providers/CnhOcr/CnhImageTreatmentService')
const CnhReaderService = require('../providers/CnhOcr/CnhReaderService')
const CnhOcrManagerService = require('../providers/CnhOcr/CnhOcrManagerService')

const BirthImageTreatmentService = require('../providers/BirthCertificateOcr/BirthImageTreatmentService')
const BirthReaderService = require('../providers/BirthCertificateOcr/BirthReaderService')
const BirthOcrManagerService = require('../providers/BirthCertificateOcr/BirthOcrManagerService')

const DeathImageTreatmentService = require('../providers/DeathCertificateOcr/DeathImageTreatmentService')
const DeathReaderService = require('../providers/DeathCertificateOcr/DeathReaderService')
const DeathOcrManagerService = require('../providers/DeathCertificateOcr/DeathOcrManagerService')

const MarriageImageTreatmentService = require('../providers/MarriageCertificateOcr/MarriageImageTreatment')
const MarriageReaderService = require('../providers/MarriageCertificateOcr/MarriageReaderService')
const MarriageOcrManagerService = require('../providers/MarriageCertificateOcr/MarriageOcrManagerService')

const BirthManagerController = require('../controllers/BirthManagerController')
const CnhManagerController = require('../controllers/CnhManagerController')
const DeathManagerController = require('../controllers/DeathManagerController')
const MarriageManagerController = require('../controllers/MarriageManagerController')

const ImageTreatmentSuperService = require('../providers/SuperServices/ImageTreatmentSuperService')
const ReaderSuperService = require('../providers/SuperServices/ReaderSuperService')

const WorkerLoader = require('../WorkerLoader')

const storageDI = require('../../storage/config/storageDI')

const { createWorker } = require('tesseract.js')
let worker = createWorker({
  logger: m => console.log(m),
})

let container = new ContainerBuilder()

container
  .register('birthManager.controller', BirthManagerController)
  .addArgument(new Reference('birthOcrManager.service'))

container
  .register('cnhManager.controller', CnhManagerController)
  .addArgument(new Reference('cnhOcrManager.service'))

container
  .register('deathManager.controller', DeathManagerController)
  .addArgument(new Reference('deathOcrManager.service'))

container
  .register('marriageManager.controller', MarriageManagerController)
  .addArgument(new Reference('marriageOcrManager.service'))

container
  .register('birthOcrManager.service', BirthOcrManagerService)
  .addArgument(new Reference('birthReader.service'))

container
  .register('birthReader.service', BirthReaderService)
  .addArgument(new Reference('birthImageTreatment.service'))
  .addArgument(new Reference('tesseract.worker'))
  .addArgument(new Reference('readerSuper.service'))

container
  .register('birthImageTreatment.service', BirthImageTreatmentService)
  .addArgument(storageDI.get('storage.service'))
  .addArgument(new PackageReference('sharp'))
  .addArgument(new PackageReference('fs'))

container
  .register('cnhOcrManager.service', CnhOcrManagerService)
  .addArgument(new Reference('cnhReader.service'))

container
  .register('cnhReader.service', CnhReaderService)
  .addArgument(new Reference('cnhImageTreatment.service'))
  .addArgument(new Reference('tesseract.worker'))
  .addArgument(new Reference('readerSuper.service'))

container
  .register('cnhImageTreatment.service', CnhImageTreatmentService)
  .addArgument(storageDI.get('storage.service'))
  .addArgument(new PackageReference('sharp'))
  .addArgument(new PackageReference('fs'))

container
  .register('deathOcrManager.service', DeathOcrManagerService)
  .addArgument(new Reference('deathReader.service'))

container
  .register('deathReader.service', DeathReaderService)
  .addArgument(new Reference('deathImageTreatment.service'))
  .addArgument(new Reference('tesseract.worker'))
  .addArgument(new Reference('readerSuper.service'))

container
  .register('deathImageTreatment.service', DeathImageTreatmentService)
  .addArgument(storageDI.get('storage.service'))
  .addArgument(new PackageReference('sharp'))
  .addArgument(new PackageReference('fs'))

container
  .register('marriageOcrManager.service', MarriageOcrManagerService)
  .addArgument(new Reference('marriageReader.service'))

container
  .register('marriageReader.service', MarriageReaderService)
  .addArgument(new Reference('marriageImageTreatment.service'))
  .addArgument(new Reference('tesseract.worker'))
  .addArgument(new Reference('readerSuper.service'))

container
  .register('marriageImageTreatment.service', MarriageImageTreatmentService)
  .addArgument(storageDI.get('storage.service'))
  .addArgument(new PackageReference('sharp'))
  .addArgument(new PackageReference('fs'))

container.register('tesseract.worker', WorkerLoader).addArgument(worker)

let superImageTreatment = container
  .register('imageTreatmentSuper.service', ImageTreatmentSuperService)
  .addArgument(storageDI.get('storage.service'))
  .addArgument(new PackageReference('fs'))
superImageTreatment.abstract = true

container
  .register('readerSuper.service', ReaderSuperService)
  .addArgument(new Reference('tesseract.worker'))

module.exports = container
