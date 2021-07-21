module.exports = class MarriageOcrManagerService {
  constructor(marriageReaderService) {
    this._marriageReaderService = marriageReaderService
  }

  async makeOcr(idPath) {
    return await this._marriageReaderService.makeOcrReaderCertificate(idPath)
  }
}
