describe('Feature Storage', () => {
    const container = require('/home/davi/Documentos/HomeOffice/wedding-api/service/storage/config/storageDI.js')
    const storageProvider = container.get('storage.service')
    describe('Testing _asDir function', () => {
        it('Checking if the directory exists', () => {
            expect(storageProvider._hasDir('/tmp')).toBe(true)
        })
        it("Checking it the directory isn't exists", () => {
            expect(storageProvider._hasDir('/tmp/dir')).toBe(false)
        })
    })
    describe('Testing _verifyAndCreateDir function', () => {
        it('Checking if the directory exists to not create another directory', () => {
            expect(storageProvider._verifyAndCreateDir('/tmp')).toBe(true)
        })
        it("Checking if the directory doesn't exists to create another directory", () => {
            expect(storageProvider._verifyAndCreateDir('/tmp/a')).toBe(true)
        })
    })
    describe('Testing _createDir function', () => {
        it('Creating directory', () => {
            expect(storageProvider._createDir('/tmp/tests')).toBe(true)
            expect(storageProvider._createDir('/tmp/tests')).not.toBe(false)
        })
    })
    describe('Testing _validate function', () => {
        const idPath =
            'uRxC2DaFqFRiz2JXX/uploads/3apYk6nGHEKe2hSMp/LztoGhqXNBMiCveHK/F9MgSYZvX7ADw8eZm'
        it('Checking if the id path worked with the regex', () => {
            expect(storageProvider._validate(idPath)).toBe(true)
            expect(storageProvider._validate(idPath)).not.toBe(false)
        })
    })

    describe('Testing _extractFilePath function', () => {
        it('Shold return the extracting file path / Shold not return the extracting file path', () => {
            const mock = {
                idPath: `uRxC2DaFqFRiz2JXX/uploads/3apYk6nGHEKe2hSMp/LztoGhqXNBMiCveHK/F9MgSYZvX7ADw8eZm`,
            }
            const { dir, fileName } = storageProvider._extractFilePath(
                mock.idPath
            )
            expect(dir).toBe('LztoGhqXNBMiCveHK')
            expect(dir).not.toBe('F9MgSYZvX7ADw8eZm')
            expect(fileName).toBe('F9MgSYZvX7ADw8eZm')
            expect(fileName).not.toBe('uRxC2DaFqFRiz2JXX')
        })
    })

    describe('Testing getDownload function', () => {
        const container = require('../config/storageDI')
        const storageProvider = container.get('storage.service')
        it('Should save a image in the extracted path / Should not save a image in the extracted path', () => {
            const objMock = {
                idPath: `uRxC2DaFqFRBRiz2JXX/uploads/jaktESvjRimwX8gPu/9Jr52i4RAvRXm9vjG/zJfrrmjkXE9oLsa23`,
            }
            const result = storageProvider.getDownload(objMock)

            expect(result).toBe('/tmp/9Jr52i4RAvRXm9vjG/zJfrrmjkXE9oLsa23')
        })
    })
})
