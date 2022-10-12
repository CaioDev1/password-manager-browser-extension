import declareComponents from "./components-declaration"

import bootstrap from 'bootstrap'
import mainStyle from './style.main.scss'

class Manager {
    popoverOpen: boolean = false
    popoverShadow: ShadowRoot

    windowResizeEvent: (params: UIEvent) => void
    
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

        this.popoverShadow.appendChild(managerPopover)

        this.popoverOpen = true

        document.onmousedown = this.removeManagerMenu.bind(this)

        document.body.appendChild(popoverHost)

        this.applyPopoverPosition(passwordInput)

        this.windowResizeEvent = event => {
            this.applyPopoverPosition(passwordInput)
        }

        window.onresize = this.windowResizeEvent
    }

    applyPopoverPosition(input: HTMLInputElement) {
        const inputPosition = this.getInputPosition(input)
        const inputWidth = input.offsetWidth

        const currentManagerPopoverEl = this.popoverShadow.querySelector('manager-popover') as HTMLElement

        let popoverLeftPosition = inputPosition.left + (inputWidth - 30)
        let popoverRightPosition = popoverLeftPosition + currentManagerPopoverEl?.offsetWidth

        const popoverXAxisOverflow = popoverRightPosition >= window.innerWidth
        const popoverXAxisPositionGap = 30

        if(popoverXAxisOverflow)
            popoverLeftPosition -= Math.abs(popoverRightPosition - window.innerWidth) + popoverXAxisPositionGap

        currentManagerPopoverEl.style.transform = `translate3d(${popoverLeftPosition}px, ${inputPosition.top + input.offsetHeight}px, 0px)`
    }

    getInputPosition(input: HTMLInputElement) {
        const rect = input.getBoundingClientRect()

        return {
          left: rect.left,
          top: rect.top + window.scrollY,
          right: rect.right
        }
      }

    removeManagerMenu(event: MouseEvent) {
        const isPopoverHostEl = (event.target as HTMLElement).id == 'popover-host'
        
        if(this.popoverOpen && !isPopoverHostEl) {
            document.body.querySelector('#popover-host')?.remove()
    
            bootstrap.unuse({target: this.popoverShadow})
            mainStyle.unuse({target: this.popoverShadow})
    
            document.removeEventListener('mousedown', this.removeManagerMenu)

            window.removeEventListener('resize', this.windowResizeEvent)
    
            this.popoverOpen = false
        }
    }
}

declareComponents()

new Manager()