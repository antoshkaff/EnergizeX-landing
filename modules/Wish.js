export default class Wish {
    selectors = {
        wishButton: '[data-js-wish-button]',
        product: '[data-js-product]'
    }

    buttonStates = {
        active: 'badge--wish-active',
    }

    allWishItems = new Set()
    cachedElements = new Map()

    localStorageKey = 'wishList'

    constructor() {
        this.bindEvents()
        this.initWishList()
    }

    updateLocalStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(Array.from(this.allWishItems)))
    }

    initWishList() {
        const allButtons = document.querySelectorAll(this.selectors.wishButton)

        allButtons.forEach((button, index) => button.dataset.jsWishButton = index.toString())

        const storageWishListString = localStorage.getItem(this.localStorageKey)
        if(storageWishListString) {
            const storageWishList = JSON.parse(storageWishListString)
            const storedButtons = Array.from(allButtons).filter(button => storageWishList.includes(button.dataset.jsWishButton))
            storageWishList.forEach(buttonId => this.allWishItems.add(buttonId))

            storedButtons.forEach(button => this.manageButtonState(button))
        }
    }

    cacheWish(wishButton) {
        if(!this.cachedElements.has(wishButton)) {
            const product = wishButton.closest(this.selectors.product)

            this.cachedElements.set(wishButton, {
                product,
            })
        }
    }

    manageButtonState(wishButton) {
        const isActive = wishButton.classList.toggle(this.buttonStates.active)
        wishButton.setAttribute('aria-pressed', isActive.toString())
    }

    manageWishList(wishButton) {
        if(!this.cachedElements.has(wishButton)) {
            this.cacheWish(wishButton)
        }

        const buttonId = wishButton.dataset.jsWishButton

        this.manageButtonState(wishButton)

        if(this.allWishItems.has(buttonId)) {
            this.allWishItems.delete(buttonId)
            this.updateLocalStorage()
            return
        }
        this.allWishItems.add(buttonId)
        this.updateLocalStorage()
    }

    onClick(event) {
        const { target } = event
        const wishButton = target.closest(this.selectors.wishButton)

        if(wishButton) {
            this.cacheWish(wishButton)
            this.manageWishList(wishButton)
        }

    }

    bindEvents() {
        document.addEventListener('click', (event) => this.onClick(event))
    }
}