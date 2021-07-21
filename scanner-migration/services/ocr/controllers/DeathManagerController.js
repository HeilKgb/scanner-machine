module.exports = class DeathManagerController {
  constructor(deathOcrManagerService) {
    this._deathOcrManagerService = deathOcrManagerService
  }

  async deathReader(idPath) {
    return await this._deathOcrManagerService.makeOcr(idPath)
  }
}
