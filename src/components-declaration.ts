import ManagerPopoverComponent from './components/password-popover/password-popover'
import '@webcomponents/custom-elements'

const COMPONENTS = [
    ManagerPopoverComponent
]

const declareComponents = () => {
    console.log('asdf')
    console.log(window.customElements )


    COMPONENTS.forEach(component => {
        window.customElements.define(component.selector, component.component())
    })
}

export default declareComponents