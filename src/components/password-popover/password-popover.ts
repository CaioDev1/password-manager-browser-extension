import { IComponentDependencies } from '../../interfaces/main-interface'
import PasswordGeneratorService from '../../services/password-generator-service'
import managerPopoverStyle from './password-popover.component.scss'
import html from './password-popover.html'

type TabIds = 'my_passwords_tab' | 'creation_tab'

const ManagerPopover = (dependencies: IComponentDependencies) => {
    class ManagerPopoverComponent extends HTMLElement {
        currentTabId: TabIds = 'creation_tab'

        passwordParams: {length: number} = {length: 12}

        connectedCallback() {
            this.innerHTML = html

            managerPopoverStyle.use({target: this})

            this.initCurrentTab()
            this.changeTabListener()

            this.initCreationTabListeners()
        }

        disconnectedCallback() {
            managerPopoverStyle.unuse({target: this})
        }

        initCurrentTab() {
            const currentTabTemplate = dependencies.root.querySelector(this.currentTabId == 'creation_tab' ? '#creation-template' : '#teste') as HTMLTemplateElement

            if(!currentTabTemplate) throw new Error('Current template not found')

            const currentTabEl = currentTabTemplate.content.cloneNode(true) as HTMLElement

            dependencies.root.querySelector('#current-tab')?.appendChild(currentTabEl)
        }
        
        initPasswordLengthChangeHandler() {
            const rangeInput = dependencies.root.querySelector('#password-length') as HTMLInputElement
            const rangeLabel = dependencies.root.querySelector('#password-length-label') as HTMLSpanElement

            rangeLabel.textContent = this.passwordParams.length.toString()

            rangeInput.oninput = event => {
                const currentValue = (event.target as HTMLInputElement).value

                this.passwordParams.length = Number(currentValue)

                rangeLabel.textContent = currentValue
            }
        }

        initCreationTabListeners() {
            this.initPasswordLengthChangeHandler()
            this.generatePasswordListener()
        }

        changeTabListener() {
            const tabContent = dependencies.root.querySelector('#current-tab') as HTMLElement

            if(!tabContent) throw new Error('Current tab wrapper not found')

            const creationTabTemplate = dependencies.root.querySelector('#creation-template') as HTMLTemplateElement
            const passwordsListTabTemplate = dependencies.root.querySelector('#my-passwords-template') as HTMLTemplateElement

            dependencies.root.querySelectorAll<HTMLButtonElement>('.tab-button')
                .forEach(button => {
                    button.addEventListener('click', e => {                        
                        const tabId: TabIds = button.dataset.tabid as TabIds

                        tabContent.innerHTML = ''

                        if(tabId == 'creation_tab') {
                            tabContent?.appendChild(creationTabTemplate.content.cloneNode(true))

                            this.initCreationTabListeners()
                        } else {
                            const testDiv = document.createElement('div')
                            testDiv.innerHTML = 'test'

                            tabContent?.appendChild(testDiv)
                        }        

                        this.currentTabId = tabId
                    })
                })
        }

        generatePasswordListener() {
            const actionButton = dependencies.root.querySelector('#generate-password-button') as HTMLButtonElement
            const passwordResultLabel = dependencies.root.querySelector('#password-result') as HTMLLabelElement

            actionButton.onclick = event => {
                const newPassword = new PasswordGeneratorService().generatePassword({
                    length: this.passwordParams.length
                })

                passwordResultLabel.textContent = newPassword

                
            }
        }
    }


    return ManagerPopoverComponent
}

export = {
    component: ManagerPopover,
    selector: 'manager-popover'
}
