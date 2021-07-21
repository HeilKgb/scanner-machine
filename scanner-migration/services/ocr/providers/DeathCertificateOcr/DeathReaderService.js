module.exports = class DeathReaderService {
  constructor(deathImageTreatment, tesseractWorker, readerSuper) {
    this._deathImageTreatment = deathImageTreatment
    this._tesseractWorker = tesseractWorker
    this._readerSuper = readerSuper
  }

  async makeOcrDeathCertificate(idPath) {
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
      return this._getDeathObject(objectToData)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async _treatImage(idPath) {
    try {
      return await this._deathImageTreatment.getImageToRead(idPath)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async _recognizePointsToExtractData(filePath) {
    const { data } = await this._tesseractWorker._worker.recognize(filePath)
    const { words } = data
    const posAnchors = await this._catchAnchorNames(words)
    const { dayPts, monthPts, yearPts } = this._getPoints({ posAnchors })
    const extractAreaFunction = this._readerSuper.getExtractArea()
    return extractAreaFunction(...[dayPts, monthPts, yearPts])
  }

  async _catchAnchorNames(words) {
    const posAnchors = {
      pos1: '',
      pos2: '',
      pos3: '',
    }
    await this._findPositionByAnchor(words, posAnchors)
    return posAnchors
  }

  async _findPositionByAnchor(words, posAnchors) {
    for (let index = 0; index < words.length; index++) {
      if (await this._readerSuper._catchField(words, index, 'DIA')) {
        posAnchors.pos1 = words[index].bbox
      }
      if (await this._readerSuper._catchField(words, index, 'MES')) {
        posAnchors.pos2 = words[index].bbox
      }
      if (await this._readerSuper._catchField(words, index, 'ANO')) {
        posAnchors.pos3 = words[index].bbox
      }
    }
  }

  _getPoints(params) {
    const { posAnchors } = params
    const dayPts = this._getDayPoints(posAnchors.pos1)
    const monthPts = this._getMonthPoints(posAnchors.pos2)
    const yearPts = this._getYearPoints(posAnchors.pos3)
    return { dayPts, monthPts, yearPts }
  }

  _getDayPoints(pos1) {
    return this._dayPointsFunction(pos1)
  }

  _dayPointsFunction(pos1) {
    if (!pos1) return undefined
    const dimensions = {
      fitLeftField: pos1.x0 - 5,
      fitTopField: pos1.y1,
      fitWidthField: pos1.x1 - pos1.x0 + 5,
      fitHeightField: 60,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getMonthPoints(pos3) {
    return this._monthPointsFunction(pos3)
  }

  _monthPointsFunction(pos3) {
    if (!pos3) return undefined
    const dimensions = {
      fitLeftField: pos3.x0 - 5,
      fitTopField: pos3.y1,
      fitWidthField: pos3.x1 - pos3.x0 + 5,
      fitHeightField: 65,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getYearPoints(pos4) {
    return this._yearPointsFunction(pos4)
  }

  _yearPointsFunction(pos4) {
    if (!pos4) return undefined
    const dimensions = {
      fitLeftField: pos4.x0,
      fitTopField: pos4.y1,
      fitWidthField: pos4.x1 - pos4.x0 + 30,
      fitHeightField: 61,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _extractingField(readValues) {
    const data = {
      day: (() =>
        readValues[0] ? readValues[0].trim().slice(0, 2) : undefined)(),
      month: (() =>
        readValues[2] ? readValues[2].trim().slice(0, 2) : undefined)(),
      year: (() =>
        readValues[4] ? readValues[4].trim().slice(0, 4) : undefined)(),
    }
    return data
  }

  async _getConfidenceField(readValues) {
    return {
      day: readValues[1],
      month: readValues[3],
      year: readValues[5],
    }
  }

  async _verifyingUsability(confidenceValues) {
    const usability = {
      dayUsability: confidenceValues.day >= 83 ? true : false,
      monthUsability: confidenceValues.month >= 83 ? true : false,
      yearUsability: confidenceValues.year >= 83 ? true : false,
    }
    return usability
  }

  _getDeathObject(objectToData) {
    let date = `${objectToData.objTreated.day}/${objectToData.objTreated.month}/${objectToData.objTreated.year}`
    const deathData = {
      deathDay: (() =>
        objectToData.objTreated.day === undefined ||
        objectToData.objTreated.month === undefined ||
        objectToData.objTreated.year === undefined
          ? (date = 'Date Empty')
          : date)(),
      dayData: this._getDayDeath({ objectToData }),
      monthData: this._getMonthDeath({ objectToData }),
      yearData: this._getYearDeath({ objectToData }),
    }
    return deathData
  }

  _getDayDeath(params) {
    const { objectToData } = params
    return {
      day: this._getDayData(objectToData.objTreated),
      confidence: objectToData.confidenceField.day,
      dayUsability: objectToData.useful.dayUsability,
    }
  }

  _getDayData(fieldTreated) {
    return this._readerSuper.getFieldData(fieldTreated, 'day')
  }

  _getMonthDeath(params) {
    const { objectToData } = params
    return {
      month: this._getMonthData(objectToData.objTreated),
      confidence: objectToData.confidenceField.month,
      monthUsability: objectToData.useful.monthUsability,
    }
  }

  _getMonthData(fieldTreated) {
    return this._readerSuper.getFieldData(fieldTreated, 'month')
  }

  _getYearDeath(params) {
    const { objectToData } = params
    return {
      year: this._getYearData(objectToData.objTreated),
      confidence: objectToData.confidenceField.year,
      yearUsability: objectToData.useful.yearUsability,
    }
  }

  _getYearData(fieldTreated) {
    return this._readerSuper.getFieldData(fieldTreated, 'year')
  }
}
