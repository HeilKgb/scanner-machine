module.exports = class ReaderSuperService {
  constructor(tesseractWorker) {
    this._tesseractWorker = tesseractWorker
  }

  getExtractArea() {
    return (...args) => {
      const extractArea = []
      for (let index = 0; index < args.length; index++) {
        if (!args[index]) {
          extractArea.push(undefined)
          continue
        }
        const objPosition = {
          left: args[index].left,
          top: args[index].top,
          width: args[index].width,
          height: args[index].height,
        }
        extractArea.push(objPosition)
      }
      return extractArea
    }
  }

  async _extractData(params) {
    const { extractArea, filePath } = params
    const readingValues = []
    for (let index = 0; index < extractArea.length; index++) {
      if (!extractArea[index]) {
        readingValues.push(undefined, undefined)
        continue
      }
      const recognize = this._tesseractWorker._worker.recognize
      const rectangleAddr = { rectangle: extractArea[index] }
      const { data } = await recognize(filePath, rectangleAddr)
      const { paragraphs } = data
      readingValues.push(paragraphs[0].text, paragraphs[0].confidence)
    }
    return readingValues
  }

  _catchField(words, index, string) {
    return words[index].text == [string]
  }

  getDimensionOfFields(params) {
    const { dimensions } = params
    return {
      left: dimensions.fitLeftField,
      top: dimensions.fitTopField,
      width: dimensions.fitWidthField,
      height: dimensions.fitHeightField,
    }
  }

  getFieldData(object, prop) {
    return (() =>
      object[prop] === undefined
        ? (object[prop] = 'Field Empty')
        : object[prop])()
  }
}
