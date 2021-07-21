module.exports = class BirthManagerController {
  constructor(birthOcrManagerService) {
    this._birthOcrManagerService = birthOcrManagerService
  }

  async birthReader(idPath) {
    return await this._birthOcrManagerService.makeOcr(idPath)
  }
}
