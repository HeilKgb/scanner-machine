module.exports = class CnhOcrManagerService {
  constructor(cnhReaderService) {
    this._cnhReaderService = cnhReaderService
  }

  async makeOcr(idPath) {
    return await this._cnhReaderService.makeOcrCnh(idPath)
  }
}
