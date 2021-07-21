module.exports = class DeathOcrManagerService {
  constructor(deathReaderService) {
    this._deathReaderService = deathReaderService
  }

  async makeOcr(idPath) {
    return await this._deathReaderService.makeOcrDeathCertificate(idPath)
  }
}
