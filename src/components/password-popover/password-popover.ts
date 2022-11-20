import { IComponentDependencies } from '../../interfaces/main-interface'
import PasswordGeneratorService, { IPasswordGeneratorParams } from '../../services/password-generator-service'
import PasswordStorageService from '../../services/password-storage-service'
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
            length: {value: 12, disabled: false},
            easyRead: {value: false, disabled: false},
            uppercase: {value: true, disabled: false},
            lowercase: {value: true, disabled: false},
            numbers: {value: false, disabled: false},
            symbols: {value: false, disabled: false},
        }

        passwordInput: HTMLInputElement

        private currentPassword: string

        private componentConnectedEvent: Event = new Event('componentConnected')

        private get creationTab() {return (this.querySelector('#creation-template') as HTMLTemplateElement).content}
        private get myPasswordsTab() {return (this.querySelector('#my-passwords-template') as HTMLTemplateElement).content}
       
        private get generatePasswordButton() {return this.querySelector('#generate-password-button') as HTMLButtonElement}

        private get passwordResultLabel() {return this.querySelector('#password-result') as HTMLLabelElement}
        private get easyReadOption() {return this.querySelector('#easy-read-option') as HTMLInputElement}
        private get uppercaseOption() {return this.querySelector('#uppercase-option') as HTMLInputElement} 
        private get lowercaseOption() {return this.querySelector('#lowercase-option') as HTMLInputElement} 
        private get numbersOption() {return this.querySelector('#numbers-option') as HTMLInputElement} 
        private get symbolsOption() {return this.querySelector('#symbols-option') as HTMLInputElement}
        private get passwordRange() {return this.querySelector('#password-length') as HTMLInputElement}
        private get passwordRangeLabel() {return this.querySelector('#password-length-label') as HTMLInputElement}

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

            this.refreshCreationForm()
            
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
            this.passwordRangeLabel.textContent = this.passwordParams.length.value.toString()

            this.passwordRange.oninput = event => {
                const currentValue = (event.target as HTMLInputElement).value

                this.passwordParams.length.value = Number(currentValue)

                this.passwordRangeLabel.textContent = currentValue
            }
        }

        private initCreationTabListeners() {
            this.initPasswordLengthChangeHandler()
            this.generatePasswordListener()
            this.initPasswordConfigOptionListeners()
            this.applyPasswordListener()
        }

        private initPasswordConfigOptionListeners() {
            type checkboxOptions = keyof IPasswordGeneratorParams

            const options: {paramName: checkboxOptions, optionEl: HTMLInputElement}[] = [
                {paramName: 'easyRead', optionEl: this.easyReadOption},
                {paramName: 'uppercase', optionEl: this.uppercaseOption},
                {paramName: 'lowercase', optionEl: this.lowercaseOption},
                {paramName: 'numbers', optionEl: this.numbersOption},
                {paramName: 'symbols', optionEl: this.symbolsOption},
            ]

            options.forEach(option => {
                option.optionEl.addEventListener('change', e => {
                    const changedOption = e.currentTarget as HTMLInputElement

                    let disableFields = false

                    switch(option.paramName) {
                        case 'length': this.passwordParams[option.paramName].value = Number(changedOption.value); break
                        case 'easyRead': {
                            disableFields = changedOption.checked

                            this.applyReadablePasswordRange({apply: true})                            
                        }
                        default: this.passwordParams[option.paramName].value = changedOption.checked
                    }

                    Object.keys(this.passwordParams).forEach(k => {
                        const key = k as keyof typeof this.passwordParams

                        if(key != 'easyRead' && key != 'length') {
                            this.passwordParams[key].disabled = disableFields
                        }
                    })

                    if(!this.passwordParams.easyRead.value)
                        this.applyReadablePasswordRange({apply: false})

                    this.refreshCreationForm()
                })
            })
        }

        private applyReadablePasswordRange(params: {apply: boolean}) {
            const attributes = {
                maxRange: params.apply ? 10 : 50,
                currentLength: params.apply ? 5 : this.passwordParams.length.value
            }

            this.passwordRange.setAttribute('max', attributes.maxRange.toString())

            this.passwordParams.length.value = attributes.currentLength
            this.passwordRange.value = this.passwordParams.length.value.toString()

            this.passwordRangeLabel.textContent = this.passwordParams.length.value.toString()
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

                            this.refreshCreationForm()
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
                if(this.passwordParams.easyRead.value) {
                    this.generateReadableSayablePassword()
                } else {
                    this.generatePassword()
                }
            }
        }

        private generatePassword() {
            const newPassword = new PasswordGeneratorService().generatePassword(this.passwordParams)

            this.currentPassword = newPassword
            this.passwordResultLabel.textContent = newPassword
        }

        private generateReadableSayablePassword() {
            const newPassword = new PasswordGeneratorService().generateReadableSayablePassword(this.passwordParams)

            this.currentPassword = newPassword
            this.passwordResultLabel.textContent = newPassword
        }

        private applyPasswordListener() {
            this.generatePasswordButton.onclick = async event => {
                if(this.passwordInput) {
                    this.passwordInput.value = this.currentPassword

                    await PasswordStorageService.storePassword(this.currentPassword)
                }
            }
        }

        private refreshCreationForm() {
            this.passwordResultLabel.textContent = this.currentPassword

            Object.entries(this.passwordParams).forEach(([k, v]) => {
                const currentInputField = (
                    () => {
                        switch(k as keyof typeof this.passwordParams) {
                            case 'easyRead': return this.easyReadOption
                            case 'length': return this.passwordRange
                            case 'lowercase': return this.lowercaseOption
                            case 'numbers': return this.numbersOption
                            case 'symbols': return this.symbolsOption
                            case 'uppercase': return this.uppercaseOption
                        }
                    }
                )()

                const param: IPasswordGeneratorParams[keyof IPasswordGeneratorParams] = v

                currentInputField.checked = param.value as boolean
                currentInputField.value = param.value.toString()
                currentInputField.disabled = param.disabled

            })
        }
    }

    return {
        component: ManagerPopover,
        COMPONENT_SELECTOR: 'manager-popover'
    }
}