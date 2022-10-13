import declareComponents from "./components-declaration"

import bootstrap from 'bootstrap'
import mainStyle from './style.main.scss'

class Manager {
    popoverOpen: boolean = false
    popoverShadow: ShadowRoot
    popoverHost: HTMLDivElement
    currentManagerPopover: HTMLElement

    windowResizeEvent: (params: UIEvent) => void
    
    constructor() {
        this.initShadowDOM()
        this.mapAllInputFields()
    }

    initShadowDOM() {
        this.popoverHost = document.createElement('div')
        this.popoverHost.id = 'popover-host'

        this.popoverShadow = this.popoverHost.attachShadow({mode: 'closed'})
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
        bootstrap.use({target: this.popoverShadow})
        mainStyle.use({target: this.popoverShadow})

        const managerPopover = document.createElement('manager-popover')

        this.popoverShadow.appendChild(managerPopover)

        this.popoverOpen = true

        document.onmousedown = this.removeManagerMenu.bind(this)

        document.body.appendChild(this.popoverHost)

        this.applyPopoverPosition(passwordInput)

        this.windowResizeEvent = event => {
            this.applyPopoverPosition(passwordInput)
        }

        window.onresize = this.windowResizeEvent
    }

    applyPopoverPosition(input: HTMLInputElement) {
        const inputPosition = this.getInputPosition(input)
        const inputWidth = input.offsetWidth

        this.currentManagerPopover = this.popoverShadow.querySelector('manager-popover') as HTMLElement

        let popoverLeftPosition = inputPosition.left + (inputWidth - 30)
        let popoverRightPosition = popoverLeftPosition + this.currentManagerPopover?.offsetWidth

        const popoverXAxisOverflow = popoverRightPosition >= window.innerWidth
        const popoverXAxisPositionGap = 30

        if(popoverXAxisOverflow)
            popoverLeftPosition -= Math.abs(popoverRightPosition - window.innerWidth) + popoverXAxisPositionGap

        this.currentManagerPopover.style.transform = `translate3d(${popoverLeftPosition}px, ${inputPosition.top + input.offsetHeight}px, 0px)`
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
            this.currentManagerPopover.remove()
            this.popoverHost.remove()
    
            bootstrap.unuse({target: this.popoverShadow})
            mainStyle.unuse({target: this.popoverShadow})
    
            document.removeEventListener('mousedown', this.removeManagerMenu)

            window.removeEventListener('resize', this.windowResizeEvent)
    
            this.popoverOpen = false
        }
    }
}

const manager = new Manager()

const DEPENDENCES = {
    root: manager.popoverShadow
}

declareComponents(DEPENDENCES)
