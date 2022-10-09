import declareComponents from "./components-declaration"

import bootstrap from 'bootstrap'
import mainStyle from './style.main.scss'

class Manager {
    popoverOpen: boolean = false
    popoverShadow: ShadowRoot
    
    constructor() {
        this.mapAllInputFields()
    }
    
    mapAllInputFields() {
        const inputs = document.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>
    
        inputs.forEach(passwordInput => {
            passwordInput.onfocus = event => {
                event.stopPropagation()

                !this.popoverOpen && this.insertManagerMenu(passwordInput)  
            }
        })
    }
    
    insertManagerMenu(passwordInput: HTMLInputElement) {
        const popoverHost = document.createElement('div')
        popoverHost.id = 'popover-host'

        this.popoverShadow = popoverHost.attachShadow({mode: 'open'})

        bootstrap.use({target: this.popoverShadow})
        mainStyle.use({target: this.popoverShadow})

        const managerPopover = document.createElement('manager-popover')

        const inputPosition = this.getInputPosition(passwordInput)
        const inputWidth = passwordInput.offsetWidth

        managerPopover.style.position = 'absolute'
        managerPopover.style.transform = `translate3d(${inputPosition.left + (inputWidth - 30)}px, ${inputPosition.top}px, 0px)`

        this.popoverShadow.appendChild(managerPopover)

        this.popoverOpen = true

        document.onmousedown = this.removeManagerMenu.bind(this)

        document.body.appendChild(popoverHost)
    }

    getInputPosition(input: HTMLInputElement) {
        const rect = input.getBoundingClientRect()

        return {
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY
        }
      }

    removeManagerMenu(event: MouseEvent) {
        const isPopoverHostEl = (event.target as HTMLElement).id == 'popover-host'
        
        if(this.popoverOpen && !isPopoverHostEl) {
            document.body.querySelector('#popover-host')?.remove()
    
            bootstrap.unuse({target: this.popoverShadow})
            mainStyle.unuse({target: this.popoverShadow})
    
            document.removeEventListener('mousedown', this.removeManagerMenu)
    
            this.popoverOpen = false
        }
    }
}

declareComponents()

new Manager()