module.exports = class MarriageManagerController {
  constructor(marriageOcrManagerService) {
    this._marriageOcrManagerService = marriageOcrManagerService
  }

  async marriageReader(idPath) {
    return await this._marriageOcrManagerService.makeOcr(idPath)
  }
}
