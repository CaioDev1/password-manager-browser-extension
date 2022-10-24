import { IComponentDependencies } from "./main-interface"

export interface ComponentParams {
    component: new () => HTMLElement
    COMPONENT_SELECTOR: string
}

export type AppComponent = (dependencies: IComponentDependencies) => ComponentParams