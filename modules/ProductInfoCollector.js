export default class ProductInfoCollector {
    selectors = {
        image: '[data-js-product-info-collector-image]',
        title: '[data-js-product-info-collector-title]',
        price: '[data-js-product-info-collector-price]',
    }

    constructor(product) {
        this.product = product
        this.collectData()
    }

    collectData() {
        this.image = this.product.querySelector(this.selectors.image)
        this.title = this.product.querySelector(this.selectors.title)
        this.price = this.product.querySelector(this.selectors.price)
    }

    getData() {
        return {
            productImage: this.image.getAttribute('src'),
            productTitle: this.title.textContent,
            productPrice: this.price.textContent,
        }
    }
}