"use strict";

class StorageController {
  constructor(service, yup, validate, debug) {
    this._service = service;
    this._yup = yup;
    this._validate = validate;
    this._debug = debug;
  }

  async getDownload(req, res) {
    let schema = this._yup.object().shape({
      idPath: this._yup.string().min(1).required(),
    });

    let resultSchema = await this._validate(schema, req.body);

    if (!resultSchema.isValid) {
      return res.json(resultSchema.data);
    }

    return res.json(await this._service.getDownload(resultSchema.data));
  }
}

module.exports = StorageController;
