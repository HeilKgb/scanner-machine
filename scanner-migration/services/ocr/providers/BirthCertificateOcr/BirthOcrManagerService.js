module.exports = class BirthOcrManagerService {
  constructor(birthReaderService) {
    this._birthReaderService = birthReaderService
  }

  async makeOcr(idPath) {
    return await this._birthReaderService.makeOcrBirthCertificate(idPath)
  }
}
