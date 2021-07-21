module.exports = class WorkerLoader{
    constructor(worker){
        this._worker = worker
    }

    async loadingWorker() {
        await this._worker.load()
        await this._worker.loadLanguage('por+eng')
        await this._worker.initialize('por+eng')
        await this._worker.setParameters({
            tessedit_char_whitelist:
                'AÁÂÃaáâBbCcÇDdEeFfGgHhIiiÍjJkKlLmMnNoOÓpPqQrRsSttTuUúuÚvVxXzYyWwZz0123456789/ ',
            tessjs_create_tsv: '0',
            tessjs_create_hocr: '0',
        })
    }


}