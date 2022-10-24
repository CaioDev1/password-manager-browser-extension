import { IComponentDependencies } from '../../interfaces/main-interface'
import PasswordGeneratorService from '../../services/password-generator-service'
import managerPopoverStyle from './password-popover.component.scss'
import html from './password-popover.html'

type TabIds = 'my_passwords_tab' | 'creation_tab'

export const ManagerPopoverComponent = (dependencies: IComponentDependencies) => {
    class ManagerPopover extends HTMLElement {
        currentTabId: TabIds = 'creation_tab'

        passwordParams: {length: number} = {length: 12}

        passwordInput: HTMLInputElement

        currentPassword: string

        connectedCallback() {
            this.innerHTML = html

            managerPopoverStyle.use({target: this})

            
            this.initCurrentTab()
            this.changeTabListener()
            
            this.disableGeneratePasswordButton(true)

            this.initCreationTabListeners()

            this.generatePassword()
            this.applyPasswordListener()
        }

        disconnectedCallback() {
            managerPopoverStyle.unuse({target: this})
        }

        connectPasswordInput(input: HTMLInputElement) {
            this.passwordInput = input
            
            this.disableGeneratePasswordButton(false)
        }

        disableGeneratePasswordButton(disabled: boolean) {
            console.log(dependencies.root)
            const generatePasswordButton = this.querySelector('#creation-container') as HTMLButtonElement
            console.log(generatePasswordButton)
            generatePasswordButton.disabled = disabled
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
            const reloadButton = dependencies.root.querySelector('.reload-password-button') as HTMLButtonElement

            reloadButton.onclick = event => {
                this.generatePassword()
            }
        }

        generatePassword() {
            const passwordResultLabel = dependencies.root.querySelector('#password-result') as HTMLLabelElement

            const newPassword = new PasswordGeneratorService().generatePassword({
                length: this.passwordParams.length
            })

            this.currentPassword = newPassword
            passwordResultLabel.textContent = newPassword
        }

        applyPasswordListener() {
            const generatePasswordButton = dependencies.root.querySelector('#generate-password-button') as HTMLButtonElement

            generatePasswordButton.onclick = event => {
                console.log(this.passwordInput)
                if(this.passwordInput) {
                    this.passwordInput.value = this.currentPassword
                }
            }
        }
    }

    return {
        component: ManagerPopover,
        COMPONENT_SELECTOR: 'manager-popover'
    }
}