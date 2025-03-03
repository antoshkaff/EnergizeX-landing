import CartLocalStorage from "./CartLocalStorage.js"

export default class Cart {
    selectors = {
        cart: '[data-js-cart]',
        totalItemsCount: '[data-js-cart-total-items-count]',
        removeButton: '[data-js-cart-remove]',
        decreaseButton: '[data-js-cart-decrease]',
        increaseButton: '[data-js-cart-increase]',
        productListElement: '[data-js-cart-product-list]',
        product: `[data-js-cart-product]`,
        productAmountElement: '[data-js-cart-product-amount]',
        productPriceElement: '[data-js-cart-product-price]',
        totalPriceElement: '[data-js-cart-total-price]',
        totalPriceElementValue: '[data-js-cart-total-price-value]',
        emptyElement: '[data-js-modal-empty]'
    }

    cartStates = {
        emptyActive: 'cart__empty--active',
        totalPriceDisable: 'cart__total-price--disable',
        productDeleted: 'product--deleted'
    }

    handleEvent = {
        add: 'productAdded',
        delete: 'productDeleted'
    }

    cachedElements = new Map()
    cartModal = null

    constructor() {
        this.cacheCart()
        this.initCart()
        this.bindEvents()
    }

    initCart() {
        if(!CartLocalStorage.isEmpty()) {
            for(const [productId, product] of CartLocalStorage.getMap()) {
                this.addToCart(product)
            }
        }
        this.isCartEmpty()
    }

    cacheCart() {
        this.cartModal = document.querySelector(this.selectors.cart)

        if(!this.cachedElements.has(this.cartModal)) {
            const totalItemsCount = this.cartModal.querySelector(this.selectors.totalItemsCount)

            const removeButton = this.cartModal.querySelector(this.selectors.removeButton)
            const decreaseButton = this.cartModal.querySelector(this.selectors.decreaseButton)
            const increaseButton = this.cartModal.querySelector(this.selectors.increaseButton)

            const productListElement = this.cartModal.querySelector(this.selectors.productListElement)
            const productAmountElement = this.cartModal.querySelector(this.selectors.productAmountElement)
            const productPriceElement = this.cartModal.querySelector(this.selectors.productPriceElement)

            const totalPriceElement = this.cartModal.querySelector(this.selectors.totalPriceElement)
            const totalPriceElementValue = this.cartModal.querySelector(this.selectors.totalPriceElementValue)

            const emptyElement = this.cartModal.querySelector(this.selectors.emptyElement)

            this.cachedElements.set(this.cartModal, {
                totalItemsCount,
                removeButton,
                decreaseButton,
                increaseButton,
                productListElement,
                productAmountElement,
                productPriceElement,
                totalPriceElement,
                totalPriceElementValue,
                emptyElement
            })
        }
    }

    getCartElements(elementForSearch) {
        for (const [cartModal, cartElements] of this.cachedElements) {
            if (Object.values(cartElements).includes(elementForSearch) ||
                cartModal === elementForSearch) {
                return cartElements
            }
        }
        return null
    }

    isCartEmpty() {
        const { emptyElement, totalPriceElement } = this.getCartElements(this.cartModal)
        const isEmpty = CartLocalStorage.isEmpty()

        emptyElement.classList.toggle(this.cartStates.emptyActive, isEmpty)
        totalPriceElement.classList.toggle(this.cartStates.totalPriceDisable, isEmpty)
    }

    cartTotalItems() {
        const { totalItemsCount } = this.getCartElements(this.cartModal)
        const count = CartLocalStorage.getSize()
        totalItemsCount.textContent = count === 1
            ? `1 Item`
            : `${count} Items`
    }

    cartTotalPrice() {
        const totalPrice = [...CartLocalStorage.getMap().values()]
            .reduce((sum, { productPrice, amount }) => sum + productPrice * amount, 0)

        this.getCartElements(this.cartModal).totalPriceElementValue.textContent = totalPrice.toFixed(2)
    }

