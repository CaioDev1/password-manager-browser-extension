import passwordGenerator from 'generate-password-browser'

export interface IPasswordGeneratorParams {
    length: number
}

export default class PasswordGeneratorService {
    generatePassword(params: IPasswordGeneratorParams) {
        return passwordGenerator.generate({
            length: params.length
        })
    }
}