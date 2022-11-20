chrome.runtime.onInstalled.addListener(event => {
    console.log('Loaded extension')
    
    chrome.runtime.onMessage.addListener((passwordItem: {domain: string, password: string}, params, sendResponse) => {
        chrome.storage.sync.get('passwords', data => {
            const passwords = data as {passwords: {[domain: string]: string}}
            
            let updatePromise: Promise<void>

            if(!passwords.passwords) {
                updatePromise = chrome.storage.sync.set({
                    passwords: [passwordItem]
                })
            } else {
                passwords.passwords[passwordItem.domain] = passwordItem.password
    
                updatePromise = chrome.storage.sync.set({passwords})
            }
            
            updatePromise.then(() => {
                sendResponse({success: true})
            })
        })

        return true
    })
})