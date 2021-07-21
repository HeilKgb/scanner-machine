module.exports = class BirthReaderService {
  constructor(birthImageTreatmentService, tesseractWorker, readerSuper) {
    this._birthImageTreatmentService = birthImageTreatmentService
    this._tesseractWorker = tesseractWorker
    this._readerSuper = readerSuper
  }

  async makeOcrBirthCertificate(idPath) {
    try {
      const filePath = await this._treatImage(idPath)
      await this._tesseractWorker.loadingWorker()
      const extractArea = await this._recognizePtsToExtractData(filePath)
      const readingValues = await this._readerSuper._extractData({
        extractArea,
        filePath,
      })
      const objTreated = this._extractingField(readingValues)
      const confidenceObj = await this._getConfidenceField(readingValues)
      const useful = await this._verifyingUsability(objTreated, confidenceObj)
      const objectToData = { objTreated, confidenceObj, useful }
      return this._getBirthObject(objectToData)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async _treatImage(idPath) {
    try {
      return await this._birthImageTreatmentService.getImageToRead(idPath)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async _recognizePtsToExtractData(filePath) {
    const { data } = await this._tesseractWorker._worker.recognize(filePath)
    const { words } = data
    const posAnchors = await this._catchAnchorNames(words)
    const {
      registryPts,
      genderPts,
      grandParentsPts,
      birthPlacePts,
    } = this._getPoints({ posAnchors })
    const extractAreaFunction = this._readerSuper.getExtractArea()
    const ptsArray = [registryPts, genderPts, grandParentsPts, birthPlacePts]
    return extractAreaFunction(...ptsArray)
  }

  async _catchAnchorNames(words) {
    const posAnchors = {
      pos1: '',
      pos2: '',
      pos3: '',
      pos4: '',
      pos5: '',
    }
    await this._findPositionByAnchor(words, posAnchors)
    return posAnchors
  }

  async _findPositionByAnchor(words, posAnchors) {
    for (let index = 0; index < words.length; index++) {
      if (await this._catchField(words, index, 'MATRICULA')) {
        posAnchors.pos1 = words[index].bbox
      }
      if (await this._catchField(words, index, 'DATA')) {
        posAnchors.pos2 = words[index].bbox
      }
      if (await this._catchField(words, index, 'SEXO')) {
        posAnchors.pos3 = words[index].bbox
      }
      if (await this._catchField(words, index, 'AVÓS')) {
        posAnchors.pos4 = words[index].bbox
      }
      if (await this._catchField(words, index, 'LOCAL')) {
        posAnchors.pos5 = words[index].bbox
      }
    }
  }

  async _catchField(text, index, string) {
    return text[index].text == [string]
  }

  _getPoints(params) {
    const { posAnchors } = params
    const registryPts = this._getRegistryPts(posAnchors.pos1, posAnchors.pos2)
    const genderPts = this._getGenderPts(posAnchors.pos3)
    const grandParentsPts = this._getGrandParentsPts(posAnchors.pos4)
    const birthPlacePts = this._getBirthPlacePts(posAnchors.pos5)
    return { registryPts, genderPts, grandParentsPts, birthPlacePts }
  }

  _getRegistryPts(pos1, pos2) {
    return this._registryPtsFunction(pos1, pos2)
  }

  _registryPtsFunction(pos1, pos2) {
    if (!pos1 || !pos2) return undefined
    const dimensions = {
      fitLeftField: pos1.x0 - 315,
      fitTopField: pos1.y1 - 10,
      fitWidthField: pos1.x0 - pos2.x1 + 333,
      fitHeightField: pos2.y0 - pos1.y1 + 18,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getGenderPts(pos3) {
    return this._genderPtsFunction(pos3)
  }

  _genderPtsFunction(pos3) {
    if (!pos3) return undefined
    const dimensions = {
      fitLeftField: pos3.x0 - 10,
      fitTopField: pos3.y1,
      fitWidthField: 135,
      fitHeightField: 35,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getGrandParentsPts(pos4) {
    return this._grandParentsPtsFunction(pos4)
  }

  _grandParentsPtsFunction(pos4) {
    if (!pos4) return undefined
    const dimensions = {
      fitLeftField: pos4.x0 - 27,
      fitTopField: pos4.y1,
      fitWidthField: 600,
      fitHeightField: 45,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getBirthPlacePts(pos5) {
    return this._birthPlacePtsFunction(pos5)
  }

  _birthPlacePtsFunction(pos5) {
    if (!pos5) return undefined
    const dimensions = {
      fitLeftField: pos5.x0 - 7,
      fitTopField: pos5.y1,
      fitWidthField: 400,
      fitHeightField: 45,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _extractingField(readingValues) {
    const splitedNames = this._separatingNames(readingValues)
    const genderFully = this._catchGenderTupeFully()

    const gender = readingValues[2]
      ? readingValues[2].trim().split('\n').join(' ')
      : undefined

    const data = {
      registry: (() =>
        readingValues[0] ? readingValues[0].trim().slice(0, 40) : undefined)(),
      gender: gender ? genderFully(gender) : undefined,

      grandParents: {
        paternalGrandParents: splitedNames
          ? splitedNames[0].split('e')
          : 'Paternal Grandparents Empty',
        maternalGrandParents: splitedNames
          ? splitedNames[1].split('e')
          : 'Maternal Grandparents Empty',
      },

      birthPlace: (() =>
        readingValues[6] ? readingValues[6].trim() : undefined)(),
    }
    return data
  }

  _separatingNames(readingValues) {
    return readingValues[4] ? readingValues[4].trim().split('\n') : undefined
  }

  _catchGenderTupeFully() {
    return catched => {
      const female = {
        regex1: /nino/i,
        regex2: /fem/i,
        value: `feminino`,
      }
      const male = {
        regex1: /lino/i,
        regex2: /mas/i,
        value: `masculino`,
      }
      if (catched.match(female.regex1 || female.regex2)) return female.value
      if (catched.match(male.regex1 || male.regex2)) return male.value
    }
  }

  async _getConfidenceField(confidence) {
    return {
      registry: !confidence[1] ? (confidence[1] = 0) : confidence[1],
      gender: !confidence[3] ? (confidence[3] = 0) : confidence[3],
      grandParents: !confidence[5] ? (confidence[5] = 0) : confidence[5],
      birthPlace: !confidence[7] ? (confidence[7] = 0) : confidence[7],
    }
  }

  async _verifyingUsability(obj, confidenceValue) {
    const usability = {
      registryUsability: confidenceValue.id >= 85 ? true : false,
      genderUsability:
        obj.gender === 'feminino' || obj.gender === 'masculino' ? true : false,
      grandParentsUsability: confidenceValue.grandParents >= 85 ? true : false,
      birthPlaceUsabilty: confidenceValue.birthPlace >= 85 ? true : false,
    }
    return usability
  }

  _getBirthObject(objectToData) {
    return {
      registryData: this._getRegistryProps({ objectToData }),
      genderData: this._getGenderProps({ objectToData }),
      grandParentsData: this._getGrandParentsProps({ objectToData }),
      birthPlaceData: this._getBirthPlaceProps({ objectToData }),
    }
  }

  _getRegistryProps(params) {
    const { objectToData } = params
    return {
      registry: this._getRegistryData(objectToData.objTreated),
      confidence: objectToData.confidenceObj.registry,
      registryIsUseful: objectToData.useful.registryUsability,
    }
  }

  _getRegistryData(objTreated) {
    return this._readerSuper.getFieldData(objTreated, 'registry')
  }

  _getGenderProps(params) {
    const { objectToData } = params
    return {
      gender: this._getGenderData(objectToData.objTreated),
      confidence: objectToData.confidenceObj.gender,
      genderIsUseful: objectToData.useful.genderUsability,
    }
  }

  _getGenderData(objTreated) {
    return this._readerSuper.getFieldData(objTreated, 'gender')
  }

  _getGrandParentsProps(params) {
    const { objectToData } = params
    return {
      grandParents: this._getParentsData(objectToData.objTreated),
      confidence: objectToData.confidenceObj.grandParents,
      grandParentsIsUseful: objectToData.useful.grandParentsUsability,
    }
  }

  _getParentsData(objTreated) {
    return this._readerSuper.getFieldData(objTreated, 'grandParents')
  }

  _getBirthPlaceProps(params) {
    const { objectToData } = params
    return {
      birthPlace: this._getBirthPlaceData(objectToData.objTreated),
      confidence: objectToData.confidenceObj.birthPlace,
      birthPlacesIsUseful: objectToData.useful.birthPlaceUsabilty,
    }
  }

  _getBirthPlaceData(objTreated) {
    return this._readerSuper.getFieldData(objTreated, 'birthPlace')
  }
}
