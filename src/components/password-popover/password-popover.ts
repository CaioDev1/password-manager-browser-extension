import { IComponentDependencies } from '../../interfaces/main-interface'
import PasswordGeneratorService, { IPasswordGeneratorParams } from '../../services/password-generator-service'
import managerPopoverStyle from './password-popover.component.scss'
import html from './password-popover.html'

type TabIds = 'my_passwords_tab' | 'creation_tab'

//! TO FIX
//? On tab changes, the creation tab removes all listeners and label values
    //* Implement a template render to pass all component value on tab show?

export const ManagerPopoverComponent = ({root}: IComponentDependencies) => {
    class ManagerPopover extends HTMLElement {
        private currentTabId: TabIds = 'creation_tab'

        private passwordParams: IPasswordGeneratorParams = {
            length: 12,
            easyRead: false,
            easySpeak: false,
            uppercase: true,
            lowercase: true,
            numbers: false,
            symbols: false,
        }

        passwordInput: HTMLInputElement

        private currentPassword: string

        private componentConnectedEvent: Event = new Event('componentConnected')

        connectedCallback() {
            this.innerHTML = html

            managerPopoverStyle.use({target: this})

            this.initCurrentTab()
            this.changeTabListener()
            
            this.disableGeneratePasswordButton(true)

            this.initCreationTabListeners()

            this.generatePassword()
            this.applyPasswordListener()
            this.initPasswordConfigOptionListeners()

            this.dispatchEvent(this.componentConnectedEvent)
        }

        connectPasswordInput(input: HTMLInputElement) {
            this.passwordInput = input

            this.addEventListener('componentConnected', () => {
                if(this.passwordInput instanceof HTMLInputElement) {
                    this.disableGeneratePasswordButton(false)
                }
            })
        }

        disconnectedCallback() {
            managerPopoverStyle.unuse({target: this})
        }

        private get creationTab() {return (this.querySelector('#creation-template') as HTMLTemplateElement).content}
        private get myPasswordsTab() {return (this.querySelector('#my-passwords-template') as HTMLTemplateElement).content}
       
        private get generatePasswordButton() {return this.querySelector('#generate-password-button') as HTMLButtonElement}

        private get easyReadOption() {return this.querySelector('#easy-read-option') as HTMLInputElement}
        private get easySpeakOption() {return this.querySelector('#easy-speak-option') as HTMLInputElement}
        private get uppercaseOption() {return this.querySelector('#uppercase-option') as HTMLInputElement} 
        private get lowercaseOption() {return this.querySelector('#lowercase-option') as HTMLInputElement} 
        private get numbersOption() {return this.querySelector('#numbers-option') as HTMLInputElement} 
        private get symbolsOption() {return this.querySelector('#symbols-option') as HTMLInputElement} 

        private disableGeneratePasswordButton(disabled: boolean) {  
            this.generatePasswordButton.disabled = disabled
        }

        private initCurrentTab() {
            const currentTabTemplate = this.currentTabId == 'creation_tab' 
                ? this.creationTab 
                : this.myPasswordsTab

            if(!currentTabTemplate) throw new Error('Current template not found')

            const currentTabEl = currentTabTemplate.cloneNode(true) as HTMLElement

            this.querySelector('#current-tab')?.appendChild(currentTabEl)
        }
        
        private initPasswordLengthChangeHandler() {
            const rangeInput = this.querySelector('#password-length') as HTMLInputElement
            const rangeLabel = this.querySelector('#password-length-label') as HTMLSpanElement

            rangeLabel.textContent = this.passwordParams.length.toString()

            rangeInput.oninput = event => {
                const currentValue = (event.target as HTMLInputElement).value

                this.passwordParams.length = Number(currentValue)

                rangeLabel.textContent = currentValue
            }
        }

        private initCreationTabListeners() {
            this.initPasswordLengthChangeHandler()
            this.generatePasswordListener()
        }

        private initPasswordConfigOptionListeners() {
            type checkboxOptions = 'easyRead' | 'easySpeak' | 'uppercase' | 'lowercase' | 'numbers' | 'symbols'

            const options: {paramName: checkboxOptions, optionEl: HTMLInputElement}[] = [
                {paramName: 'easyRead', optionEl: this.easyReadOption},
                {paramName: 'easySpeak', optionEl: this.easySpeakOption},
                {paramName: 'uppercase', optionEl: this.uppercaseOption},
                {paramName: 'lowercase', optionEl: this.lowercaseOption},
                {paramName: 'numbers', optionEl: this.numbersOption},
                {paramName: 'symbols', optionEl: this.symbolsOption},
            ]

            options.forEach(option => {
                option.optionEl.addEventListener('change', e => {
                    const changedOption = e.currentTarget as HTMLInputElement

                    this.passwordParams[option.paramName] = changedOption.checked
                })
            })
        }

        private changeTabListener() {
            const tabContent = this.querySelector('#current-tab') as HTMLElement

            if(!tabContent) throw new Error('Current tab wrapper not found')

            this.querySelectorAll<HTMLButtonElement>('.tab-button')
                .forEach(button => {
                    button.addEventListener('click', e => {                        
                        const tabId: TabIds = button.dataset.tabid as TabIds

                        tabContent.innerHTML = ''

                        if(tabId == 'creation_tab') {
                            tabContent?.appendChild(this.creationTab.cloneNode(true))

                            this.initCreationTabListeners()
                        } else {
                            tabContent?.appendChild(this.myPasswordsTab.cloneNode(true))
                        }        

                        this.currentTabId = tabId
                    })
                })
        }

        private generatePasswordListener() {
            const reloadButton = this.querySelector('.reload-password-button') as HTMLButtonElement

            reloadButton.onclick = event => {
                this.generatePassword()
            }
        }

        private generatePassword() {
            const passwordResultLabel = this.querySelector('#password-result') as HTMLLabelElement

            const newPassword = new PasswordGeneratorService().generatePassword(this.passwordParams)

            this.currentPassword = newPassword
            passwordResultLabel.textContent = newPassword
        }

        private applyPasswordListener() {
            this.generatePasswordButton.onclick = event => {
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