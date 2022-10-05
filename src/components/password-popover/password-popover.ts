import style from './password-popover.scss'
import teste from './teste.scss'
import html from './password-popover.html'

const ManagerPopover = () => {
    class ManagerPopoverComponent extends HTMLElement {
        connectedCallback() {
            console.log(style)
            // this.style.cssText = style
            this.innerHTML = html
        }
    }

    return ManagerPopoverComponent
}

export = {
    component: ManagerPopover,
    selector: 'manager-popover'
}
