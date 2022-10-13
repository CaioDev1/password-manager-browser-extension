import { IComponentDependencies } from '../../interfaces/main-interface'
import managerPopoverStyle from './password-popover.component.scss'
import html from './password-popover.html'

const ManagerPopover = (dependencies: IComponentDependencies) => {
    class ManagerPopoverComponent extends HTMLElement {
        connectedCallback() {
            this.innerHTML = html

            managerPopoverStyle.use({target: this})

            this.initPasswordLengthChangeHandler()
        }

        disconnectedCallback() {
            managerPopoverStyle.unuse({target: this})
        }
        
        initPasswordLengthChangeHandler() {
            const rangeInput = dependencies.root.querySelector('#password-length') as HTMLInputElement
            const rangeLabel = dependencies.root.querySelector('#password-length-label') as HTMLSpanElement

            rangeInput.oninput = event => {
                const currentValue = (event.target as HTMLInputElement).value

                rangeLabel.textContent = currentValue
            }
        }

        changeTab() {
            dependencies.root.querySelectorAll<HTMLButtonElement>('.tab-button')
                .forEach(button => {
                    button.addEventListener('click', e => {
                        const tabId = button.dataset.tabId

                        
                    })
                })
        }
    }


    return ManagerPopoverComponent
}

export = {
    component: ManagerPopover,
    selector: 'manager-popover'
}
