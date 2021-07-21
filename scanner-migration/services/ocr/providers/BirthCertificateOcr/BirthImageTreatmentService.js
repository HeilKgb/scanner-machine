const ImageTreatmentSuperService = require('../SuperServices/ImageTreatmentSuperService')

module.exports = class BirthImageTreatmentService extends ImageTreatmentSuperService {
  constructor(storageService, sharp, fs) {
    super(storageService, fs)
    this._sharp = sharp
  }

  async _sharpImage(originFilePath) {
    try {
      const treatedImage = await this._sharp(originFilePath)

      treatedImage
        .greyscale()
        .normalize()
        .trim(100)
        .rotate()
        .resize(1500, 1900)
        .extract({ left: 100, top: 270, width: 1300, height: 615 })
        .sharpen(100)
        .normalize()
        .gamma(1.1)
        .toFormat('jpeg')

      const outPutBuffer = await treatedImage.toBuffer({
        resolveWithObject: true,
      })
      return outPutBuffer.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
