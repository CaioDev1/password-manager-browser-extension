import passwordGenerator from 'generate-password-browser'

export interface IPasswordGeneratorParams {
    length: number,
    easyRead: boolean
    easySpeak: boolean
    uppercase: boolean
    lowercase: boolean
    numbers: boolean
    symbols: boolean
}
export default class PasswordGeneratorService {
    generatePassword(params: IPasswordGeneratorParams) {
        return passwordGenerator.generate({
            length: params.length,
            numbers: params.numbers,
            symbols: params.symbols,
            lowercase: params.lowercase,
            uppercase: params.uppercase
        })
    }
}