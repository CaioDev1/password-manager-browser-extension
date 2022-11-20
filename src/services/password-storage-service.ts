export default class PasswordStorageService {
    static storePassword(newPassword: string) {
        console.dir(chrome)
        return new Promise<void>((resolve, reject) => {
            chrome.runtime.sendMessage({
                domain: window.location.host,
                password: newPassword
            }, response => {
                console.log(response)

                resolve()
            })
        })
    }
}