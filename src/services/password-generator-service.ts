import passwordGenerator from 'generate-password-browser'
const niceware = require('niceware/browser/niceware.js')

export interface IPasswordGeneratorParams {
    length: {value: number, disabled: boolean},
    easyRead: {value: boolean, disabled: boolean}
    uppercase: {value: boolean, disabled: boolean}
    lowercase: {value: boolean, disabled: boolean}
    numbers: {value: boolean, disabled: boolean}
    symbols: {value: boolean, disabled: boolean}
}

export default class PasswordGeneratorService {
    generatePassword(params: IPasswordGeneratorParams) {
        return passwordGenerator.generate({
            length: params.length.value,
            numbers: params.numbers.value,
            symbols: params.symbols.value,
            lowercase: params.lowercase.value,
            uppercase: params.uppercase.value
        })
    }

    generateReadableSayablePassword({easyRead, length}: Partial<IPasswordGeneratorParams>) {
        if(length) {
            return (window as any).niceware.generatePassphrase(length.value % 2 == 0 ? length.value : length.value + 1)
                .join('_')
        }

        throw new Error('length param must be specified to generate readable password.')
    }
}