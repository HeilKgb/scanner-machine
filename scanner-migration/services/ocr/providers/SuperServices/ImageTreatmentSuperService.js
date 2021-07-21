module.exports = class ImageTreatmentSuperService {
  constructor(storageService, fs) {
    ;(this._storageService = storageService), (this._fs = fs)
  }

  async getImageToRead(idPath) {
    const originFilePath = await this._getImage(idPath)
    return await this._sharpImage(originFilePath)
  }

  _sharpImage() {
    console.warn(`WARNING: Must implement method`)
  }

  async _getImage(idPath) {
    try {
      const obj = {
        idPath,
      }
      const imagePath = await this._storageService.getDownload(obj)
      return await this._fs.readFileSync(imagePath)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
