declare module '*.html' {
    const value: string
    export default value
}

declare module '*.scss' {
    const value: {[key: string]: any}
    export default value
}

declare module 'bootstrap' {
    const value: {[key: string]: any}
    export default value
}