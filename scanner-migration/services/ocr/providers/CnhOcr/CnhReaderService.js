module.exports = class CnhReaderService {
  constructor(cnhImageTreatmentService, tesseractWorker, readerSuper) {
    this._cnhImageTreatmentService = cnhImageTreatmentService
    this._tesseractWorker = tesseractWorker
    this._readerSuper = readerSuper
  }

  async makeOcrCnh(idPath) {
    try {
      const filePath = await this._treatImage(idPath)
      await this._tesseractWorker.loadingWorker()
      const extractArea = await this._recognizePtsToExtractData(filePath)
      const readingValues = await this._readerSuper._extractData({
        extractArea,
        filePath,
      })
      const objTreated = await this._extractingField(readingValues)
      const confidenceField = await this._getConfidenceField(readingValues)
      const id = await this._regexOnlyNumbers(objTreated)
      const agency = await this._regexId(objTreated)
      const nameFather = await this._regexFatherName(objTreated)
      const useful = await this._verifyingUsability(objTreated, confidenceField)
      const objectToData = {
        objTreated,
        confidenceField,
        useful,
        id,
        agency,
        nameFather,
      }
      return this._getCnhObject(objectToData)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async _treatImage(idPath) {
    try {
      return await this._cnhImageTreatmentService.getImageToRead(idPath)
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
      namePts,
      docIdPts,
      cpfPts,
      birthDatePts,
      fatherPts,
      motherPts,
      registryCnhPts,
      emissionPts,
    } = this._getPoints({ posAnchors })
    const extractAreaFunction = this._readerSuper.getExtractArea()
    return extractAreaFunction(
      ...[
        namePts,
        docIdPts,
        cpfPts,
        birthDatePts,
        fatherPts,
        motherPts,
        registryCnhPts,
        emissionPts,
      ]
    )
  }

  _getPoints(params) {
    const { posAnchors } = params
    const namePts = this._getNamePts(posAnchors.pos1, posAnchors.pos2)
    const docIdPts = this._getDocIdPts(posAnchors.pos2, posAnchors.pos5)
    const cpfPts = this._getCpfPts(posAnchors.pos3, posAnchors.pos4)
    const birthDatePts = this._getBirthDatePts(posAnchors.pos4, posAnchors.pos5)
    const fatherPts = this._getFatherPts(posAnchors.pos4, posAnchors.pos6)
    const motherPts = this._getMotherPts(
      fatherPts,
      posAnchors.pos4,
      posAnchors.pos6
    )
    const registryCnhPts = this._getRegistryCnhPts(posAnchors.pos7)
    const emissionPts = this._getEmissionPts(posAnchors.pos8)
    return {
      namePts,
      docIdPts,
      cpfPts,
      birthDatePts,
      fatherPts,
      motherPts,
      registryCnhPts,
      emissionPts,
    }
  }

  async _catchAnchorNames(words) {
    const posAnchors = {
      pos1: '',
      pos2: '',
      pos3: '',
      pos4: '',
      pos5: '',
      pos6: '',
      pos7: '',
      pos8: '',
    }
    await this._findPositionByAnchor(words, posAnchors)
    return posAnchors
  }

  async _findPositionByAnchor(words, posAnchors) {
    for (let index = 0; index < words.length; index++) {
      if (await this._readerSuper._catchField(words, index, 'NOME')) {
        posAnchors.pos1 = words[index].bbox
      }
      if (await this._readerSuper._catchField(words, index, 'DOC')) {
        posAnchors.pos2 = words[index].bbox
      }
      if (await this._readerSuper._catchField(words, index, 'CPF')) {
        posAnchors.pos3 = words[index].bbox
      }
      if (await this._readerSuper._catchField(words, index, 'FILIAÇÃO')) {
        posAnchors.pos4 = words[index].bbox
      }
      if (await this._readerSuper._catchField(words, index, 'NASCIMENTO')) {
        posAnchors.pos5 = words[index].bbox
      }
      if (await this._readerSuper._catchField(words, index, 'ACC')) {
        posAnchors.pos6 = words[index].bbox
      }
      if (await this._readerSuper._catchField(words, index, 'REGISTRO')) {
        posAnchors.pos7 = words[index].bbox
      }
      if (await this._readerSuper._catchField(words, index, 'EMISSÃO')) {
        posAnchors.pos8 = words[index].bbox
      }
    }
  }

  _getNamePts(pos1, pos2) {
    return this._namePtsFunction(pos1, pos2)
  }

  _namePtsFunction(pos1, pos2) {
    if (!pos1 || !pos2) return undefined
    const dimensions = {
      fitLeftField: pos1.x0 - 20,
      fitTopField: pos1.y1 - 5,
      fitWidthField: pos2.x0 - pos1.x0 + 300,
      fitHeightField: pos2.y0 - pos1.y1 - 20,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getDocIdPts(pos2, pos5) {
    return this._documentIdPtsFunction(pos2, pos5)
  }

  _documentIdPtsFunction(pos2, pos5) {
    if (!pos2 || !pos5) return undefined
    const dimensions = {
      fitLeftField: pos2.x0 - 40,
      fitTopField: pos2.y1 - 0,
      fitWidthField: pos5.x0 - pos2.x0,
      fitHeightField: pos5.y0 - pos2.y1,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getCpfPts(pos3, pos4) {
    return this._cpfPtsFunction(pos3, pos4)
  }

  _cpfPtsFunction(pos3, pos4) {
    if (!pos3 || !pos4) return undefined
    const dimensions = {
      fitLeftField: pos3.x0 - 34,
      fitTopField: pos3.y1 - 5,
      fitWidthField: pos4.x1 - pos3.x0 + 252,
      fitHeightField: pos4.y0 - pos3.y1 + 2,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getBirthDatePts(pos4, pos5) {
    return this._birthPtsFunction(pos4, pos5)
  }

  _birthPtsFunction(pos4, pos5) {
    if (!pos4 || !pos5) return undefined
    const dimensions = {
      fitLeftField: pos5.x0 - 70,
      fitTopField: pos5.y1 - 7,
      fitWidthField: pos5.x0 - pos4.x0 - 167,
      fitHeightField: pos4.y0 - pos5.y0 - 46,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getFatherPts(pos4, pos6) {
    return this._fatherPtsFunction(pos4, pos6)
  }

  _fatherPtsFunction(pos4, pos6) {
    if (!pos4 || !pos6) return undefined
    const dimensions = {
      fitLeftField: pos4.x0 - 37,
      fitTopField: pos4.y1 - 13,
      fitWidthField: pos6.x1 - pos4.x0 + 288,
      fitHeightField: (pos6.y0 - pos4.y0 - 29) / 2,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getMotherPts(fatherPts, pos4, pos6) {
    return this._motherPtsFunction(fatherPts, pos4, pos6)
  }

  _motherPtsFunction(fatherPts, pos4, pos6) {
    if (!pos4 || !pos6) return undefined
    const dimensions = {
      fitLeftField: pos4.x0 - 37,
      fitTopField: pos4.y1 + (fatherPts.height / 2 + 25),
      fitWidthField: pos6.x1 - pos4.x0 + 288,
      fitHeightField: (pos6.y0 - pos4.y0 - 29) / 2,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getRegistryCnhPts(pos7) {
    return this._registryCnhPtsFunction(pos7)
  }

  _registryCnhPtsFunction(pos7) {
    if (!pos7) return undefined
    const dimensions = {
      fitLeftField: pos7.x0 - 10,
      fitTopField: pos7.y1 - 5,
      fitWidthField: 350,
      fitHeightField: 50,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  _getEmissionPts(pos8) {
    return this._emissionPtsFunction(pos8)
  }

  _emissionPtsFunction(pos8) {
    if (!pos8) return undefined
    const dimensions = {
      fitLeftField: pos8.x0 - 70,
      fitTopField: pos8.y1 - 5,
      fitWidthField: 250,
      fitHeightField: 40,
    }
    return this._readerSuper.getDimensionOfFields({ dimensions })
  }

  async _extractingField(value) {
    return {
      name: (() => (value[0] ? value[0].trim() : undefined))(),
      id: (() => (value[2] ? value[2].trim() : undefined))(),
      responsibleAgency: (() => (value[2] ? value[2].trim() : undefined))(),
      cpf: (() =>
        value[4]
          ? value[4].trim().split(' ').join('').slice(0, 11)
          : undefined)(),
      birth: (() => (value[6] ? value[6].trim().slice(0, 10) : undefined))(),
      father: (() =>
        value[8] ? value[8].trim().split('\n').join(' ') : undefined)(),
      mother: (() =>
        value[10] ? value[10].trim().split('\n').join(' ') : undefined)(),
      registry: (() =>
        value[12] ? value[12].trim().slice(0, 11) : undefined)(),
      emission: (() =>
        value[14] ? value[14].trim().slice(0, 10) : undefined)(),
    }
  }

  async _getConfidenceField(confidence) {
    try {
      return {
        name: !confidence[1] ? (confidence[1] = 0) : confidence[1],
        id: !confidence[3] ? (confidence[3] = 0) : confidence[3],
        agency: !confidence[3] ? (confidence[3] = 0) : confidence[3],
        cpf: !confidence[5] ? (confidence[5] = 0) : confidence[5],
        birth: !confidence[7] ? (confidence[7] = 0) : confidence[7],
        father: !confidence[9] ? (confidence[9] = 0) : confidence[9],
        mother: !confidence[11] ? (confidence[11] = 0) : confidence[11],
        registry: !confidence[13] ? (confidence[13] = 0) : confidence[13],
        emission: !confidence[15] ? (confidence[15] = 0) : confidence[15],
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async _regexId(fieldTreated) {
    try {
      const regex = /[A-Z]\w.+/g
      const result = regex.exec(fieldTreated.id)
      if (result !== null) {
        let idRegex = result[0]
        return idRegex
      } else {
        let idRegex = undefined
        return idRegex
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async _regexOnlyNumbers(fieldTreated) {
    try {
      if (!fieldTreated.id) {
        return undefined
      } else {
        const regex = /[0-9]\w+/g
        const result = regex.exec(fieldTreated.id)
        const agencyRegex = result[0]
        return agencyRegex
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async _regexFatherName(fieldTreated) {
    try {
      const fullName = fieldTreated.father
      if (fullName[fullName.length - 2] === ' ') {
        const newName = fullName.slice(0, fullName.length - 2)
        return newName
      } else {
        return fullName
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async _verifyingUsability(value, confidence) {
    try {
      return {
        nameUsabilty: confidence.name >= 85 ? true : false,
        idUsability: confidence.id >= 85 ? true : false,
        agencyUsability: confidence.agency >= 85 ? true : false,
        cpfUsability:
          value.cpf !== undefined || confidence.cpf > 85 ? true : false,
        birthUsability: confidence.birth >= 85 ? true : false,
        fatherUsability: confidence.father >= 85 ? true : false,
        motherUsability: confidence.mother >= 85 ? true : false,
        registryUsability: confidence.registry >= 85 ? true : false,
        emissionUsability: confidence.emission >= 85 ? true : false,
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  _getCnhObject(objData) {
    return {
      nameData: this._getNameProps({ objData }),
      documentIdData: {
        idData: this._getIdProps({ objData }),
        agencyData: this._getAgencyProps({ objData }),
      },
      cpfData: this._getCpfProps({ objData }),
      birthData: this._getBirthProps({ objData }),
      affiliattionData: {
        fatherData: this._getFatherProps({ objData }),
        motherData: this._getMotherProps({ objData }),
      },
      registryData: this._getRegistryProps({ objData }),
      emissionData: this._getEmissionProps({ objData }),
    }
  }

  _getNameProps(params) {
    const { objData } = params
    return {
      name: this._getNameData(objData.objTreated),
      nameConfidence: objData.confidenceField.name,
      nameIsUseful: objData.useful.nameUsabilty,
    }
  }

  _getNameData(fieldTreated) {
    return this._readerSuper.getFieldData(fieldTreated, 'name')
  }

  _getIdProps(params) {
    const { objData } = params
    return {
      id: this._getIdData(objData.objTreated, objData.id),
      idConfidence: objData.confidenceField.id,
      idIsUseful: objData.useful.idUsability,
    }
  }

  _getIdData(value, id) {
    return (() => (value.id === undefined ? (value.id = 'Id Empty') : id))()
  }

  _getAgencyProps(params) {
    const { objData } = params
    return {
      agency: this._getAgencyData(objData.objTreated, objData.agency),
      agencyConfidence: objData.confidenceField.id,
      agencyIsUseful: objData.useful.agencyUsability,
    }
  }

  _getAgencyData(value, agency) {
    return (() =>
      value.agency === undefined ? (value.agency = 'Agency Empty') : agency)()
  }

  _getCpfProps(params) {
    const { objData } = params
    return {
      cpf: this._getCpfData(objData.objTreated),
      cpfConfidence: objData.confidenceField.cpf,
      cpfIsUseful: objData.useful.cpfUsability,
    }
  }

  _getCpfData(obj) {
    return this._readerSuper.getFieldData(obj, 'cpf')
  }

  _getBirthProps(params) {
    const { objData } = params
    return {
      birth: this._getBirthData(objData.objTreated),
      birthConfidence: objData.confidenceField.birth,
      birthIsUseful: objData.useful.birthUsability,
    }
  }

  _getBirthData(obj) {
    return this._readerSuper.getFieldData(obj, 'birth')
  }

  _getFatherProps(params) {
    const { objData } = params
    return {
      father: this._getFatherData(objData.objTreated, objData.nameFather),
      fatherConfidence: objData.confidenceField.father,
      fatherIsUseful: objData.useful.fatherUsability,
    }
  }

  _getFatherData(obj) {
    return this._readerSuper.getFieldData(obj, 'father')
  }

  _getMotherProps(params) {
    const { objData } = params
    return {
      mother: this._getMotherData(objData.objTreated),
      motherConfidence: objData.confidenceField.mother,
      motherIsUseful: objData.useful.motherUsability,
    }
  }

  _getMotherData(obj) {
    return this._readerSuper.getFieldData(obj, 'mother')
  }

  _getRegistryProps(params) {
    const { objData } = params
    return {
      registry: this._getRegistryData(objData.objTreated),
      registryConfidence: objData.confidenceField.registry,
      registryIsUseful: objData.useful.registryUsability,
    }
  }

  _getRegistryData(obj) {
    return this._readerSuper.getFieldData(obj, 'registry')
  }

  _getEmissionProps(params) {
    const { objData } = params
    return {
      emission: this._getEmissionData(objData.objTreated),
      emissionConfidence: objData.confidenceField.emission,
      emissionIsUseful: objData.useful.emissionUsability,
    }
  }

  _getEmissionData(obj) {
    return this._readerSuper.getFieldData(obj, 'emission')
  }
}
