import ManagerPopoverComponent from './components/password-popover/password-popover'
import '@webcomponents/custom-elements'
import { IComponentDependencies } from './interfaces/main-interface'

const COMPONENTS = [
    ManagerPopoverComponent
]

const declareComponents = (dependencies: IComponentDependencies) => {
    COMPONENTS.forEach(component => {
        window.customElements.define(component.selector, component.component(dependencies))
    })
}

export default declareComponents