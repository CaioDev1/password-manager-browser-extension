import {ManagerPopoverComponent} from './components/password-popover/password-popover'
import '@webcomponents/custom-elements'
import { IComponentDependencies } from './interfaces/main-interface'
import { AppComponent } from './interfaces/component-interface'

const COMPONENTS: AppComponent[] = [
    ManagerPopoverComponent
]

const declareComponents = (dependencies: IComponentDependencies) => {
    COMPONENTS.forEach(componentFactory => {
        const {COMPONENT_SELECTOR, component} = componentFactory(dependencies)

        window.customElements.define(COMPONENT_SELECTOR, component)
    })
}

export default declareComponents