    increaseProduct(product) {
        const amountElement = product.querySelector('[data-js-cart-product-amount]')
        const priceElement = product.querySelector('[data-js-cart-product-price]')

        const productData = CartLocalStorage.get(product.dataset.jsCartProduct)
        productData.amount++
        CartLocalStorage.set(productData.productId, {...productData})

        const { amount, productPrice} = productData

        amountElement.textContent = amount
        priceElement.textContent = (amount * productPrice).toFixed(2) + '₹'

        this.cartTotalPrice()
    }

    decreaseProduct(product) {
        const productData = CartLocalStorage.get(product.dataset.jsCartProduct)
        if(productData.amount > 1) {
            productData.amount--
            CartLocalStorage.set(productData.productId, {...productData})

            const amountElement = product.querySelector('[data-js-cart-product-amount]')
            const priceElement = product.querySelector('[data-js-cart-product-price]')
            const { amount, productPrice} = productData

            amountElement.textContent = amount
            priceElement.textContent = (amount * productPrice).toFixed(2) + '₹'

            this.cartTotalPrice()
        }
    }

    addToCart(product) {
        const {
            productId,
            productImage,
            productTitle,
            amount,
            productPrice
        } = product


        const { productListElement } = this.getCartElements(this.cartModal);
        const existingProduct = productListElement.querySelector(`[data-js-cart-product="${productId}"]`);

        if (existingProduct) {
            this.increaseProduct(existingProduct)
            this.cartTotalPrice()
            this.cartTotalItems()
            return
        }

        const cartItemTemplate = `
            <li class="modal__item modal__item--cart">
                <article class="product product--cart" data-js-cart-product="${productId}">
                    <div class="product__info-wrapper">
                        <div class="product__image-wrapper">
                            <img src="${productImage}" alt="" class="product__image">
                        </div>
            
                        <div class="product__info">
                            <h4 class="product__title product__title--cart">${productTitle}</h4>
                            <button class="product__button button button--remove" data-js-cart-remove>Remove</button>
                        </div>
                    </div>
                    <div class="product__actions">
                        <div class="amount-counter">
                            <button class="amount-counter__button button" aria-label="Decrease quantity" data-js-cart-decrease>-</button>
                            <div class="amount-counter__amount-wrapper">
                                <span class="amount-counter__amount" data-js-cart-product-amount>${amount}</span>
                            </div>
                            <button class="amount-counter__button button" aria-label="Increase quantity" data-js-cart-increase>+</button>
                        </div>
                        <p class="product__price" data-js-cart-product-price>${(productPrice * amount).toFixed(2)}₹</p>
                    </div>
                </article>
            </li>
        `

        productListElement.insertAdjacentHTML('beforeend', cartItemTemplate)
        this.isCartEmpty()
        this.cartTotalPrice()
        this.cartTotalItems()
    }

    cartAdded(event) {
        const product = CartLocalStorage.get(event.detail.productId)
        this.addToCart(product)
    }

    onClick(event) {
        const { target } = event

        const removeButton = target.closest(this.selectors.removeButton)
        const decreaseButton = target.closest(this.selectors.decreaseButton)
        const increaseButton = target.closest(this.selectors.increaseButton)

        if(removeButton) {
            const product = removeButton.closest(this.selectors.product)
            CartLocalStorage.delete(product.dataset.jsCartProduct)
            product.classList.add(this.cartStates.productDeleted)
            setTimeout(() => {
                product.parentElement.remove()
                this.cartTotalItems()
                this.cartTotalPrice()
                this.isCartEmpty()

                document.dispatchEvent(new CustomEvent(this.handleEvent.delete))
            }, 300)
        }

        if(decreaseButton) {
            const product = decreaseButton.closest(this.selectors.product)
            this.decreaseProduct(product)
        }

        if(increaseButton) {
            const product = increaseButton.closest(this.selectors.product)
            this.increaseProduct(product)
        }
    }

    bindEvents() {
        document.addEventListener(this.handleEvent.add, (event) => this.cartAdded(event))
        document.addEventListener('click', (event) => this.onClick(event))
    }
}