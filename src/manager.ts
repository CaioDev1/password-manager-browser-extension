import declareComponents from "./components-declaration"

import 'bootstrap'

function mapAllInputFields() {
    const inputs = document.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>

    inputs.forEach(passwordInput => {
        passwordInput.addEventListener('focus', event => {
            passwordInput.style.position = 'relative'
            
            const managerPopover = document.createElement('manager-popover')

            passwordInput.after(managerPopover)
        })
    })
}
declareComponents()
mapAllInputFields()