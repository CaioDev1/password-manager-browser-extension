import declareComponents from "./components-declaration"

import bootstrap from 'bootstrap'
import mainStyle from './style.main.scss'
import { IComponentDependencies } from "./interfaces/main-interface"
import {ManagerPopoverComponent} from './components/password-popover/password-popover'

type IManagerPopoverComponent = ReturnType<typeof ManagerPopoverComponent>['component']['prototype']
class Manager {
    popoverOpen: boolean = false
    popoverShadow: ShadowRoot
    popoverHost: HTMLDivElement
    currentManagerPopover: HTMLElement

    currentPasswordInput: HTMLInputElement

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

                this.currentPasswordInput = passwordInput

                !this.popoverOpen && this.insertManagerMenu()  
            }
        })
    }
    
    insertManagerMenu() {
        bootstrap.use({target: this.popoverShadow})
        mainStyle.use({target: this.popoverShadow})

        const managerPopover = document.createElement('manager-popover') as IManagerPopoverComponent

        managerPopover.connectPasswordInput(this.currentPasswordInput)
 
        this.popoverShadow.appendChild(managerPopover);

        this.popoverOpen = true

        document.onmousedown = this.removeManagerMenu.bind(this)

        document.body.appendChild(this.popoverHost)

        this.applyPopoverPosition()

        this.windowResizeEvent = event => {
            this.applyPopoverPosition()
        }

        window.onresize = this.windowResizeEvent
    }

    applyPopoverPosition() {
        const inputPosition = this.getInputPosition()
        const inputWidth = this.currentPasswordInput.offsetWidth

        this.currentManagerPopover = this.popoverShadow.querySelector('manager-popover') as HTMLElement

        let popoverLeftPosition = inputPosition.left + (inputWidth - 30)
        let popoverRightPosition = popoverLeftPosition + this.currentManagerPopover?.offsetWidth

        const popoverXAxisOverflow = popoverRightPosition >= window.innerWidth
        const popoverXAxisPositionGap = 30

        if(popoverXAxisOverflow)
            popoverLeftPosition -= Math.abs(popoverRightPosition - window.innerWidth) + popoverXAxisPositionGap

        this.currentManagerPopover.style.transform = `translate3d(${popoverLeftPosition}px, ${inputPosition.top + this.currentPasswordInput.offsetHeight}px, 0px)`
    }

    getInputPosition() {
        const rect = this.currentPasswordInput.getBoundingClientRect()

        return {
          left: rect.left,
          top: rect.top + window.scrollY,
          right: rect.right
        }
      }

    removeManagerMenu(event: MouseEvent) {
        const isPopoverHostEl = (event.target as HTMLElement).id == 'popover-host'

        const targetIsTheCurrentPasswordInput = (event.target as HTMLElement).isEqualNode(this.currentPasswordInput)
        
        if(this.popoverOpen && !isPopoverHostEl && !targetIsTheCurrentPasswordInput) {
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

const DEPENDENCIES: IComponentDependencies = {
    root: manager.popoverShadow
}

declareComponents(DEPENDENCIES)
