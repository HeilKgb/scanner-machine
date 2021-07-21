class StorageProvider {
  constructor(storage, fs, debug) {
    this._storage = storage
    this._fs = fs
    this._debug = debug
  }

  async getDownload(objParams) {
    const myBucket = this._storage.bucket(process.env.GOOGLE_BUCKET_NAME)
    const file = myBucket.file(objParams.idPath)
    this._validate(objParams.idPath)
    const { dir, fileName } = this._extractFilePath(objParams.idPath)
    this._verifyAndCreateDir(`${process.env.FILE_DOWNLOAD_DIR}/${dir}`)
    const opts = {
      destination: `${process.env.FILE_DOWNLOAD_DIR}/${dir}/${fileName}`,
    }

    const fileAtts = {
      file,
      opts,
    }
    const path = fileAtts.opts.destination
    await this._requireCloud(fileAtts)
    return path
  }

  async _requireCloud(fileAtts) {
    try {
      return await fileAtts.file.download(fileAtts.opts)
    } catch (error) {
      console.log(`ERROR: Could not get the file`)
      throw error
    }
  }

  _regex() {
    return /\w*\/\w*\/\w*\/(\w*)\/(\w*)/gi
  }

  _validate(idPath) {
    const regex = this._regex()
    if (!regex.test(idPath)) throw Error(`ERROR: idPath is invalid`)
    return !regex.test(idPath)
  }

  _extractFilePath(idPath) {
    const regex = this._regex()
    const regexExec = regex.exec(idPath)
    const dir = regexExec[1]
    const fileName = regexExec[2]
    return {
      dir,
      fileName,
    }
  }

  _hasDir(dir) {
    if (this._fs.existsSync(dir)) {
      return true
    }

    return false
  }

  _verifyAndCreateDir(dir) {
    if (this._hasDir(dir)) {
      return true
    }

    this._createDir(dir)
    return true
  }

  _createDir(dir) {
    this._fs.mkdir(dir, { recursive: true }, err => {
      if (err) throw err
    })

    return true
  }
}

module.exports = StorageProvider
