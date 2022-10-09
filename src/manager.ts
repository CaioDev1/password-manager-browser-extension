import declareComponents from "./components-declaration"

import bootstrap from 'bootstrap'
import mainStyle from './style.main.scss'

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
        
        const managerPopover =  document.createElement('manager-popover')
        
        const popoverHost = document.createElement('div')
        popoverHost.classList.add('popover-host')

        const shadow = popoverHost.attachShadow({mode: 'open'})

        shadow.appendChild(managerPopover)

        bootstrap.use({target: shadow})
        mainStyle.use({target: shadow})

        inputWrapper.appendChild(popoverHost)
    
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