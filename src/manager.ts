import declareComponents from "./components-declaration"

function mapAllInputFields() {
    const inputs = document.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>

    inputs.forEach(passwordInput => {
        passwordInput.addEventListener('focus', event => {
            const managerPopover = document.createElement('manager-popover')

            passwordInput.after(managerPopover)
        })
    })
}
declareComponents()
mapAllInputFields()