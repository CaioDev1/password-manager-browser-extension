chrome.runtime.onInstalled.addListener(event => {
    console.log('Loaded extension')
    
    //! REMOVED UNTIL REFACTOR THE EXTENSION MESSAGING LOGIC
    /* chrome.runtime.onMessage.addListener((eventData: {type: string, data: {domain: string, password: string}}, params, sendResponse) => {
        if(eventData.type == 'store-password') {
            chrome.storage.sync.get('passwords', data => {
                const storage = data as {passwords: {[domain: string]: string}}
                
                let updatePromise: Promise<void>
    
                if(!storage.passwords) {
                    updatePromise = chrome.storage.sync.set({
                        passwords: {[eventData.data.domain]: eventData.data.password}
                    })
                } else {
                    storage.passwords[eventData.data.domain] = eventData.data.password
        
                    updatePromise = chrome.storage.sync.set({passwords: storage.passwords})
                }
                
                updatePromise.then(() => {
                    sendResponse({success: true})
                })
            })
        }

        return true
    }) */
})