import managerPopoverStyle from './password-popover.component.scss'
import html from './password-popover.html'

const ManagerPopover = () => {
    class ManagerPopoverComponent extends HTMLElement {
        connectedCallback() {
            this.innerHTML = html

            managerPopoverStyle.use({target: this})
        }
    }

    return ManagerPopoverComponent
}

export = {
    component: ManagerPopover,
    selector: 'manager-popover'
}
