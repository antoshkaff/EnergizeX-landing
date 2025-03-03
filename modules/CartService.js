import ProductInfoCollector from "./ProductInfoCollector.js"
import CartLocalStorage from "./CartLocalStorage.js"

export default class CartService {
    selectors = {
        button: '[data-js-add-to-cart]',
        product: '[data-js-product]',
        badge: '[data-js-product-amount]'
    }

    badgeStates = {
        active: 'button-cart__amount--active'
    }

    cachedElements = new Map()
    handleEvent = {
        add: 'productAdded',
        delete: 'productDeleted'
    }

    constructor() {
        this.bindEvents()
        this.initCartService()
    }

    initCartService() {
        const allProducts = document.querySelectorAll(this.selectors.product)

        allProducts.forEach((product, index) => product.dataset.jsProduct = index.toString())
        this.manageBadge()
    }

    cacheCartProduct(addToCartButton) {
        if(!this.cachedElements.has(addToCartButton)) {
            const product = addToCartButton.closest(this.selectors.product)

            this.cachedElements.set(addToCartButton, {
                product,
            })
        }
    }

    triggerProductAdded(productId) {
        document.dispatchEvent(new CustomEvent(this.handleEvent.add, {
            detail: {
                productId,
            }
        }))
    }

    manageBadge() {
        const badge = document.querySelector(this.selectors.badge)
        const isEmpty = CartLocalStorage.isEmpty()

        badge.classList.toggle(this.badgeStates.active, !isEmpty)
        badge.textContent = CartLocalStorage.getSize().toString()
    }

    addToCart(addToCartButton) {
        if(!CartLocalStorage.has(addToCartButton)) {
            this.cacheCartProduct(addToCartButton)
        }

        const product = addToCartButton.closest(this.selectors.product)
        const productId = product.dataset.jsProduct

        if(CartLocalStorage.has(productId)) {
            const product = CartLocalStorage.get(productId)
            product.amount++
            CartLocalStorage.set(productId, product)

            this.triggerProductAdded(productId)
            return
        }

        const productData = new ProductInfoCollector(product)

        const { productImage, productTitle, productPrice} = productData.getData()

        CartLocalStorage.set(productId, {
            productId,
            productImage,
            productTitle,
            productPrice,
            amount: 1
        })

        this.triggerProductAdded(productId)
        this.manageBadge()
    }

    onClick(event) {
        const { target } = event
        const addToCartButton = target.closest(this.selectors.button)

        if(addToCartButton) {
            this.cacheCartProduct(addToCartButton)
            this.addToCart(addToCartButton)
        }

    }


    bindEvents() {
        document.addEventListener(this.handleEvent.delete, () => this.manageBadge())
        document.addEventListener('click', (event) => this.onClick(event))
    }
}