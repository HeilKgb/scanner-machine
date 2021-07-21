module.exports = class CnhManagerController {
  constructor(cnhOcrManagerService) {
    this._cnhOcrManagerService = cnhOcrManagerService
  }

  async cnhReader(idPath) {
    return await this._cnhOcrManagerService.makeOcr(idPath)
  }
}
