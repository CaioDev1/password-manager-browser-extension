import dayjs from 'dayjs'

export default class PasswordStorageService {
    static storePassword(newPassword: string) {
        //! REMOVED UNTIL REFACTOR THE EXTENSION MESSAGING LOGIC
        return new Promise<void>((resolve, reject) => {
            /* chrome.runtime.sendMessage({
                type: 'store-password',
                data: {
                    domain: window.location.host,
                    password: newPassword,
                    timestamp: dayjs().toDate()
                }
            }, (response: {success: boolean}) => {
                if(chrome.runtime.lastError) reject(chrome.runtime.lastError)
                else resolve()
            }) */

            chrome.storage.sync.get('passwords', data => {
                const storage = data as {passwords: {[domain: string]: string}}
                
                let updatePromise: Promise<void>
    
                if(!storage.passwords) {
                    updatePromise = chrome.storage.sync.set({
                        passwords: {[window.location.host]: newPassword}
                    })
                } else {
                    storage.passwords[window.location.host] = newPassword
        
                    updatePromise = chrome.storage.sync.set({passwords: storage.passwords})
                }
                
                updatePromise.then(() => {
                    resolve()
                }).catch(err => reject(err))
            })
        })
    }

    static getLogins() {
        return chrome.storage.sync.get() as Promise<{passwords: {[domain: string]: string}}>
    }
}