export default class CartLocalStorage {
    static localStorageKey = 'cart'
    static allCartItems = new Map()


    static loadFromLocalStorage() {
        this.allCartItems = new Map(JSON.parse(localStorage.getItem(this.localStorageKey)))
    }

    static updateLocalStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(Array.from(this.allCartItems.entries())))
    }

    static has(productId) {
        return this.allCartItems.has(productId)
    }

    static get(productId) {
        return this.allCartItems.get(productId)
    }

    static getMap() {
        return this.allCartItems
    }

    static getSize() {
        return this.allCartItems.size
    }

    static isEmpty() {
        return !this.allCartItems.size
    }

    static delete(productId) {
        this.allCartItems.delete(productId)
        this.updateLocalStorage()
    }

    static set(productId, productData) {
        this.allCartItems.set(productId, {...productData})
        this.updateLocalStorage()
    }
}