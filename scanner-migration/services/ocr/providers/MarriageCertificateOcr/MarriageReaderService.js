module.exports = class MarriageReaderService {
  constructor(marriageImageTreatment, tesseractWorker, readerSuper) {
    this._marriageImageTreatment = marriageImageTreatment
    this._tesseractWorker = tesseractWorker
    this._readerSuper = readerSuper
  }

  async makeOcrReaderCertificate(idPath) {
    try {
      const filePath = await this._treatImage(idPath)
      await this._tesseractWorker.loadingWorker()
      const extractArea = await this._recognizePointsToExtractData(filePath)
      const readingValues = await this._readerSuper._extractData({
        extractArea,
        filePath,
      })
      const objTreated = this._extractingField(readingValues)
      const confidenceField = await this._getConfidenceField(readingValues)
      const useful = await this._verifyingUsability(confidenceField)
      const objectToData = { objTreated, confidenceField, useful }
      return this._getMarriageObject(objectToData)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async _treatImage(idPath) {
    try {
      return await this._marriageImageTreatment.getImageToRead(idPath)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async _recognizePointsToExtractData(filePath) {
    const { data } = await this._tesseractWorker._worker.recognize(filePath)
    const { words } = data
    const posAnchors = await this._catchAnchorNames(words)
    const registrationPoints = this._getRegistrationPoints(posAnchors.pos1)
    const extractAreaFunction = this._readerSuper.getExtractArea()
    return extractAreaFunction(...[registrationPoints])
  }

  async _catchAnchorNames(words) {
    const posAnchors = { pos1: '' }
    await this._findPositionByAnchor(words, posAnchors)
    return posAnchors
  }

  async _findPositionByAnchor(words, posAnchors) {
    for (let index = 0; index < words.length; index++) {
      if (
        (await this._readerSuper._catchField(words, index, 'Matricula')) ||
        (await this._readerSuper._catchField(words, index, 'MATRICULA'))
      ) {
        posAnchors.pos1 = words[index].bbox
      }
    }
  }

  _extractingField(readingValues) {
    const data = {
      registry: (() =>
        readingValues[0] ? readingValues[0].trim().slice(0, 41) : undefined)(),
    }
    return data
  }

  _getRegistrationPoints(pos1) {
    return this._registrationPointsFunction(pos1)
  }

  _registrationPointsFunction(pos1) {
    if (!pos1) return undefined
    const dimensions = {
      fitLeftField: pos1.x0 - 300,
      fitTopField: pos1.y1 - 10,
      fitWidthField: 750,
      fitHeightField: 45,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  async _getConfidenceField(confidence) {
    return {
      registry: !confidence[1] ? (confidence[1] = 0) : confidence[1],
    }
  }

  async _verifyingUsability(confidenceValues) {
    return {
      registryUsability: confidenceValues.registry > 80 ? true : false,
    }
  }

  _getMarriageObject(objectToData) {
    return {
      registryData: this._getRegistry({ objectToData }),
    }
  }

  _getRegistry(params) {
    const { objectToData } = params
    return {
      registry: this._getRegistryData(objectToData.objTreated),
      confidence: objectToData.confidenceField.registry,
      registryIsUseful: objectToData.useful.registryUsability,
    }
  }

  _getRegistryData(fieldTreated) {
    return this._readerSuper.getFieldData(fieldTreated, 'registry')
  }
}
