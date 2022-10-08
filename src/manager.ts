import declareComponents from "./components-declaration"

import 'bootstrap'

class Manager {
    constructor() {
        this.mapAllInputFields()
    }
    
    mapAllInputFields() {
        const inputs = document.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>
    
        inputs.forEach(passwordInput => {
            passwordInput.onfocus = event => {
                this.insertManagerMenu(passwordInput)  
            }
        })
    }
    
    insertManagerMenu(oldPasswordInput: HTMLInputElement) {
        const currentInputCloneEl = oldPasswordInput.cloneNode(true)
    
        const inputWrapper = document.createElement('div')
        inputWrapper.setAttribute('inputPopover', '')
        
        inputWrapper.style.position = 'relative'
        inputWrapper.style.width = 'fit-content'
    
        inputWrapper.appendChild(currentInputCloneEl)
        
        const managerPopover = document.createElement('manager-popover')
    
        inputWrapper.appendChild(managerPopover)
    
        oldPasswordInput.after(inputWrapper)
    
        oldPasswordInput.remove()

        currentInputCloneEl.addEventListener('focusout', event => {
            this.removeManagerMenu(currentInputCloneEl)
        }, {once: true})
    }

    removeManagerMenu(passwordInput: HTMLInputElement | Node) {
        passwordInput.parentElement?.querySelector('manager-popover')?.remove()
    }
}

declareComponents()

new Manager()